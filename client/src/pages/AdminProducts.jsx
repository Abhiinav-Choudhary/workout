import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Package,
  Plus,
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  X,
  Upload,
  ImagePlus,
  IndianRupee,
  Boxes,
  AlertCircle,
  CheckCircle2,
  Tag,
  Layers3,
  ChevronDown,
  ShoppingBag,
  XCircle,
} from "lucide-react";

const INITIAL_FORM = {
  title: "",
  description: "",
  price: "",
  discountPrice: "",
  category: "",
  brand: "",
  stock: "",
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [images, setImages] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/api/products`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch products.");
      }

      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (err) {
      console.error("Fetch products error:", err);
      setError(err.message || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  }, [API]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setImages([]);
    setEditingId(null);

    const input = document.getElementById("product-images");
    if (input) input.value = "";
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    setImages(selectedFiles);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title.trim() || !form.description.trim()) {
      setError("Please enter the product title and description.");
      return;
    }

    if (
      form.price === "" ||
      !Number.isFinite(Number(form.price)) ||
      Number(form.price) < 0
    ) {
      setError("Please enter a valid product price.");
      return;
    }

    if (
      form.discountPrice !== "" &&
      (!Number.isFinite(Number(form.discountPrice)) ||
        Number(form.discountPrice) < 0)
    ) {
      setError("Please enter a valid discount price.");
      return;
    }

    if (
      form.stock === "" ||
      !Number.isInteger(Number(form.stock)) ||
      Number(form.stock) < 0
    ) {
      setError("Stock must be a non-negative whole number.");
      return;
    }

    if (!form.category.trim()) {
      setError("Please enter a product category.");
      return;
    }

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    images.forEach((image) => {
      formData.append("images", image);
    });

    setSaving(true);

    try {
      const url = editingId
        ? `${API}/api/products/${editingId}`
        : `${API}/api/products`;

      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.success === false) {
        throw new Error(
          data.message ||
            `Failed to ${editingId ? "update" : "create"} product.`
        );
      }

      setSuccess(
        editingId
          ? "Product updated successfully."
          : "Product added successfully."
      );

      resetForm();
      await fetchProducts();
    } catch (err) {
      console.error("Save product error:", err);
      setError(err.message || "Unable to save product.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (product) => {
    setEditingId(product._id);

    setForm({
      title: product.title || "",
      description: product.description || "",
      price: String(product.price ?? ""),
      discountPrice: String(product.discountPrice ?? ""),
      category: product.category || "",
      brand: product.brand || "",
      stock: String(product.stock ?? ""),
    });

    // Existing image URLs are preserved by the backend unless your API
    // explicitly replaces images when no new files are uploaded.
    setImages([]);

    const input = document.getElementById("product-images");
    if (input) input.value = "";

    setError("");
    setSuccess("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async (id) => {
    const product = products.find((item) => item._id === id);
    const confirmed = window.confirm(
      `Delete "${product?.title || "this product"}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to delete product.");
      }

      setProducts((prev) => prev.filter((item) => item._id !== id));

      if (editingId === id) resetForm();

      setSuccess("Product deleted successfully.");
    } catch (err) {
      console.error("Delete product error:", err);
      setError(err.message || "Unable to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);

  const categories = useMemo(
    () =>
      [...new Set(products.map((p) => p.category).filter(Boolean))].sort(),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.title?.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "All" || product.category === categoryFilter;

      const stock = Number(product.stock) || 0;

      const matchesStock =
        stockFilter === "All" ||
        (stockFilter === "In stock" && stock > 5) ||
        (stockFilter === "Low stock" && stock > 0 && stock <= 5) ||
        (stockFilter === "Out of stock" && stock === 0);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, search, categoryFilter, stockFilter]);

  const stats = useMemo(() => {
    const totalStock = products.reduce(
      (sum, product) => sum + (Number(product.stock) || 0),
      0
    );

    return [
      {
        label: "Total Products",
        value: products.length,
        icon: Package,
        color: "bg-red-50 text-red-600",
      },
      {
        label: "Total Units",
        value: totalStock.toLocaleString("en-IN"),
        icon: Boxes,
        color: "bg-blue-50 text-blue-600",
      },
      {
        label: "Low Stock",
        value: products.filter(
          (product) =>
            Number(product.stock) > 0 && Number(product.stock) <= 5
        ).length,
        icon: AlertCircle,
        color: "bg-amber-50 text-amber-600",
      },
      {
        label: "Out of Stock",
        value: products.filter(
          (product) => Number(product.stock) === 0
        ).length,
        icon: ShoppingBag,
        color: "bg-gray-100 text-gray-600",
      },
    ];
  }, [products]);

  const stockBadge = (stockValue) => {
    const stock = Number(stockValue) || 0;

    if (stock === 0) {
      return {
        label: "Out of stock",
        style: "bg-red-50 text-red-700 ring-red-200",
        dot: "bg-red-500",
      };
    }

    if (stock <= 5) {
      return {
        label: "Low stock",
        style: "bg-amber-50 text-amber-700 ring-amber-200",
        dot: "bg-amber-500",
      };
    }

    return {
      label: "In stock",
      style: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      dot: "bg-emerald-500",
    };
  };

  const ProductImage = ({ product, className = "" }) => (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden bg-gray-100 ${className}`}
    >
      {product.images?.[0]?.url ? (
        <img
          src={product.images[0].url}
          alt={product.title || "Product"}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 hover:scale-105"
        />
      ) : (
        <Package size={28} className="text-gray-300" />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/80 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-7">
        {/* Header */}
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-red-600">
              <span className="h-2 w-2 rounded-full bg-red-600" />
              Store administration
            </div>

            <h1 className="text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
              Product <span className="text-red-600">Management</span>
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Manage your fitness equipment, pricing, images, and inventory.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              resetForm();
              document
                .getElementById("product-form")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 sm:self-auto"
          >
            <Plus size={18} />
            Add New Product
          </button>
        </header>

        {/* Alerts */}
        {error && (
          <div
            role="alert"
            className="flex items-start justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            <div className="flex items-start gap-3">
              <AlertCircle size={19} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
              className="rounded-lg p-1 hover:bg-red-100"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {success && (
          <div
            role="status"
            className="flex items-start justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 size={19} className="shrink-0" />
              <p>{success}</p>
            </div>
            <button
              type="button"
              onClick={() => setSuccess("")}
              aria-label="Dismiss success message"
              className="rounded-lg p-1 hover:bg-emerald-100"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Stats */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-200/60"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.label}
                    </p>
                    <p className="mt-3 text-3xl font-black tracking-tight text-gray-950">
                      {stat.value}
                    </p>
                  </div>

                  <div className={`rounded-xl p-3 ${stat.color}`}>
                    <Icon size={22} />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Add / Edit form */}
        <section
          id="product-form"
          className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
        >
          <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                {editingId ? <Pencil size={21} /> : <Plus size={22} />}
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-gray-950">
                  {editingId ? "Edit Product" : "Add New Product"}
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  {editingId
                    ? "Update product information below."
                    : "Fill in the details to add a product to your store."}
                </p>
              </div>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              >
                <X size={16} />
                <span className="hidden sm:inline">Cancel edit</span>
                <span className="sm:hidden">Cancel</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-6">
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-extrabold text-gray-900">
                <Tag size={16} className="text-red-600" />
                Basic information
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <div>
                  <label
                    htmlFor="product-title"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Product title <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="product-title"
                    value={form.title}
                    onChange={(e) => setField("title", e.target.value)}
                    placeholder="e.g. Professional Pull-up Bar"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="product-category"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Category <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="product-category"
                    value={form.category}
                    onChange={(e) => setField("category", e.target.value)}
                    placeholder="e.g. Strength Training"
                    required
                    list="product-categories"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-50"
                  />
                  <datalist id="product-categories">
                    {categories.map((category) => (
                      <option key={category} value={category} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label
                    htmlFor="product-brand"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Brand
                  </label>
                  <input
                    id="product-brand"
                    value={form.brand}
                    onChange={(e) => setField("brand", e.target.value)}
                    placeholder="e.g. FlexForge"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-50"
                  />
                </div>

                <div className="sm:col-span-2 xl:col-span-3">
                  <label
                    htmlFor="product-description"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Description <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="product-description"
                    value={form.description}
                    onChange={(e) => setField("description", e.target.value)}
                    placeholder="Describe the product, its features, material, and benefits..."
                    rows={4}
                    required
                    className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-50"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-extrabold text-gray-900">
                <IndianRupee size={17} className="text-red-600" />
                Pricing and inventory
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="product-price"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Regular price (₹) <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="product-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setField("price", e.target.value)}
                    placeholder="1499"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="product-discount"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Discount price (₹)
                  </label>
                  <input
                    id="product-discount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.discountPrice}
                    onChange={(e) =>
                      setField("discountPrice", e.target.value)
                    }
                    placeholder="Leave blank if not discounted"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="product-stock"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Available stock <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="product-stock"
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={(e) => setField("stock", e.target.value)}
                    placeholder="25"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-50"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-extrabold text-gray-900">
                <ImagePlus size={17} className="text-red-600" />
                Product images
              </h3>
              <p className="mb-4 text-xs leading-5 text-gray-500">
                Select one or more images. When editing, leave this empty to
                keep existing images if your backend supports that behavior.
              </p>

              <label
                htmlFor="product-images"
                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-5 py-8 text-center transition hover:border-red-300 hover:bg-red-50/40"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm">
                  <Upload size={22} />
                </div>
                <p className="mt-3 text-sm font-bold text-gray-800">
                  Click to upload product images
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Select multiple files if needed
                </p>
                <input
                  id="product-images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </label>

              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                  {images.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="h-28 w-full object-cover"
                      />
                      <p className="truncate px-2 py-2 text-xs font-medium text-gray-600">
                        {file.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {editingId && images.length === 0 && (
                <p className="mt-3 text-xs text-gray-500">
                  No new images selected. Existing images will be handled by
                  your backend update logic.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <RefreshCw size={17} className="animate-spin" />
                ) : editingId ? (
                  <CheckCircle2 size={17} />
                ) : (
                  <Plus size={18} />
                )}
                {saving
                  ? "Saving product..."
                  : editingId
                    ? "Save Changes"
                    : "Add Product"}
              </button>
            </div>
          </form>
        </section>

        {/* Product list */}
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5 sm:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-gray-950">
                  Your Products
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  View and manage the products available in your store.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-50 sm:w-60"
                  />
                </div>

                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    aria-label="Filter by category"
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-4 pr-10 text-sm font-semibold text-gray-700 outline-none focus:border-red-400 focus:ring-4 focus:ring-red-50 sm:w-48"
                  >
                    <option value="All">All categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>

                <div className="relative">
                  <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    aria-label="Filter by stock status"
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-4 pr-10 text-sm font-semibold text-gray-700 outline-none focus:border-red-400 focus:ring-4 focus:ring-red-50 sm:w-44"
                  >
                    <option value="All">All stock</option>
                    <option value="In stock">In stock</option>
                    <option value="Low stock">Low stock</option>
                    <option value="Out of stock">Out of stock</option>
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
              <p>
                Showing{" "}
                <span className="font-bold text-gray-900">
                  {filteredProducts.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-gray-900">
                  {products.length}
                </span>{" "}
                products
              </p>

              {(search ||
                categoryFilter !== "All" ||
                stockFilter !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategoryFilter("All");
                    setStockFilter("All");
                  }}
                  className="inline-flex items-center gap-1 font-bold text-red-600 hover:text-red-700"
                >
                  <XCircle size={14} />
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-8">
              <RefreshCw size={28} className="animate-spin text-red-600" />
              <p className="text-sm font-semibold text-gray-500">
                Loading your products...
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                <Package size={30} />
              </div>
              <h3 className="mt-5 text-lg font-extrabold text-gray-900">
                {products.length === 0
                  ? "No products yet"
                  : "No matching products"}
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                {products.length === 0
                  ? "Add your first product using the form above."
                  : "Try another search term or adjust the category and stock filters."}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/80 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Inventory</th>
                      <th className="px-6 py-4">Availability</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map((product) => {
                      const badge = stockBadge(product.stock);
                      const hasDiscount =
                        product.discountPrice !== "" &&
                        product.discountPrice != null &&
                        Number(product.discountPrice) > 0 &&
                        Number(product.discountPrice) < Number(product.price);

                      return (
                        <tr
                          key={product._id}
                          className="transition hover:bg-red-50/20"
                        >
                          <td className="px-6 py-4">
                            <div className="flex min-w-56 items-center gap-3">
                              <ProductImage
                                product={product}
                                className="h-16 w-16 rounded-xl"
                              />
                              <div className="min-w-0">
                                <p className="max-w-64 break-words font-bold text-gray-900">
                                  {product.title}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                  {product.brand || "No brand"}
                                </p>
                                <p className="mt-1 text-[11px] text-gray-400">
                                  ID: {product._id.slice(-8)}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-semibold text-gray-700">
                              <Layers3 size={13} />
                              {product.category || "Uncategorized"}
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-6 py-4">
                            <p className="font-extrabold text-gray-950">
                              {formatCurrency(
                                hasDiscount
                                  ? product.discountPrice
                                  : product.price
                              )}
                            </p>
                            {hasDiscount && (
                              <p className="mt-1 text-xs text-gray-400 line-through">
                                {formatCurrency(product.price)}
                              </p>
                            )}
                          </td>

                          <td className="whitespace-nowrap px-6 py-4">
                            <p className="font-bold text-gray-900">
                              {Number(product.stock) || 0} units
                            </p>
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold ring-1 ring-inset ${badge.style}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${badge.dot}`}
                              />
                              {badge.label}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => startEdit(product)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                              >
                                <Pencil size={14} />
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() => deleteProduct(product._id)}
                                disabled={deletingId === product._id}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                              >
                                {deletingId === product._id ? (
                                  <RefreshCw
                                    size={14}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Trash2 size={14} />
                                )}
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile and tablet product cards */}
              <div className="grid grid-cols-1 gap-4 bg-gray-50/50 p-4 sm:grid-cols-2 sm:p-5 lg:hidden">
                {filteredProducts.map((product) => {
                  const badge = stockBadge(product.stock);
                  const hasDiscount =
                    product.discountPrice !== "" &&
                    product.discountPrice != null &&
                    Number(product.discountPrice) > 0 &&
                    Number(product.discountPrice) < Number(product.price);

                  return (
                    <article
                      key={product._id}
                      className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
                    >
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        <ProductImage
                          product={product}
                          className="h-full w-full"
                        />

                        <span
                          className={`absolute left-3 top-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm ring-1 ring-inset ${badge.style}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${badge.dot}`}
                          />
                          {badge.label}
                        </span>

                        {hasDiscount && (
                          <span className="absolute right-3 top-3 rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-bold text-white shadow-sm">
                            SALE
                          </span>
                        )}
                      </div>

                      <div className="space-y-4 p-4">
                        <div>
                          <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-[11px] font-bold text-gray-600">
                            <Layers3 size={12} />
                            {product.category || "Uncategorized"}
                          </span>

                          <h3 className="mt-3 line-clamp-2 text-lg font-extrabold text-gray-950">
                            {product.title}
                          </h3>

                          <p className="mt-1 text-xs text-gray-500">
                            {product.brand || "No brand"}
                          </p>
                        </div>

                        <div className="flex items-end justify-between gap-3 border-t border-gray-100 pt-3">
                          <div>
                            <p className="text-xs text-gray-500">Price</p>
                            <p className="mt-1 text-xl font-black text-red-600">
                              {formatCurrency(
                                hasDiscount
                                  ? product.discountPrice
                                  : product.price
                              )}
                            </p>
                            {hasDiscount && (
                              <p className="text-xs text-gray-400 line-through">
                                {formatCurrency(product.price)}
                              </p>
                            )}
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-gray-500">Available</p>
                            <p className="mt-1 text-lg font-extrabold text-gray-900">
                              {Number(product.stock) || 0}
                            </p>
                            <p className="text-[11px] text-gray-400">units</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">
                          <button
                            type="button"
                            onClick={() => startEdit(product)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-950 py-2.5 text-sm font-bold text-white transition hover:bg-gray-800"
                          >
                            <Pencil size={15} />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteProduct(product._id)}
                            disabled={deletingId === product._id}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                          >
                            {deletingId === product._id ? (
                              <RefreshCw
                                size={15}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2 size={15} />
                            )}
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}

          {!loading && products.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-gray-100 px-5 py-4 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p>
                Displaying {filteredProducts.length} of {products.length} products.
              </p>
              <button
                type="button"
                onClick={fetchProducts}
                className="inline-flex items-center gap-1.5 self-start font-bold text-red-600 hover:text-red-700 sm:self-auto"
              >
                <RefreshCw size={13} />
                Refresh list
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminProducts;
