"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Pixel {
  x: number
  y: number
}

interface PurchaseModalProps {
  pixel: Pixel
  onPurchase: (blockSize: number) => void
  onClose: () => void
}

export function PurchaseModal({ pixel, onPurchase, onClose }: PurchaseModalProps) {
  const [companyName, setCompanyName] = useState("")
  const [url, setUrl] = useState("")
  const [email, setEmail] = useState("")
  const [blockSize, setBlockSize] = useState(10)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const totalCost = blockSize * blockSize

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!companyName || !url || !email || blockSize < 10) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields with a minimum block size of 10x10.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          url,
          email,
          startX: pixel.x,
          startY: pixel.y,
          blockSize,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Reservation failed")
      }

      const data = await response.json()

      toast({
        title: "Reservation Created!",
        description: `Your ${blockSize}×${blockSize} pixel block is reserved for 48 hours. Check your email for payment instructions.`,
      })

      onPurchase(blockSize)
      setCompanyName("")
      setUrl("")
      setEmail("")
      setBlockSize(10)
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create reservation",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg shadow-2xl shadow-cyan-900/50 max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-xl font-bold">Reserve Pixels</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label className="text-foreground">Company Name</Label>
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Your company name"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <Label className="text-foreground">Website URL</Label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <Label className="text-foreground">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <Label className="text-foreground">Block Size (pixels)</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="10"
                max="100"
                step="10"
                value={blockSize}
                onChange={(e) => setBlockSize(Number(e.target.value))}
                className="bg-input border-border text-foreground"
                disabled={isLoading}
              />
              <span className="text-sm text-muted-foreground">px</span>
            </div>
          </div>

          <div className="pt-2 px-4 py-3 bg-secondary rounded border border-border">
            <div className="text-sm text-muted-foreground">Total Cost</div>
            <div className="text-2xl font-bold text-cyan-400">${totalCost} USDT</div>
            {totalCost < 100 && <div className="text-xs text-destructive mt-1">Minimum is $100 USDT</div>}
          </div>

          <Button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold glow-cyan-hover disabled:opacity-50"
            disabled={!companyName || !url || !email || blockSize < 10 || totalCost < 100 || isLoading}
          >
            {isLoading ? "Creating Reservation..." : "Reserve Pixels"}
          </Button>
        </form>
      </div>
    </div>
  )
}
