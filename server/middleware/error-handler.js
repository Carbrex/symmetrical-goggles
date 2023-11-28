const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const logger = require("../utils/logger");

const errorHandlerMiddleware = (err, req, res, next) => {
	let customError = {
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		msg: err.message || "Something went wrong try again later.",
	};

	//Custom Error
	if (err instanceof CustomAPIError) {
		logger.error(err); // Logging the error
		return res
			.status(customError.statusCode)
			.json({ success: false, msg: customError.msg, code: "001" });
	}

	// Mongoose Validation Error, Duplicate Key Error, Cast Error
	// Log the error and set appropriate status and message
	if (
		err.name === "ValidationError" ||
		(err.code && err.code === 11000) ||
		err.name === "CastError"
	) {
		logger.error(err); // Logging the error
		if (err.name === "ValidationError") {
			customError.msg = Object.values(err.errors)
				.map((item) => item.message)
				.join(",");
			customError.statusCode = StatusCodes.BAD_REQUEST;
		} else if (err.code && err.code === 11000) {
			customError.msg = `Duplicate value entered for ${Object.keys(
				err.keyValue
			)} field, please choose another value.`;
			customError.statusCode = StatusCodes.BAD_REQUEST;
		} else if (err.name === "CastError") {
			customError.msg = `No item found with id : ${err.value}`;
			customError.statusCode = StatusCodes.NOT_FOUND;
		}
		return res
			.status(customError.statusCode)
			.json({ success: false, msg: customError.msg, code: "000" });
	}

	logger.error(err); // Logging other unhandled errors
	return res
		.status(customError.statusCode)
		.json({ success: false, msg: customError.msg, code: "000" });
};

module.exports = errorHandlerMiddleware;
