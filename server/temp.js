const speechToText = require("./utils/audiotoText");
const natural = require("natural");

const textAnalysis = (audioFile) => {
  const tokenizer = new natural.WordTokenizer();

  const porterStemmer = natural.PorterStemmer;
  const lancasterStemmer = natural.LancasterStemmer;
  const lemmatizer = new natural.Lemmatizer();

  //convert audio to text
  speechToText(audioFile, (err, text) => {
    if (err) {
      console.log(err);
    }
    //save text in database
    console.log(text);
    const tokens = tokenizer.tokenize(text);

    console.log(tokens);

    const sentence = "The quick brown foxes are jumping over the lazy dogs";
    const tokenizedWords = tokenizer.tokenize(sentence);

    const stemmedWordsPorter = tokenizedWords.map((word) =>
      porterStemmer.stem(word)
    );
    console.log("Stemming with Porter Stemmer:", stemmedWordsPorter.join(" "));

    // Stemming with Lancaster Stemmer
    const stemmedWordsLancaster = tokenizedWords.map((word) =>
      lancasterStemmer.stem(word)
    );
    console.log(
      "Stemming with Lancaster Stemmer:",
      stemmedWordsLancaster.join(" ")
    );

    // Lemmatization
    const lemmatizedWords = tokenizedWords.map((word) =>
      lemmatizer.lemmatize(word)
    );
    console.log("Lemmatization:", lemmatizedWords.join(" "));
  });
};

module.exports = textAnalysis;
