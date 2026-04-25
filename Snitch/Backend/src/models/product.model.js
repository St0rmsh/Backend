import mongoose from "mongoose";
import priceSchema from "./price.schema.js";






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
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
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
    ],
    category: {
        type: String,
        default: "Uncategorized"
    },
    type: {
        type: String,
        enum: ["simple", "variant_required", "variant_optional"],
        default: "simple"
    }
},
 {
    timestamps: true
})

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;