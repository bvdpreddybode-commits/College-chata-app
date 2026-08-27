import React from "react";

const QuickStatsCard = ({ icon, title, value, subtitle, color = "#2563eb", onClick }) => {
  return (
    <div
      className="modern-card"
      onClick={onClick}
      style={{
        cursor: onClick ? "pointer" : "default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: color }} />
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>
            {title}
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)", margin: "4px 0" }}>
            {value}
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
            {subtitle}
          </div>
        </div>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "10px",
            background: `${color}15`,
            color: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default QuickStatsCard;
