"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { Search, Heart, Star, ShoppingCart, Grid, CircleDot, Shirt, Briefcase, Footprints, Eye, X, ChevronDown } from "lucide-react";
import { useAuthModal } from "@/hooks/useAuthModal";
import pickleShopImage from "../../images/PickleShop.png";

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
  description?: string;
  features?: string[];
  specifications?: Record<string, string>;
  inStock?: boolean;
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
    description: "Professional-grade carbon fiber paddle with enhanced control and power.",
    features: ["Carbon fiber face", "Polypropylene core", "Comfort grip handle", "USAPA approved"],
    specifications: { weight: "8.2 oz", length: "15.5", width: "7.5", grip_size: "4.25" },
    inStock: true,
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
    description: "Elite tournament paddle designed for competitive players seeking maximum performance.",
    features: ["Hybrid composite face", "Honeycomb core", "Vibration dampening", "Tournament legal"],
    specifications: { weight: "8.0 oz", length: "16", width: "7.8", grip_size: "4.25" },
    inStock: true,
  },
  {
    id: "3",
    name: "Outdoor Pickleballs (6-pack)",
    category: "balls",
    price: 599,
    rating: 4.5,
    reviews: 203,
    image: "https://placehold.co/400x400/a3ff01/0a56a7?text=Balls",
    description: "Durable outdoor pickleballs designed for all-weather play.",
    features: ["40 precision holes", "Weather resistant", "Consistent bounce", "USA Pickleball approved"],
    specifications: { diameter: "2.87", weight: "0.88 oz", material: "Plastic", quantity: "6 balls" },
    inStock: true,
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
    description: "Professional indoor pickleballs with optimal hardness for indoor courts.",
    features: ["26 precision holes", "Soft construction", "Enhanced visibility", "Indoor optimized"],
    specifications: { diameter: "2.87", weight: "0.85 oz", material: "Soft plastic", quantity: "12 balls" },
    inStock: true,
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
    description: "Moisture-wicking performance tee designed for intense pickleball matches.",
    features: ["Dri-fit technology", "UV protection", "Athletic fit", "Quick-dry fabric"],
    specifications: { material: "Polyester blend", sizes: "S-XXL", colors: "5 colors", care: "Machine washable" },
    inStock: true,
  },
  {
    id: "6",
    name: "Dri-Fit Shorts",
    category: "apparel",
    price: 699,
    rating: 4.4,
    reviews: 92,
    image: "https://placehold.co/400x400/0a56a7/white?text=Shorts",
    description: "Comfortable athletic shorts with built-in compression liner.",
    features: ["Built-in liner", "Side pockets", "Elastic waistband", "Breathable mesh"],
    specifications: { material: "Polyester-spandex", inseam: "7", sizes: "S-XXL", colors: "3 colors" },
    inStock: true,
  },
  {
    id: "7",
    name: "Paddle Carry Bag",
    category: "accessories",
    price: 1299,
    rating: 4.7,
    reviews: 67,
    image: "https://placehold.co/400x400/333/white?text=Bag",
    description: "Spacious paddle bag with multiple compartments for all your gear.",
    features: ["Holds 2 paddles", "Ball compartment", "Shoulder strap", "Water resistant"],
    specifications: { capacity: "2 paddles + balls", material: "Nylon", dimensions: "31x12x8", weight: "1.2 lbs" },
    inStock: true,
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
    description: "Professional court shoes designed for pickleball's unique movements.",
    features: ["Non-marking sole", "Lateral support", "Cushioned insole", "Breathable upper"],
    specifications: { material: "Synthetic leather", sole: "Non-marking rubber", sizes: "7-13", width: "Medium" },
    inStock: true,
  },
  // Additional Products
  {
    id: "9",
    name: "Beginner Paddle Set",
    category: "paddles",
    price: 1899,
    rating: 4.3,
    reviews: 56,
    image: "https://placehold.co/400x400/0a56a7/white?text=Beginner+Set",
    description: "Complete starter set with 2 paddles and 4 balls perfect for beginners.",
    features: ["2 paddles included", "4 balls included", "Carrying case", "Instruction manual"],
    specifications: { paddles: "2", balls: "4", weight: "7.8 oz each", skill_level: "Beginner" },
    inStock: true,
  },
  {
    id: "10",
    name: "Graphite Power Paddle",
    category: "paddles",
    price: 2799,
    rating: 4.6,
    reviews: 112,
    image: "https://placehold.co/400x400/0a56a7/white?text=Graphite",
    description: "High-performance graphite paddle with power-focused design.",
    features: ["Graphite face", "Power core", "Extended handle", "Shock absorption"],
    specifications: { weight: "8.4 oz", length: "16", width: "7.9", grip_size: "4.5" },
    inStock: true,
  },
  {
    id: "11",
    name: "Championship Balls Box",
    category: "balls",
    price: 1599,
    rating: 4.8,
    reviews: 203,
    image: "https://placehold.co/400x400/a3ff01/0a56a7?text=Champ+Balls",
    isNew: true,
    description: "Professional grade balls in bulk for tournament play.",
    features: ["24 balls total", "Tournament quality", "Consistent bounce", "Durable construction"],
    specifications: { quantity: "24", type: "Outdoor", certification: "USA Pickleball", durability: "High" },
    inStock: true,
  },
  {
    id: "12",
    name: "Hybrid Training Balls",
    category: "balls",
    price: 749,
    rating: 4.2,
    reviews: 45,
    image: "https://placehold.co/400x400/a3ff01/0a56a7?text=Hybrid",
    description: "Versatile training balls suitable for both indoor and outdoor play.",
    features: ["Indoor/outdoor use", "Balanced hardness", "Good visibility", "Training optimized"],
    specifications: { quantity: "6", versatility: "Indoor/Outdoor", hardness: "Medium", visibility: "High" },
    inStock: true,
  },
  {
    id: "13",
    name: "Performance Hoodie",
    category: "apparel",
    price: 1199,
    rating: 4.7,
    reviews: 89,
    image: "https://placehold.co/400x400/0a56a7/white?text=Hoodie",
    description: "Warm and comfortable hoodie perfect for cooler playing conditions.",
    features: ["Fleece lining", "Thumbholes", "Kangaroo pocket", "Athletic cut"],
    specifications: { material: "Cotton-polyester", sizes: "S-XXL", colors: "4 colors", weight: "Medium" },
    inStock: true,
  },
  {
    id: "14",
    name: "Compression Leggings",
    category: "apparel",
    price: 899,
    rating: 4.5,
    reviews: 67,
    image: "https://placehold.co/400x400/0a56a7/white?text=Leggings",
    description: "High-compression leggings for enhanced performance and recovery.",
    features: ["Compression fit", "Moisture wicking", "Flatlock seams", "Wide waistband"],
    specifications: { material: "Spandex blend", inseam: "28", sizes: "XS-XXL", compression: "High" },
    inStock: true,
  },
  {
    id: "15",
    name: "Professional Towel",
    category: "accessories",
    price: 399,
    rating: 4.4,
    reviews: 34,
    image: "https://placehold.co/400x400/333/white?text=Towel",
    description: "Quick-dry microfiber towel perfect for courtside use.",
    features: ["Microfiber material", "Quick-dry", "Compact size", "Carrying pouch"],
    specifications: { material: "Microfiber", dimensions: "16x32", weight: "0.2 lbs", includes: "Pouch" },
    inStock: true,
  },
  {
    id: "16",
    name: "Ball Pickup Tube",
    category: "accessories",
    price: 699,
    rating: 4.6,
    reviews: 78,
    image: "https://placehold.co/400x400/333/white?text=Pickup",
    description: "Effortless ball pickup tube that holds up to 15 balls.",
    features: ["Holds 15 balls", "No bending required", "Durable construction", "Easy release"],
    specifications: { capacity: "15 balls", material: "Plastic", length: "42", diameter: "3" },
    inStock: true,
  },
  {
    id: "17",
    name: "Elite Court Shoes",
    category: "footwear",
    price: 3499,
    rating: 4.9,
    reviews: 156,
    image: "https://placehold.co/400x400/0a56a7/white?text=Elite+Shoes",
    isNew: true,
    description: "Premium court shoes with advanced cushioning and stability.",
    features: ["Advanced cushioning", "Ankle support", "Breathable mesh", "Durable outsole"],
    specifications: { material: "Synthetic mesh", cushioning: "Gel technology", sizes: "6-14", width: "Multiple" },
    inStock: true,
  },
  {
    id: "18",
    name: "Sand Court Shoes",
    category: "footwear",
    price: 2299,
    rating: 4.3,
    reviews: 45,
    image: "https://placehold.co/400x400/0a56a7/white?text=Sand+Shoes",
    description: "Specialized shoes designed for sand court pickleball.",
    features: ["Sand grip sole", "Quick drainage", "Lightweight design", "Secure fit"],
    specifications: { surface: "Sand", material: "Quick-dry mesh", sizes: "7-12", drainage: "Enhanced" },
    inStock: true,
  },
  {
    id: "19",
    name: "Junior Paddle",
    category: "paddles",
    price: 1599,
    rating: 4.5,
    reviews: 23,
    image: "https://placehold.co/400x400/0a56a7/white?text=Junior",
    description: "Lightweight paddle designed specifically for young players.",
    features: ["Youth sized", "Lightweight", "Safety grip", "Colorful design"],
    specifications: { weight: "6.5 oz", length: "14", width: "7", age_range: "8-14 years" },
    inStock: true,
  },
  {
    id: "20",
    name: "Visor Pro",
    category: "accessories",
    price: 449,
    rating: 4.2,
    reviews: 56,
    image: "https://placehold.co/400x400/333/white?text=Visor",
    description: "Professional sports visor with sweat absorption and sun protection.",
    features: ["UV protection", "Sweat band", "Adjustable strap", "Lightweight"],
    specifications: { material: "Polyester", protection: "UPF 50+", adjustability: "Velcro strap", colors: "6 colors" },
    inStock: true,
  },
  {
    id: "21",
    name: "Grip Tape Set",
    category: "accessories",
    price: 299,
    rating: 4.1,
    reviews: 34,
    image: "https://placehold.co/400x400/333/white?text=Grip",
    description: "Overgrip tape set for enhanced paddle control and comfort.",
    features: ["3 grips included", "Enhanced traction", "Moisture absorption", "Easy installation"],
    specifications: { quantity: "3 grips", material: "Polyurethane", length: "43", thickness: "0.6mm" },
    inStock: true,
  },
  {
    id: "22",
    name: "Performance Socks",
    category: "apparel",
    price: 349,
    rating: 4.4,
    reviews: 67,
    image: "https://placehold.co/400x400/0a56a7/white?text=Socks",
    description: "Moisture-wicking athletic socks with arch support.",
    features: ["Arch support", "Cushioned sole", "Moisture wicking", "Seamless toe"],
    specifications: { material: "Nylon-spandex", pairs: "3 pairs", sizes: "S-L", cushioning: "Targeted" },
    inStock: true,
  },
  {
    id: "23",
    name: "Water Bottle Pro",
    category: "accessories",
    price: 599,
    rating: 4.6,
    reviews: 89,
    image: "https://placehold.co/400x400/333/white?text=Bottle",
    description: "Insulated water bottle that keeps drinks cold for hours.",
    features: ["Double wall insulation", "32oz capacity", "Leak proof", "Carry handle"],
    specifications: { capacity: "32 oz", insulation: "Double wall", material: "Stainless steel", temperature: "Cold 24hrs" },
    inStock: true,
  },
  {
    id: "24",
    name: "Training Cones",
    category: "accessories",
    price: 449,
    rating: 4.3,
    reviews: 45,
    image: "https://placehold.co/400x400/333/white?text=Cones",
    description: "Set of colorful training cones for drill practice.",
    features: ["12 cones included", "Stackable design", "Bright colors", "Durable plastic"],
    specifications: { quantity: "12 cones", height: "9 inches", material: "Plastic", colors: "4 colors" },
    inStock: true,
  }
];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "newest">("featured");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock authentication state
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const { openLogin } = useAuthModal();

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
    if (!isLoggedIn) {
      // If not logged in, open login modal
      openLogin();
      return;
    }
    
    // If logged in, proceed with adding to cart
    setAddedToCart(id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a56a7]/15 via-blue-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-[#0a56a7] pt-37 pb-36 md:pt-46 md:pb-40 relative overflow-hidden animate-in fade-in duration-1000">
        {/* Yellow-Green Gradient Bottom Border */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#a3ff01] to-transparent opacity-60 animate-in slide-in-from-bottom duration-1000 delay-300"></div>
        
        {/* Background decorative images */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 opacity-20 animate-in spin duration-10000 delay-500">
            <img src="/images/Ball.png" alt="Pickleball" className="w-full h-full object-contain" />
          </div>
          <div className="absolute top-20 right-20 w-24 h-24 opacity-20 animate-in bounce duration-2000 delay-700">
            <img src="/images/Ball.png" alt="Pickleball" className="w-full h-full object-contain" />
          </div>
          <div className="absolute bottom-20 left-20 w-28 h-28 opacity-20 animate-in pulse duration-3000 delay-900">
            <img src="/images/Ball.png" alt="Pickleball" className="w-full h-full object-contain" />
          </div>
          <div className="absolute bottom-10 right-10 w-36 h-36 opacity-20 animate-in spin duration-15000 delay-1100">
            <img src="/images/Ball.png" alt="Pickleball" className="w-full h-full object-contain" />
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <div className="animate-in fade-in duration-1000">
            <Image
              src={pickleShopImage}
              alt="PicklePlay Shop"
              width={1000}
              height={300}
              className="h-auto w-full max-w-6xl mx-auto mb-0 animate-in zoom-in duration-700 delay-200"
              priority
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
          
          {/* Product showcase images */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 mb-6">
            <div className="animate-in slide-in-from-left duration-700 delay-400">
              <img src="https://placehold.co/150x150/0a56a7/white?text=Paddle" alt="Premium Paddle" className="w-full h-24 object-cover rounded-lg shadow-lg hover:scale-110 transition-transform duration-300" />
              <p className="text-white/90 text-xs mt-2 font-medium">Premium Paddles</p>
            </div>
            <div className="animate-in slide-in-from-left duration-700 delay-600">
              <img src="https://placehold.co/150x150/a3ff01/0a56a7?text=Balls" alt="Professional Balls" className="w-full h-24 object-cover rounded-lg shadow-lg hover:scale-110 transition-transform duration-300" />
              <p className="text-white/90 text-xs mt-2 font-medium">Pro Balls</p>
            </div>
            <div className="animate-in slide-in-from-right duration-700 delay-800">
              <img src="https://placehold.co/150x150/0a56a7/white?text=Gear" alt="Performance Gear" className="w-full h-24 object-cover rounded-lg shadow-lg hover:scale-110 transition-transform duration-300" />
              <p className="text-white/90 text-xs mt-2 font-medium">Performance Gear</p>
            </div>
            <div className="animate-in slide-in-from-right duration-700 delay-1000">
              <img src="https://placehold.co/150x150/a3ff01/0a56a7?text=Apparel" alt="Sports Apparel" className="w-full h-24 object-cover rounded-lg shadow-lg hover:scale-110 transition-transform duration-300" />
              <p className="text-white/90 text-xs mt-2 font-medium">Sports Apparel</p>
            </div>
          </div>
          
          <p className="text-white/80 text-lg max-w-xl mx-auto animate-in slide-in-from-bottom duration-700 delay-200">
            Gear up for your next game with premium paddles, balls, apparel, and accessories.
          </p>
          
          {/* Demo Login Toggle */}
          <div className="mt-4 flex items-center justify-center gap-4 animate-in fade-in duration-700 delay-500">
            <span className="text-white/80 text-sm animate-in pulse duration-2000">
              Status: {isLoggedIn ? "Logged In" : "Not Logged In"}
            </span>
            <button
              onClick={() => setIsLoggedIn(!isLoggedIn)}
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition text-sm font-medium animate-in slide-in-from-right duration-700 delay-700 hover:scale-105 transform"
            >
              {isLoggedIn ? "Logout" : "Simulate Login"}
            </button>
          </div>
        </div>
      </section>

      {/* Category Chips with Search and Sort */}
      <section className="py-6 bg-white/50 animate-in fade-in duration-700 delay-500">
        <div className="max-w-6xl mx-auto px-4">
          {/* All Controls in One Row */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Search */}
            <div className="relative w-64 animate-in slide-in-from-left duration-700 delay-600">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-in spin duration-1000" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#0a56a7] focus:ring-2 focus:ring-[#0a56a7]/20 outline-none transition-all duration-200 hover:shadow-md focus:shadow-lg"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#0a56a7] focus:ring-2 focus:ring-[#0a56a7]/20 outline-none bg-white transition-all duration-200 animate-in slide-in-from-top duration-700 delay-700 hover:shadow-md focus:shadow-lg"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>

            {/* Category Dropdown */}
            <div className="relative animate-in slide-in-from-right duration-700 delay-800">
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white font-semibold transition-all hover:border-[#0a56a7] focus:border-[#0a56a7] focus:ring-2 focus:ring-[#0a56a7]/20 outline-none hover:shadow-md focus:shadow-lg hover:scale-105 transform"
              >
                {categories.find(cat => cat.id === selectedCategory)?.icon}
                {categories.find(cat => cat.id === selectedCategory)?.label}
                <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''} animate-in bounce duration-1000`} />
              </button>
              
              {isCategoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 animate-in fade-in slide-in-from-top duration-300">
                  {categories.map((cat, index) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setIsCategoryDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 flex items-center gap-2 transition-colors hover:bg-gray-50 hover:scale-105 transform animate-in slide-in-from-left duration-300 ${
                        selectedCategory === cat.id
                          ? "bg-[#0a56a7] text-white"
                          : "hover:bg-gray-50 text-gray-700"
                      } ${cat.id === 'all' ? 'rounded-t-xl' : ''} ${cat.id === 'footwear' ? 'rounded-b-xl' : ''}`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {cat.icon}
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-12 animate-in fade-in duration-700 delay-1000">
        <div className="max-w-6xl mx-auto px-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 animate-in fade-in duration-500">
              <p className="text-gray-500 text-lg animate-in pulse duration-2000">No products found. Try a different search or category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group animate-in fade-in slide-in-from-bottom duration-700`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100 animate-in zoom-in duration-500" style={{ animationDelay: `${index * 100 + 200}ms` }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 animate-in fade-in slide-in-from-left duration-500" style={{ animationDelay: `${index * 100 + 400}ms` }}>
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
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white transition animate-in fade-in slide-in-from-right duration-500"
                      style={{ animationDelay: `${index * 100 + 400}ms` }}
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
                    <p className="text-xs text-gray-500 uppercase tracking-wider animate-in fade-in slide-in-from-left duration-500" style={{ animationDelay: `${index * 100 + 600}ms` }}>{product.category}</p>
                    <h3 className="font-semibold text-gray-900 text-lg leading-tight animate-in fade-in slide-in-from-bottom duration-500" style={{ animationDelay: `${index * 100 + 700}ms` }}>{product.name}</h3>
                  <div className="flex items-center gap-1 animate-in fade-in slide-in-from-left duration-500" style={{ animationDelay: `${index * 100 + 800}ms` }}>
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
                    <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom duration-500" style={{ animationDelay: `${index * 100 + 900}ms` }}>
                    <span className="text-xl font-bold text-[#0a56a7]">₱{product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">₱{product.originalPrice.toLocaleString()}</span>
                    )}
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className="w-full mt-3 py-2.5 bg-gradient-to-r from-[#0a56a7] to-blue-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:from-[#0a56a7]/90 transition-all animate-in fade-in slide-in-from-bottom duration-500"
                    style={{ animationDelay: `${index * 100 + 1000}ms` }}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {addedToCart === product.id ? "Added!" : "Add to Cart"}
                  </button>

                  {/* View Details */}
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="w-full mt-2 py-2.5 border-2 border-[#0a56a7] text-[#0a56a7] font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-[#0a56a7] hover:text-white transition-all animate-in fade-in slide-in-from-top duration-500"
                    style={{ animationDelay: `${index * 100 + 1100}ms` }}
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-12 animate-in fade-in duration-700" style={{ animationDelay: `${filteredProducts.length * 100 + 1200}ms` }}>
            <button className="px-8 py-3 border-2 border-[#0a56a7] text-[#0a56a7] font-semibold rounded-full hover:bg-[#0a56a7] hover:text-white transition-all hover:scale-105 transform hover:shadow-lg animate-in bounce duration-2000">
              Load More Products
            </button>
          </div>
        )}
      </div>
    </section>

    <ScrollToTop />
    <Footer />

    {/* Product Details Modal */}
    {selectedProduct && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-500">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between animate-in slide-in-from-top duration-500">
            <h2 className="text-2xl font-bold text-gray-900 animate-in fade-in duration-700">Product Details</h2>
            <button
              onClick={() => setSelectedProduct(null)}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors hover:scale-110 transform hover:rotate-90 transition-transform duration-300"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 animate-in slide-in-from-left duration-700">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Product Info */}
              <div className="space-y-4 animate-in slide-in-from-right duration-700 delay-200">
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-2 animate-in fade-in duration-500">
                    {selectedProduct.category}
                  </p>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2 animate-in slide-in-from-bottom duration-500">
                    {selectedProduct.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4 animate-in fade-in duration-700">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 transition-all hover:scale-125 ${
                            i < Math.floor(selectedProduct.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {selectedProduct.rating} ({selectedProduct.reviews} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-3 mb-6 animate-in slide-in-from-left duration-500">
                    <span className="text-3xl font-bold text-[#0a56a7] animate-in pulse duration-2000">
                      ₱{selectedProduct.price.toLocaleString()}
                    </span>
                    {selectedProduct.originalPrice && (
                      <span className="text-lg text-gray-400 line-through animate-in fade-in duration-700">
                        ₱{selectedProduct.originalPrice.toLocaleString()}
                      </span>
                    )}
                    {selectedProduct.isSale && (
                      <span className="bg-[#a3ff01] text-[#0a56a7] text-sm font-bold px-3 py-1 rounded-full animate-in bounce duration-1000">
                        SALE
                      </span>
                    )}
                    {selectedProduct.isNew && (
                      <span className="bg-[#0a56a7] text-white text-sm font-bold px-3 py-1 rounded-full animate-in pulse duration-2000">
                        NEW
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="mb-6 animate-in fade-in duration-700">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium hover:scale-105 transform transition-transform ${
                      selectedProduct.inStock !== false 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      <div className={`w-2 h-2 rounded-full animate-pulse ${
                        selectedProduct.inStock !== false ? "bg-green-500" : "bg-red-500"
                      }`} />
                      {selectedProduct.inStock !== false ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  {/* Description */}
                  {selectedProduct.description && (
                    <div className="mb-6 animate-in slide-in-from-bottom duration-500">
                      <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-600 leading-relaxed animate-in fade-in duration-700">
                        {selectedProduct.description}
                      </p>
                    </div>
                  )}

                  {/* Features */}
                  {selectedProduct.features && selectedProduct.features.length > 0 && (
                    <div className="mb-6 animate-in slide-in-from-left duration-500">
                      <h4 className="font-semibold text-gray-900 mb-2">Key Features</h4>
                      <ul className="space-y-2">
                        {selectedProduct.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 animate-in slide-in-from-right duration-500 hover:scale-105 transform transition-transform" style={{ animationDelay: `${index * 100}ms` }}>
                            <div className="w-5 h-5 rounded-full bg-[#0a56a7] text-white flex items-center justify-center flex-shrink-0 mt-0.5 animate-in bounce duration-1000" style={{ animationDelay: `${index * 100 + 200}ms` }}>
                              <span className="text-xs">✓</span>
                            </div>
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 animate-in slide-in-from-bottom duration-500">
                    <button
                      onClick={() => {
                        if (!isLoggedIn) {
                          openLogin();
                          return;
                        }
                        handleAddToCart(selectedProduct.id);
                        setSelectedProduct(null);
                      }}
                      disabled={selectedProduct.inStock === false}
                      className="flex-1 py-3 bg-gradient-to-r from-[#0a56a7] to-blue-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:from-[#0a56a7]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform animate-in pulse duration-2000"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {selectedProduct.inStock === false ? "Out of Stock" : (isLoggedIn ? "Add to Cart" : "Login to Add")}
                    </button>
                    <button
                      onClick={() => toggleWishlist(selectedProduct.id)}
                      className="w-12 h-12 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-[#0a56a7] transition-colors hover:scale-110 transform hover:rotate-12 transition-transform duration-300"
                    >
                      <Heart
                        className={`w-5 h-5 transition-all hover:scale-125 ${
                          wishlist.has(selectedProduct.id) 
                            ? "fill-red-500 text-red-500" 
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              {selectedProduct.specifications && Object.keys(selectedProduct.specifications).length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200 animate-in fade-in duration-700">
                  <h4 className="font-semibold text-gray-900 mb-4 animate-in slide-in-from-left duration-500">Specifications</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(selectedProduct.specifications).map(([key, value], index) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100 hover:bg-gray-50 rounded px-2 transition-colors animate-in slide-in-from-right duration-500 hover:scale-105 transform" style={{ animationDelay: `${index * 50}ms` }}>
                        <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}</span>
                        <span className="font-medium text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}
