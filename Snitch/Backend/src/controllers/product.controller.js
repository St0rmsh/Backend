import ProductModel from "../models/product.model.js";
import {uploadFile} from "../services/storage.service.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const createProduct = async(req,res)=> {
    
    const {title,description,priceAmount,priceCurrency} = req.body;
    const seller = req.user

    const images = await Promise.all(req.files.map(async (file)=> {
        const result = await uploadFile({
            buffer:file.buffer,
            fileName:file.originalname,
        })
        return result;
    }))


    const product = await ProductModel.create({
        title,
        description,
        price: {
            amount: priceAmount,
            currency: priceCurrency
        },
        images,
        seller:seller._id
    })

    res.status(201).json({
        message: "Product created successfully",
        product
    })

    
}



export const getAllProducts = async (req,res)=> {

   try {
     const sellerId = req.user._id;

    if(!sellerId){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    if(req.user.role !== "seller"){
        return res.status(403).json({
            message: "Forbidden"
        })
    }

    const products = await ProductModel.find({seller:sellerId})

    if(!products){
        return res.status(404).json({
            message: "No products found"
        })
    }

    if (products.length === 0) {
        return res.status(404).json({
            message: "No products found"
        })
    }

    res.status(200).json({
        message: "Products fetched successfully",
        success: true,
        products
    })
   } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
        message: "Internal server error"
    })
   }
}











export const getProductById = async (req,res)=> {

    const product = await ProductModel.findById(req.params.id)

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        })
    }

    res.status(200).json({
        message: "Product fetched successfully",
        success: true,
        product
    })
}

export const deleteProduct = async (req, res) => {
    try {
        const sellerId = req.user._id;
        const productId = req.params.id;

        const product = await ProductModel.findOne({ _id: productId, seller: sellerId });
        if (!product) {
            return res.status(404).json({ message: "Product not found or unauthorized to delete" });
        }

        await ProductModel.findByIdAndDelete(productId);
        res.status(200).json({ message: "Product deleted successfully", success: true });
    } catch(error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const sellerId = req.user._id;
        const productId = req.params.id;
        const { title, description, priceAmount, priceCurrency } = req.body;

        const product = await ProductModel.findOne({ _id: productId, seller: sellerId });
        if (!product) {
            return res.status(404).json({ message: "Product not found or unauthorized to update" });
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (priceAmount || priceCurrency) {
            updateData.price = {
                amount: priceAmount || product.price.amount,
                currency: priceCurrency || product.price.currency
            };
        }

        if (req.files && req.files.length > 0) {
            const images = await Promise.all(req.files.map(async (file)=> {
                const result = await uploadFile({
                    buffer:file.buffer,
                    fileName:file.originalname,
                })
                return result;
            }));
            updateData.images = images;
        }

        const updatedProduct = await ProductModel.findByIdAndUpdate(productId, updateData, { new: true });
        res.status(200).json({ message: "Product updated successfully", success: true, product: updatedProduct });
    } catch(error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createProductReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const productId = req.params.id;
        const user = req.user;

        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === user._id.toString() || r.user.toString() === user.id.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({ message: "Product already reviewed" });
        }

        const review = {
            name: user.firstName + " " + user.lastName || "User",
            rating: Number(rating),
            comment,
            user: user._id || user.id,
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.averageRating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();
        res.status(201).json({ message: "Review added", success: true, product });
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};