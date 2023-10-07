import { Helmet } from "react-helmet-async";
import { filter } from "lodash";
import { sentenceCase } from "change-case";
import { useState, useEffect } from "react";
import { socket } from "../socket";
// import micGif from 'https://gifer.com/en/44zG';
import micGif from "../../public/assets/images/mic-gif2.gif";
import angryFace from "../../public/assets/images/angry-face.svg";
import sadFace from "../../public/assets/images/disappointed-face.svg";
import neutralFace from "../../public/assets/images/neutral-face.svg";
import disgustFace from "../../public/assets/images/woozy-face.svg";
import happyFace from "../../public/assets/images/grinning-face.svg";

// @mui
import {
	Card,
	Box,
	Table,
	Stack,
	Paper,
	Avatar,
	Button,
	Popover,
	Checkbox,
	TableRow,
	MenuItem,
	TableBody,
	TableCell,
	Container,
	Typography,
	IconButton,
	TableContainer,
	TablePagination,
} from "@mui/material";
// components
import Label from "../components/label";
import Iconify from "../components/iconify";
import Scrollbar from "../components/scrollbar";
// sections
import { UserListHead, UserListToolbar } from "../sections/@dashboard/user";
// mock
import USERLIST from "../_mock/user";
import { GifBox } from "@mui/icons-material";

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
	const [open, setOpen] = useState(null);
	const [isRecording, setIsRecording] = useState(false);
	// const [loadingMood, setLoadingMood] = useState(true);
	const [mood, setMood] = useState("happy");

	useEffect(() => {
		// console.log(socket);
		function onConnect() {
			console.log("connected");
			if (socket.connected === true) {
				socket.emit("emotion");
			}
		}

		function onDisconnect() {
			console.log("disconnected");
		}

		function onEmotion(value) {
			console.log("onEmotion", value);
			// setMood(value);
		}

		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);
		socket.on("emotion", onEmotion);
		socket.connect();

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
			socket.off("emotion", onEmotion);
			socket.disconnect();
		};
	}, []);

	return (
		<>
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
					{/* <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New User
          </Button> */}
				</Stack>

				<Card>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							flexDirection: "column",
							padding: "10px",
							height: "50vh",
						}}>
						<Button
							variant='contained'
							style={{ margin: "20px" }}
							onClick={() => {
								setIsRecording(!isRecording);
							}}
							// startIcon={<Iconify icon="eva:plus-fill" />}
						>
							{isRecording ? "End" : "Start"} Call
						</Button>

						{isRecording && (
							<>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-around",
										flexDirection: "row",
										width: "100%",
									}}>
									<img
										src={micGif}
										alt='mic'
										style={{
											height: "15vw",
											width: "18vw",
											borderRadius: "3%",
										}}
									/>
									<div
										style={{
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											flexDirection: "column",
										}}>
										<h3>Current Sentiments</h3>
										<img
											src={EMOJI_ARR[EMOJI_MAP[mood]]}
											alt='sentiment'
											style={{
												width: "20vw",
												height: "10vw",
												objectFit: "contain",
											}}
										/>
									</div>
								</div>
								<div>
									<h3>Are the sentiments given by the model correct</h3>
									<select
										style={{
											backgroundColor: "#f7fafc" /* bg-gray-50 */,
											border: "1px solid #e5e7eb" /* border border-gray-300 */,
											color: "#111827" /* text-gray-900 */,
											fontSize: "0.875rem" /* text-sm */,
											borderRadius: "0.375rem" /* rounded-lg */,
											display: "block" /* block */,
											width: "100%" /* w-full */,
											padding: "0.625rem" /* p-2.5 */,
											backgroundColor: "#374151" /* dark:bg-gray-700 */,
											color: "#ffffff" /* dark:text-white */,
										}}
										name=''
										id=''>
										<option value=''>Feedback</option>
										<option value=''>Yes</option>
										<option value=''>No</option>
									</select>
								</div>
							</>
						)}
					</div>
				</Card>
			</Container>
		</>
	);
}
