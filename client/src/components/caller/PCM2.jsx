import React, { useState, useEffect } from "react";

const AudioRecorder = ({ socket }) => {
	const [isRecording, setIsRecording] = useState(false);
	const [leftChannel, setLeftChannel] = useState([]);
	const [rightChannel, setRightChannel] = useState([]);
	const [recordingLength, setRecordingLength] = useState(0);

	let audioContext;
	let context;
	let sampleRate;
	let volume;
	let audioInput;
	let recorder;

	useEffect(() => {
		if (!navigator.getUserMedia)
			navigator.getUserMedia =
				navigator.getUserMedia ||
				navigator.webkitGetUserMedia ||
				navigator.mozGetUserMedia ||
				navigator.msGetUserMedia;

		if (navigator.getUserMedia) {
			navigator.getUserMedia({ audio: true }, success, function (e) {
				alert("Error capturing audio.");
			});
		} else alert("getUserMedia not supported in this browser.");

		navigator.getUserMedia({ video: true }, success, function (e) {
			alert("Error capturing video.");
		});

		return () => {
			if (isRecording) {
				stopRecording();
			}
		};
	}, []);

	const success = (e) => {
		audioContext = window.AudioContext || window.webkitAudioContext;
		context = new audioContext();
		sampleRate = context.sampleRate;
		volume = context.createGain();
		audioInput = context.createMediaStreamSource(e);
		audioInput.connect(volume);
		const bufferSize = 2048;
		recorder = context.createScriptProcessor(bufferSize, 2, 2);
		recorder.onaudioprocess = function (e) {
			console.log("recording");
			const left = e.inputBuffer.getChannelData(0);
			const right = e.inputBuffer.getChannelData(1);
			setLeftChannel((prevLeftChannel) => [
				...prevLeftChannel,
				new Float32Array(left),
			]);
			setRightChannel((prevRightChannel) => [
				...prevRightChannel,
				new Float32Array(right),
			]);
			setRecordingLength(
				(prevRecordingLength) => prevRecordingLength + bufferSize
			);
		};
		volume.connect(recorder);
		recorder.connect(context.destination);
	};

	const mergeBuffers = (channelBuffer, recordingLength) => {
		let result = new Float32Array(recordingLength);
		let offset = 0;
		const length = channelBuffer.length;

		for (let i = 0; i < length; i++) {
			const buffer = channelBuffer[i];
			result.set(buffer, offset);
			offset += buffer.length;
		}

		return result;
	};

	const interleave = (leftChannel, rightChannel) => {
		const length = leftChannel.length + rightChannel.length;
		const result = new Float32Array(length);
		let inputIndex = 0;

		for (let index = 0; index < length; ) {
			result[index++] = leftChannel[inputIndex];
			result[index++] = rightChannel[inputIndex];
			inputIndex++;
		}

		return result;
	};

	const stopRecording = () => {
		setIsRecording(false);

		// recorder.disconnect();
		// audioInput.disconnect();
		// volume.disconnect();

		const leftBuffer = mergeBuffers(leftChannel, recordingLength);
		const rightBuffer = mergeBuffers(rightChannel, recordingLength);
		const interleaved = interleave(leftBuffer, rightBuffer);

		const buffer = new ArrayBuffer(44 + interleaved.length * 2);
		const view = new DataView(buffer);

		// Create WAV file header
		function writeString(view, offset, string) {
			for (let i = 0; i < string.length; i++) {
				view.setUint8(offset + i, string.charCodeAt(i));
			}
		}

		writeString(view, 0, "RIFF"); // ChunkID
		view.setUint32(4, 44 + interleaved.length * 2 - 8, true); // ChunkSize
		writeString(view, 8, "WAVE"); // Format
		writeString(view, 12, "fmt "); // Subchunk1ID
		view.setUint32(16, 16, true); // Subchunk1Size
		view.setUint16(20, 1, true); // AudioFormat
		view.setUint16(22, 2, true); // NumChannels
		view.setUint32(24, sampleRate, true); // SampleRate
		view.setUint32(28, sampleRate * 4, true); // ByteRate
		view.setUint16(32, 4, true); // BlockAlign
		view.setUint16(34, 16, true); // BitsPerSample
		writeString(view, 36, "data"); // Subchunk2ID
		view.setUint32(40, interleaved.length * 2, true); // Subchunk2Size

		// Write interleaved audio data to the WAV file
		const interleavedLength = interleaved.length;
		const loopvolume = 1;
		let index = 44;

		for (let i = 0; i < interleavedLength; i++) {
			view.setInt16(index, interleaved[i] * (0x7fff * loopvolume), true);
			index += 2;
		}

		const blob = new Blob([view], { type: "audio/wav" });
		socket.emit("audioData", blob); // Assuming 'audioData' is the event name
	};

	const handleRecord = () => {
		if (isRecording) {
			stopRecording();
		} else {
			setIsRecording(true);
		}
	};

	return (
		<div>
			<button onClick={handleRecord}>
				{isRecording ? "Stop Recording" : "Start Recording"}
			</button>
		</div>
	);
};

export default AudioRecorder;
