import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const getAdminStats = async (req, res) => {
  try {

    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    const revenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" }
        }
      }
    ]);

    res.json({
      totalOrders,
      totalProducts,
      totalUsers,
      revenue: revenue[0]?.total || 0
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};