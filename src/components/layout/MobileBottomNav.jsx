import React from "react";
import { Badge } from "rsuite";
import { useNotifications } from "../../context/notifications.context";

const MOBILE_NAV_ITEMS = [
  { key: "home", label: "Home", icon: "🏠" },
  { key: "chat", label: "Chat", icon: "💬" },
  { key: "study", label: "Study", icon: "📚" },
  { key: "ai", label: "AI", icon: "🤖" },
  { key: "events", label: "Events", icon: "🗓️" },
  { key: "placements", label: "Jobs", icon: "💼" },
  { key: "cloud", label: "Cloud", icon: "☁️" },
];

const MobileBottomNav = ({ activeView, onViewChange }) => {
  const { unreadCount } = useNotifications();

  return (
    <nav className="mobile-bottom-nav">
      {MOBILE_NAV_ITEMS.map((item) => {
        const isActive = activeView === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onViewChange(item.key)}
            className={`mobile-nav-item ${isActive ? "active" : ""}`}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              position: "relative",
            }}
          >
            <div className="nav-icon" style={{ fontSize: "19px" }}>
              {item.key === "chat" && unreadCount > 0 ? (
                <Badge content={unreadCount}>
                  <span>{item.icon}</span>
                </Badge>
              ) : (
                <span>{item.icon}</span>
              )}
            </div>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default MobileBottomNav;
