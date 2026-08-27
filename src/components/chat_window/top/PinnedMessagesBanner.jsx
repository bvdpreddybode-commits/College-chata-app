import React, { useState } from "react";
import PinIcon from "@rsuite/icons/legacy/ThumbTack";
import CloseIcon from "@rsuite/icons/Close";

const PinnedMessagesBanner = ({ pinnedMessages = [], onUnpin, onJumpTo }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!Array.isArray(pinnedMessages) || pinnedMessages.length === 0) return null;

  const currentPin = pinnedMessages[Math.min(currentIndex, pinnedMessages.length - 1)];
  const isMultiple = pinnedMessages.length > 1;

  return (
    <div
      style={{
        background: "linear-gradient(90deg, #f0fdf4 0%, #dcfce7 100%)",
        borderBottom: "1px solid #bbf7d0",
        padding: "6px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: "12px",
        color: "#166534",
        zIndex: 5,
      }}
    >
      <div
        className="d-flex align-items-center gap-2 cursor-pointer flex-grow-1"
        style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        onClick={() => onJumpTo && onJumpTo(currentPin.id)}
      >
        <span style={{ color: "#15803d", display: "flex", alignItems: "center" }}>
          <PinIcon />
        </span>
        <strong style={{ color: "#14532d" }}>Pinned Message:</strong>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", opacity: 0.9 }}>
          {currentPin.author?.name ? `${currentPin.author.name}: ` : ""}
          {currentPin.text || (currentPin.file ? `[File: ${currentPin.file.name}]` : "Pinned item")}
        </span>
      </div>

      <div className="d-flex align-items-center gap-2 flex-shrink-0" style={{ gap: "6px" }}>
        {isMultiple && (
          <span style={{ fontSize: "11px", color: "#15803d", fontWeight: 600 }}>
            ({currentIndex + 1}/{pinnedMessages.length})
          </span>
        )}
        {isMultiple && (
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => (prev + 1) % pinnedMessages.length)}
            style={{
              background: "transparent",
              border: "none",
              color: "#166534",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "11px",
              padding: "0 4px",
            }}
          >
            Next →
          </button>
        )}
        {onUnpin && (
          <button
            type="button"
            onClick={() => onUnpin(currentPin.id)}
            title="Unpin message"
            style={{
              background: "transparent",
              border: "none",
              color: "#166534",
              cursor: "pointer",
              padding: "2px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <CloseIcon />
          </button>
        )}
      </div>
    </div>
  );
};

export default PinnedMessagesBanner;
