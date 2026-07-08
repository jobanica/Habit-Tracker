import { ImageResponse } from "next/og";
import { config, formatPrice } from "@/lib/config";

export const runtime = "edge";
export const alt = config.productName;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 34, opacity: 0.9 }}>{config.productName}</div>
        <div style={{ fontSize: 76, fontWeight: 800, marginTop: 16, lineHeight: 1.1 }}>
          {config.tagline}
        </div>
        <div style={{ fontSize: 40, marginTop: 40, fontWeight: 700 }}>
          {formatPrice()} · one-time
        </div>
      </div>
    ),
    { ...size },
  );
}
