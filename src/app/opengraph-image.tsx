import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        backgroundColor: "#0e0d0b",
        padding: "72px 80px",
        position: "relative",
      }}
    >
      {/* Decorative accent line */}
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          width: "4px",
          height: "100%",
          backgroundColor: "#c2724e",
        }}
      />

      {/* Location badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#c2724e",
            marginRight: "10px",
          }}
        />
        <span
          style={{
            color: "#c2724e",
            fontSize: "16px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontFamily: "sans-serif",
          }}
        >
          {site.location} a okol&#237;
        </span>
      </div>

      {/* Name */}
      <div
        style={{
          color: "#f5f1eb",
          fontSize: "64px",
          fontWeight: "700",
          lineHeight: "1.1",
          fontFamily: "serif",
          marginBottom: "16px",
        }}
      >
        {site.name}
      </div>

      {/* Tagline */}
      <div
        style={{
          color: "#a09488",
          fontSize: "28px",
          fontFamily: "sans-serif",
          fontWeight: "400",
        }}
      >
        Rodinné focení · Svatby · Události · Dron
      </div>
    </div>,
    {
      ...size,
    },
  );
}
