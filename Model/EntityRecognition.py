import json
import sys
import spacy
from collections import Counter
import pprint
import time
import copy

def main(tweetDataset, preCalc):
    if preCalc == "true":
        with open("Results/NERTimeline.txt", "r", encoding="utf-8") as inFile:
            results = json.loads(inFile.read())
        
        return results
    else:
        # spacy.prefer_gpu()
        ner = spacy.load("en_core_web_sm")

        start = time.time()
        resultTimeline = {}
        resultPerDay = []
        date = tweetDataset[0]["date"]
        for tweet in tweetDataset:
            result = ner(tweet["contentCleaned"])
            resultPerDay = [*resultPerDay, *[x.text for x in result.ents]]
            if tweet["date"] != date:
                print(date)
                dataCopy = copy.deepcopy(resultPerDay)
                temp = []
                for tup in Counter(dataCopy).most_common():
                    temp.append(tup[0] + "<,>" + str(tup[1]))
                resultTimeline[date] = temp
                date = tweet["date"]
        end = time.time()
        print(end-start)

        with open('Results/NERTimeline.txt', 'w', encoding='utf-8') as f:
            f.write(json.dumps(resultTimeline, indent=4, sort_keys=True))

        return resultTimeline

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
