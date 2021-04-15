import torch
from tqdm.notebook import tqdm
from transformers import AutoTokenizer
from torch.utils.data import TensorDataset
from transformers import BertForSequenceClassification
import pandas as pd
from sklearn.model_selection import train_test_split
from torch.utils.data import DataLoader, RandomSampler, SequentialSampler
from transformers import AdamW, get_linear_schedule_with_warmup
from sklearn.metrics import f1_score, precision_score, recall_score
import numpy as np
import random
import sys

def main(mode):
    df = pd.read_csv('data/ModelTestTrainData/Twitter_data copy.csv')
    df = df[df['label'].notna()]
    df = df.dropna()

    possible_labels = df["label"].unique()
    label_dict = {}
    for index, possible_label in enumerate(possible_labels):
        label_dict[possible_label] = index

    # print(df["category"].value_counts())

    X_train, X_val, y_train, y_val = train_test_split(df.index.values, 
                                                    df.label.values, 
                                                    test_size=0.15, 
                                                    random_state=42, 
                                                    stratify=df.label.values)

    df['data_type'] = ['not_set']*df.shape[0]

    df.loc[X_train, 'data_type'] = 'train'
    df.loc[X_val, 'data_type'] = 'val'

    df.groupby(['clean_text', 'label', 'data_type']).count()

    tokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')

    trainData = df[df.data_type=="train"]["clean_text"].tolist()
    encoded_data_train = tokenizer(trainData, padding="max_length", max_length=256, return_tensors="pt", add_special_tokens=True)

    input_ids_train = encoded_data_train['input_ids']
    attention_masks_train = encoded_data_train['attention_mask']
    labels_train = torch.tensor(df[df.data_type=='train']["label"].values, dtype=torch.long)

    valData = df[df.data_type=="val"]["clean_text"].tolist()
    encoded_data_val = tokenizer(valData, padding="max_length", max_length=256, return_tensors="pt", add_special_tokens=True)

    input_ids_val = encoded_data_val['input_ids']
    attention_masks_val = encoded_data_val['attention_mask']
    labels_val = torch.tensor(df[df.data_type=='val']["label"].values, dtype=torch.long)
    print(labels_val)

    dataset_train = TensorDataset(input_ids_train, attention_masks_train, labels_train)
    dataset_val = TensorDataset(input_ids_val, attention_masks_val, labels_val)

    model = BertForSequenceClassification.from_pretrained("bert-base-uncased",
                                                        num_labels=len(label_dict),
                                                        output_attentions=False,
                                                        output_hidden_states=False)
    model = model.to("cuda")
    batch_size = 3

    dataloader_train = DataLoader(dataset_train, 
                                sampler=RandomSampler(dataset_train), 
                                batch_size=batch_size)

    dataloader_validation = DataLoader(dataset_val, 
                                    sampler=SequentialSampler(dataset_val), 
                                    batch_size=batch_size)

    optimizer = AdamW(model.parameters(),
                    lr=1e-5, 
                    eps=1e-8)
                    
    epochs = 5

    scheduler = get_linear_schedule_with_warmup(optimizer, 
                                                num_warmup_steps=0,
                                                num_training_steps=len(dataloader_train)*epochs)

    def f1_score_func(preds, labels):
        preds_flat = np.argmax(preds, axis=1).flatten()
        labels_flat = labels.flatten()
        return f1_score(labels_flat, preds_flat, average='weighted')

    def precision_score_func(preds, labels):
        preds_flat = np.argmax(preds, axis=1).flatten()
        labels_flat = labels.flatten()
        return precision_score(labels_flat, preds_flat, average='weighted')

    def recall_score_func(preds, labels):
        preds_flat = np.argmax(preds, axis=1).flatten()
        labels_flat = labels.flatten()
        return recall_score(labels_flat, preds_flat, average='weighted')

    def accuracy_per_class(preds, labels):
        label_dict_inverse = {v: k for k, v in label_dict.items()}
        
        preds_flat = np.argmax(preds, axis=1).flatten()
        labels_flat = labels.flatten()

        for label in np.unique(labels_flat):
            y_preds = preds_flat[labels_flat==label]
            y_true = labels_flat[labels_flat==label]
            print(f'Class: {label_dict_inverse[label]}')
            print(f'Accuracy: {len(y_preds[y_preds==label])}/{len(y_true)}\n')

    seed_val = 17
    random.seed(seed_val)
    np.random.seed(seed_val)
    torch.manual_seed(seed_val)
    torch.cuda.manual_seed_all(seed_val)

    def evaluate(dataloader_val):

        model.eval()
        
        loss_val_total = 0
        predictions, true_vals = [], []
        
        for batch in dataloader_val:
            
            batch = tuple(b.to("cuda") for b in batch)
            
            inputs = {'input_ids':      batch[0],
                    'attention_mask': batch[1],
                    'labels':         batch[2],
                    }

            with torch.no_grad():        
                outputs = model(**inputs)
                
            loss = outputs[0]
            logits = outputs[1]
            loss_val_total += loss.item()

            logits = logits.detach().cpu().numpy()
            label_ids = inputs['labels'].cpu().numpy()
            predictions.append(logits)
            true_vals.append(label_ids)
        
        loss_val_avg = loss_val_total/len(dataloader_val) 
        
        predictions = np.concatenate(predictions, axis=0)
        true_vals = np.concatenate(true_vals, axis=0)
                
        return loss_val_avg, predictions, true_vals
            
    if mode == "train":
        for epoch in tqdm(range(1, epochs+1)):
            
            model.train()
            
            loss_train_total = 0

            progress_bar = tqdm(dataloader_train, desc='Epoch {:1d}'.format(epoch), leave=False, disable=False)
            counter = 0
            for batch in progress_bar:
                if counter % 100 == 0:
                    print(counter)
                counter += 1
                model.zero_grad()
                
                batch = tuple(b.to("cuda") for b in batch)
                
                inputs = {'input_ids':      batch[0],
                        'attention_mask': batch[1],
                        'labels':         batch[2],
                        } 

                outputs = model(**inputs)

                loss = outputs[0]
                loss_train_total += loss.item()
                loss.backward()

                torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)

                optimizer.step()
                scheduler.step()
                
                progress_bar.set_postfix({'training_loss': '{:.3f}'.format(loss.item()/len(batch))})
                
            torch.save(model.state_dict(), f'results/data_volume/finetuned_BERT_epoch_{epoch}.model')
                
            tqdm.write(f'\nEpoch {epoch}')
            
            loss_train_avg = loss_train_total/len(dataloader_train)            
            tqdm.write(f'Training loss: {loss_train_avg}')
            
            val_loss, predictions, true_vals = evaluate(dataloader_validation)
            val_f1 = f1_score_func(predictions, true_vals)
            val_precision = precision_score_func(predictions, true_vals)
            val_recall = recall_score_func(predictions, true_vals)
            tqdm.write(f'Validation loss: {val_loss}')
            tqdm.write(f'F1 Score (Weighted): {val_f1}')
    elif mode == "test":
        model.load_state_dict(torch.load('results/data_volume/finetuned_BERT_epoch_1.model', map_location=torch.device('cpu')))

        
        _, predictions, true_vals = evaluate(dataloader_validation)
        val_f1 = f1_score_func(predictions, true_vals)
        val_precision = precision_score_func(predictions, true_vals)
        val_recall = recall_score_func(predictions, true_vals)
        print(val_f1, val_precision, val_recall)
        accuracy_per_class(predictions, true_vals)

if __name__ == '__main__':
    main(sys.argv[1])