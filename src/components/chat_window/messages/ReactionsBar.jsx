import React from "react";
import { Tooltip, Whisper } from "rsuite";

export const EMOJI_OPTIONS = [
  { emoji: "👍", label: "Thumbs Up" },
  { emoji: "❤️", label: "Love" },
  { emoji: "🔥", label: "Fire" },
  { emoji: "🚀", label: "Rocket" },
  { emoji: "💡", label: "Insightful" },
  { emoji: "👏", label: "Applause" },
];

const ReactionsBar = ({ reactions = {}, currentUid, onToggleReaction }) => {
  const activeEmojis = Object.keys(reactions).filter(
    (emoji) => Array.isArray(reactions[emoji]) && reactions[emoji].length > 0
  );

  if (activeEmojis.length === 0) return null;

  return (
    <div className="d-flex flex-wrap gap-1 align-items-center mt-1" style={{ gap: "4px" }}>
      {activeEmojis.map((emoji) => {
        const users = reactions[emoji] || [];
        const hasReacted = users.some(
          (u) => (typeof u === "string" ? u === currentUid : u.uid === currentUid)
        );
        const userNames = users
          .map((u) => (typeof u === "string" ? "User" : u.name || "User"))
          .join(", ");

        return (
          <Whisper
            key={emoji}
            placement="top"
            trigger="hover"
            speaker={<Tooltip>{userNames || `${users.length} reaction(s)`}</Tooltip>}
          >
            <button
              type="button"
              onClick={() => onToggleReaction(emoji)}
              style={{
                background: hasReacted ? "#dbeafe" : "#f1f5f9",
                border: hasReacted ? "1px solid #93c5fd" : "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "2px 8px",
                fontSize: "12px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                color: hasReacted ? "#1d4ed8" : "#475569",
                fontWeight: hasReacted ? 700 : 500,
                transition: "all 0.15s ease",
              }}
            >
              <span>{emoji}</span>
              <span style={{ fontSize: "11px" }}>{users.length}</span>
            </button>
          </Whisper>
        );
      })}
    </div>
  );
};

export default ReactionsBar;
