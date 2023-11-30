import { useEffect } from "react";
import { socket } from "../../socket";

export default function Socket() {
	useEffect(() => {
		const onConnect = (data) => {
			console.log("Socket Connected");
		};

		const onDisconnect = () => {
			console.log("disconnected");
		};

		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);
		socket.connect();

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
			socket.disconnect();
		};
	}, []);

	return null;
}
export { socket };
