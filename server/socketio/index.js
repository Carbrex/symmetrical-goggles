const fs = require("fs");
const logger = require("../utils/logger");

const removeEmptyAudioFiles = require("../utils/removeAudioFiles");
const { log } = require("console");

const audioDir = "./Audio";
if (!fs.existsSync(audioDir)) {
	fs.mkdirSync(audioDir);
}
removeEmptyAudioFiles();

module.exports = (io) => {
	try {
		io.on("connection", (socket) => {
			logger.socket("User Connected", socket.id);

			socket.emit("connection", { customerNo: "23223232" });

			const file = fs.createWriteStream(
				"./Audio/" + socket.id.toString() + ".webm",
				{
					flags: "a",
				}
			);

			socket.on("getCoustomerNo", (data, cb) => {
				logger.socket("getCoustomerNo received ", socket.id, data);
				cb({ customerNo: "23223232" });
			});

			socket.on("audio", (bufferArray, cb) => {
				logger.socket(
					"audio received ",
					socket.id,
					bufferArray.length + " bytes"
				);

				try {
					// console.log("Received audio data: " + bufferArray.length + " bytes");
					file.write(bufferArray);
					cb({ success: true, msg: "audio received" });
				} catch (err) {
					console.log(err);
					logger.error(err);
					cb({ success: false, msg: "error" });
				}
			});

			socket.on("hello", (data, cb) => {
				logger.socket("hello received ", socket.id, data);
				cb("hello from server");
			});

			socket.on("disconnect", () => {
				//if file empty delete file
				fs.stat("./Audio/" + socket.id.toString() + ".webm", (err, stats) => {
					if (err) {
						console.error(err);
						return;
					}
					if (stats.size == 0) {
						fs.unlink("./Audio/" + socket.id.toString() + ".webm", (err) => {
							if (err) {
								console.error(err);
								logger.error(err);

								return;
							}
							//file removed
						});
					}
				});
				file.end();
				logger.socket("User Disconnected", socket.id);
			});
		});
	} catch (err) {
		logger.error(err);
	}
};
