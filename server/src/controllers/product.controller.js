import Product from "../models/product.model.js";
import cloudinary from "../utils/cloudinary.js";
import { invalidateEquipmentCache } from "../utils/invalidateEquipmentCache.js";

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

    await invalidateEquipmentCache();

    res.status(201).json({ success: true, product });

  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: err.message });
  }
};

// get products

export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 8,
      search = "",
      category = "",
      brand = "",
      minPrice,
      maxPrice,
      sort = "newest",
    } = req.query;

    const currentPage = Math.max(1, parseInt(page, 10) || 1);
    const pageLimit = Math.min(
      50,
      Math.max(1, parseInt(limit, 10) || 8)
    );

    // Build the database filter
    const filter = {};

    if (search.trim()) {
      const escapedSearch = search.trim().replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      filter.title = {
        $regex: escapedSearch,
        $options: "i",
      };
    }

    if (category.trim()) {
      filter.category = category.trim();
    }

    if (brand.trim()) {
      const escapedBrand = brand.trim().replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      filter.brand = {
        $regex: escapedBrand,
        $options: "i",
      };
    }

    // Validate price filters
    const priceFilter = {};

    if (minPrice !== undefined && minPrice !== "") {
      const min = Number(minPrice);

      if (!Number.isFinite(min) || min < 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid minimum price",
        });
      }

      priceFilter.$gte = min;
    }

    if (maxPrice !== undefined && maxPrice !== "") {
      const max = Number(maxPrice);

      if (!Number.isFinite(max) || max < 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid maximum price",
        });
      }

      priceFilter.$lte = max;
    }

    if (
      priceFilter.$gte !== undefined &&
      priceFilter.$lte !== undefined &&
      priceFilter.$gte > priceFilter.$lte
    ) {
      return res.status(400).json({
        success: false,
        message: "Minimum price cannot exceed maximum price",
      });
    }

    if (Object.keys(priceFilter).length > 0) {
      filter.price = priceFilter;
    }

    // Sorting
    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      name_asc: { title: 1 },
      name_desc: { title: -1 },
    };

    const sortBy = sortOptions[sort] || sortOptions.newest;
    const skip = (currentPage - 1) * pageLimit;

    // Count only matching products
    const [products, totalProducts, categories, brands] =
      await Promise.all([
        Product.find(filter)
          .sort(sortBy)
          .skip(skip)
          .limit(pageLimit),

        Product.countDocuments(filter),

        Product.distinct("category"),

        Product.distinct("brand"),
      ]);

    res.json({
      success: true,
      products,
      currentPage,
      totalPages: Math.ceil(totalProducts / pageLimit),
      totalProducts,
      categories: categories.filter(Boolean).sort(),
      brands: brands.filter(Boolean).sort(),
    });
  } catch (err) {
    console.error("Error fetching products:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
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

    await invalidateEquipmentCache();

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

    await invalidateEquipmentCache();

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