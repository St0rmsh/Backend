import * as faceapi from "@vladmandic/face-api";
import canvas from "canvas";

const { Canvas, Image, ImageData } = canvas;

faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

export async function loadFaceModel() {
    await faceapi.nets.tinyFaceDetector.loadFromDisk("./models");
    console.log("✅ Face model loaded");
}

export async function detectFaces(img) {
    return await faceapi.detectAllFaces(
        img,
        new faceapi.TinyFaceDetectorOptions()
    );
}
