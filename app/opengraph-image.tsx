import { ImageResponse } from "next/og";
export const alt = "HUMANITALIS — Artificial Intelligence for Cultural Heritage";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() { return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", background: "#3B0D13", color: "#F2EBDD", padding: 72, alignItems: "center", position: "relative" }}><div style={{ position: "absolute", inset: 32, border: "1px solid rgba(178,138,63,.5)" }} /><div style={{ display: "flex", flexDirection: "column", gap: 24 }}><div style={{ fontFamily: "serif", fontSize: 105, letterSpacing: 8 }}>HUMANITALIS</div><div style={{ width: 120, height: 2, background: "#B28A3F" }} /><div style={{ fontSize: 32, letterSpacing: 2 }}>ARTIFICIAL INTELLIGENCE FOR CULTURAL HERITAGE</div></div><div style={{ position: "absolute", right: 90, top: 75, fontSize: 240, fontFamily: "serif", color: "rgba(178,138,63,.18)" }}>H</div></div>, size); }
