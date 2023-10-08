var vosk = require("vosk");
const fs = require("fs");
var mic = require("mic");
const axios = require("axios");

// MODEL_PATH = '../Models/model';
// MODEL_PATH = '../Models/model-hi';
MODEL_PATH = "../Models/model-en-in";
// MODEL_PATH = "../Models/model-hindi";
SAMPLE_RATE = 16000;

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
const voiceFileStream = fs.createWriteStream("voice.txt");

micInputStream.on("data", (data) => {
  if (rec.acceptWaveform(data)) {
    const result = rec.result();
    if (result.text.length > 0) {
      voiceFileStream.write(result.text + "\n");
    }
  }
});

micInputStream.on("audioProcessExitComplete", function () {
  console.log("Cleaning up");
  rec.free();
  model.free();
  voiceFileStream.end();
  console.log("Recognition results saved to output.txt");
});

process.on("SIGINT", function () {
  console.log("\nStopping");
  micInstance.stop();
});

micInstance.start();
console.log("Start Speaking...");
