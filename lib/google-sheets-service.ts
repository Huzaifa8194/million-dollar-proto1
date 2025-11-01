import { google } from "googleapis"

const sheets = google.sheets("v4")

let auth: any = null

async function getAuth() {
  if (!auth) {
    auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || "{}"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })
  }
  return auth
}

export async function logSubmissionToSheet(data: {
  reservationId: string
  companyName: string
  email: string
  pixelCount: number
  totalCost: number
  status: string
  createdAt: string
}) {
  try {
    const authClient = await getAuth()
    const spreadsheetId = process.env.GOOGLE_SHEET_ID

    if (!spreadsheetId) {
      console.warn("Google Sheets not configured")
      return
    }

    const values = [
      [data.reservationId, data.companyName, data.email, data.pixelCount, data.totalCost, data.status, data.createdAt],
    ]

    await sheets.spreadsheets.values.append({
      auth: authClient,
      spreadsheetId,
      range: "Submissions!A:G",
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    })

    console.log(`Submission logged to Google Sheets: ${data.reservationId}`)
  } catch (error) {
    console.error("Failed to log to Google Sheets:", error)
    throw error
  }
}

export async function updateSubmissionStatus(
  reservationId: string,
  status: "approved" | "rejected" | "payment_verified",
) {
  try {
    const authClient = await getAuth()
    const spreadsheetId = process.env.GOOGLE_SHEET_ID

    if (!spreadsheetId) {
      console.warn("Google Sheets not configured")
      return
    }

    // Find the row with this reservation ID and update the status
    const response = await sheets.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId,
      range: "Submissions!A:G",
    })

    const rows = response.data.values || []
    let targetRow = -1

    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] === reservationId) {
        targetRow = i + 1
        break
      }
    }

    if (targetRow > 0) {
      await sheets.spreadsheets.values.update({
        auth: authClient,
        spreadsheetId,
        range: `Submissions!F${targetRow}`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [[status]] },
      })

      console.log(`Submission status updated in Google Sheets: ${reservationId} -> ${status}`)
    }
  } catch (error) {
    console.error("Failed to update Google Sheets:", error)
    throw error
  }
}

export async function getSubmissionStats() {
  try {
    const authClient = await getAuth()
    const spreadsheetId = process.env.GOOGLE_SHEET_ID

    if (!spreadsheetId) {
      return { total: 0, approved: 0, pending: 0, rejected: 0 }
    }

    const response = await sheets.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId,
      range: "Submissions!A:G",
    })

    const rows = response.data.values || []
    const stats = { total: 0, approved: 0, pending: 0, rejected: 0 }

    for (let i = 1; i < rows.length; i++) {
      stats.total++
      const status = rows[i][5]
      if (status === "approved") stats.approved++
      else if (status === "pending") stats.pending++
      else if (status === "rejected") stats.rejected++
    }

    return stats
  } catch (error) {
    console.error("Failed to get submission stats:", error)
    return { total: 0, approved: 0, pending: 0, rejected: 0 }
  }
}
