import { type NextRequest, NextResponse } from "next/server"
import { sendAdminNotification, sendUserApprovalNotification } from "@/lib/email-service"
import { logSubmissionToSheet } from "@/lib/google-sheets-service"

export async function POST(request: NextRequest) {
  try {
    const { reservationId, companyName, email, pixelIds, totalCost } = await request.json()

    // Log to Google Sheets
    await logSubmissionToSheet({
      reservationId,
      companyName,
      email,
      pixelCount: pixelIds.length,
      totalCost,
      status: "pending",
      createdAt: new Date().toISOString(),
    })

    // Send admin notification with approval link
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

    // Send user confirmation email
    await sendUserApprovalNotification(email, {
      companyName,
      totalCost,
      pixelCount: pixelIds.length,
      expirationTime: "48 hours",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
