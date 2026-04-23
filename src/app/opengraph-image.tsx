import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const runtime = "edge";
export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "linear-gradient(135deg, #ff7a1a 0%, #ff4e00 50%, #c93b00 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            opacity: 0.85,
          }}
        >
          {siteConfig.name}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 84,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              maxWidth: "90%",
            }}
          >
            {siteConfig.tagline}
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 400,
              opacity: 0.85,
              maxWidth: "80%",
              lineHeight: 1.3,
            }}
          >
            Branding · Web Design · Digital Experience
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
