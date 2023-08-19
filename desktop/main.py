import webview
import pyaudio
import numpy
import math
import audioop
from api import Api, CHUNK, FORMAT, CHANNELS, RATE


def audio_int(num_samples=50):
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


def main():
    try:
        threshold = audio_int()
        api = Api(threshold)
        webview.create_window(
            "QuizCaster", "http://192.168.2.162:3000/",
            # 192.168.2.162
            width=1600, height=900, js_api=api
        )
        webview.start()
    except Exception as e:
        print(e)


if __name__ == '__main__':
    main()
