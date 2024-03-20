//Express App Imports
const express = require("express");
const path = require("path");
const http = require("https");
const fs = require("fs");
const favicon = require("serve-favicon");

const morgan = require("morgan");

require("express-async-errors");
require("dotenv").config();

const connectDB = require("./db/connect");

// HTTPs Certificates
const options = {
	key: fs.readFileSync("certficiate/key.pem"),
	cert: fs.readFileSync("certficiate/cert.crt"),
};

//Start Express App
const app = express();
const server = http.createServer(options, app);
const removeEmptyAudioFiles = require("./utils/removeAudioFiles");

// const server = http.createServer(app);

//Logger Middleware
app.use(
	morgan("dev", {
		skip: function (req, res) {
			return res.statusCode < 400;
		},
	})
);
// log all requests to access.log
app.use(
	morgan("common", {
		stream: fs.createWriteStream(path.join(__dirname, "./log/httpReqs.log"), {
			flags: "a",
		}),
	})
);

//scoket.io
const io = require("socket.io")(server, {
	cors: {
		origin: [
			"https://localhost:5173",
			"http://localhost:5173",
			"http://192.168.1.13:5173",
			"https://192.168.1.13:5173",
			"http://192.168.1.7:5173",
			"https://192.168.1.7:5173",
			"https://admin.socket.io",
			"*",
		],
	},
});
require("./socketio")(io);
//Admin UI for Socket.io
const { instrument } = require("@socket.io/admin-ui");
instrument(io, { auth: false, mode: "development" });

//Peer Server
// const peerServer = require("peer").ExpressPeerServer(server, {
// 	path: "/myapp",
// });
// app.use(peerServer);
app.use(require("./PeerServer")(server, "/call"));

//Setting Environment
const PORT = process.env.PORT || 5000;
app.set("trust proxy", 1);

//Body Parser Middleware
app.use(favicon(path.join(__dirname, "../client/dist/favicon", "favicon.ico")));

//Routes
app.use("/", express.static("../client/dist"));
app.use("/assests", express.static("../client/dist/assests"));

//Define Routes Here

app.get("/*", (req, res) => {
	res.sendFile(path.join(__dirname, "../client/dist/index.html"), (err) => {
		if (err) {
			console.error("Error sending file:", err);
		}
	});
});

//Error Handling Middleware
app.use(require("./middleware/error-handler"));

//Text Analysis
// const temp = require("./temp");
// const textAnalysis = require("./temp");

//Function Start
async function start() {
	try {
		removeEmptyAudioFiles();
		// await connectDB(process.env.MONGO_URL);
		// console.log("Connected to the DataBase Sucessfully");
		server.listen(PORT, () => {
			console.log(`Server is listening on https://localhost:${PORT}`);
		});
		// textAnalysis("./test.wav");
	} catch (error) {
		console.log(`Error: ${error}`);
	}
}
start();
