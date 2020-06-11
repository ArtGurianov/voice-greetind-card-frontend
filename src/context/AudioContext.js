import React, { createContext, useContext, useState } from "react";

export const AudioContext = createContext({});

export const AudioProvider = ({ children }) => {
  const [refs, setRefs] = useState({});
  const [blobUrl, setBlobUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const recordAudio = (refs) => {
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

        setTimeout(() => {
          if (mediaRecorder.state === "recording") {
            mediaRecorder.stop();
          }
        }, 10000);

        refs.stopButtonRef.current.addEventListener("click", () => {
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
          mediaStream.getTracks()[0].stop();
          setBlobUrl(
            window.URL.createObjectURL(
              new Blob(chunks, { type: "audio/wave;" })
            )
          );
          chunks.length = 0;
          refs.recorderResetButtonRef.current.addEventListener("click", () => {
            setBlobUrl(null);
            refs.audioPlayerRef.current.src = null;
            setIsRecording(false);
          });
        };
      })
      .catch((err) => {
        console.log(err.name, err.message);
      });
  };

  const uploadAudio = (refs) => {
    refs.uploaderRef.current.addEventListener("change", (e) => {
      setBlobUrl(URL.createObjectURL(e.target.files[0]));
      refs.uploaderResetButtonRef.current.addEventListener("click", () => {
        setBlobUrl(null);
        refs.uploaderRef.current.value = null;
        refs.audioPlayerRef.current.src = null;
      });
    });
  };

  return (
    <AudioContext.Provider
      value={{
        refs,
        setRefs,
        blobUrl,
        setBlobUrl,
        isRecording,
        setIsRecording,
        recordAudio,
        uploadAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
