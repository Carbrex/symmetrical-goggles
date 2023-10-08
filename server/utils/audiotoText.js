const vosk = require("vosk");
const fs = require("fs");
const { spawn } = require("child_process");

const MODEL_PATH = "../Models/model";
const SAMPLE_RATE = 16000;
const BUFFER_SIZE = 4000;

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

const speechToText = (audioFilePath, callback) => {
  const rec = new vosk.Recognizer({ model: model, sampleRate: SAMPLE_RATE });
  const ffmpeg_run = spawn("ffmpeg", [
    "-loglevel",
    "quiet",
    "-i",
    audioFilePath,
    "-ar",
    String(SAMPLE_RATE),
    "-ac",
    "1",
    "-f",
    "s16le",
    "-bufsize",
    String(BUFFER_SIZE),
    "-",
  ]);

  let convertedText = "";

  ffmpeg_run.stdout.on("data", (stdout) => {
    if (rec.acceptWaveform(stdout)) {
      const result = rec.result();
      convertedText += result.text; // Append the recognized text
    }
  });

  ffmpeg_run.on("close", (code) => {
    if (code !== 0) {
      console.error(`ffmpeg process exited with code ${code}`);
      callback("Error occurred during audio conversion", null);
    } else {
      // When the audio conversion is complete, return the converted text
      callback(null, convertedText);
    }
  });
};

module.exports = speechToText;
