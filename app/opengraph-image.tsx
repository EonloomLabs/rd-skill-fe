import { ImageResponse } from "next/og";

import { getCounts } from "@/lib/skills";
import { SITE } from "@/lib/site";

export const alt = "rd-skills — engineering control plane for AI coding agents";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SPINE = ["Request", "Professional judgment", "Evidence", "Closure"];

export default function OpenGraphImage() {
  const counts = getCounts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#090b10",
          color: "#e9eef6",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#8aa5ff",
              display: "flex",
            }}
          >
            {SITE.name}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 68,
              lineHeight: 1.08,
              letterSpacing: -2,
              maxWidth: 900,
              display: "flex",
            }}
          >
            Engineering control plane for AI coding agents
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 26 }}>
          {SPINE.map((item, index) => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ color: index === SPINE.length - 1 ? "#5fce9f" : "#bcc7d6", display: "flex" }}>
                {item}
              </div>
              {index < SPINE.length - 1 ? (
                <div style={{ color: "#4a5568", display: "flex" }}>→</div>
              ) : null}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: 56,
            borderTop: "1px solid #242d3a",
            paddingTop: 28,
            fontSize: 24,
            color: "#828fa1",
          }}
        >
          <div style={{ display: "flex", gap: 10 }}>
            <span style={{ color: "#e9eef6" }}>{counts.runtimeTopLevel}</span> runtime skills
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <span style={{ color: "#e9eef6" }}>{counts.agentRoles}</span> agent roles
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <span style={{ color: "#e9eef6" }}>0–{counts.maxLayer3PerTask}</span> Layer 3 per task
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <span style={{ color: "#e9eef6" }}>{counts.hostAdapters}</span> host adapters
          </div>
        </div>
      </div>
    ),
    size,
  );
}
