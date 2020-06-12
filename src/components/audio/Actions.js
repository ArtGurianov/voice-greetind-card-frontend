import React, { useEffect, useRef } from "react";
import { useAudio } from "../../context/AudioContext";

const Actions = () => {
  const { blobUrl, setRefs } = useAudio();
  const downloadLinkRef = useRef();
  const resetButtonRef = useRef();

  const submitAudio = async () => {
    const blob = await fetch(blobUrl).then((r) => r.blob());
    // const result = await fetch("https://api.wit.ai/speech", {
    //   method: "post",
    //   headers: {
    //     accept: "application/json",
    //     authorization: "Bearer " + process.env.WITAI_TOKEN,
    //     "Content-Type": "audio/wav",
    //   },
    //   body: blob,
    // });
    let formData = new FormData();
    formData.append("audiofile", blob);
    const result = await fetch("http://localhost:8000/audio/uploadAudio", {
      method: "post",
      body: formData,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
    console.log(await result.json());
    //navigate("/sketch");
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
        <button ref={resetButtonRef}>X</button>
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
        <button onClick={submitAudio}>Next</button>
      </div>
    </div>
  );
};

export default Actions;
