const fs = require("fs");
const logger = require("../utils/logger");
const ffmpeg = require("fluent-ffmpeg");
const { spawn } = require("node:child_process");
const axios = require("axios");

const url = "http://localhost:8501/v1/models/fashion_model:predict";
const headers = {
	"Content-Type": "application/json",
	"Accept-Charset": "UTF-8",
};

const handleAudioEvent = (socket, eventName, fileSuffix) => {
	const filePath = `./Audio/${socket.id.toString()}${fileSuffix}.webm`;
	const file = fs.createWriteStream(filePath, { flags: "a" });
	logger.socket(`File created ${filePath}`, socket.id);
	// logger.socket(eventName, socket.id, bufferArray.length + " bytes");

	const onDataReceived = (bufferArray, cb) => {
		// logger.socket(
		// 	`audio${fileSuffix} received`,
		// 	socket.id,
		// 	bufferArray.length + " bytes"
		// );

		try {
			file.write(bufferArray);
			// logger.socket("hello received ", socket.id, data);
			logger.socket(
				`${eventName} Data`,
				socket.id,
				bufferArray.length + " bytes"
			);

			//print details about bufferArray
			// console.log(bufferArray);
			// console.log(typeof bufferArray);
			// console.log(Array.from(bufferArray));
			if (bufferArray.byteLength % 2 !== 0) {
				throw new Error("Byte length of bufferArray is not a multiple of 2");
			}

			const int16Array = new Int16Array(bufferArray.buffer);

			// Convert the typed array to an array of numbers
			const audioData = Array.from(int16Array);

			// Prepare the data payload in the required format for the model API
			const data = JSON.stringify({
				inputs: { lstm_input: audioData },
			});
			// console.log(data);

			axios
				.post(url, data, { headers })
				.then((response) => {
					if (response.status !== 200) {
						console.log("Error");
						return;
					}
					const result = response.data;
					console.log(result);
					const predictions = result.outputs;
					// Process predictions as needed
				})
				.catch((error) => {
					console.log("Error");
					// console.log(error.response.status);
					// console.log(typeof error.response.data);
					// console.log(error.response.data.error);
					console.log(error.response.data);
					// console.log("Error in req: " + error.response.data.error);
					// console.error("Error:", error);
				});

			cb({ success: true, msg: "audio received" });
		} catch (err) {
			console.log(err);
			logger.error(err);
			cb({ success: false, msg: "error" });
		}
	};

	socket.on(eventName, onDataReceived);

	return filePath;
};
const handleAudioEventFFMPEG = (socket, eventName, fileSuffix) => {
	const filePath = `./Audio/${socket.id.toString()}${fileSuffix}.webm`;
	const file = fs.createWriteStream(filePath, { flags: "a" });

	let ffmpegProcess;
	let pythonProcess;

	const onDataReceived = (bufferArray, cb) => {
		// logger.socket(
		// 	`audio${fileSuffix} received`,
		// 	socket.id,
		// 	bufferArray.length + " bytes"
		// );

		try {
			// if (!pythonProcess) {
			// 	logger.python("Starting Python");
			// 	// pythonProcess = spawn("python3", ["./python/test.py"]);
			// 	pythonProcess = spawn("conda", [
			// 		"run",
			// 		"-n",
			// 		"speechRealtime",
			// 		"python3",
			// 		"./python/test.py",
			// 	]);
			// 	pythonProcess.stdin.write(Buffer.from(bufferArray, "utf-8"));

			// 	pythonProcess.stdout.on("data", (pyData) => {
			// 		logger.python("Says", pythonProcess?.pid, pyData);
			// 	});

			// 	pythonProcess.stderr.on("data", (pyData) => {
			// 		logger.error(`Error: ${pyData}`);
			// 	});
			// 	pythonProcess.on("close", (code) => {
			// 		if (code === 0) logger.python(`Exit: ${code}`, pythonProcess?.pid);
			// 		else logger.error(`Exit: ${code}`);
			// 	});
			// 	logger.python("WN", pythonProcess?.pid, bufferArray.length + " bytes");
			// } else {
			// 	pythonProcess.stdin.write(Buffer.from(bufferArray, "utf-8"));
			// 	logger.python("W", pythonProcess?.pid, bufferArray.length + " bytes");
			// }
			file.write(bufferArray);
			logger.socket(
				`${eventName} Data`,
				socket.id,
				bufferArray.length + " bytes"
			);
			cb({ success: true, msg: "audio received" });
		} catch (err) {
			console.log(err);
			logger.error(err);
			cb({ success: false, msg: "error" });
		}
	};

	socket.on(eventName, onDataReceived);

	return filePath;
};

const handleConnection = (socket) => {
	logger.socket("User Connected", socket.id);

	socket.emit("connection", { customerNo: "23223232" });

	socket.on("hello", (data, cb) => {
		logger.socket("hello received ", socket.id, data);
		cb("hello from server");
	});

	const clientFilePath = handleAudioEventFFMPEG(
		socket,
		"audioClient",
		"CLIENT"
	);
	const remoteFilePath = handleAudioEvent(socket, "audioRemote", "REMOTE");

	return { clientFilePath, remoteFilePath };
};
module.exports = handleConnection;
