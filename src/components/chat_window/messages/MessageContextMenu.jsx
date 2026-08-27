import React from "react";
import { Dropdown, Popover, Whisper } from "rsuite";

const MENU_ITEMS = [
  { key: "reply", icon: "💬", label: "Reply in Thread" },
  { key: "react", icon: "😊", label: "Add Reaction" },
  { key: "edit", icon: "✏️", label: "Edit Message" },
  { key: "copy", icon: "📋", label: "Copy Text" },
  { key: "pin", icon: "📌", label: "Pin Message" },
  { key: "save", icon: "🔖", label: "Save / Bookmark" },
  { key: "forward", icon: "↗️", label: "Forward to Channel" },
  { key: "report", icon: "🚩", label: "Report Message" },
  { key: "delete", icon: "🗑️", label: "Delete Message", danger: true },
];

const MessageContextMenu = ({ message, isAuthor, isAdmin, onAction, children }) => {
  const visibleItems = MENU_ITEMS.filter((item) => {
    if (item.key === "edit" && !isAuthor) return false;
    if (item.key === "delete" && !isAuthor && !isAdmin) return false;
    return true;
  });

  const speaker = (
    <Popover full style={{ width: 200, padding: 0 }}>
      <Dropdown.Menu>
        {visibleItems.map((item) => (
          <Dropdown.Item
            key={item.key}
            onClick={() => onAction(item.key, message)}
            style={item.danger ? { color: "#ef4444" } : undefined}
          >
            <span style={{ marginRight: "8px" }}>{item.icon}</span>
            {item.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Popover>
  );

  return (
    <Whisper placement="autoVerticalEnd" trigger="click" speaker={speaker}>
      {children}
    </Whisper>
  );
};

export default MessageContextMenu;
