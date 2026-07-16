import { ImageResponse } from "next/og";

export const alt =
  "80th Bradby Viewing Party — Bradby Shield 2026. Royal College vs Trinity College, book your grandstand seats on Attendly.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const pills = ["Royal College", "VS", "Trinity College"];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage:
            "radial-gradient(120% 90% at 15% 0%, #ee6a29 0%, #f9974f 30%, #fcd9b3 60%, #faf3ea 100%)",
        }}
      >
        {/* Floating cream panel, like the app shell */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: 1040,
            height: 470,
            borderRadius: 48,
            backgroundColor: "rgba(247,244,240,0.92)",
            boxShadow: "0 40px 80px rgba(67,20,7,0.35)",
            border: "1px solid rgba(255,255,255,0.6)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <svg width="88" height="88" viewBox="0 0 32 32">
              <defs>
                <linearGradient id="m" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
              </defs>
              <circle cx="16" cy="16" r="14" fill="url(#m)" />
              <path
                d="M6 19c4-3.5 16-3.5 20 0M8 13.5c3.5-2.8 12.5-2.8 16 0M11 8.8c2.6-1.7 7.4-1.7 10 0"
                stroke="#fff"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div style={{ display: "flex", fontSize: 92, fontWeight: 700 }}>
              <span style={{ color: "#0f172a" }}>Attend</span>
              <span style={{ color: "#ea580c" }}>ly</span>
            </div>
          </div>

          <div
            style={{
              marginTop: 20,
              fontSize: 34,
              fontWeight: 600,
              color: "#334155",
              textAlign: "center",
            }}
          >
            80th Bradby Viewing Party · Bradby Shield 2026
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: 32,
            }}
          >
            {pills.map((s) => (
              <div
                key={s}
                style={{
                  display: "flex",
                  padding: s === "VS" ? "12px 22px" : "12px 28px",
                  borderRadius: 999,
                  backgroundColor: s === "VS" ? "#ea580c" : "#ffffff",
                  color: s === "VS" ? "#ffffff" : "#c2410c",
                  fontSize: 26,
                  fontWeight: 700,
                  border:
                    s === "VS" ? "none" : "1px solid rgba(234,88,12,0.25)",
                }}
              >
                {s}
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 36,
              fontSize: 20,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "rgba(67,20,7,0.55)",
            }}
          >
            The Grandstand Theatre Experience · Powered by ARC AI
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
