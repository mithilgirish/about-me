"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Experience", href: "/experience" },
  { name: "Projects", href: "/projects" },
  { name: "Gallery", href: "/gallery" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Automatically close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle navigation reliably on mobile touch
  const handleNavigation = (href: string) => {
    triggerHaptic("selection");
    setIsOpen(false);
    if (pathname !== href) {
      router.push(href);
    }
  };

  return (
    <nav className="relative z-50 flex items-center justify-between p-4 bg-black/60 backdrop-blur-md border-b border-white/5">
      {/* Left: Logo */}
      <Link
        href="/"
        className="flex items-center group touch-manipulation"
        onClick={() => triggerHaptic("light")}
      >
        <img
          src="/logos/mg-logo.png"
          alt="Mithil Girish"
          className="w-8 h-8 rounded-xl object-cover border border-white/10 shadow-sm transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex space-x-8 items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => triggerHaptic("light")}
              className={`text-sm transition-colors duration-200 ${
                isActive
                  ? "text-white font-medium"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Mobile Menu Button */}
      <button
        type="button"
        aria-label={isOpen ? "Close Menu" : "Open Menu"}
        className="md:hidden text-gray-300 hover:text-white transition-colors p-2 rounded-lg active:bg-white/10 touch-manipulation"
        onClick={() => {
          triggerHaptic("medium");
          setIsOpen(!isOpen);
        }}
      >
        {isOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* Mobile Backdrop & Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop overlay to close when tapping outside */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Dropdown Menu Panel */}
          <div className="absolute top-16 right-4 w-60 max-w-[85vw] bg-zinc-900/95 backdrop-blur-xl p-3 rounded-2xl border border-white/15 shadow-2xl flex flex-col space-y-1 md:hidden z-50 animate-in fade-in zoom-in-95 duration-150">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all duration-150 flex items-center justify-between touch-manipulation active:scale-[0.98] ${
                    isActive
                      ? "bg-blue-500/20 text-white border border-blue-500/30"
                      : "text-gray-200 hover:text-white hover:bg-white/10 active:bg-white/15"
                  }`}
                >
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </nav>
  );
}

