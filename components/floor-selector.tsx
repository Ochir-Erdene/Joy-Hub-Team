"use client"

import React from "react"
import { Monitor, Gamepad2, Crown, Layers, Users } from "lucide-react"
import type { Floor, Section, SeatType } from "@/lib/types"
import { cn } from "@/lib/utils"

interface FloorSelectorProps {
  floors: Floor[]
  selectedFloor: Floor | null
  selectedSection: Section | null
  onSelectFloor: (floor: Floor) => void
  onSelectSection: (section: Section) => void
}

const sectionIcons: Record<SeatType, React.ElementType> = {
  pc: Monitor,
  console: Gamepad2,
  ps5: Gamepad2,
  vip: Crown,
}

const sectionColors: Record<SeatType, string> = {
  pc: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30 hover:border-cyan-500/50",
  console: "text-green-400 bg-green-500/10 border-green-500/30 hover:border-green-500/50",
  ps5: "text-blue-400 bg-blue-500/10 border-blue-500/30 hover:border-blue-500/50",
  vip: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-500/50",
}

const sectionActiveColors: Record<SeatType, string> = {
  pc: "text-cyan-300 bg-cyan-500/20 border-cyan-500 shadow-[0_0_15px_rgba(0,212,255,0.3)]",
  console: "text-green-300 bg-green-500/20 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]",
  ps5: "text-blue-300 bg-blue-500/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]",
  vip: "text-yellow-300 bg-yellow-500/20 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]",
}

export function FloorSelector({ 
  floors, 
  selectedFloor, 
  selectedSection,
  onSelectFloor, 
  onSelectSection 
}: FloorSelectorProps) {
  const getAvailableCount = (section: Section) => {
    return section.seats.filter(s => s.status === "available").length
  }

  const isVIPFloor = selectedFloor?.name.toLowerCase().includes("vip")

  // Group VIP rooms by capacity
  const vip5Rooms = selectedFloor?.sections.filter(s => s.type === "vip" && s.roomCapacity === 5) || []
  const vip10Rooms = selectedFloor?.sections.filter(s => s.type === "vip" && s.roomCapacity === 10) || []
  const otherVIPRooms = selectedFloor?.sections.filter(s => s.type !== "vip") || []

  return (
    <div className="space-y-4">
      {/* Floor Tabs */}
      <div className="flex items-center gap-2 p-1 bg-secondary/50 rounded-lg overflow-x-auto">
        {floors.map((floor) => {
          const isVIP = floor.name.toLowerCase().includes("vip")
          return (
            <button
              key={floor.id}
              type="button"
              onClick={() => onSelectFloor(floor)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                selectedFloor?.id === floor.id
                  ? isVIP 
                    ? "bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]"
                    : "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(0,212,255,0.3)]"
                  : isVIP
                    ? "text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {isVIP ? <Crown className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
              {floor.name}
            </button>
          )
        })}
      </div>

      {/* VIP Floor Layout */}
      {selectedFloor && isVIPFloor && (
        <div className="space-y-6">
          {/* VIP Floor Header */}
          <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <Crown className="w-5 h-5 text-yellow-400" />
            <span className="font-medium text-yellow-400">VIP Floor - Select a Room</span>
            <span className="ml-auto text-xs text-yellow-400/70">Premium pricing applies</span>
          </div>

          {/* 5-Seated VIP Rooms */}
          {vip5Rooms.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/30">
                  <span className="text-sm font-bold text-yellow-400">5</span>
                </div>
                <h3 className="font-medium text-foreground">5-Seated VIP Rooms</h3>
                <span className="text-xs text-muted-foreground ml-auto">Perfect for small groups</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {vip5Rooms.map((section) => (
                  <VIPRoomCard
                    key={section.id}
                    section={section}
                    isSelected={selectedSection?.id === section.id}
                    availableSeats={getAvailableCount(section)}
                    onSelect={() => onSelectSection(section)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 10-Seated VIP Rooms */}
          {vip10Rooms.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/30">
                  <span className="text-sm font-bold text-yellow-400">10</span>
                </div>
                <h3 className="font-medium text-foreground">10-Seated VIP Rooms</h3>
                <span className="text-xs text-muted-foreground ml-auto">Great for parties & tournaments</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {vip10Rooms.map((section) => (
                  <VIPRoomCard
                    key={section.id}
                    section={section}
                    isSelected={selectedSection?.id === section.id}
                    availableSeats={getAvailableCount(section)}
                    onSelect={() => onSelectSection(section)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Other VIP Sections (PS5, Xbox) */}
          {otherVIPRooms.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-medium text-foreground">Console VIP Suites</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {otherVIPRooms.map((section) => {
                  const Icon = sectionIcons[section.type]
                  const isSelected = selectedSection?.id === section.id
                  const availableSeats = getAvailableCount(section)
                  const totalSeats = section.seats.length
                  
                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => onSelectSection(section)}
                      className={cn(
                        "relative flex items-start gap-3 p-4 rounded-xl border transition-all text-left",
                        isSelected 
                          ? sectionActiveColors[section.type]
                          : sectionColors[section.type]
                      )}
                    >
                      {section.roomCapacity && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-white/10 rounded-full">
                          <Users className="w-3 h-3" />
                          <span className="text-xs font-medium">{section.roomCapacity}</span>
                        </div>
                      )}
                      <div className={cn(
                        "p-2 rounded-lg",
                        isSelected ? "bg-white/10" : "bg-white/5"
                      )}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground">{section.name}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {section.description}
                        </p>
                        <span className={cn(
                          "text-xs font-medium mt-2 inline-block",
                          availableSeats > 2 ? "text-emerald-400" : availableSeats > 0 ? "text-yellow-400" : "text-red-400"
                        )}>
                          {availableSeats} / {totalSeats} available
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Regular Floor Sections */}
      {selectedFloor && !isVIPFloor && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {selectedFloor.sections.map((section) => {
            const Icon = sectionIcons[section.type]
            const isSelected = selectedSection?.id === section.id
            const availableSeats = getAvailableCount(section)
            const totalSeats = section.seats.length
            
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => onSelectSection(section)}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-xl border transition-all text-left",
                  isSelected 
                    ? sectionActiveColors[section.type]
                    : sectionColors[section.type]
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg",
                  isSelected ? "bg-white/10" : "bg-white/5"
                )}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-medium text-foreground truncate">{section.name}</h4>
                    {section.type === "vip" && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-yellow-500 text-black rounded">
                        VIP
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {section.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={cn(
                      "text-xs font-medium",
                      availableSeats > 5 ? "text-emerald-400" : availableSeats > 0 ? "text-yellow-400" : "text-red-400"
                    )}>
                      {availableSeats} / {totalSeats} available
                    </span>
                    {section.type === "vip" && (
                      <span className="text-xs text-yellow-400">2x price</span>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-border">
        <span className="text-xs text-muted-foreground">Section Types:</span>
        <div className="flex items-center gap-1 text-xs">
          <Monitor className="w-3 h-3 text-cyan-400" />
          <span className="text-muted-foreground">PC</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <Gamepad2 className="w-3 h-3 text-green-400" />
          <span className="text-muted-foreground">Xbox</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <Gamepad2 className="w-3 h-3 text-blue-400" />
          <span className="text-muted-foreground">PS5</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <Crown className="w-3 h-3 text-yellow-400" />
          <span className="text-muted-foreground">VIP</span>
        </div>
      </div>
    </div>
  )
}

// VIP Room Card Component
function VIPRoomCard({ 
  section, 
  isSelected, 
  availableSeats, 
  onSelect 
}: { 
  section: Section
  isSelected: boolean
  availableSeats: number
  onSelect: () => void
}) {
  const totalSeats = section.seats.length
  const isFull = availableSeats === 0

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={isFull}
      className={cn(
        "relative flex flex-col p-4 rounded-xl border transition-all text-left overflow-hidden",
        isSelected 
          ? "bg-yellow-500/20 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]"
          : isFull
            ? "bg-red-500/5 border-red-500/30 opacity-60 cursor-not-allowed"
            : "bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-500/50 hover:bg-yellow-500/15"
      )}
    >
      {/* Room capacity badge */}
      <div className={cn(
        "absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full",
        isSelected ? "bg-yellow-500 text-black" : "bg-yellow-500/20 text-yellow-400"
      )}>
        <Users className="w-3 h-3" />
        <span className="text-xs font-bold">{section.roomCapacity}</span>
      </div>

      {/* Room Name */}
      <div className="flex items-center gap-2 mb-2">
        <Crown className={cn(
          "w-5 h-5",
          isSelected ? "text-yellow-300" : "text-yellow-400"
        )} />
        <h4 className="font-semibold text-foreground">{section.name}</h4>
      </div>
      
      {/* Description */}
      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
        {section.description}
      </p>

      {/* Availability */}
      <div className="mt-auto flex items-center justify-between">
        <span className={cn(
          "text-sm font-medium",
          availableSeats > 2 ? "text-emerald-400" : availableSeats > 0 ? "text-yellow-400" : "text-red-400"
        )}>
          {isFull ? "Room Full" : `${availableSeats}/${totalSeats} seats available`}
        </span>
        {isSelected && (
          <span className="text-xs text-yellow-300 bg-yellow-500/20 px-2 py-1 rounded">
            Selected
          </span>
        )}
      </div>

      {/* 2x Price indicator */}
      <div className="mt-2 pt-2 border-t border-yellow-500/20">
        <span className="text-xs text-yellow-400/70">2x base price per seat</span>
      </div>

      {/* Selection glow */}
      {isSelected && (
        <div className="absolute inset-0 pointer-events-none border-2 border-yellow-500 rounded-xl" />
      )}
    </button>
  )
}
