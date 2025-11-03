import { useEffect, useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// Colores oficiales de las líneas de subte
const LINE_COLORS = {
  A: "#66ccff",  // celeste
  B: "#ff6680",  // rojo
  C: "#5695ecff",  // azul
  D: "#37a85dff",  // verde
  E: "#b08bfaff",  // violeta
  H: "#ffe666",  // amarillo
  PM: "#6e6e6e", // gris
};

// si alguna línea no está, usa gris oscuro
const getColor = (line) => LINE_COLORS[line] || "#4b5563";

export default function MonthlyLineShare() {
  const [data, setData] = useState([]);
  const [monthLabel, setMonthLabel] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/stats`)
      .then((r) => r.json())
      .then((rows) => {
        if (!rows || rows.length === 0) {
          setData([]);
          return;
        }

        const months = rows
          .map((r) => r.date?.slice(0, 7))
          .filter(Boolean);
        const latest = months.sort().at(-1); // "2025-10"

        const latestRows = rows.filter((r) => r.date && r.date.startsWith(latest));

        const byLine = latestRows.reduce((acc, item) => {
          const line = item.line || "SIN LÍNEA";
          acc[line] = (acc[line] || 0) + (item.passengers || 0);
          return acc;
        }, {});

        const pieData = Object.entries(byLine)
          .map(([line, value]) => ({ name: line, value }))
          .sort((a, b) => b.value - a.value);

        setData(pieData);
        setMonthLabel(latest);
      });
  }, [API_URL]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {data.length === 0 ? (
        <p style={{ opacity: 0.6, fontSize: ".8rem" }}>No hay datos para este mes.</p>
      ) : (
        <>
          <p style={{ fontSize: ".7rem", opacity: 0.5, marginBottom: ".5rem" }}>
            Mes: {formatMonth(monthLabel)}
          </p>
          <ResponsiveContainer width="100%" height={270}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={84}
                paddingAngle={2}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => v.toLocaleString("es-AR")}
                contentStyle={{ background: "#e0e8fcff", border: "none" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}

function formatMonth(ym) {
  if (!ym) return "";
  const [y, m] = ym.split("-");
  const nombres = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  return `${nombres[Number(m) - 1]} ${y}`;
}
