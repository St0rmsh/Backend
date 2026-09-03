import ViewEventModel from "../model/viewEvent.model.js";
import PostModel from "../model/post.model.js";
import { updateUserInterestService } from "./interest.service.js";

export const trackViewTimeService = async (postId: string, userId: string, durationMs: number) => {
    try {
        const post = await PostModel.findById(postId);
        if (!post) {
            throw new Error("Post not found");
        }

        // Always log the view event for analytics
        await ViewEventModel.create({
            user: userId,
            post: postId,
            durationMs: durationMs
        });

        // Only increment the view count and interest score if the duration is significant
        // (e.g. > 2 seconds to avoid counting fast scrolls)
        if (durationMs >= 2000) {
            await PostModel.findByIdAndUpdate(postId, {
                $inc: { viewsCount: 1 }
            });

            // Reusing logic from view.service to update interest profile
            await updateUserInterestService(userId, postId, 1);
        }

        return {
            success: true,
            message: "View time tracked successfully"
        };
    } catch (error) {
        console.error("Error in view time service:", error);
        throw new Error(error instanceof Error ? error.message : "Unknown error in view time service");
    }
};
