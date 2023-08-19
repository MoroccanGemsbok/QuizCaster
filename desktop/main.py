import webview
from api import Api


api = Api()
webview.create_window(
    "QuizCaster", "http://192.168.2.162:3000/",
    # 192.168.2.162
    width=1600, height=900, js_api=api
)
webview.start()
