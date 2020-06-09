import React, { useEffect, useState } from "react";
const Audio = () => {
  const uploaderRef = React.createRef();
  const stopRef = React.createRef();
  const recordRef = React.createRef();
  const downloadRef = React.createRef();
  const playerRef = React.createRef();
  const [isRecording, setIsRecording] = useState(false);
  const [shouldStop, setShouldStop] = useState(false);

  //START RECORDING
  const recordAudio = () => {
    setIsRecording(true);
    const getUserMedia =
      navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (!getUserMedia) {
      return Promise.reject(
        new Error("getUserMedia is not implemented in this browser")
      );
    }
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: false,
      })
      .then((stream) => handleSuccess(stream))
      .catch((e) => {
        console.log("error from getUserMedia func");
        console.log(e);
      });
  };

  const handleSuccess = function (stream) {
    console.log("hit!");
    console.log(stream);
    // if (window.URL) {
    //   playerRef.current.srcObject = stream;
    // } else {
    //   playerRef.current.src = stream;
    // }
    //const AudioContext = window.AudioContext || window.webkitAudioContext;
    const options = { mimeType: "audio/webm" };

    //const context = new AudioContext();
    //const source = context.createMediaStreamSource(stream);
    // const processor = context.createScriptProcessor(1024, 1, 1);
    // source.connect(processor);
    // processor.connect(context.destination);
    // processor.onaudioprocess = (e) => {
    //   numberOfChannels = e.inputBuffer.numberOfChannels;
    //   console.log(e.inputBuffer);
    //   // Do something with the data, e.g. convert it to WAV
    //   //this.recordedBuffers[i].push([...e.inputBuffer.getChannelData(i)]);
    // };

    const mediaRecorder = new MediaRecorder(stream, options);
    const recordedChunks = [];

    recordRef.current.addEventListener("click", (ev) => {
      mediaRecorder.start();
      console.log(mediaRecorder.state);
    });

    mediaRecorder.addEventListener("dataavailable", (chunk) => {
      if (chunk.data.size > 0) {
        console.log(chunk);
        recordedChunks.push(chunk.data);
      }

      if (shouldStop === true && isRecording === true) {
        mediaRecorder.stop();
        setIsRecording(false);
        setShouldStop(false);
      }
    });

    mediaRecorder.addEventListener("stop", () => {
      downloadRef.current.href = URL.createObjectURL(
        new Blob(recordedChunks, { type: "audio/wave;" })
      );
      downloadRef.current.download = "myrecord.wav";
      recordedChunks.length = 0; //clean up the array
    });

    // stopRef.current.addEventListener("click", () => {
    //   mediaRecorder.stop();
    //   setIsRecording(false);
    //   setShouldStop(false);
    // });

    mediaRecorder.start();
  };

  //АВТОМАТИЧЕСКАЯ ОСТАНОВКА ЧЕРЕЗ 10 сек
  useEffect(() => {
    if (isRecording === true) {
      setTimeout(() => {
        setShouldStop(true);
      }, 10000);
    }
  }, [isRecording]);

  //if uploading file
  useEffect(() => {
    uploaderRef.current.addEventListener("change", (e) => {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      playerRef.current.src = url;
    });

    // return () => {
    //   uploaderRef.current.removeEventListener("change");
    // };
  }, [uploaderRef, playerRef]);

  return (
    <div>
      <div>
        <input
          type="file"
          accept="audio/*"
          capture
          id="upload"
          ref={uploaderRef}
        />
      </div>
      ИЛИ
      <div>
        <button ref={recordRef}>Record</button>
        <button
          ref={stopRef}
          onClick={() => {
            setShouldStop(true);
          }}
        >
          stop
        </button>
      </div>
      <div>
        <audio id="player" controls ref={playerRef}></audio>
      </div>
      <div>
        <button ref={downloadRef}>download</button>
      </div>
    </div>
  );
};

export default Audio;
