export default function FloatingButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        right: "1.5rem",
        bottom: "1.5rem",
        width: "54px",
        height: "54px",
        borderRadius: "9999px",
        background: "linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)",
        border: "none",
        color: "#000",
        fontWeight: 700,
        fontSize: "1.6rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
        transition: "transform .12s ease-out",
        zIndex: 50,
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      i
    </button>
  );
}
