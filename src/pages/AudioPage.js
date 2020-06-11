import React from "react";
import Actions from "../components/audio/Actions";
import Player from "../components/audio/Player";
import Recorder from "../components/audio/Recorder";
import Uploader from "../components/audio/Uploader";
import { AudioProvider } from "../context/AudioContext";

const AudioPage = () => {
  return (
    <AudioProvider>
      <Uploader />
      <Recorder />
      <Player />
      <Actions />
    </AudioProvider>
  );
};

export default AudioPage;
