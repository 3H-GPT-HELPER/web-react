import sys

#pip install nltk, scikit-learn, pandas, konlpy 필요
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize 
from nltk.stem import PorterStemmer

nltk.download('tagsets')
nltk.download('averaged_perceptron_tagger')

from nltk.tag import pos_tag

import pandas as pd


import sklearn
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import LatentDirichletAllocation

#원래 preprocessing_eng와 get_topics라는 각각의 함수로 구성되었지만
# js에서 Python 코드를 실행시키기 위해 하나의 파이썬 함수로 합침
def extract_topic(answer):    
    data = pd.DataFrame({'answer':[answer]})
    data['answer'] = data.apply(lambda row: nltk.word_tokenize(row['answer']),axis=1)
    

    #X, vectorizer = preprocessing_eng(data)
    ## preprocessing_eng 시작
    stop_words_list = stopwords.words('english') 
    tokenized = data['answer'].apply(lambda x: [word for word in x if (len(word) > 2 
                                                                       and word not in stop_words_list 
                                                                       and pos_tag([word])[0][1]=='NN'
                                                                       or pos_tag([word])[0][1]=='NNP'
                                                                       and pos_tag([word])[0][1]!='VB'
                                                                       )])
    
    lmtzr = WordNetLemmatizer()
    tokenized = data['answer'].apply(lambda x: [lmtzr.lemmatize(word) for word in x])
    detokenized = []
    for i in range(len(data)):
        t = ' '.join(tokenized[i])
        detokenized.append(t)
    context = detokenized
    vectorizer = TfidfVectorizer(stop_words='english',max_features=10)
    X = vectorizer.fit_transform(context)
    ##preprocessing_eng 종료

    lda_model = LatentDirichletAllocation(n_components=1, learning_method='online', random_state=777, max_iter=3)
    lda_top = lda_model.fit_transform(X)

    
    #topic = get_topics(lda_model.components_,vectorizer.get_feature_names_out())
    ## get_topics 시작
    topic = []

    for idx, topic in enumerate(lda_model.components_):
       # top_features = [(feature_names[i], topic[i].round(2)) for i in topic.argsort()[:-n - 1:-1]]
       top_features = [vectorizer.get_feature_names_out()[i] for i in topic.argsort()[:-3 - 1:-1]]
    ## get_topics 종료
    topic=top_features
    topics= '/'.join(topic)
    
    # return topics
    print(topics,end='')

if __name__=='__main__':
    extract_topic(sys.argv[1])
