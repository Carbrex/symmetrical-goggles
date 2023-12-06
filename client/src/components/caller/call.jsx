import { useEffect, useRef, useState } from "react";
import Confirmation from "../confirmation";
import Visualizer from "../visualizer";
import { toast } from "react-toastify";
import { Button } from "@mui/material";

// give default value to peerID
const Call = ({ peer, socket, callTo = null, closeCall, sendToServer }) => {
	const [localStream, setLocalStream] = useState(null);
	const [remoteStream, setRemoteStream] = useState(null);
	const [isCallActive, setIsCallActive] = useState(false);

	const localMediaRecorderRef = useRef(null);
	const remoteMediaRecorderRef = useRef(null);
	const audioRef = useRef(null);
	const callRef = useRef(null);

	const askPermissionForMic = () => {
		return new Promise((resolve, reject) => {
			navigator.mediaDevices
				.getUserMedia({ video: false, audio: true })
				.then((mediaStream) => {
					setLocalStream(mediaStream);
					resolve(mediaStream);
				})
				.catch((error) => {
					toast.erroror("Please allow access to continue.");
					console.error(error);
					reject(error);
				});
		});
	};

	const playAudio = (stream) => {
		if (stream) {
			toast.dismiss("call");
			toast.info("On Call", { toastId: "call", autoClose: false });

			console.log("Playing audio from stream");
			audioRef.current.srcObject = stream;
			audioRef.current.play();

			setRemoteStream(stream);
			setIsCallActive(true);
		} else {
			console.log("No stream");
		}
	};

	const hangUpCall = () => {
		console.log("Hanging up call");
		toast.dismiss("call");
		toast.info("Call ended", { toastId: "call" });
		setRemoteStream(null); // Clear remote stream
		setIsCallActive(false); // Update call status
		closeCall();
	};

	// const startCall = () => {

	const call = async (remotePeerId) => {
		console.log("Calling peer " + remotePeerId);
		toast.info("Calling peer " + remotePeerId + "...", {
			toastId: "call",
			autoClose: false,
		});
		askPermissionForMic()
			.then((mediaStream) => {
				if (!peer) {
					throw new Error("Peer not initialized");
				}
				const callInstance = peer.call(remotePeerId, mediaStream);
				callInstance.on("stream", playAudio);
				callInstance.on("close", hangUpCall);
				callRef.current = callInstance;
			})
			.catch((err) => {
				console.log(err);
				toast.dismiss("call");
				call?.close();
			});
	};

	const handleIncomingCall = (call) => {
		Confirmation({
			message: "Incoming Call from " + call.peer,
			onConfirm: () => {
				askPermissionForMic()
					.then((mediaStream) => {
						call.answer(mediaStream);
						call.on("stream", playAudio);
						call.on("close", hangUpCall);
						callRef.current = call;
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

		return () => {
			peer?.off("call", handleIncomingCall);
		};
	}, [callTo, peer]);

	const handleMediaData = (media, eventName, recorderRef, socket) => {
		media.ondataavailable = function (e) {
			if (e.data.size > 0) {
				console.log("Sending audio chunk to server: ");
				socket.emit(eventName, e.data, (response) => {
					if (!response.success) {
						toast.error(response.msg);
					}
				});
			}
		};
		recorderRef.current = media;
	};

	const setMediaRecorder = () => {
		try {
			const options = {
				mimeType: "audio/webm",
				audioBitsPerSecond: 128000,
			};

			console.log(localStream);
			console.log(remoteStream);

			const localMedia = new MediaRecorder(localStream, options);
			const remoteMedia = new MediaRecorder(remoteStream, options);

			handleMediaData(localMedia, "audioClient", localMediaRecorderRef, socket);
			handleMediaData(
				remoteMedia,
				"audioRemote",
				remoteMediaRecorderRef,
				socket
			);
			console.log(localMediaRecorderRef.current);
			console.log(remoteMediaRecorderRef.current);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		// console.log("sendToServer", sendToServer);
		if (sendToServer === false) return;
		if (isCallActive === true) {
			setMediaRecorder();
			console.log(localMediaRecorderRef.current);
			console.log(remoteMediaRecorderRef.current);
			localMediaRecorderRef.current.start(1000);
			remoteMediaRecorderRef.current.start(1000);
			console.log("Sending stream to server");
		} else {
			localMediaRecorderRef.current?.stop();
			remoteMediaRecorderRef.current?.stop();
			console.log("Stopped streaming");
		}
	}, [isCallActive]);

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
