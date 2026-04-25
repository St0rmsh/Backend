import mongoose from 'mongoose';
import Product from '../src/models/product.model.js';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Snitch';

async function seedVariants() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');
        
        const products = await Product.find().limit(2);
        if (products.length === 0) {
            console.log('No products found to seed.');
            process.exit(0);
        }

        for (const p of products) {
            console.log(`Seeding variants for: ${p.title}`);
            const variants = [
                {
                    value: "Small",
                    stock: 10,
                    price: { amount: p.price.amount, currency: p.price.currency },
                    image: p.images.slice(0, 1),
                    attributes: { Size: "S" }
                },
                {
                    value: "Medium",
                    stock: 15,
                    price: { amount: p.price.amount + 100, currency: p.price.currency },
                    image: p.images.slice(0, 1),
                    attributes: { Size: "M" }
                },
                {
                    value: "Large",
                    stock: 0, // Out of stock test
                    price: { amount: p.price.amount + 200, currency: p.price.currency },
                    image: p.images.slice(0, 1),
                    attributes: { Size: "L" }
                }
            ];
            
            p.variants = variants;
            p.type = "variant_optional";
            await p.save();
            console.log(`- Saved ${variants.length} variants for ${p.title}`);
        }

        console.log('\nSeeding complete.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedVariants();
