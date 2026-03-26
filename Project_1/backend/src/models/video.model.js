import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        default: ""
    },

    videoUrl: {
        type: String,
        required: true
    },

    thumbnail: {
        type: String,
        required: true
    },

    duration: {
        type: Number, 
        required: true
    },

    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
        required: true,
        index: true
    },

    uploader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    views: {
        type: Number,
        default: 0
    },

    likesCount: {
        type: Number,
        default: 0,
    },

    dislikesCount: {
        type: Number,
        default: 0,
    },
    commentsCount: {
    type: Number,
    default: 0
    },

    tags: {
        type: [String],
        default: []
    },

    category: {
        type: String,
        default: "general"
    },

    visibility: {
        type: String,
        enum: ["public", "private", "unlisted"],
        default: "public"
    },

    isPublished: {
        type: Boolean,
        default: true
    },

   verification: {
    summary: String,

    claims: [
        {
            text: String,
            verdict: String,
            confidence: Number,
            explanation: String,
            sources: [String]
        }
    ],

    finalVerdict: {
        type: String,
        enum: ["TRUE", "PARTIALLY TRUE", "FALSE", "UNKNOWN"],
        default: "UNKNOWN"
    },

    confidence: Number,

    truth: String,

    issues: [String],

    sources: [String],

    checkedAt: Date
},


    isFlagged: {
        type: Boolean,
        default: false
    },

    flagReason: {
        type: String,
        default: ""
    },
    transcript: {
    type: String,
    default: ""
},totalWatchTime: {
    type: Number,
    default: 0
},

averageWatchTime: {
    type: Number,
    default: 0
},

trustScore: {
    type: Number,
    default: 0
},

}, { timestamps: true });

videoSchema.index({
    title: "text",
    description: "text",
    tags: "text"
});

const videoModel =  mongoose.model("Video", videoSchema);

export default videoModel
