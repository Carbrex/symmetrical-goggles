var vosk = require("vosk");
const fs = require("fs");
var mic = require("mic");
const axios = require("axios");

const Sentiment = require("sentiment");
const sentiment = new Sentiment();

const Translate_URL = "http://127.0.0.1:5000/translate";

// MODEL_PATH = 'model';
// MODEL_PATH = 'model-hi';
MODEL_PATH = "model-en-in";
SAMPLE_RATE = 16000;

// Function to translate text from Hindi to English
function translateHindiToEnglish(text) {
  return new Promise((resolve, reject) => {
    translate(text, { from: "hi", to: "en" })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function translateHindiToEnglish2(text) {
  return new Promise((resolve, reject) => {
    axios
      .post(Translate_URL, null, {
        params: {
          q: text.trim(),
          source: "hi",
          target: "en",
          format: "text",
        },
      })
      .then((response) => {
        resolve(response.data.translatedText);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// const { spawn } = require('child_process');
// const python = spawn('python3', ['translate.py']);
// python.stdout.on('data', (data) => {
// 	console.log('Received from Python script:', data.toString());
// 	const translatedText = data.toString();
// 	englishFileStream.write(translatedText + '\n');
// 	const analyze = sentiment.analyze(translatedText);
// 	console.log(translatedText, analyze.score);
// });
// python.stderr.on('data', function (data) {
// 	console.error(data.toString());
// });
// python.on('close', (code) => {
// 	console.log(`Python script exited with code ${code}`);
// });

if (!fs.existsSync(MODEL_PATH)) {
  console.log(
    "Please download the model from https://alphacephei.com/vosk/models and unpack as " +
      MODEL_PATH +
      " in the current folder."
  );
  process.exit();
}

vosk.setLogLevel(0);
const model = new vosk.Model(MODEL_PATH);
const rec = new vosk.Recognizer({ model: model, sampleRate: SAMPLE_RATE });

var micInstance = mic({
  rate: String(SAMPLE_RATE),
  channels: "1",
  debug: false,
  device: "default",
});

var micInputStream = micInstance.getAudioStream();

const voiceFileStream = fs.createWriteStream("voice.txt"); // Create a writable stream to the output file
const englishFileStream = fs.createWriteStream("english.txt"); // Create a writable stream to the output file

function performAction(text) {
  voiceFileStream.write(text + "\n");
  translateHindiToEnglish(text)
    .then((translatedText) => {
      englishFileStream.write(translatedText + "\n");
      const analyze = sentiment.analyze(translatedText);
      console.log(translatedText, analyze.score);
    })
    .catch((error) => {
      console.error("Error translating or analyzing sentiment:", error);
    });
}

// function performAction2(text) {
// 	voiceFileStream.write(text + '\n');
// 	console.log('Sending to Python script');
// 	python.stdin.write(text);
// }

console.log("Start Speaking...");

micInputStream.on("data", (data) => {
  if (rec.acceptWaveform(data)) {
    const result = rec.result();
    // console.log(result);
    if (result.text.length > 0) {
      performAction(result.text);
    }
  }
  // else console.log(rec.partialResult());
});

micInputStream.on("audioProcessExitComplete", function () {
  console.log("Cleaning up");
  rec.free();
  model.free();
  voiceFileStream.end();
  englishFileStream.end();
  // python.stdin.end();
  console.log("Recognition results saved to output.txt");
});

process.on("SIGINT", function () {
  console.log("\nStopping");
  micInstance.stop();
});

micInstance.start();
