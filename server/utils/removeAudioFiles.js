const fs = require("fs");
const logger = require("./logger");

const removeEmptyAudioFiles = () => {
	fs.readdir("./Audio", (err, files) => {
		if (err) {
			console.error(err);
			return;
		}
		files.forEach((file) => {
			fs.stat("./Audio/" + file, (err, stats) => {
				if (err) {
					console.error(err);
					return;
				}
				if (stats.size === 0) {
					fs.unlink("./Audio/" + file, (err) => {
						if (err) {
							console.error(err);
							return;
						}
						logger.info("Removed empty file: " + file);
					});
				}
			});
		});
	});
};
module.exports = removeEmptyAudioFiles;
