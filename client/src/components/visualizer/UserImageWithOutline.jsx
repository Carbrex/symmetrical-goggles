import React, { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import account from "../../_mock/account";

const UserImageWithOutline = ({ stream }) => {
	const [volume, setVolume] = useState(0);

	useEffect(() => {
		if (!stream) {
			return; // If stream is null or undefined, do nothing
		}
		const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		const analyserNode = audioCtx.createAnalyser();
		analyserNode.fftSize = 256;
		const source = audioCtx.createMediaStreamSource(stream);
		source.connect(analyserNode);

		const updateVolume = () => {
			const bufferLength = analyserNode.frequencyBinCount;
			const dataArray = new Uint8Array(bufferLength);
			analyserNode.getByteFrequencyData(dataArray);
			const avgVolume =
				dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;
			setVolume(avgVolume);
			requestAnimationFrame(updateVolume);
		};

		const animationFrame = requestAnimationFrame(updateVolume);

		return () => {
			cancelAnimationFrame(animationFrame);
			audioCtx.close();
		};
	}, [stream]);

	const outlineScale = 1 + volume / 200;

	return (
		<div style={{ position: "relative", width: "80px", height: "80px" }}>
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					borderRadius: "50%",
					border: `2px solid #333`, // Outline color
					transform: `scale(${outlineScale})`, // Scale based on volume
					transition: "transform 0.1s ease-in-out", // Smooth transition
					zIndex: 1, // Ensure the outline is above the avatar
				}}
			/>
			<Avatar
				alt='User Avatar'
				src={account.photoURL}
				style={{
					width: "100%",
					height: "100%",
					borderRadius: "50%",
					position: "relative",
					zIndex: 0,
				}}
			/>
		</div>
	);
};

export default UserImageWithOutline;
