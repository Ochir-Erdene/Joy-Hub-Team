"use client"

import { useState } from "react"
import { Search, MapPin, Gamepad2 } from "lucide-react"
import type { PCCafe } from "@/lib/types"
import { CafeCard } from "./cafe-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface CafeSidebarProps {
  cafes: PCCafe[]
  hoveredCafe: PCCafe | null
  onHoverCafe: (cafe: PCCafe | null) => void
}

export function CafeSidebar({ cafes, hoveredCafe, onHoverCafe }: CafeSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCafes = cafes.filter(
    (cafe) =>
      cafe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cafe.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-full md:w-[400px] h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Gamepad2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">GameZone</h1>
            <p className="text-xs text-muted-foreground">Find & Book PC Cafes</p>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search cafes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-muted-foreground"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="border-sidebar-border bg-sidebar-accent text-sidebar-foreground cursor-pointer"
          >
            <MapPin className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              {filteredCafes.length} cafes found
            </span>
            <span className="text-xs text-muted-foreground">Sorted by distance</span>
          </div>
          {filteredCafes.map((cafe) => (
            <CafeCard
              key={cafe.id}
              cafe={cafe}
              isSelected={hoveredCafe?.id === cafe.id}
              onHover={onHoverCafe}
            />
          ))}
          {filteredCafes.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No cafes found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
