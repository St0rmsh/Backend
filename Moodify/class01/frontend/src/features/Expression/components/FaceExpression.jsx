import React, { useEffect, useRef, useState } from "react";
import {
  initFaceLandmarker,
  detectEmotionFromVideo
} from "../utils/utils";

export default function FullEmotionDetector() {
  const videoRef = useRef(null);
  const faceLandmarkerRef = useRef(null);

  const [emotion, setEmotion] = useState("Loading...");
  const [scores, setScores] = useState({});

  useEffect(() => {
    initFaceLandmarker(faceLandmarkerRef, videoRef);
  }, []);

  const handleDetect = () => {
    const result = detectEmotionFromVideo(
      faceLandmarkerRef,
      videoRef
    );

    if (!result) return;

    setEmotion(result.emotion);
    setScores(result.scores);
  };

  return (
    <div>
      <video ref={videoRef} width="400" autoPlay muted />
      <h2>Dominant Emotion: {emotion}</h2>
      <button onClick={handleDetect}>Get Emotion</button>
    </div>
  );
}
