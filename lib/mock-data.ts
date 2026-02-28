import type { PCCafe, Floor, Seat, SeatType, SeatStatus } from "./types"

// Helper function to generate seats for a section
function generateSeats(
  sectionId: string,
  type: SeatType,
  rows: string[],
  seatsPerRow: number,
  occupiedPercent: number = 0.3
): Seat[] {
  const seats: Seat[] = []
  
  rows.forEach((row) => {
    for (let i = 1; i <= seatsPerRow; i++) {
      const random = Math.random()
      let status: SeatStatus = "available"
      if (random < occupiedPercent) status = "occupied"
      else if (random < occupiedPercent + 0.05) status = "maintenance"
      
      seats.push({
        id: `${sectionId}-${row}${i}`,
        row,
        number: i,
        type,
        status,
        specs: type === "pc" ? "RTX 4080, i9-13900K, 32GB RAM" 
             : type === "vip" ? "RTX 4090, i9-14900K, 64GB RAM, Private Booth"
             : type === "ps5" ? "PS5, DualSense Controller"
             : "Xbox Series X, Elite Controller",
        priceMultiplier: type === "vip" ? 2.0 : type === "pc" ? 1.0 : 0.8,
      })
    }
  })
  return seats
}

// Generate floors for a cafe
function generateFloors(cafeId: string, hasVIP: boolean = true): Floor[] {
  const floors: Floor[] = [
    {
      id: `${cafeId}-f1`,
      name: "1st Floor",
      sections: [
        {
          id: `${cafeId}-f1-pc`,
          name: "PC Gaming Zone",
          type: "pc",
          description: "High-end gaming PCs with RTX 4080",
          icon: "monitor",
          seats: generateSeats(`${cafeId}-f1-pc`, "pc", ["A", "B", "C", "D"], 8, 0.35),
        },
        {
          id: `${cafeId}-f1-console`,
          name: "Xbox Corner",
          type: "console",
          description: "Xbox Series X stations",
          icon: "gamepad-2",
          seats: generateSeats(`${cafeId}-f1-console`, "console", ["X", "Y"], 4, 0.25),
        },
      ],
    },
    {
      id: `${cafeId}-f2`,
      name: "2nd Floor",
      sections: [
        {
          id: `${cafeId}-f2-pc`,
          name: "Pro Gaming Arena",
          type: "pc",
          description: "Tournament-grade PCs with 360Hz monitors",
          icon: "monitor",
          seats: generateSeats(`${cafeId}-f2-pc`, "pc", ["E", "F", "G"], 10, 0.4),
        },
        {
          id: `${cafeId}-f2-ps5`,
          name: "PlayStation Lounge",
          type: "ps5",
          description: "PS5 consoles with premium displays",
          icon: "gamepad",
          seats: generateSeats(`${cafeId}-f2-ps5`, "ps5", ["P", "Q"], 5, 0.3),
        },
      ],
    },
  ]

  if (hasVIP) {
    floors.push({
      id: `${cafeId}-f3`,
      name: "3rd Floor - VIP",
      sections: [
        {
          id: `${cafeId}-f3-vip5-1`,
          name: "VIP 1 (5-Seat)",
          type: "vip",
          description: "5-Seat Private Room with RTX 4090, streaming setup, mini fridge, private bathroom",
          icon: "crown",
          seats: generateSeats(`${cafeId}-f3-vip5-1`, "vip", ["V"], 5, 0.2),
          roomCapacity: 5,
        },
        {
          id: `${cafeId}-f3-vip5-2`,
          name: "VIP 2 (5-Seat)",
          type: "vip",
          description: "5-Seat Private Room with RTX 4090, RGB lighting, premium chairs, snack bar",
          icon: "crown",
          seats: generateSeats(`${cafeId}-f3-vip5-2`, "vip", ["V"], 5, 0.4),
          roomCapacity: 5,
        },
        {
          id: `${cafeId}-f3-vip10-1`,
          name: "VIP 3 (10-Seat)",
          type: "vip",
          description: "10-Seat Party Room with RTX 4090, 4K projector, surround sound, karaoke system",
          icon: "crown",
          seats: generateSeats(`${cafeId}-f3-vip10-1`, "vip", ["A", "B"], 5, 0.3),
          roomCapacity: 10,
        },
        {
          id: `${cafeId}-f3-vip10-2`,
          name: "VIP 4 (10-Seat)",
          type: "vip",
          description: "10-Seat Tournament Room with RTX 4090, streaming setup, dual 4K displays, team comms",
          icon: "crown",
          seats: generateSeats(`${cafeId}-f3-vip10-2`, "vip", ["A", "B"], 5, 0.5),
          roomCapacity: 10,
        },
        {
          id: `${cafeId}-f3-vip-ps`,
          name: "VIP PS5 Suite",
          type: "ps5",
          description: "Private PS5 room with 4K OLED displays and premium seating",
          icon: "gamepad",
          seats: generateSeats(`${cafeId}-f3-vip-ps`, "ps5", ["PS"], 4, 0.4),
          roomCapacity: 4,
        },
        {
          id: `${cafeId}-f3-vip-xbox`,
          name: "VIP Xbox Lounge",
          type: "console",
          description: "Private Xbox Series X room with gaming chairs",
          icon: "gamepad-2",
          seats: generateSeats(`${cafeId}-f3-vip-xbox`, "console", ["XB"], 4, 0.35),
          roomCapacity: 4,
        },
      ],
    })
  }

  return floors
}

export const mockCafes: PCCafe[] = [
  {
    id: "1",
    name: "Cyber Arena",
    address: "Peace Avenue 15, Sukhbaatar District",
    rating: 4.8,
    reviewCount: 256,
    isOpen: true,
    openHours: "24/7",
    availableSeats: 45,
    totalSeats: 80,
    pricePerHour: 5000,
    amenities: ["RTX 4090", "240Hz Monitor", "Streaming Setup", "Snacks", "VIP Rooms"],
    lat: 47.9184,
    lng: 106.9177,
    distance: "0.3 km",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
    floors: generateFloors("1", true),
  },
  {
    id: "2",
    name: "Pixel Palace",
    address: "Seoul Street 22, Khan-Uul District",
    rating: 4.6,
    reviewCount: 189,
    isOpen: true,
    openHours: "10:00 AM - 2:00 AM",
    availableSeats: 28,
    totalSeats: 50,
    pricePerHour: 4000,
    amenities: ["RTX 4080", "165Hz Monitor", "VR Station", "Energy Drinks", "PS5"],
    lat: 47.9045,
    lng: 106.9287,
    distance: "0.8 km",
    image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&h=300&fit=crop",
    floors: generateFloors("2", false),
  },
  {
    id: "3",
    name: "Neon Nexus",
    address: "Chinggis Avenue 44, Bayanzurkh District",
    rating: 4.9,
    reviewCount: 312,
    isOpen: true,
    openHours: "24/7",
    availableSeats: 60,
    totalSeats: 100,
    pricePerHour: 6000,
    amenities: ["RTX 4090", "360Hz Monitor", "Private Booths", "Full Kitchen", "VIP Rooms"],
    lat: 47.9267,
    lng: 106.9570,
    distance: "1.2 km",
    image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=300&fit=crop",
    floors: generateFloors("3", true),
  },
  {
    id: "4",
    name: "Frag Factory",
    address: "Ikh Toiruu 56, Chingeltei District",
    rating: 4.4,
    reviewCount: 145,
    isOpen: false,
    openHours: "12:00 PM - 12:00 AM",
    availableSeats: 0,
    totalSeats: 40,
    pricePerHour: 3500,
    amenities: ["RTX 3080", "144Hz Monitor", "Console Area", "Snacks", "Xbox"],
    lat: 47.9220,
    lng: 106.9050,
    distance: "2.1 km",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=300&fit=crop",
    floors: generateFloors("4", false),
  },
  {
    id: "5",
    name: "Respawn Lounge",
    address: "Baga Toiruu 18, Sukhbaatar District",
    rating: 4.7,
    reviewCount: 223,
    isOpen: true,
    openHours: "8:00 AM - 4:00 AM",
    availableSeats: 35,
    totalSeats: 70,
    pricePerHour: 4500,
    amenities: ["RTX 4070", "240Hz Monitor", "Tournament Room", "Cafe", "VIP Rooms"],
    lat: 47.9150,
    lng: 106.9220,
    distance: "1.5 km",
    image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=400&h=300&fit=crop",
    floors: generateFloors("5", true),
  },
]
