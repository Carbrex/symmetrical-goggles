import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { toast } from "react-toastify";
import Visualizer from "./Visualiser";

// give default value to peerID
const Caller = ({ socket, peerID = "" }) => {
	const [remotePeerIdValue, setRemotePeerIdValue] = useState(peerID);
	const [buttonDisabled, setButtonDisabled] = useState(true);
	const [streamingToServer, setStreamingToServer] = useState(false);

	const localStreamRef = useRef(null);
	const remoteAudioRef = useRef(null);

	const peerInstance = useRef(null);

	const mediaRecorderRef = useRef(null);

	const playAudio = (stream) => {
		if (stream) {
			console.log("Playing audio from stream");
			remoteAudioRef.current.srcObject = stream;
			remoteAudioRef.current.play();
		} else {
			console.log("No stream");
		}
	};

	useEffect(() => {
		const peer = new Peer(
			undefined,
			// "8" + Math.floor(Math.random() * 1000000000).toString(),
			{
				host: import.meta.env.DEV ? "localhost" : window.location.hostname,
				port: 443,
				path: "/call",
			}
		);
		// peer.listAllPeers((peers) => {
		// 	console.log(peers);
		// });

		peer.on("open", (id) => {
			console.log("My peer ID is: " + id);

			// Get local media stream
			navigator.mediaDevices
				.getUserMedia({ video: false, audio: true })
				.then((mediaStream) => {
					localStreamRef.current = mediaStream;

					const options = {
						mimeType: "audio/webm",
						audioBitsPerSecond: 128000,
					};

					mediaRecorderRef.current = new MediaRecorder(mediaStream, options);
					console.log(mediaRecorderRef.current.stream);

					mediaRecorderRef.current.ondataavailable = function (e) {
						console.log("Sending audio chunk to server: " + e);
						console.log(e);
						if (e.data.size > 0) {
							socket.emit("audio", e.data, (response) => {
								if (!response.success) {
									toast.error(response.msg);
								}
							});
						}
					};
					setButtonDisabled(false);
				})
				.catch((err) => {
					toast.error("Please allow access to continue.");
					console.error("getUserMedia error:", err);
				});
		});

		peer.on("call", (call) => {
			console.log(call);
			toast.info(`Incoming call from ${call.peer}`);
			console.log(`Incoming call from ${call.peer}`);
			call.answer(localStreamRef.current);
			call.on("stream", playAudio);
		});
		peer.on("error", (err) => {
			console.error(err);
			toast.error(err.message);
		});

		peerInstance.current = peer;
		return () => {
			peer.disconnect();
			peer.destroy();
		};
	}, []);

	const call = (remotePeerId) => {
		console.log("Calling peer " + remotePeerId);
		if (localStreamRef.current) {
			const call = peerInstance.current.call(
				remotePeerId,
				localStreamRef.current
			);
			call.on("stream", playAudio);
		} else {
			console.error("Local media stream not available");
		}
	};
	const handleRecording = () => {
		if (!mediaRecorderRef.current || !localStreamRef.current) {
			toast.error("Please allow microphone access to continue.");
			console.error("Local media stream or MediaRecorder not available");
			return;
		}

		if (mediaRecorderRef.current.state === "recording") {
			mediaRecorderRef.current.stop();
			console.log("Stopped recording");
		} else {
			mediaRecorderRef.current.start(1000);
			// mediaRecorderRef.current.start();
			console.log("Sending stream to server");
		}

		setStreamingToServer(mediaRecorderRef.current.state === "recording");
	};

	socket.emit("hello", "hello from client", (response) => {
		console.log(response);
	});

	return (
		<div className='App'>
			<Visualizer
				localStream={localStreamRef.current}
				remoteStream={null}
			/>
			<h1>Your Phone Number: {peerInstance.current?.id}</h1>
			<input
				type='text'
				value={remotePeerIdValue}
				onChange={(e) => setRemotePeerIdValue(e.target.value)}
			/>
			<button
				onClick={() => call(remotePeerIdValue)}
				disabled={buttonDisabled}>
				Call
			</button>
			<button
				onClick={handleRecording}
				disabled={buttonDisabled}>
				{streamingToServer ? "Stop Stream" : "Start Stream"}
			</button>
			<audio ref={remoteAudioRef} />
		</div>
	);
};

export default Caller;
