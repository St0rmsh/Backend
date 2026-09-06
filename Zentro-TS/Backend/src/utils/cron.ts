import cron from "node-cron";
import { runAIPoster } from "../services/ai-poster.service.js";

export const initCronJobs = () => {
    // Run at 9:00 AM every day
    cron.schedule("0 9 * * *", async () => {
        console.log("Running scheduled AI Poster Job at 9 AM");
        await runAIPoster("Morning Tech News Briefing");
    });

    // Run at 2:00 PM every day
    cron.schedule("0 14 * * *", async () => {
        console.log("Running scheduled AI Poster Job at 2 PM");
        await runAIPoster("Midday Programming Meme / Joke");
    });

    // Run at 7:00 PM every day
    cron.schedule("0 19 * * *", async () => {
        console.log("Running scheduled AI Poster Job at 7 PM");
        await runAIPoster("Deep-dive / Discussion Starter on AI");
    });

    console.log("Cron jobs initialized (AI Poster scheduled for 9 AM, 2 PM, 7 PM).");
};
