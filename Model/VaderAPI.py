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
            "sentiment": 0,
            "count": 0    
        }
    
    timelineData = []
    date = tweets[0]["date"]
    for tweet in tweets:
        result = sentiment_analyzer_scores(tweet["content"], analyser)
        countryData[tweet["alpha2"]]["sentiment"] += result
        countryData[tweet["alpha2"]]["count"] += 1
        tweet["label"] = result
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
                countryData[country] = countryData[country]["sentiment"] / countryData[country]["count"]
    
    with open('Results/' + name + 'Timeline.txt', 'w', encoding='utf-8') as f:
        f.write(json.dumps(timelineData, indent=4, sort_keys=True))

    with open('Results/' + name + 'Sentiment.txt', 'w', encoding='utf-8') as f:
        f.write(json.dumps(countryData, indent=4, sort_keys=True))

    with open('Results/' + name + 'Result.txt', 'w', encoding='utf-8') as f:
        f.write(json.dumps(tweets, indent=4, sort_keys=True))

    return timelineData

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])