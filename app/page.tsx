"use client"

import { useState } from "react"
import { CafeSidebar } from "@/components/cafe-sidebar"
import { GoogleMap } from "@/components/google-map"
import { mockCafes } from "@/lib/mock-data"
import type { PCCafe } from "@/lib/types"

export default function HomePage() {
  const [hoveredCafe, setHoveredCafe] = useState<PCCafe | null>(null)

  return (
    <main className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <CafeSidebar
        cafes={mockCafes}
        hoveredCafe={hoveredCafe}
        onHoverCafe={setHoveredCafe}
      />

      {/* Map Area */}
      <div className="flex-1 relative">
        <GoogleMap
          cafes={mockCafes}
          hoveredCafe={hoveredCafe}
          onHoverCafe={setHoveredCafe}
        />
      </div>
    </main>
  )
}
