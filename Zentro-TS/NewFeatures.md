# Advanced AI Features Implementation Plan

This plan outlines the architecture for the 5 requested advanced AI features. 

## Proposed Changes

### 1 & 2. Themed Posting & Dynamic Topic Generation
#### [MODIFY] [ai-poster.service.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Backend/src/services/ai-poster.service.ts)
- Update `runAIPoster(theme: string)` to accept a theme (e.g., "Morning Tech News", "Midday Meme").
- Introduce a new helper function `getTrendingTopics()` that aggregates the most used `tags` in recent posts from the database using MongoDB `$aggregate`.
- Update the Tavily search logic to combine the `theme` and the dynamically fetched trending topics.

#### [MODIFY] [cron.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Backend/src/utils/cron.ts)
- Pass the specific themes to the `runAIPoster()` calls for 9 AM, 2 PM, and 7 PM.

### 3. AI Image Generation (Fallback)
#### [MODIFY] [ai-poster.service.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Backend/src/services/ai-poster.service.ts)
- Instead of solely relying on Tavily's image results, if no image is found (or to guarantee high-quality themed images), use a free URL-based Image Generation API (like Pollinations.ai) to generate a custom cover image.
- We will construct the image generation prompt using the Mistral-generated title/theme and append `"with the text 'AI' clearly visible"` to ensure it's marked as an AI image.

### 4. Automated Content Moderation
#### [NEW] [ai-moderation.service.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Backend/src/services/ai-moderation.service.ts)
- Create a lightweight service using Gemini (`gemini-1.5-flash`) that takes text input and returns a boolean indicating if the content is toxic, spam, or NSFW.
#### [MODIFY] [Posts.controller.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Backend/src/controller/Posts.controller.ts)
#### [MODIFY] [comment.controller.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Backend/src/controller/comment.controller.ts)
- Integrate the `ai-moderation.service.ts` into the creation endpoints for both Posts and Comments. If the AI flags the content, the request will immediately fail with a `400 Bad Request` and a moderation warning.

### 5. AI Comment Replies (Engagement Agent)
#### [NEW] [ai-engagement.service.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Backend/src/services/ai-engagement.service.ts)
- Create a service that uses Mistral/Gemini to generate a contextual reply to a user's comment on an AI-generated post.
#### [MODIFY] [comment.service.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Backend/src/services/comment.service.ts)
- After a user successfully creates a comment on a post, asynchronously check if the post's author is `ai.system@zentro.com`.
- If true, invoke the `ai-engagement.service.ts` in the background to create a reply from the AI user, simulating active engagement.

## User Review Required

> [!WARNING]
> The automated content moderation will add a slight delay (approx 1-2 seconds) to post and comment creation while it checks the text against the Gemini API. Are you okay with this slight increase in latency for moderation?

> [!NOTE]
> For image generation, I plan to use Pollinations.ai because it is completely free and requires no API keys, which fits perfectly without extra setup. Let me know if you prefer a different provider.
