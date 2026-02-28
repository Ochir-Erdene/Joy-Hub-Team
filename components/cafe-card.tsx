"use client"

import Link from "next/link"
import { Star, MapPin, Monitor, Users } from "lucide-react"
import type { PCCafe } from "@/lib/types"
import { cn } from "@/lib/utils"

interface CafeCardProps {
  cafe: PCCafe
  isSelected: boolean
  onHover: (cafe: PCCafe | null) => void
}

export function CafeCard({ cafe, isSelected, onHover }: CafeCardProps) {
  return (
    <Link
      href={`/cafe/${cafe.id}`}
      onMouseEnter={() => onHover(cafe)}
      onMouseLeave={() => onHover(null)}
      className={cn(
        "block w-full text-left p-4 rounded-lg border transition-all duration-300",
        "hover:border-primary/50 hover:bg-secondary/50",
        isSelected
          ? "border-primary bg-secondary/80 shadow-[0_0_20px_rgba(0,255,255,0.15)]"
          : "border-border bg-card"
      )}
    >
      <div className="flex gap-4">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={cafe.image || "/placeholder.svg"}
            alt={cafe.name}
            className="w-full h-full object-cover"
          />
          {cafe.isOpen ? (
            <span className="absolute top-1 right-1 px-1.5 py-0.5 text-[10px] font-medium bg-emerald-500/90 text-white rounded">
              Open
            </span>
          ) : (
            <span className="absolute top-1 right-1 px-1.5 py-0.5 text-[10px] font-medium bg-red-500/90 text-white rounded">
              Closed
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground truncate">{cafe.name}</h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-foreground">{cafe.rating}</span>
              <span className="text-xs text-muted-foreground">({cafe.reviewCount})</span>
            </div>
          </div>

          <div className="flex items-center gap-1 mt-1 text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span className="text-xs truncate">{cafe.address}</span>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 text-primary" />
              <span className="text-xs">
                <span className={cafe.availableSeats > 0 ? "text-emerald-400" : "text-red-400"}>
                  {cafe.availableSeats}
                </span>
                <span className="text-muted-foreground">/{cafe.totalSeats} seats</span>
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Monitor className="w-3 h-3 text-primary" />
              <span className="text-xs text-primary font-semibold">{cafe.pricePerHour.toLocaleString()}MNT/hr</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
