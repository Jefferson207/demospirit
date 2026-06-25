import { ImageResponse } from "next/og";

export const runtime = "edge";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg, #080806 0%, #151511 48%, #0F8F6C 100%)",
          color: "#FFFDF6",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: 72,
          width: "100%"
        }}
      >
        <div
          style={{
            border: "2px solid rgba(201,154,58,.55)",
            borderRadius: 28,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
            padding: 56,
            width: "100%"
          }}
        >
          <div style={{ color: "#F2D487", fontSize: 34, fontWeight: 800, letterSpacing: 6 }}>
            SPIRIT QOSQO TRAVEL
          </div>
          <div>
            <div style={{ fontSize: 82, fontWeight: 900, lineHeight: 1.02, maxWidth: 880 }}>
              Agencia de Viajes en Cusco
            </div>
            <div style={{ color: "#C9F7EF", fontSize: 34, marginTop: 28 }}>
              Machu Picchu, Valle Sagrado, Montaña de Colores y experiencias premium.
            </div>
          </div>
          <div style={{ color: "#F2D487", fontSize: 30, fontWeight: 700 }}>
            +51 982 214 529
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}
