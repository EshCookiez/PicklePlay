"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

interface SidebarLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  children?: SidebarLink[];
}

export default function Sidebar() {
  const [isHovered, setIsHovered] = useState(false);
  const [expandedDashboard, setExpandedDashboard] = useState(true);
  const pathname = usePathname();
  const { logout } = useAuth();

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
    {
      label: "Wallet",
      href: "/wallet",
      icon: <Wallet className="w-5 h-5" />,
    },
    {
      label: "Billing",
      href: "/billing",
      icon: <Receipt className="w-5 h-5" />,
    },
    {
      label: "Messages",
      href: "/messages",
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const isActive = (href: string) => pathname === href;

  const handleLogout = () => {
    logout();
  };

  return (
    <aside
      className={`fixed left-0 top-20 h-[calc(100vh-80px)] bg-gradient-to-b from-[#1E40AF] to-[#1a3a8a] text-white transition-all duration-300 ease-in-out z-30 ${
        isHovered ? "w-64" : "w-24"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-4 py-6 border-b border-white/20">
            {isHovered && (
              <h2 className="text-lg font-bold flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile
              </h2>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
            {dashboardLinks.map((link) => (
              <div key={link.href}>
                {link.children ? (
                  <>
                    <button
                      onClick={() => setExpandedDashboard(!expandedDashboard)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-white/10 justify-between"
                    >
                      <span className="flex items-center gap-3">
                        {link.icon}
                        {isHovered && (
                          <span className="font-medium text-sm">
                            {link.label}
                          </span>
                        )}
                      </span>
                      {isHovered && (
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            expandedDashboard ? "" : "-rotate-90"
                          }`}
                        />
                      )}
                    </button>

                    {/* Nested Items */}
                    {expandedDashboard && isHovered && (
                      <div className="ml-4 space-y-2 mt-2">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                              isActive(child.href)
                                ? "bg-white/20 font-semibold"
                                : "hover:bg-white/10"
                            }`}
                          >
                            {child.icon}
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 justify-center hover:bg-white/10`}
                    title={!isHovered ? link.label : ""}
                  >
                    <span>{link.icon}</span>
                    {isHovered && (
                      <span className="font-medium text-sm">{link.label}</span>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="border-t border-white/20 p-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-500/20 rounded-lg transition-colors duration-200 font-medium text-sm justify-center hover:justify-start"
              title={!isHovered ? "Logout" : ""}
            >
              <LogOut className="w-5 h-5" />
              {isHovered && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
  );
}
