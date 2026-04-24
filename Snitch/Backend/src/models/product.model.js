import mongoose from "mongoose";
import priceSchema from "./price.schema.js";




const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
     reply: {
        text: {
            type: String
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        createdAt: {
            type: Date
        }
    },
    comment: {
        type: String,
        required: true
    }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    title: {
        type:String,
        required:true
    },
    description: {
        type: String,
        required: true
    }, 
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    price: {
        type: priceSchema,
        required: true
    },
    images: [
        {
          url: {
            type: String,
            required: true
          },
          
        }
    ],
    reviews: [reviewSchema],
    averageRating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    }, 
    stock: {
        type: Number,
        required: true
    },
    variants: [
        {
            image: [{
                url: {
                    type: String,
                    required: true
                }
            }],
            stock: {
                type: Number,
                required: true
            },
            value: {
                type: String,
                required: true
            },
            price: {
               type: priceSchema,
               required: true
            },
            
            attributes: {
                type: Map,
                of: String
            }
        }
    ]
},
 {
    timestamps: true
})

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;