"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // hamburger + close icons

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between p-4 bg-black/60 backdrop-blur-md z-20 relative">
      {/* Left: Logo */}
      <a href="/" className="flex items-center">
        <img src="/favicon.ico" alt="Logo" className="w-7 h-7" />
      </a>

      {/* Desktop Nav */}
      <div className="hidden md:flex space-x-8">
        <a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a>
        <a href="/about" className="text-gray-300 hover:text-white transition-colors">About</a>
        <a href="/experience" className="text-gray-300 hover:text-white transition-colors">Experience</a>
        <a href="/projects" className="text-gray-300 hover:text-white transition-colors">Projects</a>
        <a href="/gallery" className="text-gray-300 hover:text-white transition-colors">Gallery</a>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-300 hover:text-white transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-16 right-4 bg-gray-800/20 backdrop-blur-md p-6 rounded-xl border border-gray-700/30 shadow-lg flex flex-col space-y-4 md:hidden z-50">
          <a href="/" className="text-gray-300 hover:text-white transition-colors" onClick={() => setIsOpen(false)}>Home</a>
          <a href="/about" className="text-gray-300 hover:text-white transition-colors" onClick={() => setIsOpen(false)}>About</a>
          <a href="/experience" className="text-gray-300 hover:text-white transition-colors" onClick={() => setIsOpen(false)}>Experience</a>
          <a href="/projects" className="text-gray-300 hover:text-white transition-colors" onClick={() => setIsOpen(false)}>Projects</a>
          <a href="/gallery" className="text-gray-300 hover:text-white transition-colors" onClick={() => setIsOpen(false)}>Gallery</a>
        </div>
      )}
    </nav>
  );
}
