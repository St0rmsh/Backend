import { Types } from "mongoose";
import PostModel from "../model/post.model.js";
import UserInterestModel from "../model/userInterest.model.js";

export const getFeedService = async (userId:string, page: number, limit: number) => {

    try {

    const safePage = Math.max(1, page);
    const safeLimit = Math.min(50, Math.max(1, limit));

    const skip = (safePage - 1) * safeLimit;

    const userInterest = await UserInterestModel.findOne({
      user: userId
    }).lean();

    const topCategories = userInterest?.categories
    ?.sort((a, b) => b.score - a.score)
    ?.slice(0, 5)
    ?.map((c) => c.name)
    ?.filter(Boolean) || [];

    const topTags =
      userInterest?.tags
        ?.sort((a, b) => b.score - a.score)
        ?.slice(0, 10)
        ?.map((t) => t.name)
        ?.filter(Boolean) || [];

    const personalizedFeed =
      topCategories.length > 0 ||
      topTags.length > 0;

    const matchStage = personalizedFeed
      ? {
          isPublished: true,
          user: {
        $ne: new Types.ObjectId(userId)
      },
          createdAt: {
            $gte: new Date(
              Date.now() -
                30 * 24 * 60 * 60 * 1000
            )
          },
          $or: [
            {
              category: {
                $in: topCategories
              }
            },
            {
              tags: {
                $in: topTags
              }
            }
          ]
        }
      : {
          isPublished: true,
          createdAt: {
            $gte: new Date(
              Date.now() -
                30 * 24 * 60 * 60 * 1000
            )
          }
        };

    const [posts, totalPosts] =
      await Promise.all([
        PostModel.aggregate([
          {
            $match: matchStage
          },

          {
            $addFields: {
              ageHours: {
                $divide: [
                  {
                    $subtract: [
                      new Date(),
                      "$createdAt"
                    ]
                  },
                  1000 * 60 * 60
                ]
              }
            }
          },

          {
            $addFields: {
              score: {
                $subtract: [
                  {
                    $add: [
                      {
                        $multiply: [
                          {
                            $ifNull: [
                              "$likesCount",
                              0
                            ]
                          },
                          5
                        ]
                      },

                      {
                        $multiply: [
                          {
                            $ifNull: [
                              "$commentsCount",
                              0
                            ]
                          },
                          10
                        ]
                      },

                      {
                        $multiply: [
                          {
                            $ifNull: [
                              "$viewsCount",
                              0
                            ]
                          },
                          0.1
                        ]
                      }
                    ]
                  },

                  {
                    $multiply: [
                      "$ageHours",
                      0.1
                    ]
                  }
                ]
              }
            }
          },

          {
            $sort: {
              score: -1,
              createdAt: -1
            }
          },

          {
            $skip: skip
          },

          {
            $limit: safeLimit
          },

          {
            $lookup: {
              from: "users",
              let: {
                userId: "$user"
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: [
                        "$_id",
                        "$$userId"
                      ]
                    }
                  }
                },

                {
                  $project: {
                    username: 1,
                    fullname: 1,
                    avatar: 1
                  }
                }
              ],
              as: "user"
            }
          },

          {
            $unwind: {
              path: "$user",
              preserveNullAndEmptyArrays:
                true
            }
          },

          {
            $project: {
              _id: 1,
              title: 1,
              content: 1,
              coverImage: 1,
              category: 1,
              tags: 1,
              likesCount: 1,
              commentsCount: 1,
              viewsCount: 1,
              createdAt: 1,
              updatedAt: 1,
              score: 1,

              "user._id": 1,
              "user.username": 1,
              "user.fullname": 1,
              "user.avatar": 1
            }
          }
        ]),

        PostModel.countDocuments(matchStage)
      ]);

    const totalPages = Math.max(1,Math.ceil(totalPosts / safeLimit));

    return {
      posts,
      totalPosts,
      currentPage: safePage,
      totalPages,
      limit: safeLimit,
      hasNextPage:
      safePage < totalPages,
      hasPrevPage:
      safePage > 1
    };

    } catch (error) {
         console.error(
      "Error in feed service:",
      error
    );

    throw new Error(
      error instanceof Error
        ? error.message
        : "Unknown error"
    );

    }
}