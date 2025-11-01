import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get("x-api-key")

    if (apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // TODO: Query all pending reservations from MongoDB
    // Return for admin review

    return NextResponse.json({
      submissions: [],
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get("x-api-key")

    if (apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { reservationId, approved, logoUrl } = await request.json()

    // TODO: Update reservation status in MongoDB
    // TODO: If approved, update pixels to 'reserved'
    // TODO: Send email notification to user

    return NextResponse.json({
      success: true,
      message: approved ? "Submission approved" : "Submission rejected",
    })
  } catch (error) {
    return NextResponse.json({ error: "Admin action failed" }, { status: 500 })
  }
}
