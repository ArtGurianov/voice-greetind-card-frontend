import React, { useEffect, useRef, useState } from "react";
import { useAudio } from "../../context/AudioContext";

const Actions = () => {
  const { blobUrl, setRefs } = useAudio();
  const downloadLinkRef = useRef();
  const resetButtonRef = useRef();
  const [isTextReady, setIsTextReady] = useState(false);
  const [textValue, setTextValue] = useState("Загружаем текст...");
  const inputRef = useRef();

  const submitAudio = async () => {
    inputRef.current.style = { display: "table" };
    const blob = await fetch(blobUrl).then((r) => r.blob());
    let formData = new FormData();
    formData.append("audiofile", blob);
    const result = await fetch("http://localhost:8000/audio/uploadAudio", {
      method: "post",
      body: formData,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
    const jsonResult = await result.json();
    console.log(jsonResult);
    if (jsonResult.status === "ok") {
      localStorage.setItem("message", jsonResult.message);
      setIsTextReady(true);
      setTextValue(jsonResult.message);
    } else {
      console.log("problema");
    }
  };

  useEffect(() => {
    setRefs((prevRefs) => {
      return {
        ...prevRefs,
        downloadLinkRef,
        resetButtonRef,
      };
    });
  }, [setRefs]);
  return (
    <div style={blobUrl ? { display: "block" } : { display: "none" }}>
      <div>
        <button
          // onClick={() => {
          //   inputRef.current.style = { display: "none" };
          //   setTextValue("Загружаем текст...");
          //   setIsTextReady(false);
          // }}
          ref={resetButtonRef}
        >
          X
        </button>
      </div>
      <div>
        <a
          href={blobUrl ? blobUrl : "/"}
          ref={downloadLinkRef}
          download="myrecord.wav"
        >
          download
        </a>
      </div>
      <div>
        <button onClick={submitAudio}>SUBMIT</button>
      </div>
      <br />
      <span ref={inputRef} style={{ display: "none" }}>
        <input
          onChange={(e) => {
            setTextValue(e.target.value);
          }}
          disabled={!isTextReady}
          value={textValue}
        ></input>
      </span>
    </div>
  );
};

export default Actions;
