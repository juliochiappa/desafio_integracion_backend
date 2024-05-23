import mongoose from 'mongoose';

mongoose.pluralize(null);

const collection = 'carts';

const productSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
  quantity: { type: Number, required: true, default: 1 },
});

const cartSchema = new mongoose.Schema({
  products: [productSchema],
});

const cartModel = mongoose.model(collection, cartSchema);

export default cartModel;
