import { lineColors } from "../lib/lineColors";

export default function LineBadge({ code }) {
  const color = lineColors[code] || { bg: "#334155", text: "#fff" };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 30,
        height: 30,
        borderRadius: "9999px",
        background: color.bg,
        color: color.text,
        fontWeight: 700,
        fontSize: ".8rem",
      }}
    >
      {code}
    </span>
  );
}
