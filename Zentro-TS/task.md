Identity
--------
_id
username
fullname
email
password

Profile
-------
avatar
banner
bio

Authorization
-------------
roles

Verification
------------
isVerified
verificationToken
verificationTokenExpires

Password Recovery
-----------------
resetPasswordToken
resetPasswordTokenExpires

Security
--------
refreshToken
lastLogin

Account Status
--------------
isActive

Social
------
followers
following
postCount

Timestamps
----------
createdAt
updatedAt







followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
}],

following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
}]








import { Types } from "mongoose";

export interface CreatePostBody {
    title: string;
    content: string;
    tags?: string[];
    category?: string;
}

export interface UpdatePostBody {
    title?: string;
    content?: string;
    tags?: string[];
    category?: string;
}

export interface IPostResponse {
    _id: string;
    user: Types.ObjectId;
    title: string;
    content: string;
    coverImage?: string;
    tags: string[];
    category?: string;

    likesCount: number;
    commentsCount: number;
    viewsCount: number;

    createdAt: Date;
    updatedAt: Date;
}



import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200
        },

        content: {
            type: String,
            required: true
        },

        coverImage: {
            type: String,
            default: null
        },

        category: {
            type: String,
            trim: true
        },

        tags: [
            {
                type: String,
                trim: true
            }
        ],

        likesCount: {
            type: Number,
            default: 0
        },

        commentsCount: {
            type: Number,
            default: 0
        },

        viewsCount: {
            type: Number,
            default: 0
        },

        isPublished: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Post", postSchema);








const likeSchema = new Schema({
    postId:{
        type:Schema.Types.ObjectId,
        ref:"Post",
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{
    timestamps:true
});

likeSchema.index(
    {postId:1,userId:1},
    {unique:true}
);






const bookmarkSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true
        }
    },
    { timestamps: true }
);

bookmarkSchema.index(
    { user: 1, post: 1 },
    { unique: true }
);


export interface IBookmark {
    _id: string;
    user: Types.ObjectId;
    post: Types.ObjectId;

    createdAt?: Date;
    updatedAt?: Date;
}


POST /api/bookmark/:postId