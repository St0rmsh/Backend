// test-google.ts (temporary, delete after)
import { GoogleAI } from "./ai/model.ai.js";

const res = await GoogleAI.invoke("Say hello in one word.");
console.log(res.text);