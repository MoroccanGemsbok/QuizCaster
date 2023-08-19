import webview


webview.create_window(
    "QuizCaster", "http://localhost:3000/",
    width=1600, height=900
)
webview.start()
