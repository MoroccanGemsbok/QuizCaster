import io
import base64
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/process', methods=['POST'])
def process_file():
    data = request.json
    base64_string = data['file']
    file_bytes = base64.b64decode(base64_string)
    buffered_reader = io.BufferedReader(io.BytesIO(file_bytes))
    
    # Now you can use buffered_reader as you would with any BufferedReader in Python
    # Example:
    # content = buffered_reader.read()

    return jsonify({"message": "File processed successfully"})

