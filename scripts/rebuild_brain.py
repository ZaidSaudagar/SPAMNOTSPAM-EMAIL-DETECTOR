import pandas as pd
import numpy as np
import joblib
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
import os

def train_and_save_base_model():
    # 1. Load Dataset
    # Using the local file 'spam.csv'
    dataset_path = os.path.join(os.path.dirname(__file__), '..', 'spam.csv')
    df = pd.read_csv(dataset_path, encoding='ISO-8859-1')

    # 2. Preprocess
    df.rename(columns={"v1": "Category", "v2": "Message"}, inplace=True)
    df.drop(columns={'Unnamed: 2','Unnamed: 3','Unnamed: 4'}, inplace=True)
    df['Spam'] = df['Category'].apply(lambda x: 1 if x == 'spam' else 0)

    # 3. Train/Test Split
    X_train, X_test, y_train, y_test = train_test_split(df.Message, df.Spam, test_size=0.2)

    # 4. Create Pipeline & Train
    clf = Pipeline([
        ('vectorizer', CountVectorizer()),
        ('nb', MultinomialNB())
    ])
    clf.fit(X_train, y_train)

    # 5. Save the entire pipeline (includes vectorizer and model)
    models_dir = os.path.join(os.path.dirname(__file__), 'models')
    if not os.path.exists(models_dir):
        os.makedirs(models_dir)
        
    model_path = os.path.join(models_dir, 'spam_model.joblib')
    joblib.dump(clf, model_path)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    train_and_save_base_model()
