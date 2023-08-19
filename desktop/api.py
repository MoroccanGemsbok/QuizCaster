import azure.cognitiveservices.speech as speechsdk
from env import azure_key, azure_region
from pydub import AudioSegment

import wave

class Api:
    def narrate_summary(self, summary):
        self.azure_save_wav(summary)
        file_name = "narration.wav"
        chunk= 1024

        wf = wave.open(file_name, 'rb')

        # p = pyaudio.PyAudio()

        stream = p.open(
            format = p.get_format_from_width(wf.getsampwidth()),
            channels = wf.getnchannels(),
            rate = wf.getframerate(),
            output = True
        )

        data = wf.readframes(chunk)

        while data != '':
            stream.write(data)
            data = wf.readframes(chunk)

        stream.close()
        # p.terminate()

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
