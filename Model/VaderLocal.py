from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import json
import pprint
import sys

def sentiment_analyzer_scores(sentence, analyser):
    score = analyser.polarity_scores(sentence)
    return score["compound"]

def main():
    analyser = SentimentIntensityAnalyzer()
    with open("backup.txt", "r", encoding="utf-8") as inFile:
        tweets = json.loads(inFile.read())

    with open("countryData.txt", "r", encoding="utf-8") as inFile:
        countryData = json.loads(inFile.read())
    for country in countryData:
        countryData[country] = {
            "sentiment": 0,
            "count": 0    
        }

    for tweet in tweets:
        result = sentiment_analyzer_scores(tweet["content"], analyser)
        countryData[tweet["alpha2"]]["sentiment"] += result
        countryData[tweet["alpha2"]]["count"] += 1
        tweet["label"] = result

    for country in countryData:
        if countryData[country]["count"] == 0:
            countryData[country] = None
        else:
            countryData[country] = countryData[country]["sentiment"] / countryData[country]["count"]

    with open('sentiment.txt', 'w', encoding='utf-8') as f:
        f.write(json.dumps(countryData, indent=4, sort_keys=True))

    with open('backup.txt', 'w', encoding='utf-8') as f:
        f.write(json.dumps(tweets, indent=4, sort_keys=True))

main()