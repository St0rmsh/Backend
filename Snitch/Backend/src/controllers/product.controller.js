import productService from "../services/product.service.js";
import reviewService from "../services/review.service.js";
import { uploadFile } from "../services/storage.service.js";

export const createProduct = async (req, res) => {
    try {
        const { title, description, priceAmount, priceCurrency, stock } = req.body;
        const seller = req.user;

        const images = await Promise.all(req.files.map(async (file) => {
            const result = await uploadFile({
                buffer: file.buffer,
                fileName: file.originalname,
            });
            return result;
        }));

        const product = await productService.createProduct({
            title,
            description,
            price: { amount: Number(priceAmount), currency: priceCurrency },
            stock: Number(stock),
            images: images.map(img => ({ url: img.url }))
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
        const { title, description, priceAmount, priceCurrency, stock } = req.body;

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (stock !== undefined) updateData.stock = Number(stock);
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

export const getProductReviews = async (req, res) => {
    try {
        const productId = req.params.id;
        const { limit = 10, skip = 0 } = req.query;
        const { reviews, total } = await reviewService.getReviewsByProduct(productId, { 
            limit: Number(limit), 
            skip: Number(skip) 
        });
        res.status(200).json({ 
            message: "Product reviews fetched successfully", 
            success: true, 
            reviews,
            total 
        });
    } catch (error) {
        console.error("Error fetching product reviews:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getSellerReviews = async (req, res) => {
    try {
        const sellerId = req.user._id;
        const reviews = await reviewService.getSellerReviews(sellerId);
        res.status(200).json({ message: "Seller reviews fetched", success: true, reviews });
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
            filters.category = category;
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

        const fullFilters = { ...filters };
        if (search) {
            fullFilters.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

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