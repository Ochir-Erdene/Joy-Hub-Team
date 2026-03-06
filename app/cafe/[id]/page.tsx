"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft, Star, MapPin, Clock, Users, Monitor, 
  Wifi, Coffee, Headphones, Gamepad2, Cpu, Crown
} from "lucide-react"
import { mockCafes } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { FloorSelector } from "@/components/floor-selector"
import { SeatSelection } from "@/components/seat-selection"
import { BookingForm } from "@/components/booking-form"
import { cn } from "@/lib/utils"
import type { Floor, Section } from "@/lib/types"

const amenityIcons: Record<string, React.ElementType> = {
  "RTX 4090": Cpu,
  "RTX 4080": Cpu,
  "RTX 4070": Cpu,
  "RTX 3080": Cpu,
  "240Hz Monitor": Monitor,
  "165Hz Monitor": Monitor,
  "360Hz Monitor": Monitor,
  "144Hz Monitor": Monitor,
  "Streaming Setup": Wifi,
  "VR Station": Headphones,
  "Snacks": Coffee,
  "Energy Drinks": Coffee,
  "Full Kitchen": Coffee,
  "Cafe": Coffee,
  "Private Booths": Gamepad2,
  "Console Area": Gamepad2,
  "Tournament Room": Gamepad2,
  "VIP Rooms": Crown,
  "PS5": Gamepad2,
  "Xbox": Gamepad2,
}

export default function CafeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null)
  const [selectedSection, setSelectedSection] = useState<Section | null>(null)

  const cafe = mockCafes.find((c) => c.id === params.id)

  // Initialize first floor and section
  useEffect(() => {
    if (cafe && cafe.floors.length > 0 && !selectedFloor) {
      const firstFloor = cafe.floors[0]
      setSelectedFloor(firstFloor)
      if (firstFloor.sections.length > 0) {
        setSelectedSection(firstFloor.sections[0])
      }
    }
  }, [cafe, selectedFloor])

  if (!cafe) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Cafe not found</h1>
          <Link href="/" className="text-primary hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  const handleSelectFloor = (floor: Floor) => {
    setSelectedFloor(floor)
    setSelectedSection(floor.sections[0] || null)
    setSelectedSeats([]) // Clear selected seats when changing floor
  }

  const handleSelectSection = (section: Section) => {
    setSelectedSection(section)
    setSelectedSeats([]) // Clear selected seats when changing section
  }

  const handleSelectSeat = (seatId: string) => {
    setSelectedSeats((prev) => 
      prev.includes(seatId) 
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    )
  }

  const handleBookingComplete = () => {
    setSelectedSeats([])
    router.push("/")
  }

  // Calculate total available seats across all floors
  const totalAvailable = cafe.floors.reduce((acc, floor) => {
    return acc + floor.sections.reduce((sAcc, section) => {
      return sAcc + section.seats.filter(s => s.status === "available").length
    }, 0)
  }, 0)

  const totalSeats = cafe.floors.reduce((acc, floor) => {
    return acc + floor.sections.reduce((sAcc, section) => {
      return sAcc + section.seats.length
    }, 0)
  }, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Gamepad2 className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-foreground">GameZone</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Image */}
          <div className="relative aspect-video rounded-xl overflow-hidden">
            <img
              src={cafe.image || "/placeholder.svg"}
              alt={cafe.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2 mb-2">
                {cafe.isOpen ? (
                  <span className="px-2 py-1 text-xs font-medium bg-emerald-500 text-white rounded">
                    Open Now
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs font-medium bg-red-500 text-white rounded">
                    Closed
                  </span>
                )}
                <span className="px-2 py-1 text-xs bg-black/50 text-white rounded">
                  {cafe.openHours}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-1">{cafe.name}</h1>
              <div className="flex items-center gap-4 text-white/80 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{cafe.rating}</span>
                  <span className="text-white/60">({cafe.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{cafe.distance}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-foreground">{cafe.address}</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-foreground">{cafe.openHours}</span>
              </div>
              <div className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold text-primary">{cafe.pricePerHour.toLocaleString()} MNT</span>
                <span className="text-muted-foreground">/ hour</span>
              </div>
            </div>

            {/* Availability */}
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">Total Availability</span>
                </div>
                <span className={cn(
                  "font-bold",
                  totalAvailable > 20 ? "text-emerald-400" : totalAvailable > 0 ? "text-yellow-400" : "text-red-400"
                )}>
                  20 / 20
                </span>
              </div>
              <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all",
                    20 > 10 ? "bg-emerald-500" : 20 > 0 ? "bg-yellow-500" : "bg-red-500"
                  )}
                  style={{ width: `${(totalSeats / totalSeats) * 100}%` }}
                />
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span>{cafe.floors.length} Floors</span>
                <span>{cafe.floors.reduce((acc, f) => acc + f.sections.length, 0)} Sections</span>
              </div>
            </div>

            {/* Amenities */}
            <div className="p-4 rounded-xl bg-card border border-border">
              <h3 className="font-medium text-foreground mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {cafe.amenities.map((amenity) => {
                  const Icon = amenityIcons[amenity] || Monitor
                  const isVIP = amenity === "VIP Rooms"
                  return (
                    <div 
                      key={amenity}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg border",
                        isVIP 
                          ? "bg-yellow-500/10 border-yellow-500/30" 
                          : "bg-secondary/50 border-border"
                      )}
                    >
                      <Icon className={cn("w-4 h-4", isVIP ? "text-yellow-400" : "text-primary")} />
                      <span className={cn("text-sm", isVIP ? "text-yellow-400" : "text-foreground")}>
                        {amenity}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Floor & Section Selection */}
        <div className="mb-6 p-6 rounded-xl bg-card border border-border">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-primary" />
            Choose Floor & Section
          </h2>
          <FloorSelector
            floors={cafe.floors}
            selectedFloor={selectedFloor}
            selectedSection={selectedSection}
            onSelectFloor={handleSelectFloor}
            onSelectSection={handleSelectSection}
          />
        </div>

        {/* Booking Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Seat Selection */}
          <div className="lg:col-span-2">
            <div className="p-6 rounded-xl bg-card border border-border">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Monitor className="w-5 h-5 text-primary" />
                Select Your Seat
              </h2>
              {selectedSection ? (
                <SeatSelection 
                  section={selectedSection}
                  selectedSeats={selectedSeats}
                  onSelectSeat={handleSelectSeat}
                />
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  Please select a floor and section first
                </div>
              )}
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-xl bg-card border border-border">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Book Your Session
              </h2>
              {cafe.isOpen ? (
                <BookingForm 
                  cafe={cafe}
                  selectedSection={selectedSection}
                  selectedSeats={selectedSeats}
                  onBookingComplete={handleBookingComplete}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-2">This cafe is currently closed</p>
                  <p className="text-sm text-muted-foreground">Opens at {cafe.openHours.split(" - ")[0] || "tomorrow"}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
