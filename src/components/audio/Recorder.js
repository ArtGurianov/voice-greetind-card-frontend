import React, { useEffect, useRef } from "react";
import { useAudio } from "../../context/AudioContext";
import RecordingTimer from "../RecordingTimer";

const Recorder = () => {
  const { blobUrl, recordAudio, isRecording, refs, setRefs } = useAudio();
  const stopButtonRef = useRef();

  useEffect(() => {
    setRefs((prevRefs) => {
      return {
        ...prevRefs,
        stopButtonRef,
      };
    });
  }, [setRefs]);

  return (
    <div>
      <div style={blobUrl ? { display: "none" } : { display: "inline-table" }}>
        <button
          onClick={() => recordAudio(refs)}
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
        <RecordingTimer running={isRecording} />
      </div>
    </div>
  );
};

export default Recorder;
