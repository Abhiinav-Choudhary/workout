import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  category: { type: String, required: true },
  brand: { type: String },
  stock: { type: Number, default: 0 },

  images: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true }
    }
  ],

  rating: { type: Number, default: 4.5 },
  reviews: [
    {
      user: String,
      comment: String,
      rating: Number
    }
  ]
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;
