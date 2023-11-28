const { ExpressPeerServer } = require("peer");
const logger = require("../utils/logger");

const connectedPeersID = new Map();

const getId = () => {
	const id = "8" + Math.floor(Math.random() * 1000000000).toString();
	if (connectedPeersID.has(id)) return getId();
	connectedPeersID.set(id, true);
	return id;
};
const removeId = (id) => {
	connectedPeersID.delete(id);
};

module.exports = (server, path) => {
	try {
		const peerServer = ExpressPeerServer(server, {
			path: path,
			allow_discovery: true,
			generateClientId: getId,
		});
		peerServer.on("connection", (client) => {
			logger.info(`peer client connected ${client.id}`);
		});
		peerServer.on("disconnect", (client) => {
			removeId(client.id);
			logger.info(`peer client disconnected ${client.id}`);
		});
		return peerServer;
	} catch (err) {
		logger.error(err);
	}
	return (req, res, next) => {
		console.log("peer server not working");
		next();
	};
};
