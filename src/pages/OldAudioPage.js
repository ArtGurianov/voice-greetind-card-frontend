import { navigate } from "@reach/router";
import React, { useContext, useEffect, useRef, useState } from "react";
import { StopwatchContext } from "../context/StopwatchContext";

const AudioPage = () => {
  const [blobUrl, setBlobUrl] = useState(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  // const oldBlobUrl = localStorage.getItem("blobUrl");
  // if (oldBlobUrl) {
  //   setBlobUrl(oldBlobUrl);
  // }

  useEffect(() => {
    console.log(blobUrl);
  }, [blobUrl]);

  const { seconds, startStopwatch, stopStopwatch, resetStopwatch } = useContext(
    StopwatchContext
  );

  const [isRecording, setIsRecording] = useState(false);

  const stopButtonRef = useRef();
  const resetButtonRef = useRef();
  const downloadLinkRef = useRef();
  const audioPlayerRef = useRef();
  const uploaderRef = useRef();

  const recordAudio = ({
    stopButtonRef,
    resetButtonRef,
    downloadLinkRef,
    audioPlayerRef,
  }) => {
    if (!navigator.mediaDevices) {
      navigator.mediaDevices = {};
      navigator.mediaDevices.getUserMedia = (constraintObj) => {
        const getUserMedia =
          navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if (!getUserMedia) {
          return Promise.reject(
            new Error("getUserMedia is not implemented in this browser")
          );
        }
        return new Promise((resolve, reject) => {
          getUserMedia.call(navigator, constraintObj, resolve, reject);
        });
      };
    }

    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: false,
      })
      .then((mediaStream) => {
        const mediaRecorder = new MediaRecorder(mediaStream, {
          mimeType: "audio/webm",
        });
        const chunks = [];
        mediaRecorder.start();
        setIsRecording(true);
        startStopwatch();

        setTimeout(() => {
          if (mediaRecorder.state === "recording") {
            mediaRecorder.stop();
          }
        }, 10000);

        stopButtonRef.current.addEventListener("click", () => {
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
          setIsRecording(false);
          stopStopwatch();
          mediaStream.getTracks()[0].stop();
          setBlobUrl(
            window.URL.createObjectURL(
              new Blob(chunks, { type: "audio/wave;" })
            )
          );
          setIsPlayerReady(true);
          audioPlayerRef.current.src = blobUrl;
          chunks.length = 0;
          resetButtonRef.current.addEventListener("click", () => {
            setBlobUrl(null);
            downloadLinkRef.current.href = null;
            audioPlayerRef.current.src = null;
            resetStopwatch();
            setIsPlayerReady(false);
          });
        };
      })
      .catch((err) => {
        console.log(err.name, err.message);
      });
  };

  const uploadAudio = ({ uploaderRef, audioPlayerRef, resetButtonRef }) => {
    uploaderRef.current.addEventListener("change", (e) => {
      setBlobUrl(URL.createObjectURL(e.target.files[0]));
      audioPlayerRef.current.src = blobUrl;
      setIsPlayerReady(true);
      resetButtonRef.current.addEventListener("click", () => {
        setBlobUrl(null);
        uploaderRef.current.value = null;
        audioPlayerRef.current.src = null;
        setIsPlayerReady(false);
      });
    });
  };

  return (
    <div>
      <div
        style={
          isPlayerReady ? { display: "none" } : { display: "inline-table" }
        }
      >
        <div>
          <input
            onClick={() =>
              uploadAudio({
                uploaderRef,
                audioPlayerRef,
                resetButtonRef,
              })
            }
            type="file"
            accept="audio/*"
            capture
            ref={uploaderRef}
          />
        </div>
        ИЛИ
        <button
          onClick={() =>
            recordAudio({
              stopButtonRef,
              resetButtonRef,
              downloadLinkRef,
              audioPlayerRef,
            })
          }
          style={
            isRecording ? { display: "none" } : { display: "inline-table" }
          }
        >
          Rec.
        </button>
        <button
          ref={stopButtonRef}
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
        <audio controls ref={audioPlayerRef}></audio>
        <button ref={resetButtonRef}>X</button>
        <div>
          <a
            href="/"
            ref={downloadLinkRef}
            style={
              seconds > 0 ? { display: "inline-table" } : { display: "none" }
            }
          >
            download
          </a>
        </div>
        <button
          onClick={() => {
            if (blobUrl) {
              localStorage.setItem("blobUrl", blobUrl);
              navigate("/sketch");
            }
          }}
        >
          Далее
        </button>
      </div>
    </div>
  );
};

export default AudioPage;
