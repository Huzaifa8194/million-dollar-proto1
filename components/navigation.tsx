"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-slate-950/95 backdrop-blur-lg border-b border-cyan-500/20 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded shadow-lg shadow-cyan-500/50 group-hover:shadow-cyan-500/80 transition-all" />
          <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent hidden sm:inline">
            Million Dollar CryptoPage
          </span>
          <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent sm:hidden">
            MDCP
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 ml-auto">
          <Link href="#about" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">
            About
          </Link>
          <Link href="#faq" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">
            FAQ
          </Link>
          <Link href="#nft-auction" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">
            NFT Auction
          </Link>
          <Link href="#press" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">
            Press
          </Link>
          <Link href="#contact" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">
            Contact Me
          </Link>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all">
            Buy Pixels
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-400 hover:text-cyan-400 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900/98 backdrop-blur-lg border-b border-cyan-500/20">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="#about"
              className="block text-sm text-gray-400 hover:text-cyan-400 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="#faq"
              className="block text-sm text-gray-400 hover:text-cyan-400 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <Link
              href="#nft-auction"
              className="block text-sm text-gray-400 hover:text-cyan-400 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              NFT Auction
            </Link>
            <Link
              href="#press"
              className="block text-sm text-gray-400 hover:text-cyan-400 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Press
            </Link>
            <Link
              href="#contact"
              className="block text-sm text-gray-400 hover:text-cyan-400 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Me
            </Link>
            <Button
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-semibold shadow-lg shadow-cyan-500/30"
              onClick={() => setMobileMenuOpen(false)}
            >
              Buy Pixels
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
