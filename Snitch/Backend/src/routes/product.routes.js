import { Router } from "express";
import {createProduct,getAllProducts,getProductById, updateProduct, deleteProduct, createProductReview} from "../controllers/product.controller.js";
import {validateCreateProduct} from "../validators/product.validate.js";
import {authSeller, authMiddleware} from "../Middleware/auth.middleware.js";
import multer from "multer";
const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
});

// @desc Create Product
// @route POST /api/product/create
// @access Private
router.post("/create",authSeller,upload.array("images",7),validateCreateProduct,createProduct)


// @desc Get All Products
// @route GET /api/product
// @access Public
router.get("/",authSeller,getAllProducts)


// @desc Get Product By Id
// @route GET /api/product/:id
// @access Public
router.get("/:id", getProductById)

// @desc Update Product
// @route PUT /api/product/:id
// @access Private Seller
router.put("/:id", authSeller, upload.array("images", 7), updateProduct);

// @desc Delete Product
// @route DELETE /api/product/:id
// @access Private Seller
router.delete("/:id", authSeller, deleteProduct);

// @desc Create new review
// @route POST /api/product/:id/reviews
// @access Private
router.post("/:id/reviews", authMiddleware, createProductReview);

export default router;