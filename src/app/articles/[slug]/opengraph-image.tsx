import { ImageResponse } from "next/og";
import { getArticle } from "@/lib/queries";
import { siteConfig } from "@/lib/site";

export const alt = "Article — Orange Studios";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);

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
            "linear-gradient(135deg, #1a1a1a 0%, #2a1a0a 50%, #3a1f00 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            fontWeight: 600,
            color: "#ff7a1a",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
          }}
        >
          {article?.category ?? "Article"}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              maxWidth: "90%",
            }}
          >
            {article?.title ?? "Article"}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 28,
              opacity: 0.8,
              marginTop: 12,
            }}
          >
            <div>{siteConfig.name}</div>
            <div>{article?.date ?? ""}</div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
