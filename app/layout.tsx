import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Million Dollar CryptoPage - Own a Piece of Internet History",
  description: "Buy pixels on our 1,000×1,000 canvas. $1 per pixel. Display your brand, logo, or message to the world. Crypto payments accepted.",
  keywords: "pixel advertising, crypto marketing, NFT, blockchain, million dollar homepage",
  openGraph: {
    title: "Million Dollar CryptoPage",
    description: "Own a piece of internet history with blockchain-powered pixel advertising",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
