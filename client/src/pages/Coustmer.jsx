import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { socket } from "../socket";
import Caller from "../components/caller";

// @mui
import { Card, Stack, Button, Container, Typography } from "@mui/material";

export default function UserPage() {
	const [isOnCall, setIsOnCall] = useState(false);
	const [customerNo, setCosutomerNo] = useState("");

	useEffect(() => {
		const onConnect = (data) => {
			console.log("Socket Connected");
			if (socket.connected === true) {
				socket.emit("emotion");
			}
		};
		const onConnection = (data) => {
			console.log("customer no", data);
			setCosutomerNo(data.customerNo);
		};

		const onDisconnect = () => {
			console.log("disconnected");
		};

		socket.on("connect", onConnect);
		socket.on("connection", onConnection);
		socket.on("disconnect", onDisconnect);
		socket.connect();

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
			socket.disconnect();
		};
	}, []);

	return (
		<>
			<Helmet>
				<title> Coustomer </title>
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
						Coustomer Call Page
					</Typography>
				</Stack>

				<Card>
					<div style={{ border: "2px solid black", padding: "20px" }}>
						<Caller
							socket={socket}
							peerID={isOnCall ? customerNo : ""}
						/>
					</div>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							flexDirection: "column",
							padding: "10px",
						}}>
						<Button
							disabled={customerNo === ""}
							variant='contained'
							style={{ margin: "20px" }}
							onClick={() => {
								setIsOnCall(!isOnCall);
							}}>
							{isOnCall ? "Hang Up" : "Start Call"}
						</Button>
					</div>
				</Card>
			</Container>
		</>
	);
}
