import Product from "../models/product.model.js";
import cloudinary from "../utils/cloudinary.js";

export const createProduct = async (req, res) => {
  try {
    let images = [];

    // Check if files exist and are iterable
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      for (let file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products"
        });

        images.push({
          url: result.secure_url,
          public_id: result.public_id
        });
      }
    } else {
      // If no files uploaded, use placeholder
      images.push({
        url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
        public_id: "placeholder_default"
      });
    }

    const product = await Product.create({
      ...req.body,
      images,
    });

    res.status(201).json({ success: true, product });

  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: err.message });
  }
};

// get products
export const getProducts = async (req, res) => {
  try {
    // 1️⃣ Read query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    // 2️⃣ Count total products
    const totalProducts = await Product.countDocuments();

    // 3️⃣ Fetch paginated products
    const products = await Product.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // 4️⃣ Send paginated response
    res.json({
      success: true,
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// GET single product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




// controllers/product.controller.js

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        error: "Product not found" 
      });
    }

    // Delete images from Cloudinary (with error handling)
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      for (let image of product.images) {
        try {
          // Only delete if it's not a placeholder/external URL
          if (image.public_id && !image.public_id.includes('placeholder')) {
            await cloudinary.uploader.destroy(image.public_id);
          }
        } catch (cloudinaryError) {
          console.error("Cloudinary deletion error:", cloudinaryError);
          // Continue even if cloudinary delete fails
        }
      }
    }

    // Delete product from database
    await Product.findByIdAndDelete(req.params.id);

    res.json({ 
      success: true, 
      message: "Product deleted successfully" 
    });

  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

// UPDATE product (bonus - you'll need this too)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Handle new images if uploaded
    let images = product.images;
    if (req.files && req.files.length > 0) {
      // Delete old images from Cloudinary
      for (let image of product.images) {
        await cloudinary.uploader.destroy(image.public_id);
      }
      
      // Upload new images
      images = [];
      for (let file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products"
        });
        images.push({
          url: result.secure_url,
          public_id: result.public_id
        });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, images },
      { new: true, runValidators: true }
    );

    res.json({ success: true, product: updatedProduct });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get products by category (for recommendations)
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category }).limit(8);
    
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};