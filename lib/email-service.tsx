import { Resend } from "resend"

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn("[v0] Resend API key not configured. Email notifications disabled.")
    return null
  }
  return new Resend(apiKey)
}

export async function sendAdminNotification(data: {
  reservationId: string
  companyName: string
  email: string
  pixelCount: number
  totalCost: number
  approvalLink: string
  rejectionLink: string
}) {
  const resend = getResendClient()
  if (!resend) return

  try {
    await resend.emails.send({
      from: "noreply@milliondollarcryptopage.com",
      to: process.env.ADMIN_EMAIL || "admin@example.com",
      subject: `New Pixel Submission: ${data.companyName}`,
      html: `
        <h2>New Pixel Submission</h2>
        <p><strong>Company:</strong> ${data.companyName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Pixels:</strong> ${data.pixelCount} (${Math.sqrt(data.pixelCount)}×${Math.sqrt(data.pixelCount)})</p>
        <p><strong>Cost:</strong> $${data.totalCost} USDT</p>
        <p><strong>Reservation ID:</strong> ${data.reservationId}</p>
        <hr />
        <p>
          <a href="${data.approvalLink}">Approve Submission</a> | 
          <a href="${data.rejectionLink}">Reject Submission</a>
        </p>
      `,
    })
  } catch (error) {
    console.error("Failed to send admin notification:", error)
  }
}

export async function sendUserApprovalNotification(
  email: string,
  data: {
    companyName: string
    totalCost: number
    pixelCount: number
    expirationTime: string
  },
) {
  const resend = getResendClient()
  if (!resend) return

  try {
    await resend.emails.send({
      from: "noreply@milliondollarcryptopage.com",
      to: email,
      subject: "Reservation Confirmed - Payment Instructions",
      html: `
        <h2>Your Pixel Reservation is Confirmed!</h2>
        <p>Hi ${data.companyName},</p>
        <p>Your reservation for <strong>${data.pixelCount} pixels</strong> has been created.</p>
        <p><strong>Total Cost:</strong> $${data.totalCost} USDT</p>
        <p><strong>⏰ Reservation Expires In:</strong> ${data.expirationTime}</p>
        <hr />
        <h3>Next Steps:</h3>
        <ol>
          <li>Send ${data.totalCost} USDT to: <code>0x1234567890abcdef...</code></li>
          <li>Reply with your transaction ID</li>
          <li>Our team will verify and approve your submission</li>
          <li>Your logo will appear on the grid!</li>
        </ol>
        <p>Questions? Reply to this email or contact us at contact@milliondollarcryptopage.com</p>
      `,
    })
  } catch (error) {
    console.error("Failed to send user approval email:", error)
  }
}

export async function sendUserRejectionNotification(email: string, reason?: string) {
  const resend = getResendClient()
  if (!resend) return

  try {
    await resend.emails.send({
      from: "noreply@milliondollarcryptopage.com",
      to: email,
      subject: "Submission Status Update",
      html: `
        <h2>Submission Update</h2>
        <p>Your submission has been reviewed by our team.</p>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
        <p>Please contact us if you have any questions: contact@milliondollarcryptopage.com</p>
      `,
    })
  } catch (error) {
    console.error("Failed to send rejection email:", error)
  }
}

export async function sendPaymentConfirmation(
  email: string,
  data: {
    companyName: string
    transactionId: string
    pixelCount: number
  },
) {
  const resend = getResendClient()
  if (!resend) return

  try {
    await resend.emails.send({
      from: "noreply@milliondollarcryptopage.com",
      to: email,
      subject: "Payment Received & Verifying",
      html: `
        <h2>Payment Received!</h2>
        <p>Hi ${data.companyName},</p>
        <p>We've received your transaction: <code>${data.transactionId}</code></p>
        <p>Your ${data.pixelCount} pixels are being verified on the blockchain.</p>
        <p>You'll receive a confirmation email once everything is approved!</p>
      `,
    })
  } catch (error) {
    console.error("Failed to send payment confirmation:", error)
  }
}
