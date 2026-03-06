import {
    FaceLandmarker,
    FilesetResolver
} from "@mediapipe/tasks-vision";


export const init = async ({ landmarkerRef, videoRef, streamRef }) => {
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    landmarkerRef.current = await FaceLandmarker.createFromOptions(
        vision,
        {
            baseOptions: {
                modelAssetPath:
                    "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task"
            },
            outputFaceBlendshapes: true,
            runningMode: "VIDEO",
            numFaces: 1
        }
    );

    streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = streamRef.current;
    await videoRef.current.play();
};

export const detect = ({ landmarkerRef, videoRef, setExpression }) => {
    if (!landmarkerRef.current || !videoRef.current) return;

    const results = landmarkerRef.current.detectForVideo(
        videoRef.current,
        performance.now()
    );

    if (results.faceBlendshapes?.length > 0) {
        const blendshapes = results.faceBlendshapes[ 0 ].categories;

        const getScore = (name) =>
            blendshapes.find((b) => b.categoryName === name)?.score || 0;

        const smileLeft = getScore("mouthSmileLeft");
        const smileRight = getScore("mouthSmileRight");
        const jawOpen = getScore("jawOpen");
        const browUp = getScore("browInnerUp");
        const frownLeft = getScore("mouthFrownLeft");
        const frownRight = getScore("mouthFrownRight");
        const browDownLeft = getScore("browDownLeft");
        const browDownRight = getScore("browDownRight");

        console.log(getScore("mouthFrownLeft"))

        let currentExpression = "Neutral";

        // Compose some boolean helpers for clearer rules
       const isSmiling = smileLeft > 0.45 && smileRight > 0.45;

       const isSurprised = jawOpen > 0.30 && browUp > 0.15;

      const isAngry =
    (browDownLeft > 0.01 || browDownRight > 0.01) &&
    (frownLeft > 0.02 || frownRight > 0.02);

     const isSad =
      (browUp > 0.01) &&
      (frownLeft > 0.02 || frownRight > 0.02);

        if (isSmiling) {
    currentExpression = "happy";
}
else if (isSurprised) {
    currentExpression = "surprised";
}
else if (isAngry) {
    currentExpression = "angry";
}
else if (isSad) {
    currentExpression = "sad";
}

        setExpression(currentExpression);

        return currentExpression;
    }
};