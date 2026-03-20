import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dumbbell,
  Activity,
  Armchair,
  Move,
  ShoppingCart,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useCart } from "../context/cartContext";

const Equipment = () => {
  const navigate = useNavigate();
  const { cart,clearCart, addToCart, removeFromCart, total } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  const API_URL = `${import.meta.env.VITE_API_URL}/api/products`;

  // Fetch products (paginated)
  const fetchProducts = async (pageNumber = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_URL}?page=${pageNumber}&limit=${limit}`
      );
      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
        setPage(data.currentPage);
        setTotalPages(data.totalPages);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  // Category icon helper
  const getCategoryIcon = (category) => {
    const iconMap = {
      "Calisthenics Equipment": <Activity size={22} />,
      "Training Gear": <Dumbbell size={22} />,
      Accessories: <Move size={22} />,
    };
    return iconMap[category] || <Armchair size={22} />;
  };

const {  } = useCart();
 const isAuthenticated = !!localStorage.getItem("token");
 
const handleCheckout = async () => {
  if (!isAuthenticated) {
    navigate("/login");
    return;
  }

  const token = localStorage.getItem("token");

  const totalAmount = cart.reduce((sum, item) => {
    const price = Number(item.discountPrice ?? item.price);
    const quantity = Number(item.quantity ?? 1);
    if (isNaN(price) || isNaN(quantity)) return sum;
    return sum + price * quantity;
  }, 0);

  if (!totalAmount) {
    alert("Invalid cart total");
    return;
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/create-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ amount: totalAmount })
  });

  const data = await res.json();

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: data.order.amount,
    currency: "INR",
    name: "FlexForge",
    description: "Cart Checkout",
    order_id: data.order.id,

    handler: async function (response) {
      await fetch(`${import.meta.env.VITE_API_URL}/api/payment/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          cartItems: cart
        })
      });

      clearCart();
      navigate("/profile/orders");
    }
  };

  new window.Razorpay(options).open();
};



  return (
    <section className="max-w-7xl mx-auto px-6 py-16 relative min-h-screen">
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-red-600 mb-3">Shop Equipment</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Premium calisthenics and gym gear built to push your limits.
        </p>
      </div>
      {/* Cart Button */}
      <button
        className="fixed top-24 right-8 z-50 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg transition-all hover:scale-105"
        onClick={() => document.getElementById("cart-modal").showModal()}
      >
        <ShoppingCart size={20} />
        <span>Cart ({cart.length})</span>
      </button>
      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center py-20">
          <Loader2 className="animate-spin text-red-500 mb-4" size={48} />
          <p className="text-gray-600">Loading products...</p>
        </div>
      )}
      {/* Error */}
      {error && (
        <div className="flex flex-col items-center py-20">
          <AlertCircle className="text-red-500 mb-4" size={48} />
          <p className="text-red-600 font-semibold mb-2">{error}</p>
          <button
            onClick={() => fetchProducts(page)}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      )}
      {/* Products Grid */}
      {!loading && !error && products.length > 0 && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/equipment/${item._id}`)}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="h-56 overflow-hidden relative">
                  {item.discountPrice && (
  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow">
    {Math.round(((item.price - item.discountPrice) / item.price) * 100)}% OFF
  </span>
)}
                  <img
                    src={
                      item.images?.[0]?.url ||
                      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800"
                    }
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-110 transition"
                  />
                </div>

               <div className="p-6 flex flex-col h-full">

  <div className="flex items-center gap-2 text-red-500 mb-2">
    {getCategoryIcon(item.category)}
    <span className="text-xs font-semibold uppercase">
      {item.category}
    </span>
  </div>

  <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
    {item.title}
  </h3>

  <div className="mb-4 flex items-center gap-2">
    {item.discountPrice ? (
      <>
        <span className="text-red-600 font-bold text-lg">
          ₹{item.discountPrice}
        </span>
        <span className="text-sm line-through text-gray-500">
          ₹{item.price}
        </span>
      </>
    ) : (
      <span className="font-bold text-lg">₹{item.price}</span>
    )}
  </div>

  <button
    onClick={(e) => {
      e.stopPropagation();
      addToCart(item);
    }}
    disabled={
      item.stock === 0 || cart.some((c) => c._id === item._id)
    }
    className={` py-2 rounded-lg font-semibold ${
      item.stock === 0
        ? "bg-gray-300"
        : cart.some((c) => c._id === item._id)
        ? "bg-green-500 text-white"
        : "bg-red-500 text-white hover:bg-red-600"
    }`}
  >
    {item.stock === 0
      ? "Out of Stock"
      : cart.some((c) => c._id === item._id)
      ? "Added"
      : "Add to Cart"}
  </button>

</div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-14 flex-wrap">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-4 py-2 rounded-lg ${
                    page === i + 1 ? "bg-red-500 text-white" : "bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
      {/* CART MODAL */}{" "}
      <dialog
        id="cart-modal"
        className="rounded-xl p-6 bg-white w-[90%] md:w-[500px] shadow-xl backdrop:bg-black/50"
      >
        {" "}
        <div className="flex justify-between items-center mb-6">
          {" "}
          <h2 className="text-2xl font-bold text-gray-900">Your Cart</h2>{" "}
          <button
            onClick={() => document.getElementById("cart-modal").close()}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
          >
            {" "}
            ×{" "}
          </button>{" "}
        </div>{" "}
        {cart.length === 0 ? (
          <div className="text-center py-8">
            {" "}
            <ShoppingCart
              className="mx-auto text-gray-400 mb-4"
              size={48}
            />{" "}
            <p className="text-gray-600">Your cart is empty.</p>{" "}
            <button
              onClick={() => document.getElementById("cart-modal").close()}
              className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
            >
              {" "}
              Continue Shopping{" "}
            </button>{" "}
          </div>
        ) : (
          <div className="space-y-4">
            {" "}
            <div className="max-h-96 overflow-y-auto space-y-4">
              {" "}
              {cart.map((item) => (
                <div key={item._id} className="flex gap-4 border-b pb-4">
                  {" "}
                  <img
                    src={item.images?.[0]?.url}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />{" "}
                  <div className="flex-grow">
                    {" "}
                    <p className="font-semibold text-gray-800">
                      {item.title}
                    </p>{" "}
                    <p className="text-sm text-gray-500">{item.brand}</p>{" "}
                    <p className="text-sm font-bold text-red-600 mt-1">
                      {" "}
                      ₹{item.discountPrice || item.price}{" "}
                    </p>{" "}
                  </div>{" "}
                  <button
                    className="text-red-500 text-sm hover:text-red-700 font-semibold h-fit"
                    onClick={() => removeFromCart(item._id)}
                  >
                    {" "}
                    Remove{" "}
                  </button>{" "}
                </div>
              ))}{" "}
            </div>{" "}
            <div className="border-t pt-4 space-y-3">
              {" "}
              <div className="flex justify-between text-sm text-gray-600">
                {" "}
                <span>Subtotal</span> <span>₹{total}</span>{" "}
              </div>{" "}
              <div className="flex justify-between text-sm text-gray-600">
                {" "}
                <span>Shipping</span>{" "}
                <span className="text-green-600 font-semibold">FREE</span>{" "}
              </div>{" "}
              <div className="flex justify-between text-lg font-bold border-t pt-3">
                {" "}
                <span>Total</span>{" "}
                <span className="text-red-600">₹{total}</span>{" "}
              </div>{" "}
            </div>{" "}
            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-all hover:shadow-lg"
            >
              {" "}
              Proceed to Checkout{" "}
            </button>{" "}
          </div>
        )}{" "}
      </dialog>
    </section>
  );
};

export default Equipment;
