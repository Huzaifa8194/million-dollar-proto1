"use client"

import { useState, useCallback, useRef, useEffect } from "react"
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

const GRID_SIZE = 1000 // Full 1000x1000 grid

export function PixelGrid() {
  const [pixels, setPixels] = useState<Record<string, Pixel>>(() => {
    const initial: Record<string, Pixel> = {}
    // Generate random sold blocks for demo
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E2"]
    
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const id = `${i}-${j}`
        const isSold = Math.random() > 0.85 // 15% sold for demo
        initial[id] = {
          id,
          x: i,
          y: j,
          state: isSold ? "taken" : "free",
          company: isSold ? "Brand" : undefined,
          color: isSold ? colors[Math.floor(Math.random() * colors.length)] : undefined,
        }
      }
    }
    return initial
  })

  const [selectedPixel, setSelectedPixel] = useState<Pixel | null>(null)
  const [hoveredPixel, setHoveredPixel] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Render canvas
  const renderCanvas = useCallback((highlightPixelId?: string | null) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) return

    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const id = `${i}-${j}`
        const pixel = pixels[id]
        if (pixel) {
          if (pixel.state === "free") {
            ctx.fillStyle = id === highlightPixelId ? "#00d4ff" : "#374151" // grey, cyan on hover
          } else if (pixel.state === "reserved") {
            ctx.fillStyle = "#6366f1" // indigo
          } else {
            ctx.fillStyle = pixel.color || "#dc2626" // color or red
          }
          ctx.fillRect(i, j, 1, 1)
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
      for (let i = 0; i < blockSize; i++) {
        for (let j = 0; j < blockSize; j++) {
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

  const freePixelCount = Object.values(pixels).filter((p) => p.state === "free").length
  const takenPixelCount = Object.values(pixels).filter((p) => p.state === "taken" || p.state === "reserved").length

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

      {/* THE GRID - Fully visible 1000x1000 */}
      <div className="bg-slate-950 border-2 border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-900/20 overflow-hidden w-full">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE}
          height={GRID_SIZE}
          className="w-full h-auto cursor-crosshair"
          style={{
            imageRendering: "pixelated",
            maxWidth: "100%",
            height: "auto",
            aspectRatio: "1/1",
          }}
          onClick={(e) => {
            const canvas = e.currentTarget
            const rect = canvas.getBoundingClientRect()
            const scaleX = GRID_SIZE / rect.width
            const scaleY = GRID_SIZE / rect.height
            const x = Math.floor((e.clientX - rect.left) * scaleX)
            const y = Math.floor((e.clientY - rect.top) * scaleY)
            const pixelId = `${x}-${y}`
            const pixel = pixels[pixelId]
            if (pixel && pixel.state === "free") {
              handlePixelClick(pixel)
            }
          }}
          onMouseMove={(e) => {
            const canvas = e.currentTarget
            const rect = canvas.getBoundingClientRect()
            const scaleX = GRID_SIZE / rect.width
            const scaleY = GRID_SIZE / rect.height
            const x = Math.floor((e.clientX - rect.left) * scaleX)
            const y = Math.floor((e.clientY - rect.top) * scaleY)
            const pixelId = `${x}-${y}`
            if (pixelId !== hoveredPixel) {
              setHoveredPixel(pixelId)
              renderCanvas(pixelId)
            }
          }}
          onMouseLeave={() => {
            setHoveredPixel(null)
            renderCanvas()
          }}
        />
      </div>

      {selectedPixel && (
        <PurchaseModal pixel={selectedPixel} onPurchase={handlePurchase} onClose={() => setSelectedPixel(null)} />
      )}
    </div>
  )
}
