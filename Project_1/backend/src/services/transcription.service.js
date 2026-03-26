import axios from "axios";
import config from "../config/config.js";

const BASE_URL = "https://api.assemblyai.com/v2";

export async function transcribeVideo(audioUrl) {
    try {
        // 🎯 Step 1: send transcription request
        const { data } = await axios.post(
            `${BASE_URL}/transcript`,
            {
                audio_url: audioUrl
            },
            {
                headers: {
                    authorization: config.ASSEMBLY_API_KEY
                }
            }
        );

        const transcriptId = data.id;

        // 🎯 Step 2: poll for result
        while (true) {
            const res = await axios.get(
                `${BASE_URL}/transcript/${transcriptId}`,
                {
                    headers: {
                        authorization: config.ASSEMBLY_API_KEY
                    }
                }
            );

            if (res.data.status === "completed") {
                return res.data.text; // ✅ transcript text
            }

            if (res.data.status === "error") {
                throw new Error("Transcription failed");
            }

            // wait 3 sec before retry
            await new Promise(r => setTimeout(r, 3000));
        }

    } catch (err) {
        console.error("Transcription error:", err.message);
        return null;
    }
}
