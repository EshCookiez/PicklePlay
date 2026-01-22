"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import logo from "../images/PicklePlayLogo.jpg"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`sticky top-0 z-50 text-white transition-all duration-500 ${isScrolled ? "py-3 px-4" : "py-0 px-0"}`} >
      <div className={`mx-auto flex items-center justify-between gap-4 relative h-16 transition-all duration-500 ${isScrolled ? "max-w-5xl rounded-2xl px-5 bg-[#0a56a7]/80 backdrop-blur-md border border-[#0a56a7]/60 shadow-2xl" : "max-w-full px-4 md:px-8 bg-[#0a56a7]"}`}>
        {/* Logo - Static on mobile, animated on desktop */}
        <div className={`absolute z-40 transition-all duration-500 ease-in-out ${
          isScrolled 
            ? "left-4 md:left-5 top-1/2 -translate-y-1/2" 
            : "left-4 md:left-8 top-1/2 -translate-y-1/2 md:top-auto md:-translate-y-0 md:-bottom-8"
        }`}>
          <Image
            alt="PicklePlay Logo"
            width={isScrolled ? 40 : 80}
            height={isScrolled ? 40 : 80}
            src={logo}
            className="rounded-full shadow-2xl transition-all duration-500 ease-in-out w-10 h-10 md:w-auto md:h-auto"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className={`hidden md:flex gap-8 flex-1 transition-all text-white duration-500 ease-in-out ${isScrolled ? "pl-16" : "pl-40"}`}>
          <Link href="/" className="hover:text-yellow-300 transition font-semibold">
            HOME
          </Link>
          <a href="#" className="hover:text-yellow-300 transition font-semibold">
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
          <Link href="/auth" className="px-3 py-2 text-sm border border-transparent text-white rounded-md font-semibold hover:bg-[#a3ff01] hover:text-[#0a56a7] transition cursor-pointer">
            Log in
          </Link>
          <Link href="/auth" className="px-3 py-2 text-sm border border-transparent text-white rounded-md font-semibold hover:bg-[#a3ff01] hover:text-[#0a56a7] transition cursor-pointer">
            Sign Up
          </Link>
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
              href="#"
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
            <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)} className="block w-full px-4 py-2 text-white rounded-md font-semibold hover:bg-white/10 transition text-center">
              Log in
            </Link>
            <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)} className="block w-full px-4 py-2 text-white rounded-md font-semibold hover:bg-white/10 transition text-center">
              Sign Up
            </Link>
            <button className="w-full px-4 py-2 bg-white text-[#0a56a7] rounded-md font-semibold hover:bg-[#a3ff01] transition">
              Download App
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
