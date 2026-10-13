import React from "react";
import {
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

const EquipmentSearchFilter = ({
  filters,
  onFilterChange,
  categories,
  brands,
}) => {
  const updateFilter = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const resetFilters = () => {
    onFilterChange({
      search: "",
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      sort: "newest",
    });
  };

  const hasFilters =
    filters.search ||
    filters.category ||
    filters.brand ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.sort !== "newest";

  return (
    <section className="mb-10 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <SlidersHorizontal className="text-red-500" size={21} />
        <h2 className="text-lg font-bold text-gray-900">
          Find Your Equipment
        </h2>
      </div>

      {/* Search by name */}
      <div className="relative mb-5">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />

        <input
          type="search"
          value={filters.search}
          onChange={(e) =>
            updateFilter("search", e.target.value)
          }
          placeholder="Search equipment by name..."
          className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
        />
      </div>

      {/* Category, brand and sorting */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <select
          value={filters.category}
          onChange={(e) =>
            updateFilter("category", e.target.value)
          }
          className="rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-red-500"
        >
          <option value="">All Categories</option>

          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={filters.brand}
          onChange={(e) =>
            updateFilter("brand", e.target.value)
          }
          className="rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-red-500"
        >
          <option value="">All Brands</option>

          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>

        <select
          value={filters.sort}
          onChange={(e) =>
            updateFilter("sort", e.target.value)
          }
          className="rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-red-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A to Z</option>
          <option value="name_desc">Name: Z to A</option>
        </select>

        <input
          type="number"
          min="0"
          placeholder="Minimum price (₹)"
          value={filters.minPrice}
          onChange={(e) =>
            updateFilter("minPrice", e.target.value)
          }
          className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-red-500"
        />

        <input
          type="number"
          min="0"
          placeholder="Maximum price (₹)"
          value={filters.maxPrice}
          onChange={(e) =>
            updateFilter("maxPrice", e.target.value)
          }
          className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-red-500"
        />

        <button
          type="button"
          onClick={resetFilters}
          disabled={!hasFilters}
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <X size={18} />
          Clear Filters
        </button>
      </div>
    </section>
  );
};

export default EquipmentSearchFilter;
