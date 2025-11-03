import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";

export default function ThemeSwitch() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      style={{
        background: theme === "dark" ? "#0f172a" : "#C3C6CB",
        border: "1px solid rgba(148,163,184,.25)",
        borderRadius: "9999px",
        width: 54,
        height: 28,
        position: "relative",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 3,
          left: theme === "dark" ? 28 : 3,
          width: 22,
          height: 22,
          borderRadius: "9999px",
          background: theme === "dark" ? "#38bdf8" : "#F0F1F3",
          transition: "left .25s ease",
        }}
      />
    </button>
  );
}
