import time
from flask import Flask, request, jsonify
import VaderAPI
import EntityRecognition

app = Flask(__name__)

@app.route('/vader/<name>', methods=['POST'])
def runVaderModel(name):
    data = request.json
    result = VaderAPI.main(data, name)
    return jsonify(result)

@app.route('/ner/<preCalc>', methods=['POST'])
def runNER(preCalc):
    data = request.json
    result = EntityRecognition.main(data, preCalc)
    return jsonify(result)