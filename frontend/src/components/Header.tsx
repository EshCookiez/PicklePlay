"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, LogOut, Settings, User, ChevronDown, LayoutGrid, BarChart3, Users, MessageSquare, Trophy, Zap, Award, Calendar, Briefcase, ShoppingBag, BookOpen } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Menu, X, ChevronUp } from "lucide-react";
import logo from "../images/PicklePlayLogo.jpg"
import { useAuth } from "@/contexts/AuthContext";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  memberSince: string;
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoverItem, setHoverItem] = useState<string | null>(null);
  const router = useRouter();

  const menuCategories = [
    {
      title: "🎮 SOCIAL & COMMUNITY",
      items: [
        { icon: <Users className="w-5 h-5" />, label: "Player Directory", desc: "Find & connect with players", href: "/players" },
        { icon: <MessageSquare className="w-5 h-5" />, label: "Community", desc: "Share posts & engage", href: "/community" },
        { icon: <Zap className="w-5 h-5" />, label: "Groups & Teams", desc: "Create or join groups", href: "/teams" },
      ]
    },
    {
      title: "🏆 COMPETITIVE",
      items: [
        { icon: <BarChart3 className="w-5 h-5" />, label: "Rankings", desc: "View leaderboards", href: "/rankings" },
        { icon: <Trophy className="w-5 h-5" />, label: "Contests", desc: "Join competitions", href: "/contests" },
        { icon: <Award className="w-5 h-5" />, label: "Tournaments", desc: "Participate in events", href: "/tournaments" },
      ]
    },
    {
      title: "🎯 LEARNING & GROWTH",
      items: [
        { icon: <Briefcase className="w-5 h-5" />, label: "Coaching", desc: "Book lessons & improve", href: "/coaching" },
        { icon: <BookOpen className="w-5 h-5" />, label: "Articles", desc: "Tips & guides", href: "/articles" },
      ]
    },
    {
      title: "🛠️ TOOLS & MORE",
      items: [
        { icon: <LayoutGrid className="w-5 h-5" />, label: "Dashboard", desc: "Your profile hub", href: "/dashboard" },
        { icon: <Calendar className="w-5 h-5" />, label: "Messages", desc: "Chat with others", href: "/messages" },
        { icon: <ShoppingBag className="w-5 h-5" />, label: "Shops", desc: "Browse products", href: "/shop" },
        { icon: <Settings className="w-5 h-5" />, label: "Settings", desc: "Manage preferences", href: "/settings" },
      ]
    },
  ];

  // Featured items (most used)
  const featuredItems = [
    { icon: <Users className="w-5 h-5" />, label: "Player Directory", desc: "Find & connect with players", href: "/players" },
    { icon: <BarChart3 className="w-5 h-5" />, label: "Rankings", desc: "View leaderboards", href: "/rankings" },
    { icon: <Calendar className="w-5 h-5" />, label: "Messages", desc: "Chat with others", href: "/messages" },
    { icon: <Trophy className="w-5 h-5" />, label: "Contests", desc: "Join competitions", href: "/contests" },
  ];

  // Search through all menu items
  const getAllItems = () => {
    return menuCategories.flatMap(cat => cat.items);
  };

  const filteredItems = searchQuery 
    ? getAllItems().filter(item => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  const { openAuthModal } = useAuth();

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrolled = currentScrollY > 50;
      
      setIsScrolled(scrolled);
      setIsScrollingUp(currentScrollY < lastScrollY && lastScrollY > 100);
      setLastScrollY(currentScrollY);
    };

    const throttledHandleScroll = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", throttledHandleScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledHandleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/auth");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 text-white transition-all duration-700 ease-in-out transform ${
      isScrolled && !isScrollingUp ? "-translate-y-full" : "translate-y-0"
    } ${isScrolled ? "py-3 px-4" : "py-0 px-0"}`}>
      <div className={`mx-auto flex items-center justify-between gap-4 relative h-24 transition-all duration-700 ease-in-out ${
        isScrolled 
          ? "max-w-5xl rounded-2xl px-5 bg-[#0a56a7]/90 backdrop-blur-xl border border-white/20 shadow-2xl" 
          : "max-w-full px-4 md:px-8 bg-[#0a56a7]/95 backdrop-blur-lg border border-white/10"
      }`}>
        {/* Logo */}
        <div className="flex items-center mr-4">
          <Image
            alt="PicklePlay Logo"
            width={isScrolled ? 40 : 80}
            height={isScrolled ? 40 : 80}
            src={logo}
            className="rounded-full shadow-2xl transition-all duration-700 ease-in-out hover:scale-110"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className={`hidden md:flex gap-8 flex-1 transition-all text-white duration-700 ease-in-out`}>
          <Link href="/" className="hover:text-yellow-300 transition font-semibold">
            HOME
          </Link>
          <Link href="/courts" className="hover:text-yellow-300 transition font-semibold">
          <a href="#map" className="hover:text-yellow-300 transition font-semibold">
            FIND COURTS
          </Link>
          <Link href="/players" className="hover:text-yellow-300 transition font-semibold">
            PLAYER DIRECTORY
          </Link>

          {/* Explore Mega Menu */}
          <div 
            className="relative group"
            onMouseEnter={() => setIsCategoriesOpen(true)}
            onMouseLeave={() => {
              setTimeout(() => setIsCategoriesOpen(false), 100);
            }}
          >
            <button 
              className="flex items-center gap-1 hover:text-yellow-300 transition font-semibold"
            >
              EXPLORE
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isCategoriesOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Mega Menu Dropdown - Hover to open */}
            {isCategoriesOpen && (
              <div 
                className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 p-6 z-50 origin-top transform transition-all duration-300 ease-out max-h-[70vh] overflow-y-auto"
                style={{
                  animation: "slideDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
                }}
              >
                <style>{`
                  @keyframes slideDown {
                    from {
                      opacity: 0;
                      transform: translateY(-15px) scaleY(0.9);
                    }
                    to {
                      opacity: 1;
                      transform: translateY(0) scaleY(1);
                    }
                  }
                  
                  /* Custom scrollbar */
                  .custom-scroll::-webkit-scrollbar {
                    width: 6px;
                  }
                  .custom-scroll::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                  }
                  .custom-scroll::-webkit-scrollbar-thumb {
                    background: #0a56a7;
                    border-radius: 10px;
                  }
                  .custom-scroll::-webkit-scrollbar-thumb:hover {
                    background: #053d7d;
                  }
                `}</style>

                <div className="custom-scroll">
                  {/* Search Bar */}
                  <div className="mb-5 pb-5 border-b border-gray-300">
                    <input
                      type="text"
                      placeholder="🔍 Search features..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#0a56a7] focus:ring-2 focus:ring-[#0a56a7]/30 text-gray-900 placeholder-gray-500"
                    />
                  </div>

                  {/* Featured/Search Results */}
                  {searchQuery && filteredItems.length > 0 ? (
                    <div className="mb-6">
                      <h3 className="font-bold text-gray-900 text-xs mb-3 pb-2 border-b-2 border-[#a3ff01] uppercase tracking-wider">
                        🔥 SEARCH RESULTS ({filteredItems.length})
                      </h3>
                      <div className="space-y-2">
                        {filteredItems.map((item, idx) => (
                          <Link
                            key={idx}
                            href={item.href}
                            onClick={() => {
                              setIsCategoriesOpen(false);
                              setSearchQuery("");
                            }}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 transition-all group"
                          >
                            <div className="text-[#0a56a7] flex-shrink-0 group-hover:scale-110 transition-transform">
                              {item.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 text-xs group-hover:text-[#0a56a7] transition">
                                {item.label}
                              </p>
                              <p className="text-xs text-gray-600 group-hover:text-gray-700 line-clamp-1">
                                {item.desc}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : !searchQuery ? (
                    <>
                      <div className="mb-5">
                        <h3 className="font-bold text-gray-900 text-xs mb-3 pb-2 border-b-2 border-[#a3ff01] uppercase tracking-wider">
                          ⭐ FEATURED (Most Used)
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {featuredItems.map((item, idx) => (
                            <Link
                              key={idx}
                              href={item.href}
                              onClick={() => {
                                setIsCategoriesOpen(false);
                                setSearchQuery("");
                              }}
                              className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 transition-all group"
                            >
                              <div className="text-[#0a56a7] flex-shrink-0 group-hover:scale-110 transition-transform">
                                {item.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 text-xs group-hover:text-[#0a56a7] transition">
                                  {item.label}
                                </p>
                                <p className="text-xs text-gray-600 group-hover:text-gray-700 line-clamp-1">
                                  {item.desc}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* All Categories */}
                      <div>
                        <h3 className="font-bold text-gray-900 text-xs text-gray-500 mb-3 uppercase tracking-wider">Browse All</h3>
                        <div className="space-y-4">
                          {menuCategories.map((category, catIdx) => (
                            <div key={catIdx}>
                              <h4 className="font-bold text-gray-900 text-xs mb-2 pb-2 border-b border-[#0a56a7]/30">
                                {category.title}
                              </h4>
                              <div className="space-y-1 ml-2">
                                {category.items.map((item, itemIdx) => (
                                  <Link
                                    key={itemIdx}
                                    href={item.href}
                                    onClick={() => {
                                      setIsCategoriesOpen(false);
                                      setSearchQuery("");
                                    }}
                                    onMouseEnter={() => setHoverItem(`${catIdx}-${itemIdx}`)}
                                    onMouseLeave={() => setHoverItem(null)}
                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 transition-all group"
                                  >
                                    <div className="text-[#0a56a7] flex-shrink-0 group-hover:scale-110 transition-transform text-sm">
                                      {item.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-semibold text-gray-900 text-xs group-hover:text-[#0a56a7] transition">
                                        {item.label}
                                      </p>
                                      <p className="text-xs text-gray-600 group-hover:text-gray-700 line-clamp-1">
                                        {item.desc}
                                      </p>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Desktop Buttons & Profile */}
        <nav className="hidden md:flex gap-4 flex-1 justify-end items-center">
          {user ? (
            <Popover>
              <PopoverTrigger asChild>
                <button className="w-10 h-10 rounded-full bg-white text-[#0a56a7] font-bold flex items-center justify-center hover:bg-[#a3ff01] transition cursor-pointer shadow-lg">
                  {user.avatar}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <div className="space-y-4">
                  <div className="pb-4 border-b">
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 p-2 hover:bg-blue-50 rounded transition text-gray-700 hover:text-[#0a56a7]"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">View Profile</span>
                  </Link>
                  <button className="w-full flex items-center gap-2 p-2 hover:bg-blue-50 rounded transition text-gray-700 hover:text-[#0a56a7]">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 p-2 hover:bg-red-50 rounded transition text-red-600 hover:text-red-700"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <>
              <Link href="/auth" className="px-3 py-2 text-sm border border-transparent text-white rounded-md font-semibold hover:bg-[#a3ff01] hover:text-[#0a56a7] transition cursor-pointer">
                Log in
              </Link>
              <Link href="/auth" className="px-3 py-2 text-sm border border-transparent text-white rounded-md font-semibold hover:bg-[#a3ff01] hover:text-[#0a56a7] transition cursor-pointer">
                Sign Up
              </Link>
              <button className="px-3 py-2 text-sm bg-white text-[#0a56a7] rounded-md font-semibold hover:bg-[#a3ff01] transition cursor-pointer">
                Download App
              </button>
            </>
          )}
          <button 
            onClick={() => openAuthModal("login")}
            className="px-3 py-2 text-sm border border-transparent text-white rounded-md font-semibold hover:bg-[#a3ff01] hover:text-[#0a56a7] transition cursor-pointer"
          >
            Log in
          </button>
          <button 
            onClick={() => openAuthModal("signup")}
            className="px-3 py-2 text-sm border border-transparent text-white rounded-md font-semibold hover:bg-[#a3ff01] hover:text-[#0a56a7] transition cursor-pointer"
          >
            Sign Up
          </button>
          <button className="px-3 py-2 text-sm bg-white text-[#0a56a7] rounded-md font-semibold hover:bg-[#a3ff01] transition cursor-pointer">
            Download App
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden ml-auto p-2 hover:bg-white/10 rounded-lg transition"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-[#0a56a7] border-t border-white/20 py-4">
          <div className="max-w-7xl mx-auto px-4 flex flex-col gap-2 items-center text-center">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-yellow-300 transition font-semibold py-2 w-full"
            >
              HOME
            </Link>
            <Link
              href="/courts"
            <a
              href="#map"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-yellow-300 transition font-semibold py-2 w-full"
            >
              FIND COURTS
            </Link>
            <Link
              href="/players"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-yellow-300 transition font-semibold py-2 w-full"
            >
              PLAYER DIRECTORY
            </Link>

            {/* Mobile Explore */}
            <div className="w-full border-y border-white/20 py-3 my-2">
              <p className="text-yellow-300 font-semibold text-sm mb-3 px-2">EXPLORE</p>
              <div className="space-y-2 px-2">
                {menuCategories.map((category, catIdx) => (
                  <div key={catIdx}>
                    <p className="text-white/70 text-xs font-semibold mb-2">{category.title}</p>
                    <div className="space-y-1 ml-2">
                      {category.items.map((item, itemIdx) => (
                        <Link
                          key={itemIdx}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-2 py-2 px-2 hover:bg-white/10 rounded-lg transition text-white text-xs"
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-white/20 w-full" />
            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 text-white rounded-md font-semibold hover:bg-white/10 transition text-center"
                >
                  <User className="w-4 h-4" />
                  View Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 text-red-300 rounded-md font-semibold hover:bg-red-500/20 transition text-center"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)} className="block w-full px-4 py-2 text-white rounded-md font-semibold hover:bg-white/10 transition text-center">
                  Log in
                </Link>
                <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)} className="block w-full px-4 py-2 text-white rounded-md font-semibold hover:bg-white/10 transition text-center">
                  Sign Up
                </Link>
                <button className="w-full px-4 py-2 bg-white text-[#0a56a7] rounded-md font-semibold hover:bg-[#a3ff01] transition">
                  Download App
                </button>
              </>
            )}
            <button 
              onClick={() => {
                openAuthModal("login");
                setIsMobileMenuOpen(false);
              }} 
              className="block w-full px-4 py-2 text-white rounded-md font-semibold hover:bg-white/10 transition text-center"
            >
              Log in
            </button>
            <button 
              onClick={() => {
                openAuthModal("signup");
                setIsMobileMenuOpen(false);
              }} 
              className="block w-full px-4 py-2 text-white rounded-md font-semibold hover:bg-white/10 transition text-center"
            >
              Sign Up
            </button>
            <button className="w-full px-4 py-2 bg-white text-[#0a56a7] rounded-md font-semibold hover:bg-[#a3ff01] transition">
              Download App
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
