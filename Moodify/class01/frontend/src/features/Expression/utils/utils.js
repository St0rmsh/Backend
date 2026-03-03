import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export const initFaceLandmarker = async (
  faceLandmarkerRef,
  videoRef
) => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
  );

  faceLandmarkerRef.current =
    await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"
      },
      outputFaceBlendshapes: true,
      runningMode: "VIDEO",
      numFaces: 1
    });

  const stream = await navigator.mediaDevices.getUserMedia({
    video: true
  });

  videoRef.current.srcObject = stream;
  await videoRef.current.play();
};

const getScore = (blendshapes, name) => {
  if (!Array.isArray(blendshapes)) return 0;
  return blendshapes.find((b) => b.categoryName === name)?.score || 0;
};

export const detectEmotionFromVideo = (
  faceLandmarkerRef,
  videoRef
) => {
  if (!faceLandmarkerRef.current || !videoRef.current) return null;

  const now = Date.now();
  const results = faceLandmarkerRef.current.detectForVideo(
    videoRef.current,
    now
  );

  if (!results.faceBlendshapes?.length) {
    return {
      emotion: "No Face Detected",
      scores: {}
    };
  }

  const blendshapes = results.faceBlendshapes[0].categories;

  const smile =
    (getScore(blendshapes, "mouthSmileLeft") +
      getScore(blendshapes, "mouthSmileRight")) / 2;

  const frown =
    (getScore(blendshapes, "mouthFrownLeft") +
      getScore(blendshapes, "mouthFrownRight")) / 2;

  const surprise =
    (getScore(blendshapes, "browInnerUp") +
      getScore(blendshapes, "jawOpen")) / 2;

  const angry =
    (getScore(blendshapes, "browDownLeft") +
      getScore(blendshapes, "browDownRight")) / 2;

  const emotionScores = {
    Happy: smile,
    Sad: frown,
    Surprised: surprise,
    Angry: angry
  };

  const dominant = Object.entries(emotionScores).reduce((a, b) =>
    a[1] > b[1] ? a : b
  );

  return {
    emotion: dominant[0],
    scores: emotionScores
  };
};
