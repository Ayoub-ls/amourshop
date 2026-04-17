require('dotenv').config();
const connectDB = require('./config/db');
const mockDB = require('./data/mockDB');
const Product = require('./models/Product');
const Order = require('./models/Order');
const User = require('./models/User');

const seedDatabase = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("No MONGO_URI provided in .env. Exiting seed.");
      process.exit(1);
    }
    
    await connectDB();

    console.log('Clearing existing data...');
    await Product.deleteMany();
    await Order.deleteMany();
    await User.deleteMany();

    console.log('Seeding products...');
    const productsToInsert = mockDB.products.map(p => {
        const { id, ...rest } = p;
        return rest;
    });
    await Product.insertMany(productsToInsert);

    console.log('Seeding orders...');
    const ordersToInsert = mockDB.orders.map(o => {
        const { id, ...rest } = o;
        return rest;
    });
    await Order.insertMany(ordersToInsert);

    console.log('Seeding users...');
    for (const u of mockDB.users) {
        const { id, ...rest } = u;
        await User.create(rest);
    }

    console.log('Database seeding successfully completed!');
    process.exit(0);
  } catch (error) {
    console.error(`Error during seeding: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
