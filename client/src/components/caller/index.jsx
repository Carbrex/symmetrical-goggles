import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import Peer from "peerjs";
import Call from "./call";

// give default value to peerID
const Caller = ({ socket, callTo = null, isCaller = false }) => {
	const [remotePeerIdValue, setRemotePeerIdValue] = useState(null);
	// const [streamToServer, setStreamToServer] = useState(false);

	const [peerInstance, setPeerInstance] = useState(null);

	useEffect(() => {
		const peer = new Peer(undefined, {
			host: import.meta.env.DEV
				? window.location.hostname
				: window.location.hostname,
			port: 443,
			path: "/call",
			secure: true,
		});

		peer.on("open", (id) => {
			console.log("My peer ID is: " + id);
			setPeerInstance(peer);
		});

		peer.on("error", (err) => {
			console.error(err);
			toast.error(err.message);
		});

		return () => {
			peer.disconnect();
			peer.destroy();
		};
	}, []);

	useEffect(() => {
		if (callTo) setRemotePeerIdValue(callTo);
	}, [callTo]);

	const onCallClick = (remoteId) => {
		setRemotePeerIdValue(remoteId);
	};
	const showDialer = isCaller ? false : true;
	const streamToServer = isCaller ? true : false;

	return (
		<div>
			<Call
				peer={peerInstance}
				socket={socket}
				callTo={remotePeerIdValue}
				closeCall={() => setRemotePeerIdValue(null)}
				sendToServer={streamToServer}
			/>
			<h2>Your Phone Number: {peerInstance?._id}</h2>

			{showDialer && (
				<Dialer
					disabled={peerInstance === null}
					onCallClick={onCallClick}
					streamingToServer={streamToServer}
					// sendToServer={() => setStreamToServer(!streamToServer)}
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
			{/* <Button
				disabled={disabled}
				variant='contained'
				onClick={sendToServer}>
				{streamingToServer ? "Stop Streaming" : "Stream To Server"}
			</Button> */}
		</div>
	);
};

export default Caller;
