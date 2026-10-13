
import React, { useState } from "react";
import { useCart } from "../context/cartContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  Truck,
  UserRound,
  Phone,
  LoaderCircle,
} from "lucide-react";

const Checkout = () => {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const isBuyNow = location.state?.isBuyNow;
  const product = location.state?.product;

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const checkoutItems = isBuyNow
    ? product
      ? [{ ...product, quantity: 1 }]
      : []
    : cart;

  const finalAmount = isBuyNow
    ? Number(product?.discountPrice ?? product?.price ?? 0)
    : Number(total ?? 0);

  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = "Please enter your full name.";
    }

    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      nextErrors.phone = "Enter a valid 10-digit Indian mobile number.";
    }

    if (!form.addressLine1.trim()) {
      nextErrors.addressLine1 = "Enter your street address.";
    }

    if (!form.city.trim()) {
      nextErrors.city = "Enter your city.";
    }

    if (!form.state.trim()) {
      nextErrors.state = "Enter your state.";
    }

    if (!/^\d{6}$/.test(form.pincode.trim())) {
      nextErrors.pincode = "Enter a valid 6-digit pincode.";
    }

    if (!checkoutItems.length) {
      nextErrors.cart = "Your order has no products.";
    }

    if (!Number.isFinite(finalAmount) || finalAmount <= 0) {
      nextErrors.amount = "Your order total is invalid.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePayment = async () => {
    if (loading || !validate()) return;

    if (!token) {
      navigate("/login");
      return;
    }

    if (!API || !import.meta.env.VITE_RAZORPAY_KEY_ID) {
      alert("Payment configuration is missing. Please try again later.");
      return;
    }

    if (!window.Razorpay) {
      alert("Payment gateway is unavailable. Please refresh the page.");
      return;
    }

    setLoading(true);

    try {
      const orderResponse = await fetch(
        `${API}/api/payment/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: finalAmount,
            cartItems: checkoutItems,
            shippingAddress: form,
          }),
        }
      );

      const orderData = await orderResponse.json();

      if (!orderResponse.ok || !orderData.success || !orderData.order) {
        throw new Error(orderData.message || "Unable to create your order.");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency || "INR",
        order_id: orderData.order.id,
        name: "FlexForge",
        description: "Your fitness equipment order",
        prefill: {
          name: form.fullName,
          contact: form.phone,
        },
        theme: {
          color: "#dc2626",
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
        handler: async (paymentResponse) => {
          try {
            const verifyResponse = await fetch(
              `${API}/api/payment/verify`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: paymentResponse.razorpay_order_id,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_signature: paymentResponse.razorpay_signature,
                }),
              }
            );

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok || !verifyData.success) {
              throw new Error(
                verifyData.message || "Payment verification failed."
              );
            }

            if (!isBuyNow) {
              clearCart();
            }

            alert("Payment successful! Your order has been placed.");
            navigate("/profile/orders");
          } catch (error) {
            console.error("Payment verification error:", error);
            alert(
              error.message ||
                "We couldn't verify your payment. Please contact support before retrying."
            );
          } finally {
            setLoading(false);
          }
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response) => {
        console.error("Payment failed:", response.error);
        setLoading(false);
        alert(
          response.error?.description ||
            "Payment failed. Please try again."
        );
      });

      razorpay.open();
    } catch (error) {
      console.error("Checkout error:", error);
      alert(error.message || "Something went wrong during checkout.");
      setLoading(false);
    }
  };

  const inputClass = (name) =>
    `w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-4 ${
      errors[name]
        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
        : "border-gray-200 focus:border-red-500 focus:ring-red-50"
    }`;

  const FieldError = ({ name }) =>
    errors[name] ? (
      <p className="mt-1.5 text-xs text-red-600">{errors[name]}</p>
    ) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("/equipment")}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-red-600"
          >
            <ArrowLeft size={18} />
            Continue shopping
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white">
              <DumbbellIcon />
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900">
              FLEX<span className="text-red-600">FORGE</span>
            </span>
          </div>

          <div className="hidden items-center gap-2 text-sm text-gray-500 sm:flex">
            <LockKeyhole size={16} className="text-green-600" />
            Secure checkout
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Page title */}
        <div className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-red-600">
            Almost there
          </p>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
            Complete your order
          </h1>
          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Add your delivery details and get ready to train.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8 flex max-w-md items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
            <CheckCircle2 size={20} />
            Cart
          </div>
          <div className="h-px flex-1 bg-red-300" />
          <div className="flex items-center gap-2 text-sm font-semibold text-red-600">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-xs text-white">
              2
            </span>
            Delivery
          </div>
          <div className="h-px flex-1 bg-gray-200" />
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <CreditCard size={18} />
            Payment
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Shipping form */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8 lg:col-span-7">
            <div className="mb-7 flex items-start gap-4 border-b border-gray-100 pb-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <MapPin size={23} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Shipping address
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Where should we deliver your equipment?
                </p>
              </div>
            </div>

            {errors.cart && (
              <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {errors.cart}
              </p>
            )}

            {errors.amount && (
              <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {errors.amount}
              </p>
            )}

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Full name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserRound
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="fullName"
                    name="fullName"
                    autoComplete="name"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`${inputClass("fullName")} pl-11`}
                  />
                </div>
                <FieldError name="fullName" />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Mobile number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    autoComplete="tel-national"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className={`${inputClass("phone")} pl-11`}
                  />
                </div>
                <FieldError name="phone" />
              </div>

              <div>
                <label
                  htmlFor="addressLine1"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Address line 1 <span className="text-red-500">*</span>
                </label>
                <input
                  id="addressLine1"
                  name="addressLine1"
                  autoComplete="address-line1"
                  value={form.addressLine1}
                  onChange={handleChange}
                  placeholder="House number, street, area"
                  className={inputClass("addressLine1")}
                />
                <FieldError name="addressLine1" />
              </div>

              <div>
                <label
                  htmlFor="addressLine2"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Address line 2{" "}
                  <span className="font-normal text-gray-400">
                    (Optional)
                  </span>
                </label>
                <input
                  id="addressLine2"
                  name="addressLine2"
                  autoComplete="address-line2"
                  value={form.addressLine2}
                  onChange={handleChange}
                  placeholder="Apartment, landmark, floor"
                  className={inputClass("addressLine2")}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="city"
                    name="city"
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Your city"
                    className={inputClass("city")}
                  />
                  <FieldError name="city" />
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="state"
                    name="state"
                    autoComplete="address-level1"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="Your state"
                    className={inputClass("state")}
                  />
                  <FieldError name="state" />
                </div>
              </div>

              <div className="sm:max-w-xs">
                <label
                  htmlFor="pincode"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  PIN code <span className="text-red-500">*</span>
                </label>
                <input
                  id="pincode"
                  name="pincode"
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="postal-code"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="6-digit PIN code"
                  className={inputClass("pincode")}
                />
                <FieldError name="pincode" />
              </div>
            </div>

            <div className="mt-8 flex items-start gap-3 rounded-xl bg-green-50 p-4">
              <ShieldCheck
                size={21}
                className="mt-0.5 shrink-0 text-green-700"
              />
              <div>
                <p className="text-sm font-semibold text-green-900">
                  Your information is protected
                </p>
                <p className="mt-1 text-xs leading-5 text-green-800">
                  Your shipping details are submitted securely to our server
                  for order processing.
                </p>
              </div>
            </div>
          </section>

          {/* Order summary */}
          <aside className="lg:sticky lg:top-6 lg:col-span-5">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="text-red-600" size={21} />
                  <h2 className="text-lg font-bold text-gray-900">
                    Order summary
                  </h2>
                </div>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
                  {checkoutItems.length}{" "}
                  {checkoutItems.length === 1 ? "item" : "items"}
                </span>
              </div>

              <div className="max-h-72 space-y-4 overflow-y-auto p-5 sm:px-6">
                {checkoutItems.map((item, index) => {
                  const price = Number(
                    item.discountPrice ?? item.price ?? 0
                  );
                  const quantity = Number(item.quantity ?? 1);

                  return (
                    <div
                      key={item._id || index}
                      className="flex gap-4"
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                        <img
                          src={item.images?.[0]?.url}
                          alt={item.title || "Equipment"}
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute -right-0.5 -top-0.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-gray-900 px-1.5 text-xs font-bold text-white">
                          {quantity}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
                          {item.title || "Fitness equipment"}
                        </h3>
                        <p className="mt-1 text-xs text-gray-500">
                          {item.category || "Training gear"}
                        </p>
                        <p className="mt-2 text-sm font-bold text-gray-900">
                          {formatPrice(price * quantity)}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {checkoutItems.length === 0 && (
                  <p className="py-6 text-center text-sm text-gray-500">
                    Your cart is empty.
                  </p>
                )}
              </div>

              <div className="space-y-4 border-t border-gray-100 bg-gray-50 p-5 sm:p-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(finalAmount)}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <Truck size={17} />
                    Shipping
                  </span>
                  <span className="font-semibold text-green-700">
                    FREE
                  </span>
                </div>

                <div className="border-t border-dashed border-gray-300 pt-4">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Total payable
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Inclusive of applicable charges
                      </p>
                    </div>
                    <p className="text-2xl font-black tracking-tight text-gray-900">
                      {formatPrice(finalAmount)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={loading || checkoutItems.length === 0}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-4 font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <LoaderCircle size={19} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <LockKeyhole size={18} />
                      Pay {formatPrice(finalAmount)}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <ShieldCheck size={15} className="text-green-600" />
                  Secure payment powered by Razorpay
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4">
              <Package size={20} className="mt-0.5 text-gray-500" />
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Ready for your next workout?
                </p>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Review your delivery information before completing your
                  payment.
                </p>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => navigate("/equipment")}
            className="text-sm font-medium text-gray-500 transition hover:text-red-600"
          >
            <ArrowLeft size={15} className="mr-1 inline" />
            Back to equipment
          </button>
        </div>
      </main>
    </div>
  );
};

const DumbbellIcon = () => (
  <svg
    width="21"
    height="21"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m6.5 6.5 11 11" />
    <path d="m21 21-1-1" />
    <path d="m3 3 1 1" />
    <path d="m18 22 4-4" />
    <path d="m2 6 4-4" />
    <path d="m3 10 7-7" />
    <path d="m14 21 7-7" />
  </svg>
);

export default Checkout;
