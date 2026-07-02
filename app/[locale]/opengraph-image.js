import { ImageResponse } from "next/og";
import { getDictionary } from "@/i18n/dictionaries";

// Branded Open Graph image shared by every page that does not provide its own
// (project detail pages override it with their cover image).

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "AURA360LAB";

export default async function OpengraphImage({ params }) {
  const dict = await getDictionary(params.locale);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: "#161615", // ink
          color: "#F5F5F3", // bone
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#7FA3C4", // blueprint-soft
          }}
        >
          {dict.hero.eyebrow}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 110,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
            }}
          >
            <span>AURA</span>
            <span style={{ color: "#7FA3C4" }}>360</span>
            <span>LAB</span>
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 32,
              color: "rgba(245, 245, 243, 0.75)",
              maxWidth: 900,
            }}
          >
            {dict.meta.defaultDescription}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#8A8A84", // ash
          }}
        >
          <span>{dict.meta.siteName}</span>
          <span>360°</span>
        </div>
      </div>
    ),
    size
  );
}
