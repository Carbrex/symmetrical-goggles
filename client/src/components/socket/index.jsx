import { useEffect } from "react";
import { socket } from "../../socket";

export default function Socket() {
	useEffect(() => {
		const onConnect = (data) => {
			console.log("Socket Connected");
		};

		const onDisconnect = () => {
			console.log("Socket Disconnected");
		};

		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);
		socket.connect();

		return () => {
			socket.disconnect();
		};
	}, []);

	return null;
}
export { socket };
