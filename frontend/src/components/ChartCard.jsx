import { useOnScreen } from "../hooks/useOnScreen";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";

export default function ChartCard({ title, children, autoHeight = false }) {
  const [ref, visible] = useOnScreen({ threshold: 0.2 });
  const { theme } = useContext(ThemeContext);

  return (
    <div
      ref={ref}
      style={{
        background:
          theme === "dark"
            ? "#111" // fondo actual
            : "#ffffff", // fondo claro
        border: 
          theme === "dark"
            ? "1px solid #1f1f1f"
            : "1px solid #A1C6EA",
        borderRadius: "12px",
        padding: "1rem",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity .6s ease, transform .6s ease",
        // estado base
        boxShadow: theme === "dark"
            ? "0 0 0 1px #222"
            : "0 0 0 1px #e4e4e4ff",
        // si está visible, se disparala animación una vez
        animation: visible ? "innerPulse 0.9s ease-out 1" : "none",
      }}
    >
      <h3 style={{ margin: 0, marginBottom: ".5rem", fontSize: "1rem", color: theme === "dark" ? "#e2e8f0" : "#44609cff" }}>
        {title}
      </h3>

      <div style={autoHeight ? { minHeight: 0 } : { height: 320 }}>
        {children(visible)}
      </div>
    </div>
  );
}

if (typeof document !== "undefined" && !document.getElementById("innerPulse-style")) {
  const style = document.createElement("style");
  style.id = "innerPulse-style";
  style.innerHTML = `
    @keyframes innerPulse {
      0% {
        box-shadow: 0 0 0 1px #222, inset 0 0 0 rgba(56,189,248,0);
      }
      40% {
        box-shadow: 0 0 0 1px rgba(56,189,248,0.25), inset 0 0 22px rgba(255,255,255,0.35);
      }
      100% {
        box-shadow: 0 0 0 1px #222, inset 0 0 0 rgba(56,189,248,0);
      }
    }
  `;
  document.head.appendChild(style);
}
