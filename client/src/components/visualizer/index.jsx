import React from "react";
import CanvasVisualiser from "./CanvasVisualiser";
import UserImageWithOutline from "./UserImageWithOutline";

const Visualiser = ({ localStream, remoteStream }) => {
	return (
		<div style={{ display: "flex", gap: "20px", padding: "10px" }}>
			<UserImageWithOutline stream={localStream} />
			<CanvasVisualiser stream={remoteStream} />
		</div>
	);
};

export default Visualiser;
