import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import Socket, { socket } from "../components/socket";
import Caller from "../components/caller";

// @mui
import { Card, Stack, Button, Container, Typography } from "@mui/material";

export default function UserPage() {
	const [call, setCall] = useState(false);
	const [customerNo, setCosutomerNo] = useState("");

	useEffect(() => {
		socket.emit("getCoustomerNo", null, (data) => {
			// console.log("customer no", data);
			setCosutomerNo(data.customerNo);
		});

		return () => {
			// console.log("unmounting");
		};
	}, []);
	const handleCallButton = () => {
		setCall(true);
	};

	return (
		<>
			<Socket />
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

				<Card style={{ padding: "25px" }}>
					<Caller
						socket={socket}
						callTo={call === true ? customerNo : null}
					/>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							flexDirection: "column",
							padding: "10px",
						}}>
						<Button
							disabled={customerNo === "" || call === true}
							variant='contained'
							style={{ margin: "20px" }}
							onClick={handleCallButton}>
							Call Coustomer Care
						</Button>
					</div>
				</Card>
			</Container>
		</>
	);
}
