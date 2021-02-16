import time
from flask import Flask, request, jsonify
import VaderAPI

app = Flask(__name__)

@app.route('/vader/<name>', methods=['POST'])
def runVaderModel(name):
    data = request.json
    result = VaderAPI.main(data, name)
    return jsonify(result)