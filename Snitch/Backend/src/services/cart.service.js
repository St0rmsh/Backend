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

        // FORCE BASE VARIANT
        if (product.type === "simple") {
            variantId = "BASE";
        }

        let stock = product.stock;
        let price = product.price;
        let productName = product.title;
        let variantName = "Standard";

        if (variantId !== "BASE") {
            const variant = product.variants.id(variantId);
            if (!variant) throw new Error("Variant not found");

            stock = variant.stock;
            price = variant.price;
            variantName = variant.value;
        }

        if (quantity > stock) throw new Error("Not enough stock");

        let cart = await this.getCart(userId);

        const itemIndex = cart.items.findIndex(item => {
            const itemProdId = item.product._id
                ? item.product._id.toString()
                : item.product.toString();

            const itemVarId = item.variantKey || "BASE";

            return (
                itemProdId === productId.toString() &&
                itemVarId === (variantId || "BASE")
            );
        });

        if (itemIndex > -1) {
            const newQty = cart.items[itemIndex].quantity + quantity;
            if (newQty > stock) throw new Error("Not enough stock");
            cart.items[itemIndex].quantity = newQty;
        } else {
            cart.items.push({
                product: productId,
                variant: variantId === "BASE" ? null : variantId,
                variantKey: variantId || "BASE",   // 🔥 IMPORTANT FIX
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

        if (product.type === "simple") {
            variantId = "BASE";
        }

        let stock = product.stock;

        if (variantId !== "BASE") {
            const variant = product.variants.id(variantId);
            if (!variant) throw new Error("Variant not found");
            stock = variant.stock;
        }

        if (quantity < 1) {
            return await this.removeFromCart(userId, productId, variantId);
        }

        if (quantity > stock) throw new Error("Not enough stock");

        let cart = await this.getCart(userId);

        const itemIndex = cart.items.findIndex(item => {
            const itemProdId = item.product._id
                ? item.product._id.toString()
                : item.product.toString();

            return (
                itemProdId === productId.toString() &&
                (item.variantKey || "BASE") === (variantId || "BASE")
            );
        });

        if (itemIndex === -1) throw new Error("Item not in cart");

        cart.items[itemIndex].quantity = quantity;

        return await cartDao.updateByUserId(userId, { items: cart.items });
    }

    async removeFromCart(userId, productId, variantId) {
        if (!variantId) variantId = "BASE";

        let cart = await this.getCart(userId);

        cart.items = cart.items.filter(item => {
            const itemProdId = item.product._id
                ? item.product._id.toString()
                : item.product.toString();

            return !(
                itemProdId === productId.toString() &&
                (item.variantKey || "BASE") === variantId
            );
        });

        return await cartDao.updateByUserId(userId, { items: cart.items });
    }
}

export default new CartService();
