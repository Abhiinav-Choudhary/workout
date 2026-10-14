
import React, { useState } from "react";
import { Filter, ChevronDown, X, Search, RotateCcw } from "lucide-react";

const EquipmentSearchFilter = ({
  filters,
  onFilterChange,
  categories = [],
  brands = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeCount = [
    filters.search,
    filters.category,
    filters.brand,
    filters.minPrice,
    filters.maxPrice,
    filters.sort !== "newest" ? filters.sort : "",
  ].filter(Boolean).length;

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

  const toggleTag = (key, value) => {
    updateFilter(key, filters[key] === value ? "" : value);
  };

  const tagClass = (selected) =>
    `rounded-full border px-4 py-2 text-sm font-medium transition ${
      selected
        ? "border-red-600 bg-red-600 text-white shadow-sm"
        : "border-gray-200 bg-white text-gray-600 hover:border-red-300 hover:text-red-600"
    }`;

  return (
    <div className="mb-10">
      {/* Filter button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Find your gear
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Search and filter equipment to match your needs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 font-semibold transition ${
            isOpen || activeCount > 0
              ? "border-red-600 bg-red-600 text-white"
              : "border-gray-200 bg-white text-gray-800 hover:border-red-400 hover:text-red-600"
          }`}
        >
          <Filter size={18} />
          Filters
          {activeCount > 0 && (
            <span className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs ${
              isOpen || activeCount > 0
                ? "bg-white text-red-600"
                : "bg-red-600 text-white"
            }`}>
              {activeCount}
            </span>
          )}
          <ChevronDown
            size={17}
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Expandable filters */}
      {isOpen && (
        <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-gray-900">Filter equipment</h3>
              <p className="mt-1 text-sm text-gray-500">
                Narrow down your results.
              </p>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700"
            >
              <RotateCcw size={15} />
              Clear all
            </button>
          </div>

          {/* Search */}
          <div className="mb-7">
            <label
              htmlFor="equipment-search"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Search equipment
            </label>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                id="equipment-search"
                type="search"
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                placeholder="Search by equipment name..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100"
              />
            </div>
          </div>

          {/* Category tags */}
          {categories.length > 0 && (
            <div className="mb-7">
              <h4 className="mb-3 text-sm font-semibold text-gray-700">
                Category
              </h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const value =
                    typeof category === "string"
                      ? category
                      : category.name ?? category.category ?? category.value;

                  if (!value) return null;

                  return (
                    <button
                      type="button"
                      key={value}
                      onClick={() => toggleTag("category", value)}
                      aria-pressed={filters.category === value}
                      className={tagClass(filters.category === value)}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Brand tags */}
          {brands.length > 0 && (
            <div className="mb-7">
              <h4 className="mb-3 text-sm font-semibold text-gray-700">
                Brand
              </h4>
              <div className="flex flex-wrap gap-2">
                {brands.map((brand) => {
                  const value =
                    typeof brand === "string"
                      ? brand
                      : brand.name ?? brand.brand ?? brand.value;

                  if (!value) return null;

                  return (
                    <button
                      type="button"
                      key={value}
                      onClick={() => toggleTag("brand", value)}
                      aria-pressed={filters.brand === value}
                      className={tagClass(filters.brand === value)}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Price range and sorting */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label
                htmlFor="min-price"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Minimum price (₹)
              </label>
              <input
                id="min-price"
                type="number"
                min="0"
                value={filters.minPrice}
                onChange={(e) => updateFilter("minPrice", e.target.value)}
                placeholder="0"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </div>

            <div>
              <label
                htmlFor="max-price"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Maximum price (₹)
              </label>
              <input
                id="max-price"
                type="number"
                min="0"
                value={filters.maxPrice}
                onChange={(e) => updateFilter("maxPrice", e.target.value)}
                placeholder="No limit"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </div>

            <div>
              <label
                htmlFor="equipment-sort"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Sort by
              </label>
              <select
                id="equipment-sort"
                value={filters.sort}
                onChange={(e) => updateFilter("sort", e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              >
                <option value="newest">Newest first</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Selected filter tags */}
          {activeCount > 0 && (
            <div className="mt-6 border-t border-gray-100 pt-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Active filters
              </p>
              <div className="flex flex-wrap gap-2">
                {filters.search && (
                  <button
                    type="button"
                    onClick={() => updateFilter("search", "")}
                    className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700"
                  >
                    Search: {filters.search}
                    <X size={13} />
                  </button>
                )}

                {filters.category && (
                  <button
                    type="button"
                    onClick={() => updateFilter("category", "")}
                    className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700"
                  >
                    {filters.category}
                    <X size={13} />
                  </button>
                )}

                {filters.brand && (
                  <button
                    type="button"
                    onClick={() => updateFilter("brand", "")}
                    className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700"
                  >
                    {filters.brand}
                    <X size={13} />
                  </button>
                )}

                {filters.minPrice && (
                  <button
                    type="button"
                    onClick={() => updateFilter("minPrice", "")}
                    className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700"
                  >
                    Min ₹{filters.minPrice}
                    <X size={13} />
                  </button>
                )}

                {filters.maxPrice && (
                  <button
                    type="button"
                    onClick={() => updateFilter("maxPrice", "")}
                    className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700"
                  >
                    Max ₹{filters.maxPrice}
                    <X size={13} />
                  </button>
                )}

                {filters.sort !== "newest" && (
                  <button
                    type="button"
                    onClick={() => updateFilter("sort", "newest")}
                    className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700"
                  >
                    Sort: {filters.sort}
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EquipmentSearchFilter;
