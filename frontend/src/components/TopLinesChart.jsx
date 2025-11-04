import { useEffect, useState, useContext } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import { ThemeContext } from "../context/ThemeContext.jsx";

export default function TopLinesChart({ animate = true }) {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("loading");
  const API_URL = import.meta.env.VITE_API_URL;
  const { theme } = useContext(ThemeContext);

  const bg        = theme === "dark" ? "#111827" : "#ffffff";
  const axisColor = theme === "dark" ? "#e2e8f0" : "#1f2937";
  const gridColor = theme === "dark" ? "#1f2937" : "#e2e8f0";
  const barColor  = theme === "dark" ? "#60a5fa" : "#5477c2ff";

  useEffect(() => {
    setStatus("loading");
    fetch(`${API_URL}/api/ranking`)
      .then(r => r.json())
      .then(rows => {
        // Backend ya devuelve [{ line, total }]
        const arr = Array.isArray(rows) ? rows : [];
        setData(arr);
        setStatus(arr.length ? "ok" : "empty");
      })
      .catch(() => {
        setStatus("error");
        setData([]);
      });
  }, [API_URL]);

  if (status === "loading") return <p style={{opacity:.6}}>Cargando ranking…</p>;
  if (status === "error")   return <p style={{opacity:.6}}>No pude cargar el ranking.</p>;
  if (!data.length)         return <p style={{opacity:.6}}>Sin datos para rankear.</p>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="line" tick={{ fill: axisColor, fontSize: 12 }} />
        <YAxis
          tick={{ fill: axisColor, fontSize: 11 }}
          tickFormatter={(v) => v.toLocaleString("es-AR")}
        />
        <Tooltip
          contentStyle={{ background: bg, border: "none" }}
          labelStyle={{ color: axisColor }}
          formatter={(v) => v.toLocaleString("es-AR")}
        />
        <Bar dataKey="total" fill={barColor} isAnimationActive={animate} />
      </BarChart>
    </ResponsiveContainer>
  );
}
