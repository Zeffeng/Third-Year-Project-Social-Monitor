from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import json

analyser = SentimentIntensityAnalyzer()

def sentiment_analyzer_scores(sentence):
    score = analyser.polarity_scores(sentence)
    #print("{:-<40} {}".format(sentence, str(score)))
    return json.dumps(score)

with open("coronavirusVader.txt", "r", encoding="utf-8") as inFile:
    data = inFile.read()

tweets = json.loads(data)

index = 0
correct = 0
incorrect = 0
total = 0
for tweet in tweets:
    result = json.loads(sentiment_analyzer_scores(tweet["content"]))["compound"]
    if result >= 0.05:
        prediction = 1
    elif result > -0.05 and result < 0.05:
        prediction = 0
    elif result <= -0.05:
        prediction = -1
    real = tweet["label"]
    if real == prediction:
        correct += 1
    else:
        incorrect += 1
    index += 1
    if index == 8:
        break

print("Accuracy: " + str(correct / index))