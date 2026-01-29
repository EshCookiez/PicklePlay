"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Bell, Search, Users, MessageSquare, BarChart3, Trophy, BookOpen, Briefcase, Activity, Wallet, Receipt } from "lucide-react";
import logo from "../images/PicklePlayLogo.jpg"
import { useAuth } from "@/contexts/AuthContext";

interface UserProfile {
  name: string;
  rank: number;
  points: number;
  avatar: string;
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { user, logout, openAuthModal } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  // Determine if we're on homepage
  const isHomepage = pathname === '/';
  // Use white background with black text on non-homepage pages
  const useWhiteNavbar = !isHomepage;

  const dropdownContent = {
    Play: {
      categories: [
        {
          title: "COMMUNITY",
          items: [
            { icon: <Users className="w-5 h-5" />, label: "Player Directory", desc: "Find partners based on skill", href: "/players" },
            { icon: <Trophy className="w-5 h-5" />, label: "Tournaments", desc: "Join local competitions", href: "/tournaments" },
          ]
        }
      ]
    },
    Connect: {
      categories: [
        {
          title: "COMMUNITY",
          items: [
            { icon: <Users className="w-5 h-5" />, label: "Player Directory", desc: "Find partners based on skill", href: "/players" },
            { icon: <MessageSquare className="w-5 h-5" />, label: "Team Hub", desc: "Create or join competitive teams", href: "/teams" },
            { icon: <MessageSquare className="w-5 h-5" />, label: "Social Feed", desc: "See what your friends are playing", href: "/community" },
          ]
        },
        {
          title: "COMPETITIONS",
          items: [
            { icon: <BarChart3 className="w-5 h-5" />, label: "Leaderboards", desc: "Regional and national rankings", href: "/rankings" },
            { icon: <Trophy className="w-5 h-5" />, label: "Point Rewards", desc: "Exchange points for gear", href: "/rewards" },
          ]
        }
      ]
    },
    Improve: {
      categories: [
        {
          title: "TRENDING NOW",
          items: [
            { icon: <Briefcase className="w-5 h-5" />, label: "Coaching", desc: "Book lessons & improve", href: "/coaching" },
            { icon: <BookOpen className="w-5 h-5" />, label: "Articles & Tips", desc: "Learn from the pros", href: "/articles" },
          ]
        }
      ]
    },
    Account: {
      categories: [
        {
          title: "YOUR ACCOUNT",
          items: [
            { icon: <Activity className="w-5 h-5" />, label: "Activity & Stats", desc: "Track your performance", href: "/activity" },
            { icon: <Wallet className="w-5 h-5" />, label: "Wallet", desc: "Manage your funds", href: "/wallet" },
            { icon: <Receipt className="w-5 h-5" />, label: "Billing", desc: "View invoices & plans", href: "/billing" },
          ]
        }
      ]
    },
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      useWhiteNavbar
        ? "bg-white shadow-md border-b border-gray-200"
        : isScrolled
        ? "backdrop-blur-lg bg-gradient-to-r from-[#0D3B8C]/85 via-[#1E40AF]/85 to-[#0D3B8C]/85 shadow-xl border-b border-white/20"
        : "bg-transparent backdrop-blur-none border-b border-transparent shadow-none"
      }`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Left Side - Logo + Brand */}
          <div className="flex items-center gap-3">
              {/* Logo */}
              <div
                onClick={() => {
                  if (pathname === '/') {
                    window.location.reload();
                  } else {
                    window.location.href = '/';
                  }
                }}
                className="flex items-center flex-shrink-0 hover:scale-105 transition-transform cursor-pointer py-2 group"
              >
                <Image
                  alt="PicklePlay Logo"
                  width={56}
                  height={56}
                  src={logo}
                  className="rounded-full shadow-lg border-2 border-[#FDE047] group-hover:shadow-xl group-hover:shadow-yellow-400/50"
                />
              </div>

              {/* Brand Text */}
              <div className="hidden sm:flex flex-col">
                <span className={`font-black text-lg leading-none ${useWhiteNavbar ? 'text-[#1E40AF]' : 'text-white'}`}>PicklePlay</span>
                <span className="text-xs text-[#FDE047] font-bold tracking-wide">PHILIPPINES</span>
              </div>
            </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center ml-8">
            {Object.entries(dropdownContent).map(([menu, content]) => (
              <div
                key={menu}
                className="relative group"
              >
                <button
                  onClick={() => toggleDropdown(menu)}
                  className={`flex items-center gap-2 px-4 py-2 font-bold text-sm rounded-lg transition-all duration-200 group-hover:shadow-lg ${
                    useWhiteNavbar 
                      ? 'text-[#1E40AF] hover:bg-blue-50 hover:text-[#0D3B8C]'
                      : 'text-white hover:bg-white/20 hover:text-[#FDE047]'
                  }`}
                >
                  {menu}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openDropdown === menu ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                {openDropdown === menu && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-1 w-[400px] bg-white rounded-xl shadow-2xl border border-blue-100 overflow-hidden animate-fadeIn">
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-white">
                      {content.categories.map((category, idx) => (
                        <div key={idx} className={idx > 0 ? "mt-6 pt-6 border-t border-blue-100" : ""}>
                          <h3 className="text-xs font-black text-[#1E40AF] uppercase tracking-wider mb-4">
                            {category.title}
                          </h3>
                          <div className="space-y-1">
                            {category.items.map((item, itemIdx) => (
                              <Link
                                key={itemIdx}
                                href={item.href}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#FDE047]/20 transition-all group/item border border-transparent hover:border-[#FDE047]"
                              >
                                <div className="text-[#1E40AF] flex-shrink-0 mt-0.5">
                                  {item.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-black text-[#1E40AF] text-sm group-hover/item:text-[#1E40AF]">
                                    {item.label}
                                  </p>
                                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
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
                )}
              </div>
            ))}
          </nav>

          {/* Right Side - Search, Stats, Notifications, Profile */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Search Icon */}
            <button className={`hidden lg:flex p-2.5 rounded-lg transition-all duration-200 ${
              useWhiteNavbar
                ? 'text-[#1E40AF] hover:bg-blue-50'
                : 'text-white hover:bg-white/20 hover:text-[#FDE047]'
            }`}>
              <Search className="w-5 h-5" />
            </button>

            {/* User Profile / Auth */}
            {user ? (
              <>
                {/* User Stats */}
                <div className={`hidden lg:flex items-center gap-3 px-3 py-2 rounded-lg backdrop-blur-sm border transition-all ${
                  useWhiteNavbar
                    ? 'bg-blue-50 border-blue-200 hover:border-blue-300'
                    : 'bg-white/10 border-white/20 hover:border-[#FDE047]/30'
                }`}>
                  <div className="text-right">
                    <p className={`text-xs font-bold ${
                      useWhiteNavbar ? 'text-gray-600' : 'text-white/70'
                    }`}>
                      RANK <span className="font-black text-[#FDE047]">#--</span>
                    </p>
                    <p className={`text-xs font-bold ${
                      useWhiteNavbar ? 'text-gray-600' : 'text-white/70'
                    }`}>
                      POINTS <span className="font-black text-[#FDE047]">0</span>
                    </p>
                  </div>
                </div>

                {/* Notification Bell */}
                <button className={`relative p-2.5 rounded-lg transition-all duration-200 ${
                  useWhiteNavbar
                    ? 'text-[#1E40AF] hover:bg-blue-50'
                    : 'text-white hover:bg-white/20 hover:text-[#FDE047]'
                }`}>
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FDE047] rounded-full border border-[#1E40AF] shadow-lg"></span>
                </button>

                {/* User Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown('profile')}
                    className="flex items-center gap-2 hover:scale-105 transition-transform"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-[#FDE047] to-yellow-300 rounded-full flex items-center justify-center font-bold text-[#1E40AF] text-sm shadow-lg border-2 border-white/30 hover:border-white/50">
                      {user.first_name?.[0] || 'U'}
                    </div>
                  </button>

                  {/* Profile Dropdown */}
                  {openDropdown === 'profile' && (
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-[#FDE047]/20 overflow-hidden z-50 backdrop-blur-sm">
                      <div className="p-4 bg-gradient-to-r from-[#1E40AF] to-blue-700 text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#FDE047] rounded-full flex items-center justify-center font-bold text-lg text-[#1E40AF] border-2 border-white/30">
                            {user.first_name?.[0] || 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-sm truncate max-w-[150px]">{user.first_name} {user.last_name}</p>
                            <p className="text-xs text-white/80">{user.role}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-2.5 text-[#1E40AF] hover:bg-blue-50 rounded-lg transition-all text-sm font-bold"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <Users className="w-4 h-4" />
                          My Profile
                        </Link>
                        <Link
                          href="/profile#settings"
                          className="flex items-center gap-3 px-4 py-2.5 text-[#1E40AF] hover:bg-blue-50 rounded-lg transition-all text-sm font-bold"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <BarChart3 className="w-4 h-4" />
                          Settings
                        </Link>
                        <button
                          onClick={async () => {
                            await logout();
                            setOpenDropdown(null);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm font-bold"
                        >
                          <Trophy className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <button
                  onClick={() => openAuthModal("login")}
                  className="px-4 py-2 text-white font-bold text-sm hover:bg-white/20 hover:text-[#FDE047] rounded-lg transition-all duration-200"
                >
                  Login
                </button>
                <button
                  onClick={() => openAuthModal("signup")}
                  className="px-4 py-2 bg-[#FDE047] text-[#1E40AF] font-bold text-sm rounded-lg hover:bg-yellow-300 hover:shadow-lg hover:shadow-yellow-400/50 transition-all duration-200"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="lg:hidden bg-[#1E40AF]/98 backdrop-blur-xl border-t border-white/20 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            {Object.entries(dropdownContent).map(([menu, content]) => (
              <div key={menu}>
                <button
                  onClick={() => toggleDropdown(menu)}
                  className="w-full flex items-center justify-between px-4 py-3 text-white font-black hover:bg-white/20 rounded-lg transition-all"
                >
                  {menu}
                  <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === menu ? "rotate-180" : ""}`} />
                </button>
                {openDropdown === menu && (
                  <div className="mt-2 ml-4 space-y-3 pb-2">
                    {content.categories.map((category, idx) => (
                      <div key={idx}>
                        <p className="text-xs font-black text-white/60 uppercase tracking-wider px-3 mb-2">
                          {category.title}
                        </p>
                        <div className="space-y-1">
                          {category.items.map((item, itemIdx) => (
                            <Link
                              key={itemIdx}
                              href={item.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 text-white hover:bg-white/20 rounded-lg transition-all text-sm font-bold"
                            >
                              <div className="text-[#FDE047]">
                                {item.icon}
                              </div>
                              <span className="font-black">{item.label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <hr className="border-white/20 my-4" />

            {user ? (
              <div className="px-4 py-3 space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white/20 rounded-lg border border-white/30">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#FDE047] to-yellow-300 rounded-full flex items-center justify-center font-black text-[#1E40AF] border-2 border-white/20">
                    {user.first_name?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="text-white font-black text-sm">{user.first_name} {user.last_name}</p>
                    <p className="text-white/70 text-xs font-bold">{user.role}</p>
                  </div>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full px-4 py-2.5 text-white font-black text-center hover:bg-white/20 rounded-lg transition-all text-sm"
                >
                  View Profile
                </Link>
                <button
                  onClick={async () => {
                    await logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-[#FDE047] font-black text-center hover:bg-white/20 rounded-lg transition-all text-sm border border-[#FDE047]/40"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="px-4 space-y-2">
                <button
                  onClick={() => {
                    openAuthModal("login");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-white font-black text-sm hover:bg-white/20 rounded-lg transition-all"
                >
                  Log in
                </button>
                <button
                  onClick={() => {
                    openAuthModal("signup");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2.5 bg-[#FDE047] text-[#1E40AF] font-black text-sm rounded-lg hover:bg-yellow-300 transition-all shadow-md"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </nav>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </header>
  );
}
