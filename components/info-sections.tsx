"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export function InfoSections() {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="space-y-8">
      {/* Collapsible Header */}
      <div className="text-center">
        <button
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors text-sm"
        >
          <span>{expanded ? "Hide" : "Show"} Info</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Collapsible Content */}
      {expanded && (
        <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-300">
          {/* How It Works - Compact */}
          <section id="about" className="space-y-4">
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  step: "1",
                  title: "Select Pixels",
                  description: "Click on the grid to choose your pixel block. Minimum 10x10.",
                },
                {
                  step: "2",
                  title: "Submit & Pay",
                  description: "Enter your details and pay in USDT via blockchain.",
                },
                {
                  step: "3",
                  title: "Go Live",
                  description: "Your logo appears on the canvas once approved.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="bg-slate-900/50 border border-cyan-500/20 rounded-lg p-4 hover:border-cyan-400/50 transition-all"
                >
                  <div className="w-10 h-10 bg-cyan-400/10 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-xl font-bold text-cyan-400">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-1 text-white">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="space-y-4">
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              FAQ
            </h2>
            <div className="bg-slate-900/50 border border-cyan-500/20 rounded-lg p-6 space-y-4 text-sm">
              <div>
                <h3 className="font-semibold text-cyan-400 mb-1">What is this?</h3>
                <p className="text-gray-400">
                  A 1,000×1,000 pixel canvas where you can buy pixels for $1 each to display your brand, logo, or
                  message.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-cyan-400 mb-1">How do I purchase?</h3>
                <p className="text-gray-400">Click on available (grey) pixels, fill out the form, and pay in USDT.</p>
              </div>
              <div>
                <h3 className="font-semibold text-cyan-400 mb-1">What's the minimum?</h3>
                <p className="text-gray-400">10×10 pixels (100 pixels = $100 USDT).</p>
              </div>
            </div>
          </section>

          {/* Concept */}
          <section id="press" className="space-y-4">
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              The Concept
            </h2>
            <div className="bg-slate-900/50 border border-cyan-500/20 rounded-lg p-6">
              <p className="text-sm text-gray-400 leading-relaxed">
                Inspired by the legendary{" "}
                <a
                  href="http://milliondollarhomepage.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline"
                >
                  Million Dollar Homepage
                </a>{" "}
                (2005), where Alex Tew sold 1 million pixels for $1 each. We're reimagining this for the crypto era
                with blockchain payments and NFT ownership.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section id="contact" className="text-center space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Contact
            </h2>
            <p className="text-sm text-gray-400">
              Questions? Email us at{" "}
              <a href="mailto:hello@mdcp.com" className="text-cyan-400 hover:underline">
                hello@mdcp.com
              </a>
            </p>
          </section>

          {/* NFT Auction Placeholder */}
          <section id="nft-auction" className="text-center space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              NFT Auction
            </h2>
            <p className="text-sm text-gray-400">Coming soon: Own your pixels as NFTs!</p>
          </section>
        </div>
      )}
    </div>
  )
}
