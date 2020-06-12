import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { blob2dataUrl, dataUrl2blob } from "../utils/blob2dataUrl";

export const AudioContext = createContext({});

export const AudioProvider = ({ children }) => {
  const [refs, setRefs] = useState({});
  const [blobUrl, setBlobUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const dataUrl = localStorage.getItem("dataUrl");
    if (dataUrl) {
      const objectUrl = window.URL.createObjectURL(dataUrl2blob(dataUrl));
      objectUrl && setBlobUrl(objectUrl);
    }
  }, []);

  const firstUpdate = useRef(true);
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
    } else {
      refs.resetButtonRef.current.addEventListener("click", () => {
        setBlobUrl(null);
        refs.uploaderRef.current.value = null;
        refs.audioPlayerRef.current.src = null;
        setIsRecording(false);
      });

      if (blobUrl) {
        fetch(blobUrl)
          .then((r) => r.blob())
          .then((blob) => {
            blob2dataUrl(blob).then((url) => {
              localStorage.setItem("dataUrl", url);
            });
          });
      } else {
        localStorage.removeItem("dataUrl");
      }
    }
  }, [blobUrl, setBlobUrl, setIsRecording, refs]);

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
        sampleRate: 44100,
        sampleSize: 16,
        channelCount: 1,
      })
      .then((mediaStream) => {
        const mediaRecorder = new MediaRecorder(mediaStream, {
          //mimeType: "audio/webm;codecs=pcm",
          mimeType: "audio/webm;codecs=pcm",
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

        mediaRecorder.onstop = async () => {
          setIsRecording(false);
          mediaStream.getTracks()[0].stop();
          setBlobUrl(
            window.URL.createObjectURL(
              new Blob(chunks, {
                type: "audio/wave;",
              })
            )
          );
          chunks.length = 0;
        };
      })
      .catch((err) => {
        console.log(err.name, err.message);
      });
  };

  const uploadAudio = (refs) => {
    refs.uploaderRef.current.addEventListener("change", async (e) => {
      setBlobUrl(window.URL.createObjectURL(e.target.files[0]));
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
