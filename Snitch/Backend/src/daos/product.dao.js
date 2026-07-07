import ProductModel from "../models/product.model.js";

class ProductDAO {
    async create(productData) {
        const product = new ProductModel(productData);
        return await product.save();
    }

    async findById(id) {
        return await ProductModel.findById(id).populate("seller", "name email");
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

    async addVariant(productId, variantData) {
        return await ProductModel.findByIdAndUpdate(
            productId,
            { $push: { variants: variantData } },
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

    async search(query, filters = {}, options = {}) {
        const { sort = { createdAt: -1 }, limit = 10, skip = 0 } = options;
        
        let mongoFilter = { ...filters };
        if (query) {
            mongoFilter.$or = [
                { title: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
                { "variants.value": { $regex: query, $options: "i" } },
                { "variants.attributes": { $regex: query, $options: "i" } }
            ];
        }

        return await ProductModel.find(mongoFilter)
            .sort(sort)
            .limit(limit)
            .skip(skip)
            .populate("seller", "name email");
    }
}

export default new ProductDAO();
