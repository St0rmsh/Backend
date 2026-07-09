import { Router } from "express";
import {createProduct,getAllProducts,getProductById, updateProduct, deleteProduct, createProductReview, getProductReviews, updateProductReview, deleteProductReview, fetchAllProducts, fetchProductById, getSellerReviews, addProductVariant, deleteProductVariant, getSubcategories, getCategoryOptions, replyToReviewController} from "../controllers/product.controller.js";
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

// ─── PUBLIC ROUTES (no auth) ────────────────────────────────

// @desc Fetch all products (public browsing)
// @route GET /api/product/all
// @access Public
router.get("/all", fetchAllProducts);

// @desc Fetch single product (public)
// @route GET /api/product/public/:id
// @access Public
router.get("/public/:id", fetchProductById);

// ─── SELLER ROUTES (auth required) ─────────────────────────

// @desc Create Product
// @route POST /api/product/create
// @access Private
router.post("/create",authSeller,upload.array("images",7),validateCreateProduct,createProduct)


// @desc Get All Products
// @route GET /api/product
// @access Public
router.get("/",authSeller,getAllProducts)




// @desc Get live list of subcategories in use (for filter UI)
// @route GET /api/product/subcategories
// @access Public
router.get("/subcategories", getSubcategories);


// @desc Get full category/subcategory tree (for seller create-product picker)
// @route GET /api/product/category-options
// @access Public
router.get("/category-options", getCategoryOptions);


// @desc Update Product
// @route PUT /api/product/:id
// @access Private Seller
router.put("/:id", authSeller, upload.array("images", 7), updateProduct);

// @desc Delete Product
// @route DELETE /api/product/:id
// @access Private Seller
router.delete("/:id", authSeller, deleteProduct);

// @desc Add Product Variant
// @route POST /api/product/:id/variants
// @access Private Seller
router.post("/:id/variants", authSeller, upload.array("images", 7), addProductVariant);

// @desc Delete Product Variant
// @route DELETE /api/product/:id/variants/:variantId
// @access Private Seller
router.delete("/:id/variants/:variantId", authSeller, deleteProductVariant);

// @desc Get Seller Reviews
// @route GET /api/product/seller/reviews
// @access Private Seller
router.get("/seller/reviews", authSeller, getSellerReviews);

// ─── REVIEW ROUTES ─────────────────────────────────────────

// @desc Get product reviews (public)
// @route GET /api/product/:id/reviews
// @access Public
router.get("/:id/reviews", getProductReviews);

// @desc Create new review
// @route POST /api/product/:id/reviews
// @access Private (buyer)
router.post("/:id/reviews", authMiddleware, createProductReview);

// @desc Update a review
// @route PUT /api/product/:id/reviews/:reviewId
// @access Private (review owner)
router.put("/:id/reviews/:reviewId", authMiddleware, updateProductReview);

// @desc Delete a review
// @route DELETE /api/product/:id/reviews/:reviewId
// @access Private (review owner)
router.delete("/:id/reviews/:reviewId", authMiddleware, deleteProductReview);

// @desc Get Product By Id
// @route GET /api/product/:id
// @access Public
router.get("/:id", getProductById)

// @desc Reply to review
// @route POST /api/product/:id/reviews/:reviewId/reply
// @access Private Seller
router.post("/:id/reviews/:reviewId/reply",authSeller,replyToReviewController);


export default router;