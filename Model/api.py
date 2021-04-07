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

@app.route('/ner', methods=['POST'])
def runNER():
    data = request.json
    preCalc = request.args.get("preCalc")
    name = request.args.get("name")
    result = EntityRecognition.main(data, preCalc, name)
    return jsonify(result)