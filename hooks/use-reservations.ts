import useSWR from "swr"

interface Reservation {
  id: string
  companyName: string
  email: string
  blockSize: number
  totalCost: number
  status: "pending" | "approved" | "rejected"
  expiresAt: string
  createdAt: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useReservation(reservationId: string) {
  const { data, error, isLoading } = useSWR(
    reservationId ? `/api/reserve?id=${reservationId}` : null,
    fetcher,
    { refreshInterval: 30000 }, // Refresh every 30 seconds
  )

  return {
    reservation: data as Reservation | undefined,
    isLoading,
    error,
  }
}

export function useAllReservations() {
  const { data, error, isLoading } = useSWR(
    "/api/reserve",
    fetcher,
    { refreshInterval: 60000 }, // Refresh every minute
  )

  return {
    reservations: (data || []) as Reservation[],
    isLoading,
    error,
  }
}
