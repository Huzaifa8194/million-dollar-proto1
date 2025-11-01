"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface PaymentSectionProps {
  reservationId: string
  totalCost: number
  companyName: string
}

export function PaymentSection({ reservationId, totalCost, companyName }: PaymentSectionProps) {
  const [transactionId, setTransactionId] = useState("")
  const [logoUrl, setLogoUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const paymentAddress = "0x1234567890abcdef1234567890abcdef12345678"

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!transactionId) {
      toast({
        title: "Error",
        description: "Please enter your transaction ID",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reservationId,
          transactionId,
          companyName,
          logoUrl: logoUrl || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error("Payment submission failed")
      }

      toast({
        title: "Payment Submitted!",
        description: "Your transaction is being verified. You will receive an email confirmation shortly.",
      })

      setTransactionId("")
      setLogoUrl("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit payment",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-secondary border border-border rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-bold">Complete Your Payment</h3>

      <div className="space-y-2">
        <Label>Send {totalCost} USDT to:</Label>
        <div className="bg-input rounded p-3 font-mono text-sm text-cyan-400">{paymentAddress}</div>
      </div>

      <form onSubmit={handlePaymentSubmit} className="space-y-4">
        <div>
          <Label className="text-foreground">Transaction ID</Label>
          <Input
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Paste your blockchain transaction ID"
            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label className="text-foreground">Logo URL (optional)</Label>
          <Input
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://example.com/logo.png"
            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            disabled={isSubmitting}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold glow-cyan-hover disabled:opacity-50"
          disabled={!transactionId || isSubmitting}
        >
          {isSubmitting ? "Verifying..." : "Verify Payment"}
        </Button>
      </form>
    </div>
  )
}
