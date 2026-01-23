"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ChevronUp } from "lucide-react";
import logo from "../images/PicklePlayLogo.jpg"
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openAuthModal } = useAuth();

  useEffect(() => {
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
          <a href="#map" className="hover:text-yellow-300 transition font-semibold">
            FIND COURTS
          </a>
          <Link href="/shop" className="hover:text-yellow-300 transition font-semibold">
            SHOPS
          </Link>
          <a href="#events-news" className="hover:text-yellow-300 transition font-semibold">
            ARTICLES
          </a>
        </nav>

        {/* Desktop Buttons */}
        <nav className="hidden md:flex gap-4 flex-1 justify-end items-center">
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
          <div className="max-w-7xl mx-auto px-4 flex flex-col gap-4 items-center text-center">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-yellow-300 transition font-semibold py-2 w-full"
            >
              HOME
            </Link>
            <a
              href="#map"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-yellow-300 transition font-semibold py-2 w-full"
            >
              FIND COURTS
            </a>
            <Link
              href="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-yellow-300 transition font-semibold py-2 w-full"
            >
              SHOPS
            </Link>
            <a
              href="#events-news"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-yellow-300 transition font-semibold py-2 w-full"
            >
              EVENTS & NEWS
            </a>
            <hr className="border-white/20 w-full" />
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
