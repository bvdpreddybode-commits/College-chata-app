import React from "react";
import TimeAgo from "timeago-react";
import ProfileAvatar from "../ProfileAvatar";
import { useProfile } from "../../context/profile.context";

const getCategoryIcon = (category, isPrivate, isDm) => {
  if (isDm) return "🔒 👤";
  if (isPrivate) return "🔒";
  switch (category) {
    case "Announcements":
      return "📢";
    case "Department":
      return "🏛️";
    case "Course":
      return "📖";
    case "Study Group":
      return "👥";
    case "Clubs":
      return "🎭";
    default:
      return "💬";
  }
};

const RoomItem = ({ room }) => {
  const { profile } = useProfile();
  const { created_at, createdAt, name, last_message, lastMessage, isPrivate, category, type, is_dm } = room;
  const isDm = type === "dm" || is_dm;
  const currentLastMsg = last_message || lastMessage;

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
    <div style={{ padding: "4px 0" }}>
      <div className="d-flex justify-content-between align-items-center mb-1">
        <div className="d-flex align-items-center text-disappear">
          <span style={{ marginRight: "6px", fontSize: "14px" }}>{icon}</span>
          <span style={{ fontWeight: 600, fontSize: "14px", color: "#0f172a" }} className="text-disappear">
            {displayName}
          </span>
          {isPrivate && !isDm && (
            <span className="badge-pill badge-private">Private</span>
          )}
        </div>
        <TimeAgo
          datetime={
            currentLastMsg
              ? new Date(currentLastMsg.created_at || currentLastMsg.createdAt)
              : new Date(created_at || createdAt)
          }
          className="font-normal text-black-45"
          style={{ fontSize: "11px", whiteSpace: "nowrap" }}
        />
      </div>

      <div className="d-flex align-items-center text-black-70" style={{ fontSize: "12px" }}>
        {currentLastMsg ? (
          <>
            <div className="d-flex align-items-center">
              <ProfileAvatar
                src={currentLastMsg.author?.avatar}
                name={currentLastMsg.author?.name || "Student"}
                size="xs"
              />
            </div>
            <div className="text-disappear ml-2">
              <span style={{ fontWeight: 500, color: "#334155" }}>
                {currentLastMsg.author?.name?.split(" ")[0] || "User"}:
              </span>{" "}
              <span>{currentLastMsg.text || currentLastMsg.file?.name || "Shared attachment"}</span>
            </div>
          </>
        ) : (
          <span style={{ color: "#94a3b8", fontStyle: "italic" }}>No messages yet...</span>
        )}
      </div>
    </div>
  );
};

export default RoomItem;
