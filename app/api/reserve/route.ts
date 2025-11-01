import { type NextRequest, NextResponse } from "next/server"
import { sendAdminNotification, sendUserApprovalNotification } from "@/lib/email-service"
import { logSubmissionToSheet } from "@/lib/google-sheets-service"

// In-memory reservation store (replace with MongoDB in production)
const reservations: Record<string, any> = {}

export async function POST(request: NextRequest) {
  try {
    const { companyName, url, email, startX, startY, blockSize } = await request.json()

    // Validate minimum purchase
    if (blockSize < 10) {
      return NextResponse.json({ error: "Minimum block size is 10x10 pixels" }, { status: 400 })
    }

    const totalCost = blockSize * blockSize

    if (totalCost < 100) {
      return NextResponse.json({ error: "Minimum purchase is $100 USDT (100 pixels)" }, { status: 400 })
    }

    // Create reservation with 48-hour expiration
    const reservationId = `res_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000)

    const pixelIds: string[] = []
    for (let i = 0; i < blockSize; i++) {
      for (let j = 0; j < blockSize; j++) {
        pixelIds.push(`${startX + i}-${startY + j}`)
      }
    }

    try {
      await logSubmissionToSheet({
        reservationId,
        companyName,
        email,
        pixelCount: pixelIds.length,
        totalCost,
        status: "pending",
        createdAt: new Date().toISOString(),
      })
    } catch (sheetError) {
      console.warn("Google Sheets logging failed (non-critical):", sheetError)
    }

    try {
      const approvalLink = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/submissions?action=approve&id=${reservationId}`
      const rejectionLink = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/submissions?action=reject&id=${reservationId}`

      await sendAdminNotification({
        reservationId,
        companyName,
        email,
        pixelCount: pixelIds.length,
        totalCost,
        approvalLink,
        rejectionLink,
      })

      await sendUserApprovalNotification(email, {
        companyName,
        totalCost,
        pixelCount: pixelIds.length,
        expirationTime: "48 hours",
      })
    } catch (notificationError) {
      console.warn("Email notifications failed (non-critical):", notificationError)
    }

    reservations[reservationId] = {
      id: reservationId,
      companyName,
      url,
      email,
      pixelIds,
      blockSize,
      totalCost,
      status: "pending",
      createdAt: new Date(),
      expiresAt,
      transactionId: null,
    }

    return NextResponse.json({
      success: true,
      reservationId,
      expiresAt,
      totalCost,
    })
  } catch (error) {
    console.error("Reservation error:", error)
    return NextResponse.json({ error: "Failed to create reservation" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const reservationId = request.nextUrl.searchParams.get("id")

  if (!reservationId) {
    return NextResponse.json(reservations)
  }

  const reservation = reservations[reservationId]
  if (!reservation) {
    return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
  }

  return NextResponse.json(reservation)
}
