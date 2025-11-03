import LineBadge from "./LineBadge.jsx";
import { lineColors } from "../lib/lineColors";

export default function LineSelector({ lines = [], value, onChange }) {
  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      {lines.map((line) => {
        const isActive = line.code === value;

        return (
          <button
            key={line.id}
            onClick={() => onChange(line.code)}
            style={{
              width: 36,
              height: 36,
              borderRadius: "9999px",
              border: isActive ? "2px solid #fff" : "1px solid #666",
              background: isActive ? "#fff" : "transparent",
              color: isActive ? "#000" : "#868686ff",
              fontWeight: 700,
              fontSize: isActive ? ".9rem" : ".85rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all .12s ease",
            }}
          >
            {line.code === "PM" ? "PRE" : line.code}
          </button>
        );
      })}
    </div>
  );
}


