import { Mistral } from "@mistralai/mistralai";
import { tavily } from "@tavily/core";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import PostModel from "../model/post.model.js";
import UserModel from "../model/auth.model.js";

const getSystemUser = async () => {
    let user = await UserModel.findOne({ email: "ai.system@zentro.com" });
    if (!user) {
        user = await UserModel.create({
            username: "zentro_ai",
            fullname: "Zentro AI",
            email: "ai.system@zentro.com",
            password: "SecurePassword123!",
            isVerified: true,
            roles: ["author", "admin"],
            bio: "I am an automated AI agent bringing you the latest trends, memes, and news from across the internet.",
        });
    }
    return user;
};

const getTrendingTopics = async () => {
    try {
        const topTags = await PostModel.aggregate([
            { $unwind: "$tags" },
            { $group: { _id: "$tags", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 3 }
        ]);
        return topTags.map(tag => tag._id as string);
    } catch (error) {
        return [];
    }
};

const fetchTrendingContent = async (query: string) => {
    const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY || "" });
    try {
        const response = await tvly.search(query, {
            searchDepth: "advanced",
            includeImages: false,
            maxResults: 5
        });
        return { query, results: response };
    } catch (error) {
        console.error("Tavily search failed:", error);
        throw error;
    }
};

const generateImageFallback = (title: string) => {
    const prompt = `${title}, highly detailed, professional, with the text "AI" clearly visible`;
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
};

const formatContentWithMistral = async (content: string) => {
    const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY || "" });
    const prompt = `You are a social media manager for a tech platform. Based on the following internet search results, create a highly engaging, professional yet fun post.
    Format your response EXACTLY as a JSON object with the following keys:
    - "title": A catchy title (max 100 characters).
    - "content": The main body of the post in markdown.
    - "tags": An array of 3 to 5 relevant string tags (without #).
    - "category": Choose one of ["Technology", "Programming", "AI", "General"].
    
    Search Results: ${content}`;

    const chatResponse = await client.chat.complete({
        model: "mistral-small-latest",
        messages: [{ role: "user", content: prompt }],
        responseFormat: { type: "json_object" }
    });
    
    return JSON.parse(chatResponse.choices?.[0]?.message?.content as string);
};

const formatContentWithGemini = async (content: string) => {
    const model = new ChatGoogleGenerativeAI({
        model: "gemini-1.5-flash",
        maxOutputTokens: 2048,
        apiKey: process.env.GEMINI_API_KEY || ""
    });

    const prompt = `You are a social media manager for a tech platform. Based on the following internet search results, create a highly engaging, professional yet fun post.
    Respond ONLY with a valid JSON object (no markdown code blocks) containing:
    - "title": A catchy title (max 100 characters).
    - "content": The main body of the post in markdown.
    - "tags": An array of 3 to 5 relevant string tags (without #).
    - "category": Choose one of ["Technology", "Programming", "AI", "General"].
    
    Search Results: ${content}`;

    const res = await model.invoke(prompt);
    const contentText = typeof res.content === 'string' ? res.content : JSON.stringify(res.content);
    // clean up potential markdown code block artifacts
    const cleanedText = contentText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
};

export const runAIPoster = async (theme?: string) => {
    try {
        if (!process.env.TAVILY_API_KEY || (!process.env.MISTRAL_API_KEY && !process.env.GEMINI_API_KEY)) {
            console.warn("AI Poster skipped: Missing API keys in .env");
            return;
        }

        console.log("Starting AI Poster Job...");
        const systemUser = await getSystemUser();
        
        let searchTheme = theme || "latest tech news today";
        const trendingTags = await getTrendingTopics();
        if (trendingTags.length > 0) {
            searchTheme += ` topics: ${trendingTags.join(", ")}`;
        }
        
        const { results } = await fetchTrendingContent(searchTheme);
        
        const searchContext = JSON.stringify(results.results);
        let formattedData;

        try {
            console.log("Attempting to use Mistral...");
            formattedData = await formatContentWithMistral(searchContext);
        } catch (mistralError) {
            console.warn("Mistral failed, falling back to Gemini...");
            formattedData = await formatContentWithGemini(searchContext);
        }

        const mediaUrl = generateImageFallback(formattedData.title);
        const mediaType = "image";

        const newPost = await PostModel.create({
            user: systemUser._id,
            title: formattedData.title,
            content: formattedData.content,
            tags: formattedData.tags,
            category: formattedData.category,
            coverImage: mediaUrl,
            mediaUrl: mediaUrl,
            mediaType: mediaType,
            isPublished: true
        });

        systemUser.postCount += 1;
        await systemUser.save();

        console.log("AI Poster Job completed successfully. Created post:", newPost._id);
    } catch (error) {
        console.error("AI Poster Job failed:", error);
    }
};
