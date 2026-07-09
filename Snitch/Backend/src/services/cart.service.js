import cartDao from "../daos/cart.dao.js";
import productDao from "../daos/product.dao.js";

class CartService {

    async _getOrCreateCart(userId) {

        let cart = await cartDao.findByUserId(userId);

        if (!cart) {
            cart = await cartDao.create({ user: userId, items: [] });
        }
        
        return cart;
    }


   async getCart(userId) {

    let cart = await this._getOrCreateCart(userId);

    const computed = await cartDao.getCartWithComputedTotal(userId);

    return {
        cart,
        total: computed.total,
        liveItems: computed.items
    };
}

    async addToCart(userId, productId, variantId, quantity) {

        const product = await productDao.findById(productId);
        if (!product) throw new Error("Product not found");

        // FORCE BASE VARIANT
        const hasVariants = product.variants && product.variants.length > 0;
        if (!hasVariants || !variantId || variantId === "BASE") {
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

        let cart = await this._getOrCreateCart(userId);
        const currentVariantKey = variantId && variantId !== "" ? variantId : "BASE";

        const itemIndex = cart.items.findIndex(item => {
         const itemProdId = item.product._id
        ? item.product._id.toString()
        : item.product.toString();

      return (
        itemProdId === productId.toString() &&
        item.variantKey === currentVariantKey
     );
});

        if (itemIndex > -1) {
            const newQty = cart.items[itemIndex].quantity + quantity;
            if (newQty > stock) throw new Error("Not enough stock");
            cart.items[itemIndex].quantity = newQty;
        } else {

           cart.items.push({
           product: productId,
           variant: currentVariantKey === "BASE" ? null : currentVariantKey,
           variantKey: currentVariantKey,
           productName,
           variantName,
           quantity,
           price
        });
     }

        await cartDao.updateByUserId(userId, { items: cart.items });
        return await this.getCart(userId);

    }

    async updateQuantity(userId, productId, variantId, quantity) {
        const product = await productDao.findById(productId);
        if (!product) throw new Error("Product not found");

        const hasVariants = product.variants && product.variants.length > 0;
        if (!hasVariants || !variantId || variantId === "BASE") {
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

        let cart = await this._getOrCreateCart(userId);
        const currentVariantKey = variantId && variantId !== "" ? variantId : "BASE";
        const itemIndex = cart.items.findIndex(item => {
        const itemProdId = item.product._id
        ? item.product._id.toString()
        : item.product.toString();

        return (
        itemProdId === productId.toString() &&
        item.variantKey === currentVariantKey
        );
    });

        if (itemIndex === -1) throw new Error("Item not in cart");

        cart.items[itemIndex].quantity = quantity;

        await cartDao.updateByUserId(userId, { items: cart.items });
        return await this.getCart(userId);

    }

    async removeFromCart(userId, productId, variantId) {
        const currentVariantKey = variantId && variantId !== "" ? variantId : "BASE";
        let cart = await this._getOrCreateCart(userId);

        cart.items = cart.items.filter(item => {
            const itemProdId = item.product._id
                ? item.product._id.toString()
                : item.product.toString();

            return !(
                itemProdId === productId.toString() &&
                item.variantKey === currentVariantKey            );
        });

        await cartDao.updateByUserId(userId, { items: cart.items });
        return await this.getCart(userId);
    }
}

export default new CartService();
