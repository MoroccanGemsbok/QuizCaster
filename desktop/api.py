import azure.cognitiveservices.speech as speechsdk
from env import azure_key, azure_region, openai_api_key
import pyaudio
import wave
import time
import audioop
import math
import numpy
from collections import deque
import openai
import base64

CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000
SILENCE_LIMIT = 1.0
PREV_AUDIO = 0.2
FILENAME = "user_response.wav"
openai.api_key = openai_api_key

class Api:

    def __init__(self, threshold):
        self.stream = None
        self.p = None
        self.wf = None
        self.stop = False
        self.threshold = threshold

    def upload_file(self, raw):
        binary_data = base64.b64decode(raw)
        with open("output.pdf", "wb") as pdf_file:
            pdf_file.write(binary_data)

    def audio_int(self, num_samples=50):
        """ Gets average audio intensity of your mic sound. You can use it to get
            average intensities while you're talking and/or silent. The average
            is the avg of the 20% largest intensities recorded.
        """
        p = pyaudio.PyAudio()
        stream = p.open(format=FORMAT,
                        channels=CHANNELS,
                        rate=RATE,
                        input=True,
                        frames_per_buffer=CHUNK)
        values = []
        for i in range(num_samples):
            values.append(audioop.rms(stream.read(CHUNK), 2))
        rms = numpy.mean(values)
        decibel = 20 * math.log10(rms)
        stream.close()
        p.terminate()
        return decibel + 5

    def narrate_summary(self, summary):
        self.stop = False
        self.azure_save_wav(summary)
        file_name = "narration.wav"

        self.wf = wave.open(file_name, 'rb')
        self.p = pyaudio.PyAudio()
        self.stream = self.p.open(
            format=self.p.get_format_from_width(self.wf.getsampwidth()),
            channels=self.wf.getnchannels(),
            rate=self.wf.getframerate(),
            output=True
        )
        data = self.wf.readframes(CHUNK)

        while data != '' and not self.stop:
            self.stream.write(data)
            data = self.wf.readframes(CHUNK)

        if not self.stop:
            self.narrate_stop()

    def narrate_stop(self):
        self.stop = True
        if self.stream is not None:
            self.stream.stop_stream()
            self.stream.close()
        if self.p is not None:
            self.p.terminate()
        if self.wf is not None:
            self.wf.close()

    def azure_save_wav(self, summary):
        speech_config = speechsdk.SpeechConfig(subscription=azure_key,
                                               region=azure_region)
        speech_config.speech_synthesis_voice_name = 'en-US-SaraNeural'
        file_name = "narration.wav"
        file_config = speechsdk.audio.AudioOutputConfig(filename=file_name)
        speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=file_config)

        speech_synthesis_result = speech_synthesizer.speak_text_async(summary).get()

        if speech_synthesis_result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
            print(f"Speech synthesized for text [{summary}], and the audio was written to output file: {file_name}")
        elif speech_synthesis_result.reason == speechsdk.ResultReason.Canceled:
            cancellation_details = speech_synthesis_result.cancellation_details
            print(f"Speech synthesis canceled: {cancellation_details}")

    def azure_speak(self, response):
        speech_config = speechsdk.SpeechConfig(subscription=azure_key,
                                               region=azure_region)
        audio_config = speechsdk.audio.AudioOutputConfig(use_default_speaker=True)
        speech_config.speech_synthesis_voice_name = 'en-US-SaraNeural'

        speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)
        speech_synthesis_result = speech_synthesizer.speak_text_async(response).get()

        if speech_synthesis_result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
            print(f"Speech synthesized for text [{response}]")
        elif speech_synthesis_result.reason == speechsdk.ResultReason.Canceled:
            cancellation_details = speech_synthesis_result.cancellation_details
            print(f"Speech synthesis canceled: {cancellation_details}")

    def listening(self, threshold):
        p = pyaudio.PyAudio()
        stream = p.open(format=FORMAT,
                        channels=CHANNELS,
                        rate=RATE,
                        input=True,
                        frames_per_buffer=CHUNK)

        recorded_audio = []
        rel = int(RATE / CHUNK)
        slid_win = deque(maxlen=int(SILENCE_LIMIT * rel))
        prev_audio = deque(maxlen=int(PREV_AUDIO * rel))
        started = False
        timed = False
        timeout = time.perf_counter() + 15

        print("QuizCaster listening for answer")
        while True:
            cur_data = stream.read(CHUNK)
            rms = audioop.rms(cur_data, 2)
            if rms == 0:
                rms = threshold
            db = 20 * math.log10(rms)
            slid_win.append(db)
            if sum([x > threshold for x in slid_win]) > 0:
                if not started:
                    started = True
                recorded_audio.append(cur_data)
            elif started is True:
                break
            elif time.perf_counter() > timeout:
                print("QuizCaster timed out")
                timed = True
                break
            else:
                prev_audio.append(cur_data)
        self.save_record(list(prev_audio) + recorded_audio, p)
        print("QuizCaster done recording")

        stream.close()
        p.terminate()
        return timed

    def save_record(self, data, p):
        # Saves mic data to temporary WAV file.
        file = wave.open(FILENAME, 'wb')
        file.setnchannels(CHANNELS)
        file.setsampwidth(p.get_sample_size(FORMAT))
        file.setframerate(RATE)

        file.writeframes(b''.join(data))
        file.close()

    # Transcribe audio
    def transcribe_audio(self, filename):
        with open(filename, "rb") as audio_file:
            transcript = openai.Audio.transcribe("whisper-1", audio_file)
            return transcript["text"]

    def question_set(self, quiz_set):
        print("QuizCaster starting up")
        print(f"Ready - threshold is: {self.threshold}")
        print(quiz_set)
        question = quiz_set["question"]
        answers = quiz_set["options"]
        correct = quiz_set["answer"] + 1

        self.azure_speak(question)
        str_answer = ''
        for i in range(len(answers)):
            str_answer += str(i + 1) + " - " + answers[i] + ". "
        self.azure_speak(str_answer)

        timed_out = self.listening(self.threshold)

        if timed_out is True:
            self.azure_speak(f"Time's up! The correct answer is {correct}- {answers[int(correct) - 1]}.")
        else:
            response = self.transcribe_audio(FILENAME)
            response = response.lower()
            self.azure_speak(response)
            if response == correct:
                self.azure_speak("Correct!")
            else:
                self.azure_speak(f"Incorrect! The correct answer is {correct}- {answers[int(correct) - 1]}.")
