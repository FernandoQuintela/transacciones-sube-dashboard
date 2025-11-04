import { useEffect, useState } from "react";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";

export default function NationalStats() {
  const [data, setData] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/metrics`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, [API_URL]);

  if (!data) {
    return <p style={{ opacity: 0.6, fontSize: ".8rem" }}>Cargando métricas...</p>;
  }

  const { totalPassengers, byMode, ambaTotal, topColectivo } = data;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
      <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
        <Kpi label="Transacciones totales" value={totalPassengers} />
        <Kpi label="En AMBA" value={ambaTotal} />
      </div>
      <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
        {Object.entries(byMode).map(([mode, val]) => (
          <Kpi key={mode} label={`Transporte: ${mode}`} value={val} small />
        ))}
      </div>

      {topColectivo && (
        <Kpi
          label="Colectivo con más transacciones"
          value={topColectivo.passengers}
          extra={topColectivo.line}
        />
      )}
    </div>
  );
}

function Kpi({ label, value, extra, small = false }) {
  const { theme } = useContext(ThemeContext);
  return (
    <div
      style={{
        background: theme === "dark" ? "#292929ff" : "#5477c2ff",
        border: "1px solid rgba(148,163,184,0.09)",
        borderRadius: "0.7rem",
        padding: small ? ".35rem .6rem" : ".5rem .75rem",
      }}
    >
      <p style={{ margin: 0, fontSize: ".6rem", opacity: 0.6, textTransform: "uppercase" }}>
        {label}
      </p>
      <p style={{ margin: 0, fontSize: small ? "1rem" : "1.2rem", fontWeight: 600 }}>
        {value.toLocaleString("es-AR")}
      </p>
      {extra && (
        <p style={{ margin: 0, fontSize: ".7rem", opacity: 0.7 }}>
          {extra}
        </p>
      )}
    </div>
  );
}
