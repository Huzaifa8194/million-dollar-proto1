"use client"

import { useState, useCallback, useRef, useEffect, useMemo } from "react"
import { PurchaseModal } from "./purchase-modal"

interface Pixel {
  id: string
  x: number
  y: number
  state: "free" | "reserved" | "taken"
  company?: string
  link?: string
  color?: string
}

const GRID_SIZE = 100 // Back to 100x100 for performance (represents 1000x1000 conceptually)
const BLOCK_SIZE = 10 // Each block represents 10x10 pixels

export function PixelGrid() {
  const [pixels, setPixels] = useState<Record<string, Pixel>>(() => {
    const initial: Record<string, Pixel> = {}
    // Generate random sold blocks for demo with realistic data
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E2", "#E74C3C", "#3498DB"]
    const companies = [
      { name: "CryptoX", link: "https://cryptox.io" },
      { name: "NFT Marketplace", link: "https://nftmarket.com" },
      { name: "DeFi Protocol", link: "https://defi.finance" },
      { name: "Blockchain Labs", link: "https://blocklabs.dev" },
      { name: "Web3 Studio", link: "https://web3studio.io" },
      { name: "Token Analytics", link: "https://tokendata.io" },
      { name: "Crypto News", link: "https://cryptonews.com" },
      { name: "MetaVerse Inc", link: "https://metaverse.world" },
      { name: "Smart Contracts", link: "https://smartcontracts.dev" },
      { name: "Digital Assets", link: "https://digitalassets.com" },
    ]
    
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const id = `${i}-${j}`
        const isSold = Math.random() > 0.85 // 15% sold for demo
        const companyData = companies[Math.floor(Math.random() * companies.length)]
        initial[id] = {
          id,
          x: i,
          y: j,
          state: isSold ? "taken" : "free",
          company: isSold ? companyData.name : undefined,
          link: isSold ? companyData.link : undefined,
          color: isSold ? colors[Math.floor(Math.random() * colors.length)] : undefined,
        }
      }
    }
    return initial
  })

  const [selectedPixel, setSelectedPixel] = useState<Pixel | null>(null)
  const [hoveredPixel, setHoveredPixel] = useState<string | null>(null)
  const [tooltipData, setTooltipData] = useState<{ x: number; y: number; pixel: Pixel } | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()

  // Render canvas efficiently
  const renderCanvas = useCallback((highlightPixelId?: string | null) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) return

    // Clear and render
    ctx.clearRect(0, 0, GRID_SIZE * BLOCK_SIZE, GRID_SIZE * BLOCK_SIZE)
    
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const id = `${i}-${j}`
        const pixel = pixels[id]
        if (pixel) {
          if (pixel.state === "free") {
            ctx.fillStyle = id === highlightPixelId ? "#00d4ff" : "#4B5563" // grey, cyan on hover
          } else if (pixel.state === "reserved") {
            ctx.fillStyle = "#6366f1" // indigo
          } else {
            ctx.fillStyle = pixel.color || "#dc2626" // color or red
          }
          ctx.fillRect(i * BLOCK_SIZE, j * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
          
          // Add border for clarity
          if (pixel.state === "free") {
            ctx.strokeStyle = "#1F2937"
            ctx.lineWidth = 1
            ctx.strokeRect(i * BLOCK_SIZE, j * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
          }
        }
      }
    }
  }, [pixels])

  // Initial render
  useEffect(() => {
    renderCanvas()
  }, [renderCanvas])

  const handlePixelClick = useCallback((pixel: Pixel) => {
    if (pixel.state === "free") {
      setSelectedPixel(pixel)
    }
  }, [])

  const handlePurchase = useCallback(
    (blockSize: number) => {
      if (!selectedPixel) return

      const updatedPixels = { ...pixels }
      const blocksToUpdate = blockSize / 10 // Convert to grid blocks
      for (let i = 0; i < blocksToUpdate; i++) {
        for (let j = 0; j < blocksToUpdate; j++) {
          const pixelId = `${selectedPixel.x + i}-${selectedPixel.y + j}`
          if (pixelId in updatedPixels) {
            updatedPixels[pixelId].state = "reserved"
          }
        }
      }
      setPixels(updatedPixels)
      setSelectedPixel(null)
    },
    [selectedPixel, pixels],
  )

  const freePixelCount = useMemo(() => 
    Object.values(pixels).filter((p) => p.state === "free").length * 100, // Each block = 100 pixels
    [pixels]
  )
  
  const takenPixelCount = useMemo(() => 
    Object.values(pixels).filter((p) => p.state === "taken" || p.state === "reserved").length * 100,
    [pixels]
  )

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget
    const rect = canvas.getBoundingClientRect()
    const scaleX = (GRID_SIZE * BLOCK_SIZE) / rect.width
    const scaleY = (GRID_SIZE * BLOCK_SIZE) / rect.height
    const x = Math.floor(((e.clientX - rect.left) * scaleX) / BLOCK_SIZE)
    const y = Math.floor(((e.clientY - rect.top) * scaleY) / BLOCK_SIZE)
    const pixelId = `${x}-${y}`
    const pixel = pixels[pixelId]
    
    // ALWAYS update tooltip position if hovering over sold/reserved pixel
    if (pixel) {
      if (pixel.state !== "free") {
        setTooltipData({
          x: e.clientX,
          y: e.clientY,
          pixel: pixel
        })
      } else {
        setTooltipData(null)
      }
      
      // Only re-render canvas if pixel changed
      if (pixelId !== hoveredPixel) {
        setHoveredPixel(pixelId)
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
        animationFrameRef.current = requestAnimationFrame(() => {
          renderCanvas(pixelId)
        })
      }
    }
  }, [hoveredPixel, pixels, renderCanvas])

  return (
    <div className="w-full max-w-[1020px] mx-auto space-y-4">
      {/* Minimal Stats - Single Line */}
      <div className="text-center text-xs md:text-sm text-gray-400 space-x-3 md:space-x-6">
        <span>
          <span className="text-cyan-400 font-semibold">{freePixelCount.toLocaleString()}</span> available
        </span>
        <span className="text-gray-600">•</span>
        <span>
          <span className="text-blue-400 font-semibold">{takenPixelCount.toLocaleString()}</span> sold
        </span>
        <span className="text-gray-600">•</span>
        <span>
          <span className="text-purple-400 font-semibold">${takenPixelCount.toLocaleString()}</span> raised
        </span>
      </div>

      {/* THE GRID - Fully visible 100x100 blocks (1000x1000 pixels) */}
      <div className="bg-slate-950 border-2 border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-900/20 overflow-hidden w-full">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * BLOCK_SIZE}
          height={GRID_SIZE * BLOCK_SIZE}
          className="w-full h-auto cursor-pointer hover:cursor-crosshair"
          style={{
            imageRendering: "auto",
            maxWidth: "100%",
            height: "auto",
            aspectRatio: "1/1",
          }}
          onClick={(e) => {
            const canvas = e.currentTarget
            const rect = canvas.getBoundingClientRect()
            const scaleX = (GRID_SIZE * BLOCK_SIZE) / rect.width
            const scaleY = (GRID_SIZE * BLOCK_SIZE) / rect.height
            const x = Math.floor(((e.clientX - rect.left) * scaleX) / BLOCK_SIZE)
            const y = Math.floor(((e.clientY - rect.top) * scaleY) / BLOCK_SIZE)
            const pixelId = `${x}-${y}`
            const pixel = pixels[pixelId]
            if (pixel && pixel.state === "free") {
              handlePixelClick(pixel)
            }
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            setHoveredPixel(null)
            setTooltipData(null)
            renderCanvas()
            if (animationFrameRef.current) {
              cancelAnimationFrame(animationFrameRef.current)
            }
          }}
        />
      </div>

      {/* Hover Tooltip */}
      {tooltipData && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: `${tooltipData.x + 15}px`,
            top: `${tooltipData.y + 15}px`,
          }}
        >
          <div className="bg-slate-900/95 backdrop-blur-sm border border-cyan-400/50 rounded-lg shadow-xl shadow-cyan-900/30 px-4 py-3 min-w-[200px]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded border border-slate-700" 
                  style={{ backgroundColor: tooltipData.pixel.color || '#dc2626' }}
                />
                <span className="text-white font-semibold text-sm">
                  {tooltipData.pixel.company || 'Reserved Pixel'}
                </span>
              </div>
              <div className="text-xs text-gray-400">
                Position: ({tooltipData.pixel.x * 10}, {tooltipData.pixel.y * 10})
              </div>
              <div className="text-xs text-gray-400">
                Size: 10×10 pixels
              </div>
              {tooltipData.pixel.link && (
                <div className="text-xs text-cyan-400 truncate">
                  {tooltipData.pixel.link}
                </div>
              )}
              <div className="pt-1 border-t border-slate-700/50">
                <span className={`text-xs font-medium ${
                  tooltipData.pixel.state === 'taken' ? 'text-green-400' : 'text-blue-400'
                }`}>
                  {tooltipData.pixel.state === 'taken' ? '● Sold' : '● Reserved'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedPixel && (
        <PurchaseModal pixel={selectedPixel} onPurchase={handlePurchase} onClose={() => setSelectedPixel(null)} />
      )}
    </div>
  )
}
