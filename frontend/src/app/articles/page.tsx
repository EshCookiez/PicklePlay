"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, Calendar, Clock, TrendingUp, Filter, X, ArrowUp, LayoutGrid, List, Grip, ArrowRight, Tag, User } from "lucide-react";
import AnimatedContent from "@/animate/AnimatedContent";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: number;
  featured?: boolean;
}

const articles: Article[] = [
  {
    id: 1,
    title: "Getting Started with Pickleball: A Beginner's Guide",
    excerpt: "Learn the basics of pickleball and start your journey as a beginner. Discover the rules, equipment, and tips to help you get started.",
    content: `Pickleball is one of the fastest-growing sports in the world. It combines elements of tennis, badminton, and ping-pong into an easy-to-learn, fun-to-play sport. Whether you're 8 or 80, pickleball is accessible to everyone.

In this comprehensive guide, we'll cover everything you need to know to start playing pickleball today. From understanding the basic rules to finding your first court, we've got you covered.

The beauty of pickleball lies in its simplicity. The court is smaller than a tennis court, the paddle is easy to handle, and the learning curve is much gentler than traditional racquet sports. Most beginners can play a decent game after just a few sessions.`,
    author: "Sarah Johnson",
    date: "Jan 15, 2024",
    category: "Beginner Tips",
    image: "🎾",
    readTime: 5,
    featured: true,
  },
  {
    id: 2,
    title: "Top 5 Pickleball Courts in the Philippines",
    excerpt: "Explore the best pickleball facilities across the Philippines with our comprehensive guide to premium courts.",
    content: `The Philippines has seen a tremendous growth in pickleball facilities over the past few years. From Manila to Cebu, there are now excellent courts where you can enjoy this amazing sport.

We've compiled a list of the top 5 pickleball courts that offer great amenities, professional instruction, and a welcoming community. Whether you're a beginner looking to learn or an experienced player seeking competitive matches, these courts have something for everyone.

Each facility offers unique features including air-conditioned courts, professional coaching staff, and vibrant community events.`,
    author: "Marcus Rivera",
    date: "Jan 12, 2024",
    category: "Court Reviews",
    image: "📍",
    readTime: 7,
    featured: true,
  },
  {
    id: 3,
    title: "Pickleball Nutrition: Fueling Your Performance",
    excerpt: "Discover the best nutrition strategies to improve your pickleball performance and recover faster between matches.",
    content: `Proper nutrition is crucial for athletic performance in pickleball. Whether you're playing casually or competitively, what you eat and drink can significantly impact your game.

In this article, we'll discuss the essential nutrients for pickleball players, pre-game meal timing, hydration strategies, and post-game recovery nutrition. Learn how to fuel your body for optimal performance on the court.

We'll also share some practical meal ideas and snack recommendations from professional athletes and nutritionists who specialize in court sports.`,
    author: "Dr. Emily Chen",
    date: "Jan 10, 2024",
    category: "Health & Fitness",
    image: "🥗",
    readTime: 6,
  },
  {
    id: 4,
    title: "Advanced Strategies: The Third Shot Drop",
    excerpt: "Master the third shot drop, one of the most important shots in competitive pickleball.",
    content: `The third shot drop is often considered the most important shot in pickleball. It's the first shot a serving team hits after the return of serve and can make or break your match strategy.

In this detailed guide, we'll break down the mechanics of the third shot drop, explain why it's crucial, and provide step-by-step instructions to help you master this technique.

You'll also learn common mistakes that beginners make and how to practice this shot effectively to build consistency and confidence in your game.`,
    author: "Coach Michael Torres",
    date: "Jan 8, 2024",
    category: "Advanced Techniques",
    image: "⚡",
    readTime: 8,
    featured: true,
  },
  {
    id: 5,
    title: "Building a Pickleball Community: Local Tournament Organization",
    excerpt: "Learn how to organize and host a successful pickleball tournament in your local community.",
    content: `Want to bring the pickleball community together? Organizing a local tournament is a great way to build connections, increase participation, and create memorable experiences.

This comprehensive guide walks you through the entire process of planning and executing a successful tournament. From determining the format and schedule to managing registrations and prizes, we cover all the details you need to know.

You'll also find best practices from experienced tournament organizers and tips for creating an inclusive, enjoyable experience for all participants.`,
    author: "Lisa Anderson",
    date: "Jan 5, 2024",
    category: "Community",
    image: "🏆",
    readTime: 9,
  },
  {
    id: 6,
    title: "Injury Prevention in Pickleball: Stay Healthy and Playing",
    excerpt: "Prevent common pickleball injuries with these evidence-based strategies and recovery techniques.",
    content: `While pickleball is generally a safe sport, injuries can still occur. The most common injuries include ankle sprains, knee issues, and shoulder problems.

This article covers injury prevention strategies, proper warm-up routines, and recovery techniques specifically designed for pickleball players. Learn from physical therapists and sports medicine specialists about how to stay healthy and extend your pickleball career.

We'll also discuss when to seek professional help and how to return to play safely after an injury.`,
    author: "Dr. James Patterson",
    date: "Jan 3, 2024",
    category: "Health & Fitness",
    image: "🏥",
    readTime: 7,
  },
];

export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [minReadTime, setMinReadTime] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [gridLayout, setGridLayout] = useState<"grid" | "grid-3" | "list">("grid");
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (selectedArticle) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selectedArticle]);

  const scrollToSearch = () => {
    searchRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const categories = Array.from(new Set(articles.map((a) => a.category)));
  const featuredArticles = articles.filter((a) => a.featured);
  const trendingArticles = articles.slice(0, 4);

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    const matchesReadTime = article.readTime >= minReadTime;
    return matchesSearch && matchesCategory && matchesReadTime;
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {selectedArticle ? (
        <ArticleDetail article={selectedArticle} onBack={() => setSelectedArticle(null)} onSelectArticle={setSelectedArticle} />
      ) : (
        <>
          {/* Hero/Featured Section */}
          <section className="pt-8 pb-12 px-4 md:px-8 bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto">
              {/* Featured Articles Carousel */}
              <div className="mb-8">
                <h2 className="text-sm font-bold text-[#0a56a7] uppercase tracking-wide mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Featured Stories
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {featuredArticles.map((article, idx) => (
                    <AnimatedContent
                      key={article.id}
                      distance={50}
                      direction="vertical"
                      duration={0.6}
                      ease="power3.out"
                      initialOpacity={0}
                      animateOpacity
                      delay={idx * 0.1}
                    >
                      <div
                        onClick={() => setSelectedArticle(article)}
                        className="group cursor-pointer"
                      >
                        <div className="h-40 bg-gradient-to-br from-[#0a56a7] to-blue-600 rounded-lg flex items-center justify-center text-5xl overflow-hidden mb-3 group-hover:scale-105 transition-transform duration-300">
                          {article.image}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-[#0a56a7] transition-colors mb-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {article.excerpt}
                        </p>
                        <span className="text-xs font-semibold text-[#0a56a7] uppercase">
                          {article.category}
                        </span>
                      </div>
                    </AnimatedContent>
                  ))}
                </div>
              </div>

              {/* Main Featured Article */}
              {featuredArticles[0] && (
                <AnimatedContent
                  distance={50}
                  direction="vertical"
                  duration={0.6}
                  ease="power3.out"
                  initialOpacity={0}
                  animateOpacity
                >
                  <div
                    onClick={() => setSelectedArticle(featuredArticles[0])}
                    className="group cursor-pointer bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8">
                      <div className="h-full bg-gradient-to-br from-[#0a56a7] to-blue-600 rounded-lg flex items-center justify-center text-9xl">
                        {featuredArticles[0].image}
                      </div>
                      <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="inline-block px-3 py-1 bg-[#a3ff01] text-gray-900 rounded-full text-xs font-bold uppercase">
                            {featuredArticles[0].category}
                          </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-[#a3ff01] transition-colors">
                          {featuredArticles[0].title}
                        </h2>
                        <p className="text-gray-300 text-lg mb-6">
                          {featuredArticles[0].excerpt}
                        </p>
                        <div className="flex items-center gap-6 text-sm text-gray-400">
                          <span>{featuredArticles[0].date}</span>
                          <span>By {featuredArticles[0].author}</span>
                          <span>{featuredArticles[0].readTime} min read</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedContent>
              )}
            </div>
          </section>

          {/* Trending Posts Section */}
          <section className="py-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-[#0a56a7]" />
                Trending Posts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {trendingArticles.map((article, idx) => (
                  <AnimatedContent
                    key={article.id}
                    distance={50}
                    direction="vertical"
                    duration={0.6}
                    ease="power3.out"
                    initialOpacity={0}
                    animateOpacity
                    delay={idx * 0.1}
                  >
                    <div
                      onClick={() => setSelectedArticle(article)}
                      className="group cursor-pointer"
                    >
                      <div className="h-48 bg-gradient-to-br from-[#0a56a7] to-blue-600 rounded-lg flex items-center justify-center text-6xl overflow-hidden mb-3 group-hover:scale-105 transition-transform duration-300">
                        {article.image}
                      </div>
                      <p className="text-xs font-bold text-[#0a56a7] uppercase mb-2">
                        {article.category}
                      </p>
                      <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-[#0a56a7] transition-colors">
                        {article.title}
                      </h3>
                    </div>
                  </AnimatedContent>
                ))}
              </div>
            </div>
          </section>

          {/* Search and Filter Section */}
          <section className="py-6 px-4 md:px-8 bg-white border-b border-gray-200 scroll-mt-32" ref={searchRef}>
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0a56a7] focus:border-transparent transition"
                  />
                </div>
                <button
                  onClick={() => {
                    const layouts: Array<"grid" | "grid-3" | "list"> = ["grid", "grid-3", "list"];
                    const currentIndex = layouts.indexOf(gridLayout);
                    setGridLayout(layouts[(currentIndex + 1) % layouts.length]);
                  }}
                  className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition flex items-center gap-2 whitespace-nowrap"
                  title="Toggle grid/list view"
                >
                  {gridLayout === "grid" && <LayoutGrid className="w-5 h-5" />}
                  {gridLayout === "grid-3" && <Grip className="w-5 h-5" />}
                  {gridLayout === "list" && <List className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setShowFilterModal(true)}
                  className="px-4 py-3 bg-[#0a56a7] hover:bg-[#0a56a7]/90 text-white font-semibold rounded-lg transition flex items-center gap-2 whitespace-nowrap"
                >
                  <Filter className="w-5 h-5" />
                  Filter
                </button>
              </div>

              {/* Active Filters Display */}
              {(selectedCategory || minReadTime > 0) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedCategory && (
                    <span className="px-3 py-1 bg-blue-100 text-[#0a56a7] rounded-full text-sm font-semibold flex items-center gap-2">
                      {selectedCategory}
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className="hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  )}
                  {minReadTime > 0 && (
                    <span className="px-3 py-1 bg-blue-100 text-[#0a56a7] rounded-full text-sm font-semibold flex items-center gap-2">
                      {minReadTime}+ min read
                      <button
                        onClick={() => setMinReadTime(0)}
                        className="hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* All Articles Section */}
          <section className="py-12 px-4 md:px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Articles</h2>

              {filteredArticles.length > 0 ? (
                <div className={gridLayout === "list" ? "space-y-4" : gridLayout === "grid-3" ? "grid grid-cols-1 md:grid-cols-3 gap-6" : "grid grid-cols-1 md:grid-cols-2 gap-8"}>
                  {filteredArticles.map((article, idx) => (
                    <AnimatedContent
                      key={article.id}
                      distance={50}
                      direction="vertical"
                      duration={0.6}
                      ease="power3.out"
                      initialOpacity={0}
                      animateOpacity
                      delay={idx * 0.1}
                    >
                      <ArticleCard
                        article={article}
                        onClick={() => setSelectedArticle(article)}
                        layout={gridLayout === "list" ? "list" : "grid"}
                      />
                    </AnimatedContent>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-500">No articles found matching your search.</p>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowFilterModal(false)}
          />

          {/* Modal */}
          <div className="relative ml-auto w-full max-w-md bg-white shadow-2xl flex flex-col max-h-screen overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Filter</h2>
              <button
                onClick={() => setShowFilterModal(false)}
                className="p-1 hover:bg-gray-100 rounded transition"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 space-y-6">
              {/* Search in Modal */}
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0a56a7]"
                  />
                </div>
              </div>

              {/* Popular Filters */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Popular Filters</h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedCategory === category}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategory(category);
                          } else {
                            setSelectedCategory(null);
                          }
                        }}
                        className="w-5 h-5 accent-[#0a56a7] rounded"
                      />
                      <span className="text-gray-700 group-hover:text-[#0a56a7] transition">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Read Time Filter */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Read Time</h3>
                <div className="space-y-3">
                  {[
                    { label: "Quick Read (1-5 min)", value: 5 },
                    { label: "Medium Read (6-8 min)", value: 6 },
                    { label: "Long Read (9+ min)", value: 9 },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="readTime"
                        checked={minReadTime === option.value}
                        onChange={() => setMinReadTime(minReadTime === option.value ? 0 : option.value)}
                        className="w-5 h-5 accent-[#0a56a7]"
                      />
                      <span className="text-gray-700 group-hover:text-[#0a56a7] transition">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Read Time Slider */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Minimum Read Time: {minReadTime} min</h3>
                <input
                  type="range"
                  min="0"
                  max="9"
                  value={minReadTime}
                  onChange={(e) => setMinReadTime(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-[#0a56a7]"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>0 min</span>
                  <span>9 min</span>
                </div>
              </div>

              {/* Featured Articles Option */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Content Type</h3>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 accent-[#0a56a7] rounded" />
                  <span className="text-gray-700 group-hover:text-[#0a56a7] transition">
                    Featured Articles Only
                  </span>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setMinReadTime(0);
                  setSearchQuery("");
                }}
                className="flex-1 px-4 py-3 text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition"
              >
                Clear all
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="flex-1 px-4 py-3 bg-[#0a56a7] hover:bg-[#0a56a7]/90 text-white font-bold rounded-lg transition"
              >
                Show {filteredArticles.length} results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Scroll Buttons */}
      {showScrollButton && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <button
            onClick={scrollToSearch}
            className="p-3 bg-[#0a56a7] hover:bg-[#0a56a7]/90 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group relative"
            title="Scroll to search"
          >
            <Search className="w-5 h-5" />
            <span className="absolute right-full mr-3 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Search
            </span>
          </button>
          <button
            onClick={scrollToTop}
            className="p-3 bg-[#a3ff01] hover:bg-[#a3ff01]/90 text-[#0a56a7] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group relative"
            title="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
            <span className="absolute right-full mr-3 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Top
            </span>
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}

function ArticleCard({
  article,
  onClick,
  layout = "grid",
}: {
  article: Article;
  onClick: () => void;
  layout?: "grid" | "list";
}) {
  if (layout === "list") {
    return (
      <div
        onClick={onClick}
        className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md hover:shadow-xl hover:scale-102 transition-all duration-300 cursor-pointer flex"
      >
        {/* Article Image */}
        <div className="w-40 h-40 bg-gradient-to-br from-[#0a56a7] to-blue-600 flex items-center justify-center text-4xl overflow-hidden relative flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
          {article.image}
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-[#0a56a7] uppercase">
                {article.category}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#0a56a7] transition-colors">
              {article.title}
            </h3>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {article.excerpt}
            </p>
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              <span>{article.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3" />
              <span>{article.readTime}m</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md hover:shadow-xl hover:scale-102 transition-all duration-300 cursor-pointer"
    >
      {/* Article Image */}
      <div className="h-40 bg-gradient-to-br from-[#0a56a7] to-blue-600 flex items-center justify-center text-5xl overflow-hidden relative group-hover:scale-110 transition-transform duration-300">
        {article.image}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold text-[#0a56a7] uppercase">
            {article.category}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#0a56a7] transition-colors">
          {article.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {article.excerpt}
        </p>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            <span>{article.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            <span>{article.readTime}m</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArticleDetail({
  article,
  onBack,
  onSelectArticle,
}: {
  article: Article;
  onBack: () => void;
  onSelectArticle: (article: Article) => void;
}) {
  const categories = Array.from(new Set(articles.map((a) => a.category)));
  const relatedArticles = articles.filter((a) => a.category === article.category && a.id !== article.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-white pt-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Breadcrumb - More Visual */}
        <div className="mb-12 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => window.scrollTo(0, 0)} 
                className="flex items-center gap-2 text-[#0a56a7] hover:text-[#0a56a7]/80 font-semibold transition group"
              >
                <span className="p-2 bg-white rounded-lg group-hover:bg-[#a3ff01] transition">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </span>
                <span className="hidden sm:inline">Home</span>
              </button>
              
              <span className="text-gray-400 text-lg">/</span>
              
              <button 
                onClick={onBack} 
                className="flex items-center gap-2 text-[#0a56a7] hover:text-[#0a56a7]/80 font-semibold transition group"
              >
                <span className="p-2 bg-white rounded-lg group-hover:bg-[#a3ff01] transition">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h6a1 1 0 01.82.45l2.851 4.87h2.36a2 2 0 012 2v5a2 2 0 01-2 2h-5a1 1 0 01-.9-1.45L8.955 4H4a2 2 0 00-2 2v7a2 2 0 002 2h5a1 1 0 110 2H4a4 4 0 01-4-4V5z" />
                  </svg>
                </span>
                <span className="hidden sm:inline">Articles</span>
              </button>
              
              <span className="text-gray-400 text-lg">/</span>
              
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#0a56a7] text-white rounded-full text-xs font-bold uppercase">
                  {article.category}
                </span>
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-[#0a56a7] hover:bg-[#0a56a7]/90 text-white font-semibold rounded-lg transition hover:shadow-lg"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Article Content */}
          <div className="lg:col-span-2">
            <AnimatedContent
              distance={30}
              direction="vertical"
              duration={0.6}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
            >
              {/* Category Badge */}
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#0a56a7] to-blue-600 text-white rounded-lg text-xs font-bold uppercase shadow-md">
                  {article.category}
                </span>
              </div>

              {/* Featured Image with Title Inside */}
              <div className="relative w-full h-96 bg-gradient-to-br from-[#0a56a7] to-blue-600 rounded-2xl flex items-end justify-start text-9xl mb-8 overflow-hidden shadow-lg">
                {/* Background Image/Icon */}
                <div className="absolute inset-0 flex items-center justify-center text-9xl opacity-20">
                  {article.image}
                </div>

                {/* Title Overlay */}
                <div className="relative z-10 w-full p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                    {article.title}
                  </h1>
                </div>
              </div>

              {/* Article Meta - Card Style Below Image */}
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 flex flex-wrap items-center gap-8 mb-10">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#0a56a7] text-white rounded-lg">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Author</p>
                    <p className="font-semibold text-gray-900">{article.author}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#0a56a7] text-white rounded-lg">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Published</p>
                    <p className="font-semibold text-gray-900">{article.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#a3ff01] text-[#0a56a7] rounded-lg">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Read Time</p>
                    <p className="font-semibold text-gray-900">{article.readTime} minutes</p>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="mb-12">
                <div className="text-lg text-gray-700 leading-relaxed space-y-6">
                  {article.content.split("\n\n").map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* CTA Section */}
              <div className="bg-gradient-to-r from-[#0a56a7] to-blue-600 rounded-2xl p-8 text-white mb-8">
                <h3 className="text-2xl font-bold mb-3">Ready to play?</h3>
                <p className="text-blue-100 mb-6">
                  Find the nearest pickleball court and start your game today!
                </p>
                <button className="bg-[#a3ff01] hover:bg-[#a3ff01]/90 text-[#0a56a7] font-bold py-3 px-6 rounded-lg transition">
                  Find Courts Near You
                </button>
              </div>

              {/* Back Button */}
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-[#0a56a7] font-semibold hover:gap-3 transition-all mt-12 pt-8 border-t border-gray-200"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                Back to Articles
              </button>
            </AnimatedContent>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <AnimatedContent
              distance={30}
              direction="horizontal"
              duration={0.6}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
            >
              <div className="space-y-8">
                {/* Search Box */}
                <div className="sticky top-24">
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search articles..."
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0a56a7] focus:border-transparent transition text-sm"
                    />
                  </div>

                  {/* Categories */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-1 h-1 bg-[#a3ff01] rounded-full"></span>
                      Categories
                    </h3>
                    <div className="space-y-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          className={`block w-full text-left px-3 py-2 rounded-lg transition ${
                            cat === article.category
                              ? "bg-[#0a56a7] text-white font-semibold"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Related Articles */}
                  {relatedArticles.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-[#a3ff01]" />
                        Related Articles
                      </h3>
                      <div className="space-y-4">
                        {relatedArticles.map((related) => (
                          <div
                            key={related.id}
                            onClick={() => onSelectArticle(related)}
                            className="pb-4 border-b border-gray-200 last:border-b-0 cursor-pointer hover:opacity-80 transition group"
                          >
                            <p className="text-xs font-semibold text-[#0a56a7] uppercase mb-1">
                              {related.category}
                            </p>
                            <p className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-[#0a56a7]">
                              {related.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{related.date}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Features Section */}
                  <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Featured</h3>
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-[#0a56a7] rounded-full mt-2 flex-shrink-0"></span>
                        <span>Learn the fundamentals of pickleball</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-[#0a56a7] rounded-full mt-2 flex-shrink-0"></span>
                        <span>Discover courts near you</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-[#0a56a7] rounded-full mt-2 flex-shrink-0"></span>
                        <span>Join the community</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </AnimatedContent>
          </div>
        </div>
      </div>
    </div>
  );
}
