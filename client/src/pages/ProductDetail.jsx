import React, { useState, useEffect } from "react";
import { useParams, useNavigate , useLocation } from "react-router-dom";
import { 
  ChevronLeft, 
  ChevronRight, 
  ShoppingCart, 
  Star, 
  Package, 
  Truck, 
  Shield,
  Loader2,
  AlertCircle,
  ArrowLeft
} from "lucide-react";

const ProductDetail = () => {
     const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem("token");

  const API_URL = `${import.meta.env.VITE_API_URL}/api/products`;

  useEffect(() => {
    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch product details
      const productRes = await fetch(`${API_URL}/${id}`);
      const productData = await productRes.json();

      if (productData.success) {
        setProduct(productData.product);
        
        // Fetch recommendations based on category
        if (productData.product.category) {
          const recRes = await fetch(`${API_URL}/category/${encodeURIComponent(productData.product.category)}`);
          const recData = await recRes.json();
          
          if (recData.success) {
            // Filter out current product from recommendations
            const filtered = recData.products.filter(p => p._id !== id);
            setRecommendations(filtered.slice(0, 4));
          }
        }
      } else {
        setProduct(productData.product || productData);
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (product?.images?.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product?.images?.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  

// const handleCheckout = async () => {
//   if (!isAuthenticated) {
//     navigate("/login", { state: { from: location.pathname } });
//     return;
//   }

//   const token = localStorage.getItem("token");
//   const amount = (product.discountPrice || product.price) * quantity;

//   // 1️⃣ Create Razorpay order (backend)
//   const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/create-order`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`
//     },
//     body: JSON.stringify({ amount })
//   });

//   const data = await res.json();

//   if (!data.success) {
//     alert("Payment initiation failed");
//     return;
//   }

//   // 2️⃣ Open Razorpay UI
//   const options = {
//     key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
//     amount: data.order.amount,
//     currency: "INR",
//     name: "FlexForge",
//     description: product.title,
//     order_id: data.order.id,

//     handler: async function (response) {
//       // 3️⃣ Verify payment
//       await fetch(`${import.meta.env.VITE_API_URL}/api/payment/verify`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//       body: JSON.stringify({
//    razorpay_order_id: response.razorpay_order_id,
//       razorpay_payment_id: response.razorpay_payment_id,
//       razorpay_signature: response.razorpay_signature,
//       productId: product._id,
//       quantity
// })


//       });

//       alert("Payment successful!");
//       navigate("/profile/orders");
//     },

//     theme: {
//       color: "#ef4444"
//     }
//   };

//   const razorpay = new window.Razorpay(options);
//   razorpay.open();
// };



  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-red-500 mb-4" size={48} />
        <p className="text-gray-600">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <p className="text-red-600 font-semibold mb-4">{error || "Product not found"}</p>
        <button
          onClick={() => navigate("/equipment")}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
        >
          Back to Equipment
        </button>
      </div>
    );
  }

  const images = product.images || [];
  const currentImage = images[currentImageIndex]?.url || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800";

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
        
      {/* Back Button */}
      <button
        onClick={() => navigate("/equipment")}
        className="flex items-center gap-2 text-gray-600 hover:text-red-500 mb-6 transition"
      >
        <ArrowLeft size={20} />
        <span>Back to Equipment</span>
      </button>

    
    
      {/* Product Section */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {/* Image Carousel */}
        <div className="space-y-4">
          <div className="relative bg-gray-100 rounded-2xl overflow-hidden aspect-square">
            <img
              src={currentImage}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition shadow-lg"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition shadow-lg"
                >
                  <ChevronRight size={24} />
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition ${
                        index === currentImageIndex ? "bg-red-500 w-8" : "bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {product.discountPrice && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition ${
                    index === currentImageIndex ? "border-red-500" : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img src={img.url} alt={`${product.title} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Category & Brand */}
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-semibold">
              {product.category}
            </span>
            {product.brand && (
              <span className="text-gray-500 text-sm">by {product.brand}</span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900">{product.title}</h1>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="font-semibold">{product.rating}</span>
              {product.reviews?.length > 0 && (
                <span className="text-gray-500">({product.reviews.length} reviews)</span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-4">
            {product.discountPrice ? (
              <>
                <span className="text-4xl font-bold text-red-600">₹{product.discountPrice}</span>
                <span className="text-2xl text-gray-500 line-through">₹{product.price}</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">
                  Save ₹{product.price - product.discountPrice}
                </span>
              </>
            ) : (
              <span className="text-4xl font-bold text-gray-900">₹{product.price}</span>
            )}
          </div>

          {/* Description */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-3">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <Package size={20} className={product.stock > 0 ? "text-green-500" : "text-red-500"} />
            {product.stock > 0 ? (
              <span className="text-green-600 font-semibold">
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-red-600 font-semibold">Out of Stock</span>
            )}
          </div>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4">
              <span className="font-semibold">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100 transition"
                >
                  -
                </button>
                <span className="px-6 py-2 border-x">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-2 hover:bg-gray-100 transition"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => navigate("/checkout", {
                 state: {
                product,
                isBuyNow: true
                     }
                    })
                    }
              disabled={product.stock === 0}
              className={`flex-1 py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                product.stock === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl"
              }`}
            >
              <ShoppingCart size={24} />
              {product.stock === 0
               ? "Out of Stock"
                : isAuthenticated
                 ? "Buy Now"
                 : "Sign in to Buy"}
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t">
            <div className="text-center">
              <Truck className="mx-auto mb-2 text-red-500" size={32} />
              <p className="text-sm font-semibold">Free Shipping</p>
              <p className="text-xs text-gray-500">On orders over ₹2000</p>
            </div>
            <div className="text-center">
              <Shield className="mx-auto mb-2 text-red-500" size={32} />
              <p className="text-sm font-semibold">Warranty</p>
              <p className="text-xs text-gray-500">1 Year Coverage</p>
            </div>
            <div className="text-center">
              <Package className="mx-auto mb-2 text-red-500" size={32} />
              <p className="text-sm font-semibold">Easy Returns</p>
              <p className="text-xs text-gray-500">30 Days Return</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>
          <div className="space-y-6">
            {product.reviews.map((review, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-900">{review.user}</span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold mb-8">You May Also Like</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((item) => (
              <div
                key={item._id}
                onClick={() => {
    navigate(`/equipment/${item._id}`);
    window.scrollTo(0, 0);
  }}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1 overflow-hidden group"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.images?.[0]?.url || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{item.title}</h3>
                  <div className="flex items-center justify-between">
                    {item.discountPrice ? (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-red-600">₹{item.discountPrice}</span>
                        <span className="text-sm text-gray-500 line-through">₹{item.price}</span>
                      </div>
                    ) : (
                      <span className="font-bold text-gray-900">₹{item.price}</span>
                    )}
                    {item.rating && (
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{item.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;