import React, { useEffect, useState } from "react";

const AdminProducts = () => {

  const [products, setProducts] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");
  const [images, setImages] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    const res = await fetch(`${API}/api/products`);
    const data = await res.json();
    setProducts(data.products);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const createProduct = async () => {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("discountPrice", discountPrice);
    formData.append("category", category);
    formData.append("brand", brand);
    formData.append("stock", stock);

    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    await fetch(`${API}/api/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    resetForm();
    fetchProducts();
  };

  const updateProduct = async () => {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("discountPrice", discountPrice);
    formData.append("category", category);
    formData.append("brand", brand);
    formData.append("stock", stock);

    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    await fetch(`${API}/api/products/${editingId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    resetForm();
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    await fetch(`${API}/api/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    fetchProducts();
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setTitle(product.title);
    setDescription(product.description);
    setPrice(product.price);
    setDiscountPrice(product.discountPrice || "");
    setCategory(product.category);
    setBrand(product.brand || "");
    setStock(product.stock);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setPrice("");
    setDiscountPrice("");
    setCategory("");
    setBrand("");
    setStock("");
    setImages([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

      <h1 className="text-2xl sm:text-3xl font-bold mb-6">
        Product Management
      </h1>

      {/* 🔥 FORM */}
      <div className="bg-white shadow rounded-xl p-4 sm:p-6 mb-8">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

          <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" className="border p-2 rounded"/>

          <input value={category} onChange={(e)=>setCategory(e.target.value)} placeholder="Category" className="border p-2 rounded"/>

          <input value={price} onChange={(e)=>setPrice(e.target.value)} placeholder="Price" type="number" className="border p-2 rounded"/>

          <input value={discountPrice} onChange={(e)=>setDiscountPrice(e.target.value)} placeholder="Discount Price" type="number" className="border p-2 rounded"/>

          <input value={brand} onChange={(e)=>setBrand(e.target.value)} placeholder="Brand" className="border p-2 rounded"/>

          <input value={stock} onChange={(e)=>setStock(e.target.value)} placeholder="Stock" type="number" className="border p-2 rounded"/>

          <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Description" className="border p-2 rounded sm:col-span-2 lg:col-span-3"/>

          <input type="file" multiple onChange={(e)=>setImages(e.target.files)} className="border p-2 rounded sm:col-span-2 lg:col-span-3"/>

          <button
            onClick={editingId ? updateProduct : createProduct}
            className={`${
              editingId ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"
            } text-white py-2 rounded sm:col-span-2 lg:col-span-3 transition`}
          >
            {editingId ? "Update Product" : "Add Product"}
          </button>

        </div>

      </div>

      {/* 🔥 DESKTOP TABLE */}
      <div className="hidden md:block bg-white shadow rounded-xl overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Title</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map(product => (
              <tr key={product._id} className="border-b">

                <td className="p-3">
                  <img src={product.images?.[0]?.url} className="w-14 h-14 object-cover rounded"/>
                </td>

                <td className="p-3">{product.title}</td>

                <td className="p-3 text-red-600 font-semibold">₹{product.price}</td>

                <td className="p-3">{product.stock}</td>

                <td className="p-3 flex gap-2">
                  <button onClick={()=>startEdit(product)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                  <button onClick={()=>deleteProduct(product._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* 🔥 MOBILE CARDS */}
      <div className="md:hidden space-y-4">

        {products.map(product => (
          <div key={product._id} className="bg-white shadow rounded-xl p-4 space-y-3">

            <img src={product.images?.[0]?.url} className="w-full h-40 object-cover rounded"/>

            <h2 className="font-semibold">{product.title}</h2>

            <p className="text-red-600 font-bold">₹{product.price}</p>

            <p className="text-sm text-gray-600">Stock: {product.stock}</p>

            <div className="flex gap-2">
              <button onClick={()=>startEdit(product)} className="flex-1 bg-yellow-500 text-white py-2 rounded">Edit</button>
              <button onClick={()=>deleteProduct(product._id)} className="flex-1 bg-red-500 text-white py-2 rounded">Delete</button>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default AdminProducts;