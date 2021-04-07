import json
import sys
import spacy
from collections import Counter
import pprint
import copy

def main(tweetDataset, preCalc, name):
    if preCalc == "true":
        with open("results/" + name + "NERTimeline.txt", "r", encoding="utf-8") as inFile:
            results = json.loads(inFile.read())
        
        return results
    else:
        # spacy.prefer_gpu()
        ner = spacy.load("en_core_web_sm")
        with open("results/" + name + "result.txt", "r", encoding="utf-8") as inFile:
            sentimentResults = json.loads(inFile.read())

        resultTimeline = {}
        resultPerDay = []
        resultPerDay1 = []
        date = tweetDataset[0]["date"]
        for index, tweet in enumerate(tweetDataset):
            result = ner(tweet["contentCleaned"])
            currentTweetSentiment = sentimentResults[index]["roundedLabel"]
            temp = [(x.text, x.label_) for x in result.ents]
            temp1 = []
            temp2 = []
            for item in temp:
                if item[1] != "CARDINAL":
                    temp1.append(item[0])
            tweetSentiment = sentimentResults[index]["roundedLabel"]
            for entity in temp1:
                temp2.append(entity + "||" + str(tweetSentiment))
            resultPerDay = [*resultPerDay, *temp2]
            if tweet["date"] != date:
                print(date)
                dataCopy = copy.deepcopy(resultPerDay)
                temp = []
                tempCount = Counter(dataCopy).most_common()
                for tup in tempCount:
                    if len(tempCount) > 30:
                        if tup[1] != 1:
                            temp.append(tup[0] + "<,>" + str(tup[1]))
                    else:
                        temp.append(tup[0] + "<,>" + str(tup[1]))
                resultTimeline[date] = temp
                date = tweet["date"]

        with open('results/' + name + 'NERTimeline.txt', 'w', encoding='utf-8') as f:
            f.write(json.dumps(resultTimeline, indent=4, sort_keys=True))

        return resultTimeline

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2], sys.argv[2])
