import productDao from "../daos/product.dao.js";

class ProductService {
    async createProduct(productData, sellerId) {
        return await productDao.create({ ...productData, seller: sellerId });
    }

    async getProductById(id) {
        return await productDao.findById(id);
    }

    async getAllProducts(filters = {}, options = {}) {
        return await productDao.find(filters, options);
    }

    async countProducts(filter = {}) {
        return await productDao.count(filter);
    }

    async updateProduct(id, updateData, sellerId) {
        const product = await productDao.findById(id);
        if (!product) throw new Error("Product not found");
        if (product.seller._id.toString() !== sellerId.toString()) throw new Error("Unauthorized");
        
        return await productDao.updateById(id, updateData);
    }

    async deleteProduct(id, sellerId) {
        const product = await productDao.findById(id);
        if (!product) throw new Error("Product not found");
        if (product.seller._id.toString() !== sellerId.toString()) throw new Error("Unauthorized");
        
        return await productDao.deleteById(id);
    }

    async searchProducts(query, filters = {}, options = {}) {
        return await productDao.search(query, filters, options);
    }

    async addVariant(productId, variantData, sellerId) {
        const product = await productDao.findById(productId);
        if (!product) throw new Error("Product not found");
        if (product.seller._id.toString() !== sellerId.toString()) throw new Error("Unauthorized");
        
        return await productDao.addVariant(productId, variantData);
    }

    async updateVariant(productId, variantId, variantData, sellerId) {
        const product = await productDao.findById(productId);
        if (!product) throw new Error("Product not found");
        if (product.seller._id.toString() !== sellerId.toString()) throw new Error("Unauthorized");
        
        return await productDao.updateVariant(productId, variantId, variantData);
    }

    async deleteVariant(productId, variantId, sellerId) {
        const product = await productDao.findById(productId);
        if (!product) throw new Error("Product not found");
        if (product.seller._id.toString() !== sellerId.toString()) throw new Error("Unauthorized");
        
        return await productDao.deleteVariant(productId, variantId);
    }
}

export default new ProductService();
