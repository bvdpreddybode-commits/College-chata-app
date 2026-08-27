import React from "react";
import { Drawer, Button, Tag, List } from "rsuite";
import TimeAgo from "timeago-react";
import { useNotifications } from "../../context/notifications.context";

const NotificationCenter = ({ isOpen, onClose, onViewChange }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAllNotifications } = useNotifications();

  const handleNotificationClick = (notif) => {
    markAsRead(notif.id);
    if (notif.link) {
      if (notif.link.startsWith("/chat")) {
        onViewChange("chat");
      } else if (notif.link === "/events") {
        onViewChange("events");
      } else if (notif.link === "/study") {
        onViewChange("study");
      } else if (notif.link === "/placements") {
        onViewChange("placements");
      } else if (notif.link === "/departments") {
        onViewChange("departments");
      }
    }
    onClose();
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "placement": return "💼";
      case "event": return "🗓️";
      case "study": return "📚";
      case "reply": return "💬";
      case "announcement": return "📢";
      default: return "🔔";
    }
  };

  return (
    <Drawer size="sm" open={isOpen} onClose={onClose} placement="right">
      <Drawer.Header>
        <div className="d-flex justify-content-between align-items-center w-100 pr-3">
          <Drawer.Title>
            🔔 Notifications {unreadCount > 0 && <Tag color="blue" size="sm">{unreadCount} new</Tag>}
          </Drawer.Title>
          <div className="d-flex gap-2">
            {unreadCount > 0 && (
              <Button size="xs" appearance="subtle" color="blue" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button size="xs" appearance="subtle" color="red" onClick={clearAllNotifications}>
                Clear
              </Button>
            )}
          </div>
        </div>
      </Drawer.Header>
      <Drawer.Body style={{ padding: 0 }}>
        {notifications.length === 0 ? (
          <div className="text-center p-5 text-muted">
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>🔕</div>
            <h6>All caught up!</h6>
            <p style={{ fontSize: "12px" }}>No new campus notifications.</p>
          </div>
        ) : (
          <List hover>
            {notifications.map((notif) => (
              <List.Item
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                style={{
                  padding: "14px 16px",
                  cursor: "pointer",
                  background: notif.isRead ? "transparent" : "rgba(37, 99, 235, 0.04)",
                  borderLeft: notif.isRead ? "3px solid transparent" : "3px solid var(--brand-primary)",
                  transition: "background 0.15s ease",
                }}
              >
                <div className="d-flex align-items-start gap-3">
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "8px",
                      background: "var(--bg-surface-subtle)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      flexShrink: 0,
                    }}
                  >
                    {getTypeIcon(notif.type)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="d-flex justify-content-between align-items-baseline mb-1">
                      <strong style={{ fontSize: "13px", color: "var(--text-primary)" }}>
                        {notif.title}
                      </strong>
                    </div>
                    <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "0 0 6px 0", lineHeight: 1.4 }}>
                      {notif.message}
                    </p>
                    <div className="d-flex align-items-center gap-2">
                      {notif.tag && <Tag size="sm" color="blue">{notif.tag}</Tag>}
                      <TimeAgo datetime={notif.timestamp} style={{ fontSize: "10px", color: "var(--text-muted)" }} />
                    </div>
                  </div>
                </div>
              </List.Item>
            ))}
          </List>
        )}
      </Drawer.Body>
    </Drawer>
  );
};

export default NotificationCenter;
