"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Activity,
  User,
  Wallet,
  Receipt,
  MessageSquare,
  Settings,
  LogOut,
  ChevronDown,
  LayoutGrid,
  Users,
  Trophy,
  BarChart3,
  Briefcase,
  BookOpen,
  Gamepad2,
  Network,
  Lightbulb,
  Home,
  Menu,
  X,
} from "lucide-react";
import logo from "@/images/PicklePlayLogo.jpg";

interface SidebarLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  children?: SidebarLink[];
}

export default function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({
    Play: false,
    Connect: false,
    Improve: false,
    Account: false,
    Dashboard: false,
  });
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const toggleMenu = (menu: string) => {
    setExpandedMenus(prev => {
      if (prev[menu]) {
        return { ...prev, [menu]: false };
      }
      return {
        Play: false,
        Connect: false,
        Improve: false,
        Account: false,
        Dashboard: false,
        [menu]: true
      };
    });
  };

  const dropdownContent = {
    Play: [
      { icon: <Users className="w-4 h-4" />, label: "Player Directory", href: "/players" },
      { icon: <Trophy className="w-4 h-4" />, label: "Tournaments", href: "/tournaments" },
    ],
    Connect: [
      { icon: <Users className="w-4 h-4" />, label: "Player Directory", href: "/players" },
      { icon: <MessageSquare className="w-4 h-4" />, label: "Team Hub", href: "/teams" },
      { icon: <BarChart3 className="w-4 h-4" />, label: "Leaderboards", href: "/rankings" },
      { icon: <Trophy className="w-4 h-4" />, label: "Point Rewards", href: "/rewards" },
    ],
    Improve: [
      { icon: <Briefcase className="w-4 h-4" />, label: "Coaching", href: "/coaching" },
      { icon: <BookOpen className="w-4 h-4" />, label: "Articles & Tips", href: "/articles" },
    ],
    Account: [
      { icon: <Activity className="w-4 h-4" />, label: "Activity & Stats", href: "/activity" },
      { icon: <Wallet className="w-4 h-4" />, label: "Wallet", href: "/wallet" },
      { icon: <Receipt className="w-4 h-4" />, label: "Billing", href: "/billing" },
    ],
  };

  const dashboardLinks: SidebarLink[] = [
    {
      label: "Dashboard",
      href: "#",
      icon: <LayoutGrid className="w-5 h-5" />,
      children: [
        {
          label: "Activity",
          href: "/activity",
          icon: <Activity className="w-4 h-4" />,
        },
        {
          label: "Traffic",
          href: "/traffic",
          icon: <Activity className="w-4 h-4" />,
        },
        {
          label: "Statistic",
          href: "/statistic",
          icon: <Activity className="w-4 h-4" />,
        },
      ],
    },
  ];

  const handleLogout = () => {
    logout();
  };

  const getMenuIcon = (name: string) => {
    switch(name) {
      case 'Play':
        return <Gamepad2 className="w-5 h-5 text-lime-500" />;
      case 'Connect':
        return <Network className="w-5 h-5 text-lime-500" />;
      case 'Improve':
        return <Lightbulb className="w-5 h-5 text-lime-500" />;
      case 'Account':
        return <BarChart3 className="w-5 h-5 text-lime-500" />;
      default:
        return <LayoutGrid className="w-5 h-5 text-lime-500" />;
    }
  };

  return (
    <>
      {/* Mobile Menu Toggle Button - Fixed at top */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        aria-label="Toggle sidebar"
      >
        {isMobileOpen ? (
          <X className="w-6 h-6 text-slate-700" />
        ) : (
          <Menu className="w-6 h-6 text-slate-700" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar - Always Full Width */}
      <aside
        className="hidden lg:block fixed left-0 top-0 h-screen w-72 backdrop-blur-md bg-white/95 border-r border-gray-200 text-slate-900 z-40"
      >
        <div className="h-full flex flex-col">
          {/* Logo Section - Always Visible */}
          <div className="flex items-center justify-center px-2 py-4 border-b border-gray-200">
            <button 
              onClick={() => router.push('/')}
              className="flex items-center justify-center gap-3 hover:scale-105 transition-transform cursor-pointer"
            >
              <Image
                src={logo}
                alt="PicklePlay Logo"
                width={56}
                height={56}
                className="rounded-full shadow-lg border-2 border-[#FDE047] hover:shadow-xl hover:shadow-yellow-400/50"
              />
              <div className="hidden sm:flex flex-col flex-1">
                <span className="font-black text-lg leading-none text-slate-900">PicklePlay</span>
                <span className="text-xs text-[#FDE047] font-bold tracking-wide">PHILIPPINES</span>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
            {/* Social Feed Link - Above Play Menu */}
            <Link
              href="/community"
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-100 text-slate-700"
            >
              <span className="text-lime-500"><MessageSquare className="w-5 h-5" /></span>
              <span className="font-medium text-sm">Social Feed</span>
            </Link>

            {/* Dropdown Menus */}
            {Object.entries(dropdownContent).map(([menuName, items]) => (
              <div key={menuName}>
                <button
                  onClick={() => toggleMenu(menuName)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-gray-100 justify-between text-slate-700"
                >
                  <span className="flex items-center gap-3">
                    {getMenuIcon(menuName)}
                    <span className="font-medium text-sm">
                      {menuName}
                    </span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 text-lime-500 ${
                      expandedMenus[menuName] ? "" : "-rotate-90"
                    }`}
                  />
                </button>

                {/* Nested Items */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedMenus[menuName] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="ml-4 space-y-2 mt-2">
                    {items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm hover:bg-gray-100 text-slate-700"
                      >
                        <span className="text-lime-500">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Dashboard and other links */}
            {dashboardLinks.map((link) => (
              <div key={link.href}>
                {link.children ? (
                  <>
                    <button
                      onClick={() => toggleMenu('Dashboard')}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-gray-100 justify-between text-slate-700"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-lime-500">{link.icon}</span>
                        <span className="font-medium text-sm">
                          {link.label}
                        </span>
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 text-lime-500 ${
                          expandedMenus['Dashboard'] ? "" : "-rotate-90"
                        }`}
                      />
                    </button>

                    {/* Nested Items */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        expandedMenus['Dashboard'] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="ml-4 space-y-2 mt-2">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                              pathname === child.href
                                ? "bg-slate-100 font-semibold text-slate-900"
                                : "hover:bg-gray-100 text-slate-700"
                            }`}
                          >
                            <span className="text-lime-500">{child.icon}</span>
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-100 text-slate-700`}
                  >
                    <span className="text-lime-500">{link.icon}</span>
                    <span className="font-medium text-sm">{link.label}</span>
                  </Link>
                )}
              </div>
            ))}

            {/* Settings Link */}
            <Link
              href="/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-100 text-slate-700"
            >
              <span className="text-lime-500"><Settings className="w-5 h-5" /></span>
              <span className="font-medium text-sm">Settings</span>
            </Link>
          </nav>

          {/* User Profile Section */}
          <div className="border-t border-gray-200 p-3">
            <Link
              href="/profile"
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 hover:border-gray-200 transition-all cursor-pointer"
            >
              {user?.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt={`${user.first_name} ${user.last_name}`}
                  className="w-14 h-14 rounded-full object-cover flex-shrink-0 shadow-md"
                />
              ) : (
                <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <User className="w-7 h-7 text-slate-400 stroke-[1.5]" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate text-slate-900">{user?.first_name} {user?.last_name}</p>
                <p className="text-xs text-slate-600">{user?.role}</p>
              </div>
            </Link>
          </div>

          {/* Logout Button */}
          <div className="border-t border-gray-200 p-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 font-medium text-sm"
            >
              <LogOut className="w-5 h-5 text-lime-500" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar - Slide in from left */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-screen w-72 backdrop-blur-md bg-white/98 border-r border-gray-200 text-slate-900 z-40 transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="flex items-center justify-center px-4 py-4 border-b border-gray-200 mt-14">
            <button 
              onClick={() => {
                router.push('/');
                setIsMobileOpen(false);
              }}
              className="flex items-center gap-3 hover:scale-105 transition-transform cursor-pointer"
            >
              <Image
                src={logo}
                alt="PicklePlay Logo"
                width={48}
                height={48}
                className="rounded-full shadow-lg border-2 border-[#FDE047]"
              />
              <div className="flex flex-col">
                <span className="font-black text-lg leading-none text-slate-900">PicklePlay</span>
                <span className="text-xs text-[#FDE047] font-bold tracking-wide">PHILIPPINES</span>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
            {/* Social Feed Link - Above Play Menu */}
            <Link
              href="/community"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-gray-100 text-slate-700"
            >
              <span className="text-lime-500"><MessageSquare className="w-5 h-5" /></span>
              <span className="font-semibold text-sm">Social Feed</span>
            </Link>

            {/* Dropdown Menus */}
            {Object.entries(dropdownContent).map(([menuName, items]) => (
              <div key={menuName}>
                <button
                  onClick={() => toggleMenu(menuName)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-gray-100 justify-between text-slate-700"
                >
                  <span className="flex items-center gap-3">
                    {getMenuIcon(menuName)}
                    <span className="font-semibold text-sm">{menuName}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 text-lime-500 ${
                      expandedMenus[menuName] ? "" : "-rotate-90"
                    }`}
                  />
                </button>

                {/* Nested Items */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedMenus[menuName] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="ml-4 space-y-1 mt-2">
                    {items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                          pathname === item.href
                            ? "bg-[#a3e635]/20 text-[#0f2e22] font-semibold border border-[#a3e635]/30"
                            : "hover:bg-gray-100 text-slate-600"
                        }`}
                      >
                        <span className="text-lime-500">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Dashboard Links */}
            {dashboardLinks.map((link) => (
              <div key={link.href}>
                {link.children ? (
                  <>
                    <button
                      onClick={() => toggleMenu('Dashboard')}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-gray-100 justify-between text-slate-700"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-lime-500">{link.icon}</span>
                        <span className="font-semibold text-sm">{link.label}</span>
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 text-lime-500 ${
                          expandedMenus['Dashboard'] ? "" : "-rotate-90"
                        }`}
                      />
                    </button>

                    {/* Nested Items */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        expandedMenus['Dashboard'] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="ml-4 space-y-1 mt-2">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setIsMobileOpen(false)}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                              pathname === child.href
                                ? "bg-[#a3e635]/20 text-[#0f2e22] font-semibold border border-[#a3e635]/30"
                                : "hover:bg-gray-100 text-slate-600"
                            }`}
                          >
                            <span className="text-lime-500">{child.icon}</span>
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-gray-100 text-slate-700`}
                  >
                    <span className="text-lime-500">{link.icon}</span>
                    <span className="font-semibold text-sm">{link.label}</span>
                  </Link>
                )}
              </div>
            ))}

            {/* Settings Link */}
            <Link
              href="/settings"
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-gray-100 text-slate-700 ${
                pathname === "/settings" ? "bg-[#a3e635]/20 border border-[#a3e635]/30" : ""
              }`}
            >
              <span className="text-lime-500"><Settings className="w-5 h-5" /></span>
              <span className="font-semibold text-sm">Settings</span>
            </Link>
          </nav>

          {/* User Profile Section */}
          <div className="border-t border-gray-200 p-3">
            <Link
              href="/profile"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 hover:border-gray-200 transition-all"
            >
              {user?.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt={`${user.first_name} ${user.last_name}`}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0 shadow-md"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <User className="w-6 h-6 text-slate-400 stroke-[1.5]" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate text-slate-900">{user?.first_name} {user?.last_name}</p>
                <p className="text-xs text-slate-500">{user?.role}</p>
              </div>
            </Link>
          </div>

          {/* Logout Button */}
          <div className="border-t border-gray-200 p-3">
            <button
              onClick={() => {
                handleLogout();
                setIsMobileOpen(false);
              }}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200 font-semibold text-sm"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/98 backdrop-blur-md border-t border-gray-200 z-40 safe-area-inset-bottom">
        <div className="flex items-center justify-around py-2 px-2">
          <Link
            href="/"
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
              pathname === "/" ? "text-[#a3e635]" : "text-slate-500"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Home</span>
          </Link>
          <Link
            href="/profile"
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
              pathname === "/profile" ? "text-[#a3e635]" : "text-slate-500"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Profile</span>
          </Link>
          <Link
            href="/activity"
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
              pathname === "/activity" ? "text-[#a3e635]" : "text-slate-500"
            }`}
          >
            <Activity className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Activity</span>
          </Link>
          <Link
            href="/wallet"
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
              pathname === "/wallet" ? "text-[#a3e635]" : "text-slate-500"
            }`}
          >
            <Wallet className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Wallet</span>
          </Link>
          <Link
            href="/settings"
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
              pathname === "/settings" ? "text-[#a3e635]" : "text-slate-500"
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Settings</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
