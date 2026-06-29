"use client";
import Link from "next/link";
import { useState } from "react";
import SearchBar from "./SearchBar";
import DarkModeToggle from "./DarkModeToggle";
import AuthButton from "./AuthButton";
import StreakCounter from "./StreakCounter";
import XPBar from "./XPBar";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🚀</span>
            <span className="font-bold text-xl">DevOps Formation</span>
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            <SearchBar />
            <Link href="/" className="hover:text-blue-400 transition-colors">Accueil</Link>
            <Link href="/cours" className="hover:text-blue-400 transition-colors">Cours</Link>
            <Link href="/profil" className="hover:text-blue-400 transition-colors">Profil</Link>
            <StreakCounter />
            <XPBar />
            <DarkModeToggle />
            <AuthButton />
          </div>
          <div className="flex md:hidden items-center gap-2">
            <StreakCounter />
            <DarkModeToggle />
            <button className="p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-gray-800 px-4 pb-4 space-y-2">
          <Link href="/" className="block py-2 hover:text-blue-400" onClick={() => setIsOpen(false)}>Accueil</Link>
          <Link href="/cours" className="block py-2 hover:text-blue-400" onClick={() => setIsOpen(false)}>Cours</Link>
          <Link href="/profil" className="block py-2 hover:text-blue-400" onClick={() => setIsOpen(false)}>Profil</Link>
          <div className="pt-2"><AuthButton /></div>
        </div>
      )}
    </nav>
  );
}
