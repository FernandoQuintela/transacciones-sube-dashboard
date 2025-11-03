import { useEffect, useState, useContext } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import { ThemeContext } from "../context/ThemeContext.jsx";

export default function TopLinesChart({ animate = true }) {
  const [data, setData] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;
  const { theme } = useContext(ThemeContext);

  const bg = theme === "dark" ? "#111827" : "#ffffff";
  const axisColor = theme === "dark" ? "#e2e8f0" : "#1f2937";
  const gridColor = theme === "dark" ? "#1f2937" : "#e2e8f0";
  const barColor = theme === "dark" ? "#60a5fa" : "#44609cff";

  useEffect(() => {
    fetch(`${API_URL}/api/stats`)
      .then((r) => r.json())
      .then((rows) => {
        const totals = rows.reduce((acc, r) => {
          acc[r.line] = (acc[r.line] || 0) + Number(r.passengers || 0);
          return acc;
        }, {});
        const arr = Object.entries(totals)
          .map(([line, total]) => ({ line, total }))
          .sort((a, b) => b.total - a.total);
        setData(arr);
      });
  }, [API_URL]);

  return (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
      <XAxis dataKey="line" tick={{ fill: axisColor, fontSize: 12 }} />
      <YAxis
        tick={{ fill: axisColor, fontSize: 11 }}
        tickFormatter={(value) => value.toLocaleString("es-AR")}
      />
      <Tooltip
        contentStyle={{ background: bg, border: "none" }}
        labelStyle={{ color: axisColor }}
        formatter={(value) => value.toLocaleString("es-AR")}
      />
      <Bar dataKey="total" fill={barColor} isAnimationActive={animate} />
    </BarChart>
  </ResponsiveContainer>
);
}
