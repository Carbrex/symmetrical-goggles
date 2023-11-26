const Speaker = require("speaker");
const { Readable } = require("stream");
const fs = require("fs");
const { Blob } = require("node:buffer");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected");
    // let audioData = [];

    socket.on("audio", async (audioBlob) => {
      console.log(audioBlob);
      const audioStream = new Readable();
      audioStream.push(audioBlob);
      audioStream.push(null);

      // Create a Speaker instance to play the audio
      const speaker = new Speaker({
        channels: 2, // Assuming stereo audio
        bitDepth: 16, // Assuming 16-bit audio
        sampleRate: 44100, // Assuming a common sample rate
      });

      // Pipe the audio stream to the speaker
      audioStream.pipe(speaker);
    });
    socket.on("hello", (data, cb) => {
      console.log(data);
      cb("hello from server");
    });

    // socket.on("room:join", (data, cb) => joinRoom(data, cb, socket));
    // socket.on("room:leave", (data, cb) => leaveRoom(data, cb, socket));
    // socket.on("onEmotion", (data, cb) => leaveRoom(data, cb, socket));

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};
