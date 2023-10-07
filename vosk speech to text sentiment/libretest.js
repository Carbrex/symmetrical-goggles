const axios = require('axios');
const fs = require('fs');

const API_URL = 'http://127.0.0.1:5000/translate';

const params = {
	q: 'India wins the world cup after 28 years',
	source: 'en',
	target: 'hi',
	format: 'text',
	api_key: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
};

async function translateAndWrite(line, file2) {
	console.log(line);
	params.q = line.trim();

	try {
		const response = await axios.post(API_URL, null, { params });
		const translatedText = response.data.translatedText;
		console.log(translatedText);
		file2.write(translatedText + '\n');
	} catch (error) {
		console.error('Error translating:', error.message);
	}
}

(async () => {
	// Reading the file with sample English Sentences.
	var lines;
	try {
		lines = fs.readFileSync('sentence.txt', 'utf8').split('\n');
	} catch (error) {
		console.error('No such file exists');
		process.exit(1);
	}

	const file2 = fs.createWriteStream('hindi.txt');

	for (const line of lines) {
		await translateAndWrite(line, file2);
	}

	file2.end();
})();
