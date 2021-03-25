from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import json
import pprint
import sys
import copy

def sentiment_analyzer_scores(sentence, analyser):
    score = analyser.polarity_scores(sentence)
    return score["compound"]

def main(tweets, name):
    analyser = SentimentIntensityAnalyzer()
    with open("Data/CountryData.txt", "r", encoding="utf-8") as inFile:
        countryData = json.loads(inFile.read())
    for country in countryData:
        countryData[country] = {
            "positive": 0,
            "neutral": 0,
            "negative": 0,
            "count": 0  
        }
    
    timelineData = []
    date = tweets[0]["date"]
    for tweet in tweets:
        result = sentiment_analyzer_scores(tweet["contentCleaned"], analyser)
        tweet["label"] = result
        if result > 0.05:
            result = "positive"
        elif result < -0.05:
            result = "negative"
        else:
            result = "neutral"
        countryData[tweet["alpha2"]][result] += 1
        countryData[tweet["alpha2"]]["count"] += 1
        if tweet["date"] != date:
            dataCopy = copy.deepcopy(countryData)
            dataCopy["date"] = date
            timelineData.append(dataCopy)
            date = tweet["date"]

    finalData = []
    for countryData in list(timelineData):
        for country in list(countryData):
            if country == "date":
                break
            if countryData[country]["count"] == 0:
                countryData[country] = None
            else:
                posPercent = (countryData[country]["positive"] / countryData[country]["count"], "pos")
                neuPercent = (countryData[country]["neutral"] / countryData[country]["count"], "neu")
                negPercent = (countryData[country]["negative"] / countryData[country]["count"], "neg")
                largest = sorted([posPercent, neuPercent, negPercent], key=lambda tup: tup[0])[-1]
                if largest[1] == "pos":
                    if largest[0] > 0.8:
                        result = 1
                    elif largest[0] > 0.6:
                        result = 0.7
                    elif largest[0] > 0.4:
                        result = 0.4
                    else:
                        result = 0.2
                elif largest[1] == "neg":
                    if largest[0] > 0.8:
                        result = -1
                    elif largest[0] > 0.6:
                        result = -0.7
                    elif largest[0] > 0.4:
                        result = -0.4
                    else:
                        result = -0.2
                elif largest[1] == "neu":
                    result = 0
                countryData[country] = {
                    "sentiment": result,
                    "sentimentDistribution": {
                        "neg": negPercent[0] * 100,
                        "neu": neuPercent[0] * 100,
                        "pos": posPercent[0] * 100
                    }
                }
    
    with open('Results/' + name + 'Timeline.txt', 'w', encoding='utf-8') as f:
        f.write(json.dumps(timelineData, indent=4, sort_keys=True))

    with open('Results/' + name + 'Sentiment.txt', 'w', encoding='utf-8') as f:
        f.write(json.dumps(countryData, indent=4, sort_keys=True))

    with open('Results/' + name + 'Result.txt', 'w', encoding='utf-8') as f:
        f.write(json.dumps(tweets, indent=4, sort_keys=True))

    return timelineData

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])