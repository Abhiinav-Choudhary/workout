import express from "express";
import multer from "multer";
import { protect, admin } from "../middleware/auth.middleware.js";
import { createProduct, getProducts, getProductById , updateProduct , deleteProduct , getProductsByCategory } from "../controllers/product.controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Public routes
router.get("/", getProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/:id", getProductById);

// Protected admin routes
router.post("/", protect, admin, upload.array("images", 5), createProduct);
router.put("/:id", protect, admin, upload.array("images", 5), updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

export default router;
