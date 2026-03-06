export type SeatType = "pc" | "console" | "ps5" | "vip"
export type SeatStatus = "available" | "selected"

export interface Seat {
  id: string
  row: string
  number: number
  type: SeatType
  status: SeatStatus
  specs?: string
  priceMultiplier: number
}

export interface Floor {
  id: string
  name: string
  sections: Section[]
}

export interface Section {
  id: string
  name: string
  type: SeatType
  seats: Seat[]
  description: string
  icon: string
  roomCapacity?: number // For VIP rooms - 5 or 10 seated
}

export interface PCCafe {
  id: string
  name: string
  address: string
  rating: number
  reviewCount: number
  isOpen: boolean
  openHours: string
  availableSeats: number
  totalSeats: number
  pricePerHour: number
  amenities: string[]
  lat: number
  lng: number
  distance?: string
  image: string
  floors: Floor[]
}
