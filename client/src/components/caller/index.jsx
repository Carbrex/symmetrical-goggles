import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { toast } from "react-toastify";
import { set } from "lodash";

const Caller = ({ socket }) => {
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
  const [peerId, setPeerId] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [streamingToServer, setStreamingToServer] = useState(false); // [1
  const remoteAudioRef = useRef(null);
  const peerInstance = useRef(null);
  const localStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const playAudio = (stream) => {
    console.log("Playing audio from stream");
    remoteAudioRef.current.srcObject = stream;
    remoteAudioRef.current.play();
  };

  useEffect(() => {
    const peer = new Peer(undefined, {
      host: "localhost",
      port: 5000,
      path: "/myapp",
    });

    peer.on("open", (id) => {
      console.log("My peer ID is: " + id);
      setPeerId(id);

      // Get local media stream
      navigator.mediaDevices
        .getUserMedia({ video: false, audio: true })
        .then((mediaStream) => {
          localStreamRef.current = mediaStream;

          const options = {
            mimeType: "audio/ogg; codecs=opus",
            audioBitsPerSecond: 128000,
            videoBitsPerSecond: 2500000,
            bitsPerSecond: 2628000,
          };

          mediaRecorderRef.current = new MediaRecorder(mediaStream);
          const audioChunks = []; // Store audio chunks continuously

          mediaRecorderRef.current.ondataavailable = function (e) {
            console.log("Data available");
            console.log(e);
            if (e.data.size > 0) {
              console.log("Sending audio chunk to server");
              audioChunks.push(e.data);
              const audioBlob = new Blob(audioChunks, {
                type: "audio/ogg; codecs=opus",
              });
              // console.log(audioChunks);
              // console.log(audioBlob);

              // Send the audio Blob to the server via Socket in real-time
              socket.emit("audio", audioBlob, (response) => {
                if (!response.success) {
                  toast.error(response.msg);
                }
              });

              // Clear the chunks after sending to avoid resending old data
              audioChunks.length = 0;
            }
          };

          setButtonDisabled(false);
        })
        .catch((err) => {
          toast.error(
            "Microphone access denied. Please allow access to continue."
          );
          console.error("getUserMedia error:", err);
        });
    });

    peer.on("call", (call) => {
      console.log("Incoming call");
      console.log(call);
      call.answer(localStreamRef.current);
      call.on("stream", playAudio);
    });

    peerInstance.current = peer;
  }, []);

  const call = (remotePeerId) => {
    console.log("Calling peer " + remotePeerId);
    if (localStreamRef.current) {
      const call = peerInstance.current.call(
        remotePeerId,
        localStreamRef.current
      );
      call.on("stream", playAudio);
    } else {
      console.error("Local media stream not available");
    }
  };
  const handleRecording = () => {
    if (!mediaRecorderRef.current || !localStreamRef.current) {
      toast.error("Please allow microphone access to continue.");
      console.error("Local media stream or MediaRecorder not available");
      return;
    }

    if (mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      console.log("Stopped recording");
    } else {
      mediaRecorderRef.current.start(1000);
      console.log("Sending stream to server");
    }

    setStreamingToServer(mediaRecorderRef.current.state === "recording");
  };

  socket.emit("hello", "hello from client", (response) => {
    console.log(response);
  });

  return (
    <div className="App">
      <h1>Current user id is {peerId}</h1>
      <input
        type="text"
        value={remotePeerIdValue}
        onChange={(e) => setRemotePeerIdValue(e.target.value)}
      />
      <button onClick={() => call(remotePeerIdValue)} disabled={buttonDisabled}>
        Call
      </button>
      <button onClick={handleRecording} disabled={buttonDisabled}>
        {streamingToServer ? "Stop Stream" : "Start Stream"}
      </button>
      <div>
        <audio ref={remoteAudioRef} controls />
      </div>
    </div>
  );
};

export default Caller;
