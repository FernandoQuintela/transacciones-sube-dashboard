import { useEffect, useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

// Colores oficiales de las líneas de subte
const LINE_COLORS = {
  A: "#66ccff",
  B: "#ff6680",
  C: "#5695ecff",
  D: "#37a85dff",
  E: "#b08bfaff",
  H: "#ffe666",
  PM: "#6e6e6e",
};
const getColor = (line) => LINE_COLORS[line] || "#4b5563";

export default function MonthlyLineShare() {
  const [data, setData] = useState([]);
  const [monthLabel, setMonthLabel] = useState("");
  const [status, setStatus] = useState("loading");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setStatus("loading");
    fetch(`${API_URL}/api/monthly-share`)
      .then((r) => r.json())
      .then((rows) => {
        if (!Array.isArray(rows) || rows.length === 0) {
          setData([]);
          setStatus("empty");
          return;
        }
        // rows ya viene con: line, value, percent, monthLabel
        setData(rows);
        setMonthLabel(rows[0]?.monthLabel || "");
        setStatus("ok");
      })
      .catch(() => {
        setStatus("error");
        setData([]);
      });
  }, [API_URL]);

  if (status === "loading") return <p style={{ opacity: 0.6 }}>Cargando...</p>;
  if (status === "error")   return <p style={{ opacity: 0.6 }}>No pude cargar el mes.</p>;
  if (data.length === 0)    return <p style={{ opacity: 0.6 }}>No hay datos para este mes.</p>;

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <p style={{ fontSize: ".7rem", opacity: 0.5, marginBottom: ".5rem" }}>
        Mes: {monthLabel}
      </p>

      <ResponsiveContainer width="100%" height={270}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="line"
            innerRadius={60}
            outerRadius={84}
            paddingAngle={2}
            label={({ line, percent }) => `${line} ${(percent).toFixed(1)}%`}
            labelLine={false}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={getColor(entry.line)} />
            ))}
          </Pie>

          <Tooltip
            formatter={(v, _n, item) => {
              const p = item?.payload?.percent ?? 0;
              return [`${Number(v).toLocaleString("es-AR")} (${(p).toFixed(1)}%)`, `Línea ${item?.payload?.line}`];
            }}
            contentStyle={{ background: "#e0e8fcff", border: "none" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
