const natural=require('natural');
// const {TfidfVectorizer}=require('tf-idf');
const StopwordsFilter=require('stop');
const lemmatizer=require('lemmatizier');
// import nltk
// nltk.download('tagsets');
// nltk.download('averaged_perceptron_tagger');

// 필요한 라이브러리/모듈을 import
const { TfidfVectorizer, LatentDirichletAllocation } = require('scikit-learn');

// 필요한 데이터 전처리 함수
function preprocessingEng(data) {
  const stopWordsList = natural.stopwords;
  
  const tokenized = data.map(answer => natural.word_tokenize(answer).filter(word =>
    word.length > 2 &&
    !stopWordsList.includes(word) &&
    (natural.BrillPOSTagger().tag([word])[0][1] === 'NN' ||
     natural.BrillPOSTagger().tag([word])[0][1] === 'NNP' &&
     natural.BrillPOSTagger().tag([word])[0][1] !== 'VB')
  ));

  const lemmatizer = new natural.WordNetLemmatizer();
  const detokenized = tokenized.map(words => words.map(word => lemmatizer.lemmatize(word)).join(' '));

  const context = detokenized;
  console.log('Detokenized:', context);

  const vectorizer = new TfidfVectorizer({ stop_words: 'english', max_features: 10 });
  const X = vectorizer.fit_transform(context);

  console.log('Vectorizer:', vectorizer, '\nX:', X);

  return { X, vectorizer };
}

// 주어진 답변에서 토픽을 추출하는 함수
function extractTopic(answer) {
  const data = [answer];
  const { X, vectorizer } = preprocessingEng(data);

  const ldaModel = new LatentDirichletAllocation({ n_components: 1, learning_method: 'online', random_state: 777, max_iter: 3 });
  const ldaTop = ldaModel.fit_transform(X);

  const topic = getTopics(ldaModel.components_, vectorizer.get_feature_names_out());
  const topics = topic.join('/');

  return topics;
}

// 주어진 토픽을 추출하는 함수
function getTopics(components, featureNames, n = 3) {
  const topic = featureNames.slice().sort((a, b) => components[0][featureNames.indexOf(b)] - components[0][featureNames.indexOf(a)]).slice(0, n);
  console.log('Top Features:', topic);

  return topic;
}

// 예시 데이터로 토픽 추출 테스트
const exampleAnswer = "In computing, a network refers to a collection of interconnected devices and systems that can communicate and share resources with each other. The purpose of a network is to enable the exchange of data and information between connected devices, allowing them to work together and share resources efficiently. Networks can be categorized based on their geographical scope and the technologies they use. Here are some key concepts related to networks:";
const extractedTopic = extractTopic(exampleAnswer);
console.log('Extracted Topic:', extractedTopic);
