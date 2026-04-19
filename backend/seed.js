const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const categories = [
    { category_name: 'Electronics', slug: 'electronics', description: 'Gadgets and gizmos' },
    { category_name: 'Fashion', slug: 'fashion', description: 'Trendy clothes and accessories' },
    { category_name: 'Home', slug: 'home', description: 'Furniture and decor' }
];

const products = [
    {
        product_name: 'Premium Leather Watch',
        slug: 'premium-leather-watch',
        description: 'A classic timepiece with a genuine leather strap and minimalist dial.',
        price: 199,
        stock: 15,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'
    },
    {
        product_name: 'Wireless Noise-Canceling Headphones',
        slug: 'wireless-headphones',
        description: 'Experience pure sound with our advanced noise-canceling technology.',
        price: 299,
        stock: 20,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'
    },
    {
        product_name: 'Glass Coffee Table',
        slug: 'glass-coffee-table',
        description: 'Modern and elegant, this coffee table is the center of any living room.',
        price: 450,
        stock: 5,
        image: 'https://images.unsplash.com/photo-1549462229-37f261ec00fc?auto=format&fit=crop&q=80&w=800'
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/newkart');
        
        await Category.deleteMany({});
        await Product.deleteMany({});
        await User.deleteMany({});

        // Create Admin User first to get its ID
        const adminUser = await User.create({
            first_name: 'Admin',
            last_name: 'User',
            username: 'admin',
            email: 'admin@example.com',
            password: 'password123',
            is_staff: true,
            is_superadmin: true,
            is_seller: true // Make admin a seller too for seeding
        });

        const createdCategories = await Category.insertMany(categories);
        
        // Assign categories and the admin as common seller
        products[0].category = createdCategories[1]._id; // Fashion
        products[1].category = createdCategories[0]._id; // Electronics
        products[2].category = createdCategories[2]._id; // Home

        const productsWithSeller = products.map(p => ({
            ...p,
            seller: adminUser._id
        }));

        await Product.insertMany(productsWithSeller);

        console.log('Database seeded successfully with Admin user as seller!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
