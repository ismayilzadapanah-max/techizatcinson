import { ImageResponse } from "next/og";
import { SITE } from "@/lib/constants";

export const revalidate = 3600;

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0B0E3B 0%, #1A1D60 50%, #243786 100%)",
          fontFamily: "Inter",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            padding: 48,
          }}
        >
          {/* Logo ikon */}
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 20,
              background: "linear-gradient(135deg, #243786, #D47092)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
              color: "white",
              fontWeight: 900,
            }}
          >
            T
          </div>

          {/* Başlıq */}
          <h1
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: "white",
              textAlign: "center",
              letterSpacing: -1,
              margin: 0,
            }}
          >
            Techizatcin.com
          </h1>

          {/* Alt başlıq */}
          <p
            style={{
              fontSize: 28,
              color: "#9DB1CA",
              textAlign: "center",
              margin: 0,
              maxWidth: 800,
            }}
          >
            Restoranlar və təchizatçılar üçün ağıllı B2B marketplace
          </p>

          {/* Tagline */}
          <div
            style={{
              marginTop: 16,
              padding: "12px 32px",
              borderRadius: 40,
              background: "rgba(212, 112, 146, 0.2)",
              border: "2px solid rgba(212, 112, 146, 0.4)",
              fontSize: 22,
              color: "#D47092",
              fontWeight: 600,
            }}
          >
            Azərbaycanın ən böyük təchizat platforması
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            fontSize: 18,
            color: "#5D608B",
          }}
        >
          techizatcin.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
