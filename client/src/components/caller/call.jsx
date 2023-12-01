import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Visualizer from "../visualizer";
import Confirmation from "../confirmation";
import { Button } from "@mui/material";

// give default value to peerID
const Call = ({ peer, socket, callTo = null, closeCall, sendToServer }) => {
	const [localStream, setLocalStream] = useState(null);
	const [remoteStream, setRemoteStream] = useState(null);
	const [isCallActive, setIsCallActive] = useState(false);

	const mediaRecorderRef = useRef(null);
	const audioRef = useRef(null);
	const callRef = useRef(null);
	console.log("callTo", callTo);

	const hangUpCall = () => {
		console.log("Hanging up call");
		toast.dismiss("call");
		toast.info("Call ended", { toastId: "call" });
		setRemoteStream(null); // Clear remote stream
		setIsCallActive(false); // Update call status
		closeCall();
	};

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
			audioRef.current.srcObject = stream;
			audioRef.current.play();
			setRemoteStream(stream);
		} else {
			console.log("No stream");
		}
	};

	const call = async (remotePeerId) => {
		console.log("Calling peer " + remotePeerId);
		toast.info("Calling peer " + remotePeerId + "...", {
			toastId: "call",
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
					console.log(remotePeerId);
					callRef.current = peer.call(remotePeerId, mediaStream);
					callRef.current.on("stream", (stream) => {
						toast.dismiss("call");
						toast.success("On Call with", {
							toastId: "call",
							autoClose: false,
						});
						playAudio(stream);
						setIsCallActive(true);
					});
					callRef.current.on("close", hangUpCall);
				} catch (error) {
					console.log(error);
				}
			})
			.catch((err) => {
				toast.dismiss("call");
				call.close();
				console.log(err);
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
						call.on("close", hangUpCall);
						toast.success("On Call with" + remotePeerId, { toastId: "call" });
						callRef.current = call;
						setIsCallActive(true);
					})
					.catch((err) => {
						toast.dismiss("call");
						call.close();
						console.log(err);
					});
			},
			onCancel: () => {
				call.close();
			},
			toastId: "call",
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
				remoteStream={remoteStream}
			/>
			<audio ref={audioRef} />
			{isCallActive && (
				<Button
					variant='contained'
					onClick={() => {
						callRef.current.close();
					}}>
					Hang Up
				</Button>
			)}
		</>
	);
};

export default Call;
