"use client"

import { Navigation } from "@/components/navigation"
import { PixelGrid } from "@/components/pixel-grid"
import { InfoSections } from "@/components/info-sections"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navigation />

      <main className="pt-20 pb-8">
        {/* Minimal Header - Grid is the STAR */}
        <section className="w-full">
          <div className="text-center mb-6 px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                Million Dollar CryptoPage
              </span>
            </h1>
            <p className="text-sm md:text-base text-gray-400">
              1,000,000 pixels • $1 per pixel • Own a piece of internet history
            </p>
          </div>

          {/* Grid Container - HERO SECTION */}
          <div className="w-full flex justify-center px-2 md:px-4">
            <PixelGrid />
          </div>
        </section>

        {/* Minimal Info - Collapsible */}
        <section className="max-w-7xl mx-auto px-4 py-12 mt-8">
          <InfoSections />
        </section>

        {/* Footer */}
        <footer className="border-t border-cyan-500/10 py-6 px-4 mt-8">
          <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
            <p>&copy; 2025 Million Dollar CryptoPage. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  )
}
