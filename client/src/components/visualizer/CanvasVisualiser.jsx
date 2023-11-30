import { Stream } from "@mui/icons-material";
import React, { useEffect, useRef } from "react";
const Visualizer = ({ stream }) => {
	const canvasRef = useRef(null);
	let audioCtx = useRef(null);
	let canvasCtx = useRef(null);

	useEffect(() => {
		if (!stream) {
			return; // If stream is null or undefined, do nothing
		}
		if (!audioCtx.current) {
			try {
				audioCtx.current = new (window.AudioContext ||
					window.webkitAudioContext)();
			} catch (error) {
				console.log("Web Audio API is not supported in this browser");
				console.log(error);
			}
		}

		const source = audioCtx.current.createMediaStreamSource(stream);

		const analyser = audioCtx.current.createAnalyser();
		analyser.fftSize = 2048;
		const bufferLength = analyser.frequencyBinCount;
		const dataArray = new Uint8Array(bufferLength);

		source.connect(analyser);

		const canvas = canvasRef.current;
		canvasCtx.current = canvas.getContext("2d");

		function draw() {
			const WIDTH = canvas.width;
			const HEIGHT = canvas.height;

			requestAnimationFrame(draw);

			analyser.getByteTimeDomainData(dataArray);

			let gradient = canvasCtx.current.createLinearGradient(0, 0, 200, 0); // Define the gradient direction (x0, y0, x1, y1)
			// Adding color stops to the gradient
			gradient.addColorStop(0, "#1f283e"); // Start color
			gradient.addColorStop(1, "#405377"); // End color

			canvasCtx.current.fillStyle = gradient;
			canvasCtx.current.fillRect(0, 0, WIDTH, HEIGHT);

			canvasCtx.current.lineWidth = 2;
			canvasCtx.current.strokeStyle = "rgb(255, 255, 255)";
			canvasCtx.current.beginPath();

			let sliceWidth = (WIDTH * 1.0) / bufferLength;
			let x = 0;

			for (let i = 0; i < bufferLength; i++) {
				let v = dataArray[i] / 128.0;
				let y = (v * HEIGHT) / 2;

				if (i === 0) {
					canvasCtx.current.moveTo(x, y);
				} else {
					canvasCtx.current.lineTo(x, y);
				}

				x += sliceWidth;
			}

			canvasCtx.current.lineTo(canvas.width, canvas.height / 2);
			canvasCtx.current.stroke();
		}

		draw();

		const resizeCanvas = () => {
			canvas.width = canvas.parentElement.offsetWidth;
		};

		window.addEventListener("resize", resizeCanvas);
		resizeCanvas();

		return () => {
			window.removeEventListener("resize", resizeCanvas);
		};
	}, [stream]);

	return (
		<canvas
			ref={canvasRef}
			style={{
				width: "100%",
				height: "80px",
				borderRadius: "20px",
				backgroundColor: "black",
			}}
		/>
	);
};

export default Visualizer;
