"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Bell, Search, Users, MessageSquare, BarChart3, Trophy, BookOpen, Briefcase, Activity, Wallet, Receipt, User, MapPin } from "lucide-react";
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
  const headerRef = useRef<HTMLElement>(null);

  // Pages that should not have the sidebar
  const noSidebarPages = ['/auth', '/'];
  const shouldShowSidebar = !noSidebarPages.includes(pathname || "") && user !== null;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  // Determine if we're on homepage
  const isHomepage = pathname === '/';
  
  // Hide navbar on non-homepage pages
  if (!isHomepage) {
    return null;
  }

  // Use white background with black text on non-homepage pages
  const useWhiteNavbar = !isHomepage;

  const dropdownContent = {
    Play: {
      categories: [
        {
          title: "COMMUNITY",
          items: [
            { icon: <MapPin className="w-5 h-5" />, label: "Find Courts", desc: "Discover courts near you", href: "/courts" },
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
    <header ref={headerRef} className={`fixed top-0 z-30 transition-all duration-500 left-0 right-0 ${
      useWhiteNavbar
        ? "bg-white shadow-md"
        : isScrolled
        ? "backdrop-blur-lg bg-gradient-to-r from-[#0D3B8C]/85 via-[#1E40AF]/85 to-[#0D3B8C]/85 shadow-xl"
        : "bg-transparent backdrop-blur-none shadow-none"
      }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 md:h-24 lg:h-28">
          {/* Left Side - Logo + Brand */}
          <div className="flex items-center gap-2 sm:gap-3">
              {/* Logo */}
              <div
                onClick={() => {
                  // Find and scroll to the hero section
                  const heroSection = document.querySelector('section');
                  if (heroSection) {
                    heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  } else {
                    // Fallback to home page
                    window.location.href = '/';
                  }
                }}
                className="flex items-center flex-shrink-0 hover:scale-105 active:scale-95 transition-transform cursor-pointer py-2 group"
              >
                <Image
                  alt="PicklePlay Logo"
                  width={40}
                  height={40}
                  src={logo}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full shadow-lg border-2 border-[#FDE047] group-hover:shadow-xl group-hover:shadow-yellow-400/50"
                />
              </div>

              {/* Brand Text */}
              <div className="hidden sm:flex flex-col">
                <span className={`font-black text-lg sm:text-xl md:text-2xl leading-none ${useWhiteNavbar ? 'text-[#1E40AF]' : 'text-white'}`}>PicklePlay</span>
                <span className="text-xs sm:text-sm text-[#FDE047] font-bold tracking-wide">PHILIPPINES</span>
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
                  className={`flex items-center gap-2 px-5 py-2.5 font-bold text-base rounded-lg transition-all duration-200 group-hover:shadow-lg ${
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
                  <div className="absolute left-1/2 -translate-x-1/2 mt-1 w-[400px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
                    <div className="p-6 bg-gradient-to-br from-[#f8fafc] via-white to-[#f0fdf4]">
                      {content.categories.map((category, idx) => (
                        <div key={idx} className={idx > 0 ? "mt-6 pt-6 border-t border-slate-100" : ""}>
                          <h3 className="text-xs font-black text-[#0f2e22] uppercase tracking-wider mb-4">
                            {category.title}
                          </h3>
                          <div className="space-y-2">
                            {category.items.map((item, itemIdx) => (
                              user ? (
                                <Link
                                  key={itemIdx}
                                  href={item.href}
                                  onClick={() => setOpenDropdown(null)}
                                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#a3e635]/15 transition-all group/item border border-transparent hover:border-[#a3e635] hover:shadow-md hover:shadow-[#a3e635]/10"
                                >
                                  <div className="text-[#a3e635] flex-shrink-0 mt-0.5">
                                    {item.icon}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-black text-[#0f2e22] text-sm">
                                      {item.label}
                                    </p>
                                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                                      {item.desc}
                                    </p>
                                  </div>
                                </Link>
                              ) : (
                                <button
                                  key={itemIdx}
                                  onClick={() => {
                                    setOpenDropdown(null);
                                    openAuthModal("login");
                                  }}
                                  className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-[#a3e635]/15 transition-all group/item border border-transparent hover:border-[#a3e635] hover:shadow-md hover:shadow-[#a3e635]/10 text-left"
                                >
                                  <div className="text-[#a3e635] flex-shrink-0 mt-0.5">
                                    {item.icon}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-black text-[#0f2e22] text-sm">
                                      {item.label}
                                    </p>
                                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                                      {item.desc}
                                    </p>
                                  </div>
                                </button>
                              )
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
                    {user.avatar_url ? (
                      <img 
                        src={user.avatar_url} 
                        alt={`${user.first_name} ${user.last_name}`}
                        className="w-9 h-9 rounded-full object-cover shadow-lg border-2 border-white/30 hover:border-white/50"
                      />
                    ) : (
                      <div className="w-9 h-9 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center shadow-lg border-2 border-white/30 hover:border-white/50">
                        <User className="w-5 h-5 text-slate-400 stroke-[1.5]" />
                      </div>
                    )}
                  </button>

                  {/* Profile Dropdown */}
                  {openDropdown === 'profile' && (
                    <div className="absolute right-0 mt-3 w-80 bg-gradient-to-br from-[#f8fafc] via-white to-[#f0fdf4] rounded-xl shadow-2xl border border-[#a3ff01]/20 overflow-hidden z-50 backdrop-blur-sm">
                      <div className="px-4 pt-4">
                        <div className="flex items-center gap-3 mb-2">
                          {user.avatar_url ? (
                            <img 
                              src={user.avatar_url} 
                              alt={`${user.first_name} ${user.last_name}`}
                              className="w-12 h-12 rounded-full object-cover border-2 border-[#a3ff01]/30"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center border-2 border-[#a3ff01]/30">
                              <User className="w-6 h-6 text-[#a3ff01] stroke-[1.5]" />
                            </div>
                          )}
                          <div>
                            <p className="font-black text-sm text-[#0f2e22] truncate max-w-[150px]">{user.first_name} {user.last_name}</p>
                            <p className="text-xs text-slate-600">{user.role}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 space-y-1">
                        <Link
                          href="/profile"
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#a3ff01]/15 transition-all group/item border border-transparent hover:border-[#a3ff01] hover:shadow-md hover:shadow-[#a3ff01]/10"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <Users className="w-5 h-5 text-[#a3ff01] flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-[#0f2e22] text-sm">My Profile</p>
                            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">View your profile</p>
                          </div>
                        </Link>
                        <Link
                          href="/profile#settings"
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#a3ff01]/15 transition-all group/item border border-transparent hover:border-[#a3ff01] hover:shadow-md hover:shadow-[#a3ff01]/10"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <BarChart3 className="w-5 h-5 text-[#a3ff01] flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-[#0f2e22] text-sm">Settings</p>
                            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">Manage preferences</p>
                          </div>
                        </Link>
                        <button
                          onClick={async () => {
                            await logout();
                            setOpenDropdown(null);
                          }}
                          className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-red-50 transition-all group/item border border-transparent hover:border-red-300 hover:shadow-md hover:shadow-red-200/10"
                        >
                          <Trophy className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0 text-left">
                            <p className="font-black text-red-600 text-sm">Logout</p>
                            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">Sign out of account</p>
                          </div>
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
              className="lg:hidden p-2.5 text-white hover:bg-white/10 rounded-xl active:scale-95 transition-all duration-200 touch-target"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="lg:hidden bg-white/98 backdrop-blur-xl border-t border-gray-200 shadow-2xl max-h-[75dvh] overflow-y-auto smooth-scroll">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 space-y-2">
            {Object.entries(dropdownContent).map(([menu, content]) => (
              <div key={menu}>
                <button
                  onClick={() => toggleDropdown(menu)}
                  className="w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 text-slate-700 font-bold hover:bg-gray-100 active:bg-gray-200 rounded-xl transition-all touch-target"
                >
                  <span className="flex items-center gap-2 sm:gap-3">
                    <span className="text-[#a3e635]">
                      {menu === 'Play' && <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />}
                      {menu === 'Connect' && <Users className="w-4 h-4 sm:w-5 sm:h-5" />}
                      {menu === 'Improve' && <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />}
                      {menu === 'Account' && <Activity className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </span>
                    <span className="text-sm sm:text-base">{menu}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform text-[#a3e635] ${openDropdown === menu ? "" : "-rotate-90"}`} />
                </button>
                {openDropdown === menu && (
                  <div className="mt-1 sm:mt-2 ml-3 sm:ml-4 space-y-1 pb-2">
                    {content.categories.map((category, idx) => (
                      <div key={idx}>
                        <p className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-wider px-2 sm:px-3 mb-1.5 sm:mb-2">
                          {category.title}
                        </p>
                        <div className="space-y-1">
                          {category.items.map((item, itemIdx) => (
                            user ? (
                              <Link
                                key={itemIdx}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 text-slate-600 hover:bg-[#a3e635]/15 active:bg-[#a3e635]/25 hover:text-[#0f2e22] rounded-lg transition-all text-xs sm:text-sm font-semibold touch-target"
                              >
                                <div className="text-[#a3e635]">
                                  {item.icon}
                                </div>
                                <span>{item.label}</span>
                              </Link>
                            ) : (
                              <button
                                key={itemIdx}
                                onClick={() => {
                                  setIsMobileMenuOpen(false);
                                  openAuthModal("login");
                                }}
                                className="w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 text-slate-600 hover:bg-[#a3e635]/15 active:bg-[#a3e635]/25 hover:text-[#0f2e22] rounded-lg transition-all text-xs sm:text-sm font-semibold text-left touch-target"
                              >
                                <div className="text-[#a3e635]">
                                  {item.icon}
                                </div>
                                <span>{item.label}</span>
                              </button>
                            )
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <hr className="border-gray-200 my-3 sm:my-4" />

            {user ? (
              <div className="px-3 sm:px-4 py-2 sm:py-3 space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-xl border border-gray-200">
                  {user.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={`${user.first_name} ${user.last_name}`}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-gray-300"
                    />
                  ) : (
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center border-2 border-slate-300">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 stroke-[1.5]" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-slate-900 font-bold text-xs sm:text-sm truncate">{user.first_name} {user.last_name}</p>
                    <p className="text-slate-500 text-[10px] sm:text-xs font-medium truncate">{user.role}</p>
                  </div>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full px-3 sm:px-4 py-2.5 bg-[#0f2e22] text-white font-bold text-center hover:bg-[#1a4332] active:bg-[#0f2e22] rounded-xl transition-all text-xs sm:text-sm touch-target"
                >
                  View Profile
                </Link>
                <button
                  onClick={async () => {
                    await logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-3 sm:px-4 py-2.5 text-red-600 font-bold text-center hover:bg-red-50 active:bg-red-100 rounded-xl transition-all text-xs sm:text-sm border border-red-200 touch-target"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="px-3 sm:px-4 space-y-2">
                <button
                  onClick={() => {
                    openAuthModal("login");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-3 sm:px-4 py-2.5 text-[#0f2e22] font-bold text-xs sm:text-sm hover:bg-gray-100 active:bg-gray-200 rounded-xl transition-all border border-gray-200 touch-target"
                >
                  Log in
                </button>
                <button
                  onClick={() => {
                    openAuthModal("signup");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-3 sm:px-4 py-2.5 bg-[#a3e635] text-[#0f2e22] font-bold text-xs sm:text-sm rounded-xl hover:bg-[#84cc16] active:bg-[#65a30d] transition-all shadow-md touch-target"
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
