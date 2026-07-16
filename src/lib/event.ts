// Bradby Shield 2026 — 80th Bradby Viewing Party event content.
// The Attendly platform is generic; everything event-specific lives here.

export const bradby = {
  title: "80th Bradby Viewing Party",
  edition: "Bradby Shield 2026",
  subtitle: "The Grandstand Theatre Experience",
  tagline: ["One rivalry.", "One passion.", "One experience."],
  description:
    "A premium open-air theatre experience where the passion of Bradby comes alive on the big screen with electrifying entertainment, great food and unforgettable memories.",
  venue: "Royal College Sports Complex, Colombo 07",
  schedule: [
    { label: "Date", value: "TBA" },
    { label: "Gates open", value: "2:00 PM" },
    { label: "Kick-off", value: "4:15 PM" },
    { label: "Venue", value: "Royal College Sports Complex, Colombo 07" },
  ],
  teams: {
    home: {
      name: "Royal College",
      city: "Colombo",
      crest: "/royal-college.png",
    },
    away: {
      name: "Trinity College",
      city: "Kandy",
      crest: "/trinity-college.png",
    },
  },
} as const;

/** Grandstand seating: cinema-style rows facing the LED screen. */
export const seating = {
  rows: ["A", "B", "C", "D", "E", "F"],
  seatsPerRow: 75,
  /** Seats per block, separated by walking aisles (must sum to seatsPerRow). */
  blocks: [20, 35, 20],
  pricePerSeat: 1500,
  maxSeatsPerBooking: 10,
} as const;

/** Valid seat ids: row A–F + zero-padded 01–75 (e.g. "A01", "F75"). */
export const SEAT_RE = /^[A-F](0[1-9]|[1-6][0-9]|7[0-5])$/;

export function seatId(row: string, n: number): string {
  return `${row}${String(n).padStart(2, "0")}`;
}

export function formatLKR(amount: number): string {
  return `Rs ${amount.toLocaleString("en-LK")}`;
}
