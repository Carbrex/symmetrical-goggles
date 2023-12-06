const fs = require("fs");
const logger = require("../utils/logger");
const ffmpeg = require("fluent-ffmpeg");
const { spawn } = require("node:child_process");

const handleAudioEvent = (socket, eventName, fileSuffix) => {
	const filePath = `./Audio/${socket.id.toString()}${fileSuffix}.webm`;
	const file = fs.createWriteStream(filePath, { flags: "a" });

	const onDataReceived = (bufferArray, cb) => {
		// logger.socket(
		// 	`audio${fileSuffix} received`,
		// 	socket.id,
		// 	bufferArray.length + " bytes"
		// );

		try {
			file.write(bufferArray);
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
			if (!pythonProcess) {
				logger.python("Starting Python");
				// pythonProcess = spawn("python3", ["./python/test.py"]);
				pythonProcess = spawn("conda", [
					"run",
					"-n",
					"speechRealtime",
					"python3",
					"./python/test.py",
				]);
				pythonProcess.stdin.write(Buffer.from(bufferArray, "utf-8"));

				pythonProcess.stdout.on("data", (pyData) => {
					logger.python("Says", pythonProcess?.pid, pyData);
				});

				pythonProcess.stderr.on("data", (pyData) => {
					logger.error(`Error: ${pyData}`);
				});
				pythonProcess.on("close", (code) => {
					if (code === 0) logger.python(`Exit: ${code}`, pythonProcess?.pid);
					else logger.error(`Exit: ${code}`);
				});
				logger.python("WN", pythonProcess?.pid, bufferArray.length + " bytes");
			} else {
				pythonProcess.stdin.write(Buffer.from(bufferArray, "utf-8"));
				logger.python("W", pythonProcess?.pid, bufferArray.length + " bytes");
			}
			file.write(bufferArray);
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
