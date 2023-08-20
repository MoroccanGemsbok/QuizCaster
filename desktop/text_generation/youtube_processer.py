from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter
import joblib


def get_transcript(yt_id):
    try:
        transcript = YouTubeTranscriptApi.get_transcript(yt_id)
        formatter = TextFormatter()
        text = formatter.format_transcript(transcript)
        return text
    except Exception as e:
        print(e)


def naive_bayes(model, vectorizer, text):
    indices = []
    result = []
    loaded_model = joblib.load(model)
    loaded_vectorizer = joblib.load(vectorizer)

    text_array = text.split(" ")
    test_pred = loaded_model.predict(loaded_vectorizer.transform(text_array))

    for i in range(len(test_pred)):
        if test_pred[i] == 1:
            indices.append(i)

    for i, char in enumerate(text_array):
        if i in indices:
            result.extend(['.', char])
        else:
            result.append(char)

    corrected_text = ' '.join(result)
    return corrected_text


def youtube_process(yt_id):
    # Youtube ID (Replace with your own)
    text = get_transcript(yt_id)
    corrected_text = naive_bayes('naive_bayes_model.joblib', 'vectorizer.joblib', text)
    return corrected_text

