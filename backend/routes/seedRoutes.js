import express from 'express';
import Product from '../models/productModel.js';
// const Product = require('../models/product')
import data from '../data.js';
import User from '../models/userModel.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  await Product.deleteMany({}); //import all products inside product
  const createdProducts = await Product.insertMany(data.products); //copy all from data to db

  await User.deleteMany({});
  const createdusers = await User.insertMany(data.users);

  res.send({ createdProducts, createdusers });
});

export default seedRouter;
