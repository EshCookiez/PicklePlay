"use client";

import { useState } from "react";
import { BookOpen, Search, Clock, TrendingUp, Calendar, ArrowRight, ChevronRight } from "lucide-react";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: number;
  featured?: boolean;
}

const articles: Article[] = [
  {
    id: 1,
    title: "Getting Started with Pickleball: A Beginner's Guide",
    excerpt: "Learn the basics of pickleball and start your journey. Discover the rules, equipment, and tips to help you get started.",
    category: "Basics",
    date: "2026-01-15",
    readTime: 8,
    featured: true,
  },
  {
    id: 2,
    title: "Advanced Techniques: Master Your Serve",
    excerpt: "Level up your pickleball game with advanced serving techniques. Learn spin, speed, and placement strategies.",
    category: "Techniques",
    date: "2026-01-10",
    readTime: 12,
  },
  {
    id: 3,
    title: "Nutrition Tips for Pickleball Players",
    excerpt: "Fuel your body properly for peak performance on the court. Expert nutritional advice for pickleball athletes.",
    category: "Health",
    date: "2026-01-05",
    readTime: 6,
  },
  {
    id: 4,
    title: "Court Equipment: Racket Selection Guide",
    excerpt: "Choose the perfect racket for your playing style. Compare materials, weights, and specifications.",
    category: "Equipment",
    date: "2025-12-28",
    readTime: 10,
  },
  {
    id: 5,
    title: "Tournament Preparation: Mental Game",
    excerpt: "Build mental toughness and focus for tournament play. Psychological strategies from professional players.",
    category: "Tournaments",
    date: "2025-12-20",
    readTime: 9,
  },
  {
    id: 6,
    title: "Injury Prevention & Recovery",
    excerpt: "Stay healthy and prevent common pickleball injuries. Warm-up routines and recovery techniques.",
    category: "Health",
    date: "2025-12-15",
    readTime: 7,
  },
];

export default function ArticlesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = articles.filter((article) => {
    const categoryMatch = selectedCategory === "All" || article.category === selectedCategory;
    const searchMatch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-white to-[#f0fdf4] pt-6 sm:pt-8 pb-12 sm:pb-16">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-gradient-to-br from-[#0f2e22] to-[#1a4332] rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 relative overflow-hidden text-white shadow-lg">
          <div className="relative z-10">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="p-2.5 sm:p-3 bg-[#a3e635]/20 rounded-2xl">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-[#a3e635]" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight">PicklePlay Articles</h1>
            </div>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
              Explore expert guides, tips, and insights to improve your pickleball game. Learn from professionals and the community.
            </p>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute right-0 bottom-0 w-32 sm:w-64 h-32 sm:h-64 bg-[#a3e635] opacity-10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-slate-200 focus:border-[#a3e635] outline-none transition-colors bg-white text-sm sm:text-base font-medium"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
            {["All", "Basics", "Techniques", "Equipment", "Health", "Tournaments"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-[#a3e635] text-[#0f2e22] shadow-lg shadow-[#a3e635]/30"
                    : "bg-white border-2 border-slate-200 text-slate-600 hover:border-[#a3e635]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Article */}
      {filteredArticles.some((a) => a.featured) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-900">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#a3e635]" />
              Featured Article
            </h2>
            {filteredArticles
              .filter((a) => a.featured)
              .map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 border-2 border-[#a3e635]/30 hover:border-[#a3e635] hover:shadow-xl hover:shadow-[#a3e635]/10 transition-all group cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3 sm:mb-4 flex-wrap">
                        <span className="bg-[#a3e635]/20 text-[#65a30d] px-3 py-1 rounded-lg text-xs sm:text-sm font-bold">
                          {article.category}
                        </span>
                        <span className="text-slate-500 text-xs sm:text-sm font-bold flex items-center gap-1">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          {new Date(article.date).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 sm:mb-3 group-hover:text-[#a3e635] transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-slate-600 text-sm sm:text-base mb-4 sm:mb-6 line-clamp-2">{article.excerpt}</p>
                      <button className="flex items-center gap-2 text-[#a3e635] hover:text-[#84cc16] font-bold text-sm sm:text-base group/btn transition-colors">
                        Read Article <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2 bg-[#a3e635]/10 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl">
                      <Clock className="w-5 h-5 text-[#65a30d]" />
                      <span className="font-bold text-[#0f2e22] text-sm sm:text-base">{article.readTime} min</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6">
          {selectedCategory === "All" ? "All Articles" : `${selectedCategory} Articles`}
        </h2>
        
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <BookOpen className="w-16 h-16 sm:w-20 sm:h-20 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium text-sm sm:text-base">No articles found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredArticles
              .filter((a) => !a.featured)
              .map((article, index) => (
                <div
                  key={article.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-white rounded-2xl sm:rounded-[2rem] p-5 sm:p-6 border border-slate-200 hover:border-[#a3e635] hover:shadow-lg hover:shadow-[#a3e635]/10 transition-all h-full flex flex-col">
                    {/* Category Badge */}
                    <div className="mb-3 sm:mb-4">
                      <span className="inline-block bg-[#a3e635]/20 text-[#65a30d] px-3 py-1 rounded-lg text-xs sm:text-sm font-bold">
                        {article.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 sm:mb-3 group-hover:text-[#a3e635] transition-colors line-clamp-2">
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-slate-600 text-xs sm:text-sm mb-4 sm:mb-5 flex-grow line-clamp-2">{article.excerpt}</p>

                    {/* Meta */}
                    <div className="space-y-2 sm:space-y-3 pt-4 sm:pt-5 border-t border-slate-100">
                      <div className="flex items-center justify-between text-slate-500 text-xs sm:text-sm font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          {new Date(article.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1 bg-[#a3e635]/10 px-2 sm:px-3 py-1 rounded-lg">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          {article.readTime} min
                        </span>
                      </div>
                      <button className="w-full py-2 sm:py-2.5 rounded-xl bg-[#0f2e22] hover:bg-[#a3e635] text-white font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 group/btn">
                        Read <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
