import { Card, Stack, Button, Container, Typography } from "@mui/material";
import Socket, { socket } from "../components/socket";
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import Caller from "../components/caller";

import angryFace from "../../public/assets/images/angry-face.svg";
import sadFace from "../../public/assets/images/disappointed-face.svg";
import neutralFace from "../../public/assets/images/neutral-face.svg";
import disgustFace from "../../public/assets/images/woozy-face.svg";
import happyFace from "../../public/assets/images/grinning-face.svg";

// ----------------------------------------------------------------------

const EMOJI_ARR = [angryFace, sadFace, happyFace, disgustFace, neutralFace];

const EMOJI_MAP = {
	angry: 0,
	sad: 1,
	happy: 2,
	disgust: 3,
	neutral: 4,
};

// ----------------------------------------------------------------------

export default function UserPage() {
	const [readtToTakeCall, setReadtToTakeCall] = useState(true);
	const [mood, setMood] = useState("happy");
	const [selectedValue, setSelectedValue] = useState(null);

	useEffect(() => {
		// socket.on("emotion", onEmotion);

		return () => {
			// socket.off("emotion", onEmotion);
		};
	}, []);

	const handleFeedback = (value) => {
		setSelectedValue(value);
		console.log("Selected:", value);
	};

	return (
		<>
			<Socket />
			<Helmet>
				<title> User | Minimal UI </title>
			</Helmet>

			<Container>
				<Stack
					direction='row'
					alignItems='center'
					justifyContent='space-between'
					mb={5}>
					<Typography
						variant='h4'
						gutterBottom
						sx={{ color: "white" }}>
						User
					</Typography>
				</Stack>

				<Card
					style={{
						display: "flex",
						alignItems: "center",
						flexDirection: "column",
						padding: "25px",
						minHeight: "50vh",
						gap: "20px",
					}}>
					<Button
						variant='contained'
						style={{
							margin: "20px",
							display: "block",
							width: "fit-content",
						}}
						onClick={() => {
							setReadtToTakeCall(!readtToTakeCall);
						}}>
						{readtToTakeCall ? "Need a Break" : "Ready to take calls"}
					</Button>

					{readtToTakeCall && (
						<>
							<div
								style={{
									display: "flex",
									width: "100%",
									padding: "0px 20px",
									gap: "50px",
									// justifyContent: "space-between",
								}}>
								<div style={{ minWidth: "75%" }}>
									<Caller
										socket={socket}
										isCaller={true}
									/>
								</div>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										flexDirection: "column",
										maxWidth: "200px",
										// border: "2px solid black",
									}}>
									<h3>Predicted Sentiment</h3>
									<img
										src={EMOJI_ARR[EMOJI_MAP[mood]]}
										alt='sentiment'
										style={{
											objectFit: "contain",
										}}
									/>
								</div>
							</div>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									gap: "20px",
									border: "1px solid black",
									padding: "10px",
									minWidth: "50%",
									borderRadius: "10px",
								}}>
								<h3 style={{ margin: "0px" }}>Are sentiments correct</h3>
								<label>
									<input
										type='checkbox'
										checked={selectedValue === "yes"}
										onChange={() => handleFeedback("yes")}
										disabled={selectedValue !== null}
									/>{" "}
									Yes
								</label>
								<label>
									<input
										type='checkbox'
										checked={selectedValue === "no"}
										disabled={selectedValue !== null}
										onChange={() => handleFeedback("no")}
									/>{" "}
									No
								</label>
							</div>
						</>
					)}
				</Card>
			</Container>
		</>
	);
}
