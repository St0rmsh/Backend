import { axiosInstance } from "@/shared/lib/axios";
import { FeedResponse } from "../types/feed.types";

export const feedService = {
  getFeed: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get<FeedResponse>("/feed", {
      params: { page, limit },
    });
    return response.data;
  },
};
