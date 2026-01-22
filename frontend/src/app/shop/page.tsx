"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, Heart, Star, ShoppingCart, Grid, CircleDot, Shirt, Briefcase, Footprints } from "lucide-react";

type Category = "all" | "paddles" | "balls" | "apparel" | "accessories" | "footwear";

interface Product {
  id: string;
  name: string;
  category: Exclude<Category, "all">;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  isNew?: boolean;
  isSale?: boolean;
}

const categories: { id: Category; label: string; icon: React.ReactNode }[] = [
  { id: "all", label: "All", icon: <Grid className="w-4 h-4" /> },
  { id: "paddles", label: "Paddles", icon: <span className="text-sm">🏓</span> },
  { id: "balls", label: "Balls", icon: <CircleDot className="w-4 h-4" /> },
  { id: "apparel", label: "Apparel", icon: <Shirt className="w-4 h-4" /> },
  { id: "accessories", label: "Accessories", icon: <Briefcase className="w-4 h-4" /> },
  { id: "footwear", label: "Footwear", icon: <Footprints className="w-4 h-4" /> },
];

const products: Product[] = [
  {
    id: "1",
    name: "Pro Carbon Paddle",
    category: "paddles",
    price: 2499,
    originalPrice: 2999,
    rating: 4.8,
    reviews: 124,
    image: "https://placehold.co/400x400/0a56a7/white?text=Paddle",
    isSale: true,
  },
  {
    id: "2",
    name: "Tournament Paddle Elite",
    category: "paddles",
    price: 3299,
    rating: 4.9,
    reviews: 89,
    image: "https://placehold.co/400x400/0a56a7/white?text=Paddle+Elite",
    isNew: true,
  },
  {
    id: "3",
    name: "Outdoor Pickleballs (6-pack)",
    category: "balls",
    price: 599,
    rating: 4.5,
    reviews: 203,
    image: "https://placehold.co/400x400/a3ff01/0a56a7?text=Balls",
  },
  {
    id: "4",
    name: "Indoor Pro Balls (12-pack)",
    category: "balls",
    price: 899,
    originalPrice: 1099,
    rating: 4.7,
    reviews: 156,
    image: "https://placehold.co/400x400/a3ff01/0a56a7?text=Pro+Balls",
    isSale: true,
  },
  {
    id: "5",
    name: "PicklePlay Performance Tee",
    category: "apparel",
    price: 799,
    rating: 4.6,
    reviews: 78,
    image: "https://placehold.co/400x400/0a56a7/white?text=Tee",
    isNew: true,
  },
  {
    id: "6",
    name: "Dri-Fit Shorts",
    category: "apparel",
    price: 699,
    rating: 4.4,
    reviews: 92,
    image: "https://placehold.co/400x400/0a56a7/white?text=Shorts",
  },
  {
    id: "7",
    name: "Paddle Carry Bag",
    category: "accessories",
    price: 1299,
    rating: 4.7,
    reviews: 67,
    image: "https://placehold.co/400x400/333/white?text=Bag",
  },
  {
    id: "8",
    name: "Court Shoes Pro",
    category: "footwear",
    price: 2999,
    originalPrice: 3499,
    rating: 4.8,
    reviews: 145,
    image: "https://placehold.co/400x400/0a56a7/white?text=Shoes",
    isSale: true,
  },
];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "newest">("featured");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [addedToCart, setAddedToCart] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered = [...filtered].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return filtered;
  }, [selectedCategory, searchQuery, sortBy]);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddToCart = (id: string) => {
    setAddedToCart(id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a56a7]/15 via-blue-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-[#0a56a7] py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">PicklePlay Shop</h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Gear up for your next game with premium paddles, balls, apparel, and accessories.
          </p>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 py-4">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0a56a7] focus:ring-2 focus:ring-[#0a56a7]/20 outline-none transition"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0a56a7] focus:ring-2 focus:ring-[#0a56a7]/20 outline-none bg-white transition"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </section>

      {/* Category Chips */}
      <section className="py-6 bg-white/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? "bg-[#0a56a7] text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-[#0a56a7] hover:text-[#0a56a7]"
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No products found. Try a different search or category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.isSale && (
                        <span className="bg-[#a3ff01] text-[#0a56a7] text-xs font-bold px-2 py-1 rounded-full">
                          SALE
                        </span>
                      )}
                      {product.isNew && (
                        <span className="bg-[#0a56a7] text-white text-xs font-bold px-2 py-1 rounded-full">
                          NEW
                        </span>
                      )}
                    </div>

                    {/* Wishlist */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white transition"
                    >
                      <Heart
                        className={`w-5 h-5 transition ${
                          wishlist.has(product.id) ? "fill-red-500 text-red-500" : "text-gray-400"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{product.category}</p>
                    <h3 className="font-semibold text-gray-900 text-lg leading-tight">{product.name}</h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">
                        ({product.reviews})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-[#0a56a7]">₱{product.price.toLocaleString()}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ₱{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart */}
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className="w-full mt-3 py-2.5 bg-gradient-to-r from-[#0a56a7] to-blue-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:from-[#0a56a7]/90 transition-all"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {addedToCart === product.id ? "Added!" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More */}
          {filteredProducts.length > 0 && (
            <div className="text-center mt-12">
              <button className="px-8 py-3 border-2 border-[#0a56a7] text-[#0a56a7] font-semibold rounded-full hover:bg-[#0a56a7] hover:text-white transition-all">
                Load More Products
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
