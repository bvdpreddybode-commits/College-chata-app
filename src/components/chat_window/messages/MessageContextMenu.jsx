import React from "react";
import { Dropdown, Popover, Whisper } from "rsuite";
import MoreIcon from "@rsuite/icons/legacy/EllipsisH";
import PinIcon from "@rsuite/icons/legacy/ThumbTack";
import TrashIcon from "@rsuite/icons/legacy/Trash";
import CopyIcon from "@rsuite/icons/Copy";
import { EMOJI_OPTIONS } from "./ReactionsBar";

const MessageContextMenu = ({
  message,
  isAuthor,
  isAdmin,
  isPinned,
  onToggleReaction,
  onPinMessage,
  onOpenThread,
  onDeleteMessage,
  onCopyText,
}) => {
  const emojiSpeaker = (
    <Popover full style={{ padding: "6px 8px" }}>
      <div className="d-flex gap-1" style={{ gap: "6px" }}>
        {EMOJI_OPTIONS.map(({ emoji, label }) => (
          <button
            key={emoji}
            type="button"
            title={label}
            onClick={() => onToggleReaction(emoji)}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "18px",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "4px",
              transition: "transform 0.1s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.25)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {emoji}
          </button>
        ))}
      </div>
    </Popover>
  );

  return (
    <div className="d-inline-flex align-items-center gap-1" style={{ gap: "4px" }}>
      {/* Quick Reaction Trigger */}
      <Whisper placement="top" trigger="click" speaker={emojiSpeaker}>
        <button
          type="button"
          title="Add Reaction"
          style={{
            background: "rgba(255,255,255,0.85)",
            border: "1px solid #cbd5e1",
            borderRadius: "50%",
            width: "24px",
            height: "24px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          😀
        </button>
      </Whisper>

      {/* Reply in Thread Button */}
      {onOpenThread && (
        <button
          type="button"
          title="Reply in Thread"
          onClick={() => onOpenThread(message)}
          style={{
            background: "rgba(255,255,255,0.85)",
            border: "1px solid #cbd5e1",
            borderRadius: "50%",
            width: "24px",
            height: "24px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          💬
        </button>
      )}

      {/* Options Dropdown */}
      <Dropdown
        renderToggle={(props, ref) => (
          <button
            {...props}
            ref={ref}
            type="button"
            style={{
              background: "rgba(255,255,255,0.85)",
              border: "1px solid #cbd5e1",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "11px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            <MoreIcon />
          </button>
        )}
        placement="bottomEnd"
      >
        {message.text && (
          <Dropdown.Item onClick={() => onCopyText(message.text)}>
            <CopyIcon /> Copy Message Text
          </Dropdown.Item>
        )}
        {onPinMessage && (
          <Dropdown.Item onClick={() => onPinMessage(message)}>
            <PinIcon /> {isPinned ? "Unpin from Channel" : "Pin to Channel Header"}
          </Dropdown.Item>
        )}
        {(isAuthor || isAdmin) && onDeleteMessage && (
          <>
            <Dropdown.Separator />
            <Dropdown.Item
              onClick={() => onDeleteMessage(message.id, message.file)}
              style={{ color: "#ef4444" }}
            >
              <TrashIcon /> Delete Message
            </Dropdown.Item>
          </>
        )}
      </Dropdown>
    </div>
  );
};

export default MessageContextMenu;
