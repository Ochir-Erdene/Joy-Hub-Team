"use client"

import React from "react"
import { useState } from "react"
import { Calendar, Clock, CreditCard, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { PCCafe, Section } from "@/lib/types"

interface BookingFormProps {
  cafe: PCCafe
  selectedSection: Section | null
  selectedSeats: string[]
  onBookingComplete: () => void
}

export function BookingForm({ cafe, selectedSection, selectedSeats, onBookingComplete }: BookingFormProps) {
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [duration, setDuration] = useState("1")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")

  // Calculate price based on section type
  const getPriceMultiplier = () => {
    if (!selectedSection) return 1
    const seat = selectedSection.seats[0]
    return seat?.priceMultiplier || 1
  }

  const basePrice = cafe.pricePerHour
  const multiplier = getPriceMultiplier()
  const pricePerSeat = basePrice * multiplier
  const totalPrice = pricePerSeat * Number(duration) * selectedSeats.length

  const isVIP = selectedSection?.type === "vip"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const sectionName = selectedSection?.name || "Unknown Section"
    alert(`Booking confirmed!\n\nSection: ${sectionName}\nSeats: ${selectedSeats.map(id => id.split("-").pop()).join(", ")}\nDate: ${date}\nTime: ${startTime}\nDuration: ${duration} hour(s)\nTotal: ${totalPrice.toLocaleString()} MNT`)
    onBookingComplete()
  }

  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", 
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
    "20:00", "21:00", "22:00", "23:00", "00:00", "01:00"
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {isVIP && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
          <Crown className="w-5 h-5 text-yellow-400" />
          <div>
            <p className="text-sm font-medium text-yellow-400">VIP Section Selected</p>
            <p className="text-xs text-muted-foreground">2x premium pricing applied</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 w-full">
          <Label htmlFor="date" className="text-foreground">Date</Label>
          <div className="relative w-full">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 bg-secondary border-border"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time" className="text-foreground">Start Time</Label>
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="bg-secondary border-border"
            required
          />
          {/* <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
            <Select value={startTime} onValueChange={setStartTime} required>
              <SelectTrigger className="pl-10 bg-secondary border-border">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>{time}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}
        </div>

      </div>

      <div className="space-y-2">
        <Label htmlFor="duration" className="text-foreground">Duration</Label>
        <Select value={duration} onValueChange={setDuration}>
          <SelectTrigger className="bg-secondary border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((h) => (
              <SelectItem key={h} value={h.toString()}>{h} hour{h > 1 ? "s" : ""}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-foreground">Your Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="bg-secondary border-border"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
          <Input
            id="phone"
            value={phone}
            type="tel"
            maxLength={8}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+976 ..."
            className="bg-secondary border-border"
            required
          />
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 rounded-lg bg-secondary/50 border border-border space-y-2">
        {selectedSection && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Section</span>
            <span className="text-foreground font-medium">{selectedSection.name}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Price per hour</span>
          <span className="text-foreground">
            {pricePerSeat.toLocaleString()} MNT
            {isVIP && <span className="text-yellow-400 ml-1">(VIP)</span>}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Duration</span>
          <span className="text-foreground">{duration} hour{Number(duration) > 1 ? "s" : ""}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Players</span>
          <span className="text-foreground">{selectedSeats.length}</span>
        </div>
        <div className="border-t border-border my-2 pt-2 flex justify-between">
          <span className="font-semibold text-foreground">Total</span>
          <span className="font-bold text-primary text-lg">{totalPrice.toLocaleString()} MNT</span>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={selectedSeats.length === 0 || !date || !startTime || !selectedSection}
      >
        <CreditCard className="w-4 h-4 mr-2" />
        Confirm Booking
      </Button>
    </form>
  )
}
