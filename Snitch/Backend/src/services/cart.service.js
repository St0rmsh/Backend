import cartDao from "../daos/cart.dao.js";
import productDao from "../daos/product.dao.js";

class CartService {
    async getCart(userId) {
        let cart = await cartDao.findByUserId(userId);
        if (!cart) {
            cart = await cartDao.create({ user: userId, items: [] });
        }
        return cart;
    }

    async addToCart(userId, productId, variantId, quantity) {
        const product = await productDao.findById(productId);
        if (!product) throw new Error("Product not found");

        // VALIDATION based on product.type
        if (product.type === "variant_required" && !variantId) {
            throw new Error("Selection is mandatory for this product");
        }

        let stock = product.stock;
        let price = product.price;
        let productName = product.title;
        let variantName = null;

        // If product is simple, ignore variantId
        if (product.type === "simple") {
            variantId = null;
        }

        if (variantId) {
            const variant = product.variants.id(variantId);
            if (!variant) throw new Error("Variant not found");
            stock = variant.stock;
            price = variant.price;
            variantName = variant.value;
        }

        if (quantity > stock) throw new Error("Not enough stock");

        let cart = await this.getCart(userId);
        const itemIndex = cart.items.findIndex(item => {
            const itemProdId = item.product._id ? item.product._id.toString() : item.product.toString();
            const itemVarId = item.variant ? item.variant.toString() : null;
            const targetVarId = variantId ? variantId.toString() : null;
            return itemProdId === productId.toString() && itemVarId === targetVarId;
        });

        if (itemIndex > -1) {
            const newQuantity = cart.items[itemIndex].quantity + quantity;
            if (newQuantity > stock) throw new Error("Not enough stock");
            cart.items[itemIndex].quantity = newQuantity;
        } else {
            cart.items.push({
                product: productId,
                variant: variantId,
                productName,
                variantName,
                quantity,
                price
            });
        }

        return await cartDao.updateByUserId(userId, { items: cart.items });
    }

    async updateQuantity(userId, productId, variantId, quantity) {
        const product = await productDao.findById(productId);
        if (!product) throw new Error("Product not found");

        let stock = product.stock;
        if (variantId && product.type !== "simple") {
            const variant = product.variants.id(variantId);
            if (!variant) throw new Error("Variant not found");
            stock = variant.stock;
        } else {
            stock = product.stock;
        }

        if (quantity < 1) {
            return await this.removeFromCart(userId, productId, variantId);
        }

        if (quantity > stock) throw new Error("Not enough stock");

        let cart = await this.getCart(userId);
        const itemIndex = cart.items.findIndex(item => {
            const itemProdId = item.product._id ? item.product._id.toString() : item.product.toString();
            return itemProdId === productId.toString() && 
            (variantId ? item.variant && item.variant.toString() === variantId.toString() : !item.variant);
        });

        if (itemIndex === -1) throw new Error("Item not in cart");

        cart.items[itemIndex].quantity = quantity;
        return await cartDao.updateByUserId(userId, { items: cart.items });
    }

    async removeFromCart(userId, productId, variantId) {
        let cart = await this.getCart(userId);
        cart.items = cart.items.filter(item => {
            const itemProdId = item.product._id ? item.product._id.toString() : item.product.toString();
            return !(itemProdId === productId.toString() && 
            (variantId ? item.variant && item.variant.toString() === variantId.toString() : !item.variant));
        });
        return await cartDao.updateByUserId(userId, { items: cart.items });
    }
}

export default new CartService();
