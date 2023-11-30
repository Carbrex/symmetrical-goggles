import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { toast } from "react-toastify";
import Call from "./call";
import { Button } from "@mui/material";

// give default value to peerID
const Caller = ({ socket, callTo = null, showDialer = true }) => {
	const [remotePeerIdValue, setRemotePeerIdValue] = useState(callTo);
	const [streamToServer, setStreamToServer] = useState(false);

	const [peerInstance, setPeerInstance] = useState(null);

	useEffect(() => {
		const peer = new Peer(undefined, {
			host: import.meta.env.DEV ? "localhost" : window.location.hostname,
			port: 443,
			path: "/call",
		});

		peer.on("open", (id) => {
			console.log("My peer ID is: " + id);
		});

		peer.on("error", (err) => {
			console.error(err);
			toast.error(err.message);
		});

		setPeerInstance(peer);
		return () => {
			peer.disconnect();
			peer.destroy();
		};
	}, []);

	const onCallClick = (remoteId) => {
		setRemotePeerIdValue(remoteId);
	};

	return (
		<div>
			<Call
				peer={peerInstance}
				socket={socket}
				callTo={remotePeerIdValue}
				sendToServer={streamToServer}
			/>
			<h2>Your Phone Number: {peerInstance?.id}</h2>

			{showDialer && (
				<Dialer
					disabled={peerInstance === null}
					onCallClick={onCallClick}
					streamingToServer={streamToServer}
					sendToServer={() => setStreamToServer(!streamToServer)}
				/>
			)}
		</div>
	);
};

const Dialer = ({ disabled, sendToServer, onCallClick, streamingToServer }) => {
	const [inputValue, setInputValue] = useState("");
	return (
		<div style={{ textAlign: "center" }}>
			<input
				type='text'
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				style={{
					padding: "8px",
					margin: "10px",
					borderRadius: "4px",
					border: "1px solid #ccc",
				}}
			/>
			<Button
				variant='contained'
				onClick={() => {
					if (inputValue === "")
						return toast.error("Enter phone number", {
							toastId: "phnNo",
						});
					onCallClick(inputValue);
				}}
				disabled={disabled}
				style={{ marginRight: "10px" }}>
				Call
			</Button>
			<Button
				disabled={disabled}
				variant='contained'
				onClick={sendToServer}>
				{streamingToServer ? "Stop Stream" : "Start Stream"}
			</Button>
		</div>
	);
};

export default Caller;
