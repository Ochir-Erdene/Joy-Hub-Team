"use client";

import React from "react";

import {
  Monitor,
  Gamepad2,
  Crown,
  Users,
  Tv,
  Speaker,
  Refrigerator,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Seat, SeatType, Section } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface SeatSelectionProps {
  section: Section;
  selectedSeats: string[];
  onSelectSeat: (seatId: string) => void;
}

const seatIcons: Record<SeatType, React.ElementType> = {
  pc: Monitor,
  console: Gamepad2,
  ps5: Gamepad2,
  vip: Crown,
};

const seatTypeLabels: Record<SeatType, string> = {
  pc: "Gaming PC",
  console: "Xbox Series X",
  ps5: "PlayStation 5",
  vip: "VIP Booth",
};

export function SeatSelection({
  section,
  selectedSeats,
  onSelectSeat,
}: SeatSelectionProps) {
  const [players, setPlayers] = useState("1");

  // Keep selected seats equal to player count
  useEffect(() => {
    const count = Number(players);
    if (count <= 0) return;

    const availableSeats = section.seats.filter(
      (s) => s.status === "available"
    );

    // If we need more seats, add them
    if (selectedSeats.length < count) {
      const seatsToAdd = availableSeats
        .filter((s) => !selectedSeats.includes(s.id))
        .slice(0, count - selectedSeats.length);

      seatsToAdd.forEach((seat) => onSelectSeat(seat.id));
    }

    // If we have too many seats, remove the extra ones
    if (selectedSeats.length > count) {
      const seatsToRemove = selectedSeats.slice(count);
      seatsToRemove.forEach((seatId) => onSelectSeat(seatId));
    }
  }, [players, selectedSeats, section.seats, onSelectSeat]);
  // Group seats by row
  const rows = section.seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  const rowKeys = Object.keys(rows).sort();
  const Icon = seatIcons[section.type];
  const isVIPRoom = section.type === "vip";

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "p-2 rounded-lg",
              section.type === "pc" && "bg-cyan-500/20",
              section.type === "console" && "bg-green-500/20",
              section.type === "ps5" && "bg-blue-500/20",
              section.type === "vip" && "bg-yellow-500/20"
            )}
          >
            <Icon
              className={cn(
                "w-5 h-5",
                section.type === "pc" && "text-cyan-400",
                section.type === "console" && "text-green-400",
                section.type === "ps5" && "text-blue-400",
                section.type === "vip" && "text-yellow-400"
              )}
            />
          </div>
          <div>
            <h3 className="font-medium text-foreground">{section.name}</h3>
            <p className="text-xs text-muted-foreground">
              {isVIPRoom && section.roomCapacity
                ? `${section.roomCapacity}-Seat Private Room`
                : seatTypeLabels[section.type]}
            </p>
          </div>
        </div>
        {section.type === "vip" && (
          <span className="px-3 py-1 text-xs font-bold bg-yellow-500 text-black rounded-full">
            2x PRICE
          </span>
        )}
      </div>

      {/* VIP Room Features */}
      {isVIPRoom && (
        <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
          <h4 className="text-sm font-medium text-yellow-400 mb-3">
            Room Features
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Monitor className="w-4 h-4 text-yellow-400" />
              <span>RTX 4090 PCs</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Tv className="w-4 h-4 text-yellow-400" />
              <span>
                {section.roomCapacity === 10 ? "4K Projector" : "4K Display"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Speaker className="w-4 h-4 text-yellow-400" />
              <span>Surround Sound</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Refrigerator className="w-4 h-4 text-yellow-400" />
              <span>Mini Fridge</span>
            </div>
          </div>
        </div>
      )}
      {/* Player Selector */}
      <div className="space-y-2 max-w-xs">
        <Label htmlFor="players" className="text-foreground">
          Select Players
        </Label>
        <Select value={players} onValueChange={setPlayers}>
          <SelectTrigger className="bg-secondary border-primary">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6, 8, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(
              (p) => (
                <SelectItem key={p} value={p.toString()}>
                  {p} Player{p > 1 ? "s" : ""}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Seat grid */}
      <div
        className={cn(
          "rounded-xl p-6 border",
          isVIPRoom
            ? "bg-yellow-500/5 border-yellow-500/20"
            : "bg-secondary/30 border-border"
        )}
      >
        {/* VIP Room capacity indicator */}
        {isVIPRoom && section.roomCapacity && (
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <Users className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-yellow-400 font-medium">
                {section.roomCapacity}-Seat{" "}
                {section.roomCapacity === 5 ? "Private" : "Party"} Room
              </span>
            </div>
          </div>
        )}

        {/* Rows */}
        <div className="space-y-4">
          {rowKeys.map((rowKey) => (
            <div key={rowKey} className="flex items-center gap-4">
              <div className="flex gap-2 flex-wrap justify-center flex-1">
                {rows[rowKey].map((seat) => {
                  const isSelected = selectedSeats.includes(seat.id);
                  const isAvailable = seat.status === "available";

                  return (
                    <button
                      key={seat.id}
                      type="button"
                      disabled={!isAvailable}
                      title={`${seat.row}${seat.number} - ${
                        seat.specs || seatTypeLabels[section.type]
                      }`}
                      className={cn(
                        "relative w-14 h-14 rounded-lg flex flex-col items-center justify-center",
                        "transition-all duration-200 border",
                        isVIPRoom && "w-16 h-16", // Slightly larger for VIP
                        isSelected &&
                          section.type === "pc" &&
                          "bg-cyan-500/30 border-cyan-500 shadow-[0_0_15px_rgba(0,212,255,0.5)] scale-105",
                        isSelected &&
                          section.type === "console" &&
                          "bg-green-500/30 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)] scale-105",
                        isSelected &&
                          section.type === "ps5" &&
                          "bg-blue-500/30 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-105",
                        isSelected &&
                          section.type === "vip" &&
                          "bg-yellow-500/30 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)] scale-105",
                        isAvailable &&
                          !isSelected &&
                          "bg-emerald-500/20 border-emerald-500/50 hover:bg-emerald-500/30 hover:scale-105 cursor-pointer"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-5 h-5",
                          isVIPRoom && "w-6 h-6",
                          isSelected &&
                            section.type === "pc" &&
                            "text-cyan-400",
                          isSelected &&
                            section.type === "console" &&
                            "text-green-400",
                          isSelected &&
                            section.type === "ps5" &&
                            "text-blue-400",
                          isSelected &&
                            section.type === "vip" &&
                            "text-yellow-400",
                          isAvailable && !isSelected && "text-emerald-400"
                        )}
                      />
                      <span
                        className={cn(
                          "text-[10px] font-medium mt-0.5",
                          isSelected &&
                            section.type === "pc" &&
                            "text-cyan-400",
                          isSelected &&
                            section.type === "console" &&
                            "text-green-400",
                          isSelected &&
                            section.type === "ps5" &&
                            "text-blue-400",
                          isSelected &&
                            section.type === "vip" &&
                            "text-yellow-400",
                          isAvailable && !isSelected && "text-emerald-400"
                        )}
                      >
                        {isVIPRoom ? seat.number : `${seat.row}${seat.number}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-emerald-500/20 border border-emerald-500/50" />
          <span className="text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-6 h-6 rounded border",
              section.type === "pc" &&
                "bg-cyan-500/30 border-cyan-500 shadow-[0_0_10px_rgba(0,212,255,0.5)]",
              section.type === "console" &&
                "bg-green-500/30 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]",
              section.type === "ps5" &&
                "bg-blue-500/30 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]",
              section.type === "vip" &&
                "bg-yellow-500/30 border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]"
            )}
          />
          <span className="text-muted-foreground">Selected</span>
        </div>
      </div>

      {/* Specs Info */}
      {section.seats[0]?.specs && (
        <div
          className={cn(
            "p-3 rounded-lg border",
            isVIPRoom
              ? "bg-yellow-500/5 border-yellow-500/20"
              : "bg-secondary/50 border-border"
          )}
        >
          <p className="text-xs text-muted-foreground">
            <span
              className={cn(
                "font-medium",
                isVIPRoom ? "text-yellow-400" : "text-foreground"
              )}
            >
              Specs:
            </span>{" "}
            {section.seats[0].specs}
          </p>
        </div>
      )}
    </div>
  );
}
