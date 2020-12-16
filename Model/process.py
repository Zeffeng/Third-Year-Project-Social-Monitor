import sys
import json
import re

with open("coronavirusVader.txt", "r", encoding="utf-8") as inFile:
    data = inFile.read()

jsonData = json.loads(data)

for item in jsonData:
    item["label"] = 0

with open('coronavirusVader.txt', 'w', encoding='utf-8') as f:
    f.write(json.dumps(jsonData, indent=4, sort_keys=True))