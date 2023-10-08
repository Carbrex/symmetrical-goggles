//Express App Imports
const express = require("express");
const path = require("path");
const http = require("http");

const morgan = require("morgan");

require("express-async-errors");
require("dotenv").config();

const connectDB = require("./db/connect");

//Start Express App
const app = express();
const server = http.createServer(app);

// //scoket.io
// const io = require("socket.io")(server, {
//   cors: {
//     origin: ["http://localhost:5173", "https://admin.socket.io", "*"],
//   },
// });
// require("./socketio")(io);
// //Admin UI
// const { instrument } = require("@socket.io/admin-ui");
// instrument(io, { auth: false });

//Setting Environment
const PORT = process.env.PORT || 5000;
app.set("trust proxy", 1);

app.use(morgan("common")); //logger

//Routes
// app.use("/", express.static("../client/dist"));
// app.use("/assests", express.static("../client/dist/assests"));

//Define Routes Here

// app.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/dist/index.html"), (err) => {
//     if (err) {
//       console.error("Error sending file:", err);
//     }
//   });
// });

//Error Handling Middleware
app.use(require("./middleware/error-handler"));

const temp = require("./temp");
const textAnalysis = require("./temp");

//Function Start
async function start() {
  try {
    // await connectDB(process.env.MONGO_URL);
    // console.log("Connected to the DataBase Sucessfully");
    server.listen(PORT, () => {
      console.log(`Server is listening on http://localhost:${PORT}`);
    });
    textAnalysis("./test.wav");
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}
start();
