import productService from "../services/product.service.js";
import restockService from "../services/restock.service.js";
import reviewService from "../services/review.service.js";
import { uploadFile } from "../services/storage.service.js";
import { suggestCategory, getCategoryTree } from "../utils/categorize.util.js";
import { buildTextSearchClause } from "../utils/search.util.js";

export const createProduct = async (req, res) => {
    try {
        const { title, description, priceAmount, priceCurrency, stock, category, subcategory } = req.body;
        const seller = req.user;

        const images = await Promise.all(req.files.map(async (file) => {
            const result = await uploadFile({
                buffer: file.buffer,
                fileName: file.originalname,
            });
            return result;
        }));

        // Auto-suggest category/subcategory from title+description if the
        // seller didn't explicitly provide one (or left it "Uncategorized").
        let finalCategory = category;
        let finalSubcategory = subcategory;
        if (!finalCategory || finalCategory === "Uncategorized" || !finalSubcategory || finalSubcategory === "Uncategorized") {
            const suggested = suggestCategory(title, description);
            finalCategory = finalCategory && finalCategory !== "Uncategorized" ? finalCategory : suggested.category;
            finalSubcategory = finalSubcategory && finalSubcategory !== "Uncategorized" ? finalSubcategory : suggested.subcategory;
        }

        const product = await productService.createProduct({
            title,
            description,
            price: { amount: Number(priceAmount), currency: priceCurrency },
            stock: Number(stock),
            images: images.map(img => ({ url: img.url })),
            category: finalCategory,
            subcategory: finalSubcategory
        }, req.user.id
        );

        res.status(201).json({
            message: "Product created successfully",
            success: true,
            product
        });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const sellerId = req.user._id;
        const products = await productService.getAllProducts({ seller: sellerId });
        res.status(200).json({
            message: "Products fetched successfully",
            success: true,
            products
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({
            message: "Product fetched successfully",
            success: true,
            product
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const sellerId = req.user._id;
        const productId = req.params.id;
        const { title, description, priceAmount, priceCurrency, stock, category, subcategory } = req.body;

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (stock !== undefined) updateData.stock = Number(stock);
        if (category) updateData.category = category;
        if (subcategory) updateData.subcategory = subcategory;
        if (priceAmount || priceCurrency) {
            updateData.price = {
                amount: Number(priceAmount),
                currency: priceCurrency
            };
        }

        if (req.files && req.files.length > 0) {
            const images = await Promise.all(req.files.map(async (file) => {
                const result = await uploadFile({
                    buffer: file.buffer,
                    fileName: file.originalname,
                });
                return result;
            }));
            updateData.images = images;
        }

        const updatedProduct = await productService.updateProduct(productId, updateData, sellerId);
        res.status(200).json({ message: "Product updated successfully", success: true, product: updatedProduct });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const sellerId = req.user._id;
        const productId = req.params.id;
        await productService.deleteProduct(productId, sellerId);
        res.status(200).json({ message: "Product deleted successfully", success: true });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const addProductVariant = async (req, res) => {
    try {
        const sellerId = req.user._id;
        const productId = req.params.id;
        const { value, stock, priceAmount, priceCurrency } = req.body;

        let images = [];
        if (req.files && req.files.length > 0) {
            images = await Promise.all(req.files.map(async (file) => {
                const result = await uploadFile({
                    buffer: file.buffer,
                    fileName: file.originalname,
                });
                return { url: result.url };
            }));
        }

        const variantData = {
            value,
            stock: Number(stock),
            price: {
                amount: Number(priceAmount),
                currency: priceCurrency
            },
            image: images
        };

        const product = await productService.addVariant(productId, variantData, sellerId);
        res.status(201).json({ message: "Variant added successfully", success: true, product });
    } catch (error) {
        console.error("Error adding variant:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const deleteProductVariant = async (req, res) => {
    try {
        const sellerId = req.user._id;
        const { id: productId, variantId } = req.params;
        const product = await productService.deleteVariant(productId, variantId, sellerId);
        res.status(200).json({ message: "Variant deleted successfully", success: true, product });
    } catch (error) {
        console.error("Error deleting variant:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const createProductReview = async (req, res) => {
    try {
        const { rating, comment, parentId } = req.body;
        const productId = req.params.id;
        const user = req.user;

        if (parentId) {
            // This is a reply
            const product = await reviewService.replyToReview(user._id, parentId, comment, user._id); 
            return res.status(201).json({ message: "Reply added", success: true, product });
        }

        const product = await reviewService.addReview(user._id, productId, { rating: Number(rating), comment });
        res.status(201).json({ message: "Review added", success: true, product });
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const getSellerReviews = async (req, res) => {
    try {
        const sellerId = req.user._id;
        const { reviews, products } = await reviewService.getSellerReviews(sellerId);
        res.status(200).json({ message: "Seller reviews fetched", success: true, reviews, products });
    } catch (error) {
        console.error("Error fetching seller reviews:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const fetchAllProducts = async (req, res) => {
    try {
        const { search, minPrice, maxPrice, rating, category, sort, page = 1, limit = 10 } = req.query;
        
        const filters = {};
        if (minPrice || maxPrice) {
            filters["price.amount"] = {};
            if (minPrice) filters["price.amount"].$gte = Number(minPrice);
            if (maxPrice) filters["price.amount"].$lte = Number(maxPrice);
        }
        if (rating) {
            filters.averageRating = { $gte: Number(rating) };
        }
        if (category && category !== 'All') {
            filters.subcategory = category;
        }

        const options = {
            limit: Number(limit),
            skip: (Number(page) - 1) * Number(limit),
            sort: {}
        };

        if (sort === "price_low") options.sort["price.amount"] = 1;
        else if (sort === "price_high") options.sort["price.amount"] = -1;
        else if (sort === "rating") options.sort.averageRating = -1;
        else options.sort.createdAt = -1;

        // Same tokenized text clause used for both fetching and counting,
        // so pagination totals always match what's actually returned.
        const textClause = buildTextSearchClause(search);
        const fullFilters = { ...filters, ...textClause };

        const products = await productService.searchProducts(search, filters, options);
        const total = await productService.countProducts(fullFilters);

        res.status(200).json({ 
            message: "Products fetched successfully", 
            success: true, 
            products,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
         console.error(error);
        console.error(error.stack);

    res.status(500).json({
        success: false,
        message: error.message,
        stack: error.stack
    });
    }
};

export const fetchProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product fetched successfully", success: true, product });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProductReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const { id: productId, reviewId } = req.params;
        const userId = req.user._id;
        
        const product = await reviewService.updateReview(userId, reviewId, { rating, comment }); 
        res.status(200).json({ message: "Review updated", success: true, product });
    } catch (error) {
        console.error("Error updating review:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const deleteProductReview = async (req, res) => {
    try {
        const { id: productId, reviewId } = req.params;
        const userId = req.user._id;
        
        const product = await reviewService.deleteReview(userId, reviewId);
        res.status(200).json({ message: "Review deleted", success: true, product });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const getSubcategories = async (req, res) => {
    try {
        const subcategories = await productService.getDistinctSubcategories();
        res.status(200).json({ success: true, subcategories });
    } catch (error) {
        console.error("Error fetching subcategories:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getCategoryOptions = async (req, res) => {
    try {
        const tree = getCategoryTree();
        res.status(200).json({ success: true, categories: tree });
    } catch (error) {
        console.error("Error fetching category tree:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



export const replyToReviewController = async (req, res) => {
    try {

        const { reviewId } = req.params;
        const { comment } = req.body;

        const sellerId = req.user._id;

        const result = await reviewService.replyToReview(
            sellerId,
            reviewId,
            comment,
            sellerId
        );

        return res.status(200).json({
            success: true,
            message: "Reply added successfully",
            data: result
        });

    } catch (err) {

        return res.status(400).json({
            success: false,
            message: err.message
        });

    }
};



export const getCompleteTheLook = async (req, res) => {
    try {
        const suggestions = await productService.getCompleteTheLook(req.params.id);
        res.status(200).json({ success: true, suggestions });
    } catch (error) {
        console.error("Complete the look error:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};


export const updateProductVariant = async (req, res) => {
    try {
        const sellerId = req.user._id;
        const { id: productId, variantId } = req.params;
        const { stock, priceAmount, priceCurrency, value } = req.body;

        const product = await productService.getProductById(productId);
        const existingVariant = product?.variants?.id(variantId);
        const wasOutOfStock = existingVariant ? existingVariant.stock < 1 : false;

        const variantData = {
            value: value ?? existingVariant?.value,
            stock: stock !== undefined ? Number(stock) : existingVariant?.stock,
            price: {
                amount: priceAmount !== undefined ? Number(priceAmount) : existingVariant?.price?.amount,
                currency: priceCurrency || existingVariant?.price?.currency
            },
            image: existingVariant?.image || []
        };

        const updated = await productService.updateVariant(productId, variantId, variantData, sellerId);

        const newVariant = updated?.variants?.id(variantId);
        if (wasOutOfStock && newVariant && newVariant.stock > 0) {
            restockService.notifyWaitlist(productId, variantId).catch(err => console.error("Restock notify failed", err));
        }

        res.status(200).json({ message: "Variant updated successfully", success: true, product: updated });
    } catch (error) {
        console.error("Error updating variant:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const joinRestockWaitlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id: productId } = req.params;
        const { variantId } = req.body;
        await restockService.joinWaitlist(userId, productId, variantId || null);
        res.status(200).json({ success: true, message: "You'll be notified when this is back in stock" });
    } catch (error) {
        console.error("Restock waitlist error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const getProductReviews = async (req, res) => {
    try {
        const productId = req.params.id;
        const { limit = 10, skip = 0 } = req.query;
        const { reviews, total, verifiedCount } = await reviewService.getReviewsByProduct(productId, { 
            limit: Number(limit), 
            skip: Number(skip) 
        });
        res.status(200).json({ 
            message: "Product reviews fetched successfully", 
            success: true, 
            reviews,
            total,
            verifiedCount
        });
    } catch (error) {
        console.error("Error fetching product reviews:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};