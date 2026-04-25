import mongoose from 'mongoose';
import Product from '../src/models/product.model.js';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Snitch';

async function checkVariants() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');
        
        const products = await Product.find({ 'variants.0': { $exists: true } });
        console.log('Products with variants:', products.length);
        
        products.forEach(p => {
            console.log(`- ${p.title} (ID: ${p._id})`);
            console.log(`  Variants: ${p.variants.length}`);
            p.variants.forEach((v, i) => {
                console.log(`    [${i}] ${v.value} - Stock: ${v.stock}, Price: ${v.price.amount}`);
            });
        });

        if (products.length === 0) {
            console.log('\nNO PRODUCTS WITH VARIANTS FOUND.');
            const all = await Product.find().limit(5);
            console.log('Checking first 5 products for any variant data:');
            all.forEach(p => console.log(`${p.title}: variants array length = ${p.variants?.length || 0}`));
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkVariants();
