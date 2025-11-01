export interface Pixel {
  id: string
  x: number
  y: number
  state: "free" | "reserved" | "taken"
  company?: string
  link?: string
  logo?: string
  createdAt?: Date
  expiresAt?: Date
}

export interface PurchaseRequest {
  companyName: string
  url: string
  email: string
  startX: number
  startY: number
  blockSize: number
  totalCost: number
  status: "pending" | "approved" | "rejected"
  transactionId?: string
}

export interface ReservationData {
  pixelIds: string[]
  email: string
  expiresAt: Date
  status: "pending" | "confirmed" | "expired"
}
