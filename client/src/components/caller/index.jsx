import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { toast } from "react-toastify";
import { set } from "lodash";

const Caller = ({ socket }) => {
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
  const [peerId, setPeerId] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
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

          mediaRecorderRef.current = new MediaRecorder(mediaStream);
          mediaRecorderRef.current.ondataavailable = function (e) {
            console.log("data available");
            if (e.data.size > 0) {
              const audioChunks = [];
              audioChunks.push(e.data);
              const audioBlob = new Blob(audioChunks, {
                type: "audio/ogg; codecs=opus",
              });

              // Send the audio Blob to the server via Socket
              socket.emit("audio", audioBlob, (response) => {
                if (!response.success) {
                  toast.error(response.msg);
                }
              });
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
  const startRecording = () => {
    if (mediaRecorderRef.current && localStreamRef.current) {
      //check if already recording
      if (mediaRecorderRef.current.state === "recording") {
        toast.error("Already recording");
        return;
      }
      mediaRecorderRef.current.start();
      setTimeout(() => {
        // Stop recording after 5 seconds (adjust as needed)
        console.log("Stopped recording");
        mediaRecorderRef.current.stop();
      }, 5000); // Change this value to the desired duration
    } else {
      toast.error("Please allow microphone access to continue.2");
      console.error("Local media stream or MediaRecorder not available");
    }
  };
  const sendStreamToServer = () => {
    if (mediaRecorderRef.current && localStreamRef.current) {
      console.log("Sending stream to server");
      startRecording();
    } else {
      toast.error("Please allow microphone access to continue.3");
      console.error("Local media stream or MediaRecorder not available");
    }
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
      <button onClick={sendStreamToServer} disabled={buttonDisabled}>
        Send Stream to Server
      </button>
      <div>
        <audio ref={remoteAudioRef} controls />
      </div>
    </div>
  );
};

export default Caller;
