from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import pandas as pd
import numpy as np
from sklearn.metrics import f1_score

def sentiment_analyzer_scores(sentence, analyser):
    score = analyser.polarity_scores(str(sentence))
    return score["compound"]

def main():
    analyser = SentimentIntensityAnalyzer()
    df = pd.read_csv('data/ModelTestTrainData/Twitter_data.csv')
    df = df[df['label'].notna()]

    possible_labels = df["label"].unique()
    label_dict = {}
    for index, possible_label in enumerate(possible_labels):
        label_dict[possible_label] = index

    trueLabels = df["label"].tolist()
    predLabels = []
    counter = 0
    for index, row in df.iterrows():
        if counter % 1000 == 0:
            print(counter)
        counter += 1
        prediction = sentiment_analyzer_scores(row["clean_text"], analyser)
        if prediction > 0.05:
            prediction = 1
        elif prediction < -0.05:
            prediction = -1
        else: 
            prediction = 0
        predLabels.append(prediction)

    conf_matrix = np.zeros((3, 3))
    for i in range(len(trueLabels)):
        true = label_dict[trueLabels[i]]
        pred = label_dict[predLabels[i]]
        conf_matrix[true, pred] += 1
    print(conf_matrix)

    sumOfColumns = conf_matrix.sum(axis=0)
    sumOfRows = conf_matrix.sum(axis=1)
    totalNo = len(trueLabels)
    for key, i in label_dict.items():
        tp = conf_matrix[i, i]
        fp = sumOfRows[i] - tp
        fn = sumOfColumns[i] - tp
        precision = tp / (fp + tp)
        recall = tp / (fn + tp)
        f1 = (2 * precision * recall) / (precision + recall)
        print("Stats for " + str(key))
        print("Precision: " + str(precision))
        print("Recall: " + str(recall))
        print("f-1 Score: " + str(f1))
        print("-------------------------")

if __name__ == '__main__':
    main()