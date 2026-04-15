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

    const sellerId = req.user._id

    if (!sellerId) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    if (req.user.role !== "seller") {
        return res.status(403).json({
            message: "Forbidden"
        })
    }

    const token = req.cookies?.token;

    if(!token){
        return res.status(401).json({
            message: "No token provided, authorization denied"
        })
    }

    const verifySellerId = jwt.verify(token, config.JWT_SECRET);

    if(verifySellerId.id !== sellerId){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

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