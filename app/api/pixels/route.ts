import { type NextRequest, NextResponse } from "next/server"

// In-memory pixel store (replace with MongoDB in production)
const pixelsStore: Record<string, any> = {}

// Initialize grid
function initializeGrid() {
  if (Object.keys(pixelsStore).length === 0) {
    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 100; j++) {
        const id = `${i}-${j}`
        pixelsStore[id] = {
          id,
          x: i,
          y: j,
          state: "free",
          company: null,
          link: null,
        }
      }
    }
  }
}

export async function GET(request: NextRequest) {
  initializeGrid()
  return NextResponse.json(pixelsStore)
}

export async function POST(request: NextRequest) {
  try {
    const { pixelIds, state } = await request.json()

    if (!Array.isArray(pixelIds) || !state) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    initializeGrid()

    // Update pixels
    pixelIds.forEach((id) => {
      if (pixelsStore[id]) {
        pixelsStore[id].state = state
      }
    })

    return NextResponse.json({ success: true, updated: pixelIds.length })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update pixels" }, { status: 500 })
  }
}
