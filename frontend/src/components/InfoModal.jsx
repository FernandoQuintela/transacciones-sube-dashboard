export default function InfoModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(5px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "1rem",
        animation: "fadeBackdrop 180ms ease-out",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(145deg, #0f172a 0%, #1e293b 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "1rem",
          width: "min(520px, 100%)",
          padding: "1.5rem 1.5rem 1.25rem",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          color: "#f1f5f9",
          animation: "scaleIn 220ms ease-out",
          transformOrigin: "center",
        }}
      >
        {/* encabezado */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: ".85rem", color: "#f8fafc" }}>
              Sobre este proyecto
            </h2>
            <p
              style={{
                margin: 0,
                marginTop: ".50rem",
                fontSize: "1rem",
                opacity: 0.85,
                color: "#cbd5e1",
              }}
            >
              Dashboard de Transacciones SUBE – Movilidad Nacional 2025
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: "9999px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#f8fafc",
              fontSize: "1rem",
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all .25s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(56,189,248,0.25)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
            }
          >
            X
          </button>
        </div>

        {/* contenido */}
        <div
          style={{
            marginTop: "1.2rem",
            display: "flex",
            flexDirection: "column",
            gap: ".8rem",
          }}
        >
          <p style={{ fontSize: ".85rem", lineHeight: 1.5 }}>
            Proyecto <strong>Full Stack</strong> desarrollado por <strong>Fernando Quintela</strong>, integrando backend en Node/Express y frontend en React. 
            Procesa más de <strong>400.000 transacciones del sistema SUBE</strong> para visualizar patrones de movilidad urbana y nacional durante 2025.
            <br /><br />
            El objetivo fue transformar un dataset público en una herramienta clara, visual y accesible, aplicando criterios de QA técnico, 
            diseño de interfaz y análisis de datos.
            <br /><br />
            <span style={{ opacity: 0.6, fontSize: ".8rem" }}>
              Fuente de datos:{" "}
              <a
                href="https://datos.transporte.gob.ar/dataset/sube-cantidad-de-transacciones-usos-por-fecha"
                target="_blank"
                rel="noreferrer"
                style={{ color: "#38bdf8" }}
              >
                datos.transporte.gob.ar
              </a>
            </span>
          </p>
          <div>
            <h3
              style={{
                fontSize: ".75rem",
                textTransform: "uppercase",
                opacity: 0.7,
                letterSpacing: ".05em",
                marginBottom: ".3rem",
              }}
            >
              Descargas
            </h3>
            <div
              style={{
                display: "flex",
                gap: ".5rem",
                flexWrap: "wrap",
                marginTop: ".25rem",
              }}
            >
              <a href="/cv-es.pdf" style={linkBtnStyle} download>
                CV (Español)
              </a>
              <a href="/cv-en.pdf" style={linkBtnStyle} download>
                CV (Inglés)
              </a>
            </div>
          </div>

          <div>
            <h3
              style={{
                fontSize: ".75rem",
                textTransform: "uppercase",
                opacity: 0.7,
                letterSpacing: ".05em",
                marginBottom: ".3rem",
              }}
            >
              Contacto
            </h3>

            <p style={{ fontSize: ".85rem", margin: ".2rem 0" }}>
              📧{" "}
              <a href="mailto:fernand.quintela@gmail.com" style={{ color: "#38bdf8" }}>
                fernand.quintela@gmail.com
              </a>
            </p>

            <p style={{ fontSize: ".85rem", margin: ".2rem 0" }}>
              💼{" "}
              <a
                href="https://www.linkedin.com/in/fernando-quintela-605565230/"
                target="_blank"
                rel="noreferrer"
                style={{ color: "#38bdf8" }}
              >
                linkedin.com/in/fernando-quintela
              </a>
            </p>

            <p style={{ fontSize: ".85rem", margin: ".2rem 0" }}>
              🐙{" "}
              <a
                href="https://github.com/FernandoQuintela/transacciones-sube-dashboard"
                target="_blank"
                rel="noreferrer"
                style={{ color: "#38bdf8" }}
              >
                github.com/FernandoQuintela/transacciones-sube-dashboard
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const linkBtnStyle = {
  background: "rgba(56,189,248,0.15)",
  border: "1px solid rgba(56,189,248,0.25)",
  borderRadius: "9999px",
  padding: ".4rem .8rem",
  fontSize: ".8rem",
  color: "#f1f5f9",
  textDecoration: "none",
  transition: "background .25s ease, border .25s ease",
};

if (typeof document !== "undefined" && !document.getElementById("modal-anims")) {
  const style = document.createElement("style");
  style.id = "modal-anims";
  style.innerHTML = `
    @keyframes scaleIn {
      0% { opacity: 0; transform: scale(.92); }
      100% { opacity: 1; transform: scale(1); }
    }
    @keyframes fadeBackdrop {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}
