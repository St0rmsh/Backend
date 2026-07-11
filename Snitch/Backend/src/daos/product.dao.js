import ProductModel from "../models/product.model.js";
import { buildTextSearchClause } from "../utils/search.util.js";

class ProductDAO {

     async findById(id) {
        return await ProductModel.findById(id).populate("seller", "name email");
    }


    async create(productData) {
        const product = new ProductModel(productData);
        return await product.save();
    }

   
    async find(filter = {}, options = {}) {
        const { sort = { createdAt: -1 }, limit = 10, skip = 0 } = options;
        return await ProductModel.find(filter)
            .sort(sort)
            .limit(limit)
            .skip(skip)
            .populate("seller", "name email");
    }

    async count(filter = {}) {
        return await ProductModel.countDocuments(filter);
    }

    async updateById(id, updateData) {
        return await ProductModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    }

    async deleteById(id) {
        return await ProductModel.findByIdAndDelete(id);
    }

   async addVariant(productId, variantData, newType) {
        const update = { $push: { variants: variantData } };
        if (newType) {
            update.$set = { type: newType };
        }
        return await ProductModel.findByIdAndUpdate(
            productId,
            update,
            { new: true, runValidators: true }
        );
    }

    async updateVariant(productId, variantId, variantData) {
        return await ProductModel.findOneAndUpdate(
            { _id: productId, "variants._id": variantId },
            { $set: { "variants.$": variantData } },
            { new: true, runValidators: true }
        );
    }

    async deleteVariant(productId, variantId) {
        return await ProductModel.findByIdAndUpdate(
            productId,
            { $pull: { variants: { _id: variantId } } },
            { new: true }
        );
    }

    async deductStock(productId, quantity) {
        // Atomic: only succeeds if stock is still sufficient at write-time
        return await ProductModel.findOneAndUpdate(
            { _id: productId, stock: { $gte: quantity } },
            { $inc: { stock: -quantity } },
            { new: true }
        );
    }

    async deductVariantStock(productId, variantId, quantity) {
        return await ProductModel.findOneAndUpdate(
            { _id: productId, "variants._id": variantId, "variants.stock": { $gte: quantity } },
            { $inc: { "variants.$.stock": -quantity } },
            { new: true }
        );
    }

    async distinctSubcategories() {
        const results = await ProductModel.distinct("subcategory", { subcategory: { $ne: "Uncategorized" } });
        return results.sort();
    }

    async search(query, filters = {}, options = {}) {
        const { sort = { createdAt: -1 }, limit = 10, skip = 0 } = options;
        const textClause = buildTextSearchClause(query);
        const mongoFilter = { ...filters, ...textClause };

        return await ProductModel.find(mongoFilter)
            .sort(sort)
            .limit(limit)
            .skip(skip)
            .populate("seller", "name email");
    }

    async findComplementary(categories, excludeProductId, limit = 4) {
        if (!categories || categories.length === 0) return [];
        return await ProductModel.find({
            category: { $in: categories },
            _id: { $ne: excludeProductId }
        })
            .sort({ averageRating: -1, createdAt: -1 })
            .limit(limit)
            .populate("seller", "name email");
    }
}


export default new ProductDAO();