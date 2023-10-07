const fs = require('fs');
const translate = require('translate-google');
const vander = require('vader-sentiment');

// Function to translate text from Hindi to English
function translateHindiToEnglish(text) {
	return new Promise((resolve, reject) => {
		translate(text, { from: 'hi', to: 'en' })
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}
// Read the Hindi text from a.txt
const sentences = fs.readFileSync('output.txt', 'utf-8').split('\n');
// const sentences = ['मुझे यह किताब बहुत अच्छी लगी।'];

for (const sentence of sentences) {
	// Translate the sentence from Hindi to English
	if (sentence.length > 0)
		translateHindiToEnglish(sentence)
			.then((translatedText) => {
				// console.log('\n', sentence, translatedText);
				console.log(translatedText);

				// Analyze the sentiment of the translated text
				const sentiment =
					vander.SentimentIntensityAnalyzer.polarity_scores(translatedText);
				// console.log('Sentiment Dictionary:', sentiment);
				console.log(sentiment.compound);

				// if (sentiment.compound >= 0.05) {
				// 	console.log('It is a Positive Sentence');
				// } else if (sentiment.compound <= -0.05) {
				// 	console.log('It is a Negative Sentence');
				// } else {
				// 	console.log('It is a Neutral Sentence');
				// }
			})
			.catch((error) => {
				console.error('Error translating or analyzing sentiment:', error);
			});
}
