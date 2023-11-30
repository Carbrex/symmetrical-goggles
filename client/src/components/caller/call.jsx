import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { toast } from "react-toastify";
import Visualizer from "../visualizer";
import Confirmation from "../confirmation";

// give default value to peerID
const Call = ({ peer, socket, callTo = null, sendToServer }) => {
	const [localStream, setLocalStream] = useState(null);
	const [remoteStream, setRemoteStream] = useState(null);

	const mediaRecorderRef = useRef(null);
	const callRef = useRef(null);

	const setMediaRecorder = (stream) => {
		try {
			const options = {
				mimeType: "audio/webm",
				audioBitsPerSecond: 128000,
			};

			mediaRecorderRef.current = new MediaRecorder(stream, options);
			// console.log(mediaRecorderRef.current.stream);

			mediaRecorderRef.current.ondataavailable = function (e) {
				// console.log(e);
				if (e.data.size > 0) {
					console.log("Sending audio chunk to server: ");
					socket.emit("audio", e.data, (response) => {
						if (!response.success) {
							toast.error(response.msg);
						}
					});
				}
			};
		} catch (error) {
			console.log(error);
		}
	};

	const askPermissionForMic = () => {
		return new Promise((resolve, reject) => {
			navigator.mediaDevices
				.getUserMedia({ video: false, audio: true })
				.then((mediaStream) => {
					setLocalStream(mediaStream);
					setMediaRecorder(mediaStream);
					resolve(mediaStream);
				})
				.catch((err) => {
					toast.error("Please allow access to continue.");
					console.error("getUserMedia error:", err);
					reject(false);
				});
		});
	};

	const playAudio = (stream) => {
		if (stream) {
			console.log("Playing audio from stream");
			setRemoteStream(stream);
		} else {
			console.log("No stream");
		}
	};

	const call = async (remotePeerId) => {
		console.log("Calling peer " + remotePeerId);
		toast.info("Calling peer " + remotePeerId + "...", {
			toastId: "callTo",
			autoClose: false,
		});
		askPermissionForMic()
			.then((mediaStream) => {
				try {
					if (!peer) {
						console.log(peer);
						console.error("Peer not initialized");
						return;
					}
					console.log(peer);
					console.log(remotePeerId);
					console.log(localStream);
					console.log(mediaStream);
					const call12 = peer.call(remotePeerId, mediaStream);
					// console.log();
					// callRef.current = peer.call(remotePeerId, localStream);
					// callRef.current.on("stream", (stream) => {
					call12.on("stream", (stream) => {
						toast.dismiss("callTo");
						console.log("Got remote stream");
						console.log(stream);
						playAudio(stream);
					});
				} catch (error) {
					console.log(error);
				}
			})
			.catch((permissionDenied) => {
				toast.dismiss("callTo");
				console.error("Permission denied");
			});
	};

	const handleIncomingCall = (call) => {
		console.log(call);
		Confirmation({
			message: "Incoming Call from " + call.peer,
			onConfirm: () => {
				askPermissionForMic()
					.then((mediaStream) => {
						call.answer(mediaStream);
						call.on("stream", playAudio);
					})
					.catch((err) => {
						console.log(err);
					});
			},
			onCancel: () => {
				call.close();
			},
			toastId: "callFrom",
		});
	};

	useEffect(() => {
		if (peer) {
			peer.on("call", handleIncomingCall);
		}

		callTo && call(callTo);

		return () => {};
	}, [callTo, peer]);

	const handleRecording = () => {
		if (!mediaRecorderRef.current || !localStream) {
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

	return (
		<>
			<Visualizer
				localStream={localStream}
				// remoteStream={localStreamRef.current}
				remoteStream={remoteStream}
			/>
			{remoteStream && <audio src={remoteStream} />}
		</>
	);
};

export default Call;
