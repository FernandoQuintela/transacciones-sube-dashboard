import { useEffect, useState, useContext } from "react";
import PassengersChart from "./components/PassengersChart.jsx";
import TopLinesChart from "./components/TopLinesChart.jsx";
import ChartCard from "./components/ChartCard.jsx";
import LineSelector from "./components/LineSelector.jsx";
import LineBadge from "./components/LineBadge.jsx";
import MonthlyLineShare from "./components/MonthlyLineShare.jsx";
import NationalStats from "./components/NationalStats.jsx";
import FloatingButton from "./components/FloatingButton.jsx";
import InfoModal from "./components/InfoModal.jsx";
import trainIcon from "./assets/train.png";
import { ThemeContext } from "./context/ThemeContext.jsx";
import ThemeSwitch from "./components/ThemeSwitch.jsx";

function App() {
  const [apiMessage, setApiMessage] = useState("cargando...");
  const [lines, setLines] = useState([]);
  const [selectedLine, setSelectedLine] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const { theme } = useContext(ThemeContext);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // hello
    fetch("http://localhost:4000/api/hello")
      .then((r) => r.json())
      .then((d) => setApiMessage(d.message))
      .catch(() => setApiMessage("No pude hablar con el backend 😒"));

    // líneas
    
    fetch(`${API_URL}/api/lines`)
      .then((r) => r.json())
      .then((data) => {
        const ordered = [...data].sort((a, b) =>
          a.code.localeCompare(b.code, "es")
        );
        setLines(ordered);
        const hasD = ordered.find((l) => l.code === "D");
        setSelectedLine(hasD ? "D" : ordered[0]?.code || "");
      })
      .catch(() => setLines([]));
  }, [API_URL]);

  return (
    <>
      {/* estilos globales */}
      <style>{`
        body {
          background: #000;
          margin: 0;              /* por las dudas */
        }
        .page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          width: 100vw;
        }
        .container {
          width: min(1200px, 100%);
          padding: 2rem 1.5rem 3rem;
          color: #e2e8f0;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        @media (min-width: 1024px) {
          .grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>

      <div className="page">
        <div className="container">
          {/* HEADER NUEVO */}
          <header
            style={{
              textAlign: "center",
              marginBottom: "2.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.35rem",
              alignItems: "center",
              position: "relative",
              color: theme === "dark" ? "#f8fafc" : "#0f172a", // ← color general del header
            }}
          >
            <img
              src={trainIcon}
              alt="Transporte"
              style={{
                width: 58,
                height: 58,
                opacity: theme === "dark" ? 0.9 : 0.8,
                filter: theme === "light" ? "invert(1)" : "none", // ← así el ícono se adapta
              }}
            />

            <h1
              style={{
                fontSize: "1.6rem",
                margin: 0,
                color: theme === "dark" ? "#f8fafc" : "#5477c2ff",
              }}
            >
              Dashboard interactivo de Transacciones SUBE
            </h1>

            <p
              style={{
                margin: 0,
                fontSize: ".9rem",
                opacity: 0.75,
                color: theme === "dark" ? "#cbd5e1" : "#334155",
              }}
            >
              Análisis y visualización de datos públicos de movilidad urbana y nacional
            </p>

            <p
              style={{
                margin: 0,
                fontSize: ".75rem",
                color: theme === "dark" ? "#38bdf8" : "#2969d6ff",
              }}
            >
              Argentina 2025
            </p>

            {/* SWITCH DE TEMA */}
            <div style={{ marginTop: "1rem" }}>
              <ThemeSwitch />
            </div>
          </header>

          {/* selector de línea */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1rem", marginBottom: ".5rem", color: theme === "dark" ? "#e2e8f0" : "#989a9eff" }}>Filtrar por línea de subte</h2>

            <LineSelector
              lines={lines}
              value={selectedLine}
              onChange={setSelectedLine}
            />
          </div>


          {/* GRID DE CARDS */}
          <div className="grid">
            <ChartCard
              title={
                <span style={{ display: "flex", gap: ".4rem", alignItems: "center" }}>
                  <LineBadge code={selectedLine} />
                  Transacciones por mes (línea {selectedLine})
                </span>
              }
            >
              {(visible) => (
                <PassengersChart lineCode={selectedLine} animate={visible} />
              )}
            </ChartCard>

            <ChartCard title="Ranking de líneas de subte por uso (total de transacciones en 2025)">
              {(visible) => <TopLinesChart animate={visible} />}
            </ChartCard>

            <ChartCard title="Proporción por línea (último mes)">
              {() => <MonthlyLineShare />}
            </ChartCard>

            <ChartCard title="Resumen nacional 2025" autoHeight>
              {() => <NationalStats />}
            </ChartCard>
          </div>
          <footer
            style={{
              textAlign: "center",
              fontSize: ".75rem",
              marginTop: "2rem",
              marginBottom: "2rem",
              opacity: 0.7,
              color: theme === "dark" ? "#e2e8f0" : "#1e293b", // ← texto claro u oscuro
            }}
          >
            Creado y compartido por <strong>Fernando Quintela</strong> usando datos públicos de 2025.{" "}
            <span style={{ opacity: 0.6 }}>Fuente: datos.transporte.gob.ar</span>
          </footer>
        </div>
      </div>
      <FloatingButton onClick={() => setShowInfo(true)} />
      <InfoModal open={showInfo} onClose={() => setShowInfo(false)} />
    </>
  );
}

export default App;
