import { useEffect, useState, useContext } from "react";
import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { ThemeContext } from "../context/ThemeContext.jsx";

export default function PassengersChart({ lineCode = "D", animate = true }) {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("loading");
  const API_URL = import.meta.env.VITE_API_URL;
  const { theme } = useContext(ThemeContext);

  // colores según tema
  const bg = theme === "dark" ? "#111827" : "#ffffff";
  const gridColor = theme === "dark" ? "#1f2937" : "#04080F";
  const axisColor = theme === "dark" ? "#e2e8f0" : "#04080F";
  const lineColor = theme === "dark" ? "#38bdf8" : "#5477c2ff";
  const tooltipLabel = theme === "dark" ? "#fff" : "#04080F";

  useEffect(() => {
    setStatus("loading");
    fetch(`${API_URL}/api/stats?line=${lineCode}`)
      .then((r) => r.json())
      .then((rows) => {
        const byMonth = rows.reduce((acc, item) => {
          if (!item.date) return acc;
          const month = item.date.slice(0, 7); // "2025-03"
          acc[month] = (acc[month] || 0) + Number(item.passengers || 0);
          return acc;
        }, {});
        const ordered = Object.entries(byMonth)
          .map(([month, passengers]) => ({ month, passengers }))
          .sort((a, b) => a.month.localeCompare(b.month));
        setData(ordered);
        setStatus("ok");
      })
      .catch(() => {
        setStatus("error");
        setData([]);
      });
  }, [API_URL, lineCode]);

  if (status === "loading") return <p>Cargando datos...</p>;
  if (status === "error") return <p>No pude cargar los datos 😒</p>;
  if (data.length === 0) return <p>No hay datos para esta línea.</p>;

  const nombresMes = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis
          dataKey="month"
          stroke={axisColor}
          tick={{ fill: axisColor, fontSize: 12 }}
          tickFormatter={(m) => {
            const mes = parseInt(String(m).split("-")[1]);
            return nombresMes[mes - 1] || m;
          }}
        />
        <YAxis
          tick={{ fill: axisColor, fontSize: 12 }}
          tickLine={false}
          tickFormatter={(value) => value.toLocaleString("es-AR")}
        />
        <Tooltip
          contentStyle={{ background: bg, border: "none" }}
          labelStyle={{ color: tooltipLabel }}
          formatter={(value) => value.toLocaleString("es-AR")}
        />
        <Line
          type="monotone"
          dataKey="passengers"
          stroke={lineColor}
          strokeWidth={2}
          dot={false}
          isAnimationActive={animate}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
