const handleConnection = require("../controller-socket/handleConnection");
const removeEmptyAudioFiles = require("../utils/removeAudioFiles");
const logger = require("../utils/logger");
const fs = require("fs");

const audioDir = "./Audio";
if (!fs.existsSync(audioDir)) {
	fs.mkdirSync(audioDir);
}
removeEmptyAudioFiles();

module.exports = (io) => {
	try {
		io.on("connection", (socket) => {
			const { clientFilePath, remoteFilePath } = handleConnection(socket);

			socket.on("getCoustomerNo", (data, cb) => {
				logger.socket("getCoustomerNo received ", socket.id, data);
				cb({ customerNo: "23223232" });
			});

			socket.on("disconnect", () => {
				fs.unlink(clientFilePath, (err) => {
					if (err) {
						console.error(err);
						logger.error(err);
						return;
					}
					// file removed
				});

				fs.unlink(remoteFilePath, (err) => {
					if (err) {
						console.error(err);
						logger.error(err);
						return;
					}
					// file removed
				});
			});
		});
	} catch (err) {
		logger.error(err);
	}
};
