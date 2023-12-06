const winston = require("winston");

const logDir = "./log";

const logger = winston.createLogger({
	levels: {
		error: 0,
		warning: 1,
		info: 2,
		socket: 3,
		python: 4,
	},
	// format: combine(timestamp(), prettyPrint()),
	transports: [
		new winston.transports.File({
			filename: logDir + "/logs.log",
			format: winston.format.combine(
				winston.format.json(),
				winston.format.timestamp(),
				winston.format.prettyPrint()
			),
		}),
	],
	// exceptionHandlers: [
	// 	new winston.transports.File({ filename: logDir + "/exceptions.log" }),
	// ],
});

if (process.env.NODE_ENV !== "production") {
	logger.add(
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.simple()
			),
		})
	);
}

logger.socket = function (eventName, id = null, data = null) {
	this.info({
		level: "socket",
		message: `Socket: ${eventName}, ID:${id}, Data: ${JSON.stringify(data)}`,
	});
};
logger.python = function (eventName, pid = null, data = null) {
	this.info({
		level: "python",
		message: `Python: ${eventName}, PID:${pid}, Data: ${JSON.stringify(data)}`,
	});
};

module.exports = logger;
