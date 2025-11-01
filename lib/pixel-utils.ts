export function generatePixelId(x: number, y: number): string {
  return `${x}-${y}`
}

export function parsePixelId(id: string): { x: number; y: number } {
  const [x, y] = id.split("-").map(Number)
  return { x, y }
}

export function validatePixelBlock(startX: number, startY: number, blockSize: number, gridSize = 100): boolean {
  if (blockSize < 10 || blockSize > gridSize) return false
  if (startX < 0 || startY < 0) return false
  if (startX + blockSize > gridSize || startY + blockSize > gridSize) return false
  return true
}

export function calculatePixelCost(blockSize: number): number {
  return blockSize * blockSize
}

export function getReservationExpirationTime(): Date {
  const expirationTime = new Date()
  expirationTime.setHours(expirationTime.getHours() + 48)
  return expirationTime
}

export function formatTimeRemaining(expiresAt: Date): string {
  const now = new Date()
  const diff = expiresAt.getTime() - now.getTime()

  if (diff <= 0) return "Expired"

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  return `${hours}h ${minutes}m remaining`
}
