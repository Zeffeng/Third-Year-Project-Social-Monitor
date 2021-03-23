import torch
from tqdm.notebook import tqdm
from transformers import BertTokenizer
from torch.utils.data import TensorDataset
from transformers import BertForSequenceClassification
import pandas as pd

df = pd.read_csv('data/BertTrainAndTestData/training.csv', header=None, usecols=[0, 5], names=["Label", "Tweet"])

possible_labels = df["Label"].unique()

label_dict = {}
for index, possible_label in enumerate(possible_labels):
    label_dict[possible_label] = index
print(label_dict)