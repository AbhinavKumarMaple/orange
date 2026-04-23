import { ImageResponse } from "next/og";
import { getProject } from "@/lib/queries";
import { siteConfig } from "@/lib/site";

export const alt = "Project — Orange Studios";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);

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
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            opacity: 0.9,
          }}
        >
          <div>{project?.category ?? "Case Study"}</div>
          <div>{project?.year ?? ""}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.0,
            }}
          >
            {project?.name ?? "Project"}
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 400,
              opacity: 0.9,
              maxWidth: "85%",
              lineHeight: 1.3,
            }}
          >
            {project?.industry ? `${project.industry} · ` : ""}{siteConfig.name}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
