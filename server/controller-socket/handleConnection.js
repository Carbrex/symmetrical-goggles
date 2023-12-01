const fs = require("fs");
const logger = require("../utils/logger");

const handleAudioEvent = (socket, eventName, fileSuffix) => {
	const filePath = `./Audio/${socket.id.toString()}${fileSuffix}.webm`;
	const file = fs.createWriteStream(filePath, { flags: "a" });

	const onDataReceived = (bufferArray, cb) => {
		logger.socket(
			`audio${fileSuffix} received ${socket.id}`,
			bufferArray.length + " bytes"
		);

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

const handleConnection = (socket) => {
	logger.socket("User Connected", socket.id);

	socket.emit("connection", { customerNo: "23223232" });

	socket.on("hello", (data, cb) => {
		logger.socket("hello received ", socket.id, data);
		cb("hello from server");
	});

	const clientFilePath = handleAudioEvent(socket, "audioClient", "CLIENT");
	const remoteFilePath = handleAudioEvent(socket, "audioRemote", "REMOTE");

	return { clientFilePath, remoteFilePath };
};
module.exports = handleConnection;
