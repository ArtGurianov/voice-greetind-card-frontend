import React, { useEffect, useRef } from "react";
import { useAudio } from "../../context/AudioContext";

const Player = () => {
  const { blobUrl, setRefs } = useAudio();
  const audioPlayerRef = useRef();

  useEffect(() => {
    setRefs((prevRefs) => {
      return { ...prevRefs, audioPlayerRef };
    });
  }, [setRefs]);

  return (
    <div style={!blobUrl ? { display: "none" } : { display: "inline-table" }}>
      <audio controls ref={audioPlayerRef} src={blobUrl}></audio>
    </div>
  );
};

export default Player;
