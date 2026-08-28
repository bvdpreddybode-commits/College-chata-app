import React from "react";
import TimeAgo from "timeago-react";
import ProfileAvatar from "../ProfileAvatar";
import { useProfile } from "../../context/profile.context";
import { useLocation } from "react-router-dom";

const getCategoryIcon = (category, isPrivate, isDm) => {
  if (isDm) return "💬";
  if (isPrivate) return "🔒";
  switch (category) {
    case "Announcements": return "📢";
    case "Department": return "🏛️";
    case "Course": return "📖";
    case "Study Group": return "👥";
    case "Clubs": return "🎭";
    default: return "💬";
  }
};

const RoomItem = ({ room }) => {
  const { profile } = useProfile();
  const location = useLocation();
  const { created_at, createdAt, name, last_message, lastMessage, isPrivate, category, type, is_dm } = room;
  const isDm = type === "dm" || is_dm;
  const currentLastMsg = last_message || lastMessage;

  const isActive = location.pathname === `/chat/${room.id}`;

  // For DMs, format displayName nicely
  let displayName = name;
  if (isDm && profile) {
    const parts = (name || "").split(" & ");
    if (parts.length === 2) {
      const myName = profile.name || "Peer";
      displayName = parts[0] === myName ? parts[1] : parts[0];
    }
  }

  const icon = getCategoryIcon(category, isPrivate, isDm);

  return (
    <div className={`room-item-card ${isActive ? "room-item-active" : ""}`}>
      <div className="d-flex justify-content-between align-items-center mb-1">
        <div className="d-flex align-items-center text-disappear" style={{ gap: "8px" }}>
          {isDm ? (
            <div className="dm-peer-avatar-wrap">
              <ProfileAvatar
                src={currentLastMsg?.author?.avatar}
                name={displayName || "Peer"}
                size="sm"
              />
              <div className="dm-online-dot" />
            </div>
          ) : (
            <span style={{ fontSize: "16px", flexShrink: 0 }}>{icon}</span>
          )}
          <div style={{ minWidth: 0 }}>
            <span
              style={{
                fontWeight: isActive ? 700 : 600,
                fontSize: "13.5px",
                color: isActive ? "var(--primary)" : "var(--text-primary)",
              }}
              className="text-disappear d-block"
            >
              {displayName}
            </span>
            {isDm && (
              <span style={{ fontSize: "10px", color: "var(--success)", fontWeight: 600 }}>
                Online now
              </span>
            )}
          </div>
        </div>

        <div className="d-flex align-items-center" style={{ gap: "6px", flexShrink: 0 }}>
          {isPrivate && !isDm && (
            <span className="badge-pill badge-private" style={{ fontSize: "9px", margin: 0, padding: "1px 6px" }}>
              Private
            </span>
          )}
          <TimeAgo
            datetime={
              currentLastMsg
                ? new Date(currentLastMsg.created_at || currentLastMsg.createdAt)
                : new Date(created_at || createdAt)
            }
            className="font-normal"
            style={{ fontSize: "10px", color: "var(--text-muted)", whiteSpace: "nowrap" }}
          />
        </div>
      </div>

      <div className="d-flex align-items-center" style={{ fontSize: "12px", color: "var(--text-secondary)", marginLeft: isDm ? "40px" : "24px" }}>
        {currentLastMsg ? (
          <>
            {!isDm && (
              <span style={{ fontWeight: 500, color: "var(--text-secondary)", marginRight: "4px" }}>
                {currentLastMsg.author?.name?.split(" ")[0] || "User"}:
              </span>
            )}
            <span className="text-disappear" style={{ flex: 1 }}>
              {currentLastMsg.text || currentLastMsg.file?.name || "Shared an attachment"}
            </span>
            {isDm && (
              <span className="read-receipt read-receipt-seen" style={{ marginLeft: "6px" }}>
                ✓✓
              </span>
            )}
          </>
        ) : (
          <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>No messages yet…</span>
        )}
      </div>
    </div>
  );
};

export default RoomItem;
