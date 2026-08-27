import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Modal, Input, InputGroup, List, Tag } from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import { useHistory } from "react-router-dom";
import { useRooms } from "../../context/rooms.context";
import { useTheme } from "../../context/theme.context";

const QUICK_ACTIONS = [
  { id: "act-home", type: "action", title: "🏠 Go to Home Dashboard", category: "Navigation", target: "home" },
  { id: "act-ai", type: "action", title: "🤖 Open CampusConnect AI Assistant", category: "AI Assistant", target: "ai" },
  { id: "act-quiz", type: "action", title: "📝 Generate AI Academic Quiz", category: "AI Assistant", target: "ai_quiz" },
  { id: "act-flash", type: "action", title: "🗂️ Study with Flashcards", category: "Study", target: "ai_flashcards" },
  { id: "act-study", type: "action", title: "📚 Browse Study Materials & Notes", category: "Study", target: "study" },
  { id: "act-events", type: "action", title: "🗓️ View Campus Events & Hackathons", category: "Campus Life", target: "events" },
  { id: "act-placements", type: "action", title: "💼 Explore Placements & Internships", category: "Careers", target: "placements" },
  { id: "act-clubs", type: "action", title: "🎭 Discover Student Clubs & Societies", category: "Campus Life", target: "clubs" },
  { id: "act-cloud", type: "action", title: "☁️ Open Cloud Architecture & Simulator", category: "Cloud Hub", target: "cloud" },
  { id: "act-admin", type: "action", title: "🛡️ Access Admin & Moderation Queue", category: "Admin", target: "admin" },
  { id: "act-settings", type: "action", title: "⚙️ Open Settings & Stealth Mode", category: "Settings", target: "settings" },
];

const CommandPalette = ({ isOpen, onClose, onViewChange, onNavigate }) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const rooms = useRooms();
  const history = useHistory();
  const { toggleTheme } = useTheme();
  const inputRef = useRef();

  const handleNavigate = useCallback(
    (target) => {
      if (onViewChange) onViewChange(target);
      else if (onNavigate) onNavigate(target);
    },
    [onViewChange, onNavigate]
  );

  // Reset query on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global keydown listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else handleNavigate("command_palette_open");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handleNavigate]);

  // Unified items
  const filteredItems = useMemo(() => {
    const term = query.toLowerCase().trim();
    if (!term) return QUICK_ACTIONS;

    const matchedActions = QUICK_ACTIONS.filter((a) =>
      a.title.toLowerCase().includes(term) || a.category.toLowerCase().includes(term)
    );

    const roomList = rooms || [];
    const matchedRooms = roomList
      .filter((r) => (r.name || "").toLowerCase().includes(term) || (r.description || "").toLowerCase().includes(term))
      .map((r) => ({
        id: `room-${r.id}`,
        type: "channel",
        title: `💬 ${r.name}`,
        subtitle: r.description || "Channel",
        category: r.is_dm ? "Direct Message" : "Channels",
        roomId: r.id,
      }));

    return [...matchedActions, ...matchedRooms];
  }, [query, rooms]);

  const handleSelect = (item) => {
    if (!item) return;

    if (item.type === "channel") {
      onClose();
      handleNavigate("chat");
      history.push(`/chat/${item.roomId}`);
    } else if (item.target === "theme_toggle") {
      toggleTheme();
      onClose();
    } else if (item.target) {
      handleNavigate(item.target);
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="sm"
      className="command-palette-modal"
      style={{ top: "10%" }}
    >
      <Modal.Body style={{ padding: "12px" }}>
        <InputGroup inside style={{ marginBottom: "12px" }}>
          <InputGroup.Addon>
            <SearchIcon />
          </InputGroup.Addon>
          <Input
            ref={inputRef}
            autoFocus
            placeholder="Type a command, channel, topic, or search term..."
            value={query}
            onChange={setQuery}
            onKeyDown={handleKeyDown}
            style={{ fontSize: "14px" }}
          />
        </InputGroup>

        <List hover bordered style={{ maxHeight: "360px", overflowY: "auto" }}>
          {filteredItems.length === 0 ? (
            <div className="text-center p-4 text-muted" style={{ fontSize: "13px" }}>
              No matching commands, channels, or resources found.
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <List.Item
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  style={{
                    padding: "10px 14px",
                    cursor: "pointer",
                    background: isSelected ? "var(--bg-surface-subtle)" : "transparent",
                    borderLeft: isSelected ? "3px solid var(--brand-primary)" : "3px solid transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "13px", color: "var(--text-primary)" }}>
                      {item.title}
                    </div>
                    {item.subtitle && (
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                        {item.subtitle}
                      </div>
                    )}
                  </div>
                  <Tag color="blue" size="sm">
                    {item.category}
                  </Tag>
                </List.Item>
              );
            })
          )}
        </List>

        <div className="d-flex justify-content-between align-items-center mt-2 px-1" style={{ fontSize: "11px", color: "var(--text-muted)" }}>
          <span>↑↓ to navigate • ↵ to select • esc to close</span>
          <span>CampusConnect Command Bar</span>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CommandPalette;
