import React, { createRef, useEffect, useState } from "react";
import { useStopwatch } from "./context/StopwatchContext";

const Audio = () => {
  const {
    seconds,
    startStopwatch,
    stopStopwatch,
    resetStopwatch,
    //isStopwatchRunning,
  } = useStopwatch();
  const uploaderRef = createRef();
  const playerRef = createRef();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
    navigator.mediaDevices.getUserMedia = function (constraintObj) {
      let getUserMedia =
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      if (!getUserMedia) {
        return Promise.reject(
          new Error("getUserMedia is not implemented in this browser")
        );
      }
      return new Promise(function (resolve, reject) {
        getUserMedia.call(navigator, constraintObj, resolve, reject);
      });
    };
  } else {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        devices.forEach((device) => {
          //console.log(device.kind.toUpperCase(), device.label);
        });
      })
      .catch((err) => {
        console.log(err.name, err.message);
      });
  }

  let recordAudio = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: false,
      })
      .then(function (mediaStreamObj) {
        console.log(mediaStreamObj);
        let mediaRecorder = new MediaRecorder(mediaStreamObj, {
          mimeType: "audio/webm",
        });
        let chunks = [];

        mediaRecorder.start();
        setIsRecording(true);
        startStopwatch();

        //автоматическая остановка через 10 сек
        setTimeout(() => {
          if (mediaRecorder.state === "recording") {
            mediaRecorder.stop();
          }
        }, 10000);

        let stopButton = document.getElementById("stopButton");
        stopButton.addEventListener("click", () => {
          if (mediaRecorder.state === "recording") {
            mediaRecorder.stop();
          }
        });

        mediaRecorder.ondataavailable = function (ev) {
          if (ev.data.size > 0) {
            chunks.push(ev.data);
          }
        };

        mediaRecorder.onstop = () => {
          console.log("ONSTOP CALLED");
          setIsRecording(false);
          stopStopwatch();
          //stopRef.current.removeEventListener("click", mediaRecorder.stop);
          mediaStreamObj.getTracks()[0].stop();
          let blob = new Blob(chunks, { type: "audio/wave;" });
          setIsPlayerReady(true);
          let audioPlayer = document.getElementById("audioPlayer");
          audioPlayer.src = window.URL.createObjectURL(blob);
          chunks = [];
          let downloadLink = document.getElementById("downloadLink");
          downloadLink.href = window.URL.createObjectURL(blob);
          downloadLink.download = "myrecord.wav";
          document
            .getElementById("resetButton")
            .addEventListener("click", () => {
              downloadLink.href = null;
              audioPlayer.src = null;
              resetStopwatch();
              setIsPlayerReady(false);
            });
        };
      })
      .catch(function (err) {
        console.log(err.name, err.message);
      });
  };

  //if uploading file
  useEffect(() => {
    uploaderRef.current.addEventListener("change", (e) => {
      let audioPlayer = document.getElementById("audioPlayer");
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      audioPlayer.src = url;
      setIsPlayerReady(true);
      document.getElementById("resetButton").addEventListener("click", () => {
        let fileUploader = document.getElementById("fileUploader");
        fileUploader.value = null;
        audioPlayer.src = null;
        setIsPlayerReady(false);
      });
    });

    // return () => {
    //   uploaderRef.current.removeEventListener("change");
    // };
  }, [uploaderRef, playerRef]);

  return (
    <div>
      <div
        style={
          isPlayerReady ? { display: "none" } : { display: "inline-table" }
        }
      >
        <div>
          <input
            type="file"
            accept="audio/*"
            capture
            id="fileUploader"
            ref={uploaderRef}
          />
        </div>
        ИЛИ
        <button
          onClick={() => recordAudio()}
          style={
            isRecording ? { display: "none" } : { display: "inline-table" }
          }
        >
          Rec.
        </button>
        <button
          id="stopButton"
          style={
            !isRecording ? { display: "none" } : { display: "inline-table" }
          }
        >
          stop
        </button>
        {isRecording && `${seconds}s`}
      </div>
      <div
        style={
          !isPlayerReady ? { display: "none" } : { display: "inline-table" }
        }
      >
        <audio controls id="audioPlayer" ref={playerRef}></audio>
        <button id="resetButton">X</button>
        <div>
          <a
            href="/"
            id="downloadLink"
            style={
              seconds > 0 ? { display: "inline-table" } : { display: "none" }
            }
          >
            download
          </a>
        </div>
      </div>
    </div>
  );
};

export default Audio;
