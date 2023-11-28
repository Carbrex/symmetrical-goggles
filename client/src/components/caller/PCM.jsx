import React, { useState, useEffect } from "react";

const AudioRecorder = ({ socket }) => {
	const [isRecording, setIsRecording] = useState(false);
	const [audioStream, setAudioStream] = useState(null);
	const [leftChannel, setLeftChannel] = useState([]);
	const [recordingLength, setRecordingLength] = useState(0);

	useEffect(() => {
		const initAudio = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					audio: true,
				});
				setAudioStream(stream);
			} catch (error) {
				alert("Error capturing audio.");
			}
		};

		initAudio();

		return () => {
			if (audioStream) {
				audioStream.getTracks().forEach((track) => track.stop());
			}
		};
	}, []);

	const startRecording = () => {
		if (!isRecording && audioStream) {
			const context = new (window.AudioContext || window.webkitAudioContext)();
			const sampleRate = context.sampleRate;
            console.log(sampleRate);
			const volume = context.createGain();
			const audioInput = context.createMediaStreamSource(audioStream);
			const bufferSize = 2048;

			const recorder = (
				context.createScriptProcessor || context.createJavaScriptNode
			).call(context, bufferSize, 1, 1);

			const handleAudioProcess = (event) => {
				const samples = event.inputBuffer.getChannelData(0);
				setLeftChannel((prevChannel) => [
					...prevChannel,
					new Float32Array(samples),
				]);
				setRecordingLength((prevLength) => prevLength + bufferSize);
			};

			recorder.onaudioprocess = handleAudioProcess;
			volume.connect(recorder);
			audioInput.connect(volume);
			recorder.connect(context.destination);

			setIsRecording(true);
		} else {
			stopRecording();
		}
	};

	const stopRecording = () => {
		setIsRecording(false);
		setLeftChannel([]);
		setRecordingLength(0);
	};

	const mergeBuffers = (channelBuffer, length) => {
		let result = new Float32Array(length);
		let offset = 0;

		for (let i = 0; i < channelBuffer.length; i++) {
			result.set(channelBuffer[i], offset);
			offset += channelBuffer[i].length;
		}

		return Array.prototype.slice.call(result);
	};

	const convertToPCM16 = (PCM32fSamples) => {
		const PCM16iSamples = PCM32fSamples.map((sample) => {
			let val = Math.floor(32767 * sample);
			val = Math.min(32767, val);
			val = Math.max(-32768, val);
			return val;
		});

		return PCM16iSamples;
	};

	const sendData = () => {
		const PCM32fSamples = mergeBuffers(leftChannel, recordingLength);
		const PCM16iSamples = convertToPCM16(PCM32fSamples);

		// Send PCM16iSamples array using socket.io
		if (socket) {
			socket.emit("audioData", PCM16iSamples);
			// You might need to implement the corresponding socket event on the server side.
		}
	};

	return (
		<div>
			<button onClick={startRecording}>
				{isRecording ? "Stop Recording" : "Start Recording"}
			</button>
			<button
				onClick={sendData}
				disabled={!leftChannel.length}>
				Send Data
			</button>
		</div>
	);
};

export default AudioRecorder;
