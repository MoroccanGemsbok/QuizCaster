import webview
import pyaudio
import numpy
import math
import audioop
from api import Api, CHUNK, FORMAT, CHANNELS, RATE


def audio_init(num_samples=50):
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
        threshold = audio_init()
        print(f"Ready - Threshold is: {threshold}")
        api = Api(threshold)
        webview.create_window(
            "QuizCaster", "http://localhost:3000/",
            width=1600, height=1000, js_api=api
        )
        webview.start(debug=False #andy
                      )
    except Exception as e:
        print(e)


if __name__ == '__main__':
    main()
