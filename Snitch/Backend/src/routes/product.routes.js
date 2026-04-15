import { Router } from "express";
import {createProduct,getAllProducts,getProductById} from "../controllers/product.controller.js";
import {validateCreateProduct} from "../validators/product.validate.js";
import {authSeller} from "../Middleware/auth.middleware.js";
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
router.get("/:id",authSeller,getProductById)

export default router;