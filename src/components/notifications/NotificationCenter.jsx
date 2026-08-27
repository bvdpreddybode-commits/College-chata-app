import React, { useState } from "react";
import { Drawer, Button, Nav, List, Tag, Badge } from "rsuite";
import CheckIcon from "@rsuite/icons/Check";
import TrashIcon from "@rsuite/icons/Trash";
import TimeAgo from "timeago-react";
import { useNotifications } from "../../context/notifications.context";
import { useMediaQuery } from "../../misc/custom-hooks";

const NotificationCenter = ({ isOpen, onClose, onViewChange }) => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useNotifications();

  const [activeFilter, setActiveFilter] = useState("all");
  const isMobile = useMediaQuery("(max-width: 992px)");

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === "unread") return !n.isRead;
    if (activeFilter === "careers") return n.type === "placement";
    if (activeFilter === "academics") return n.type === "study" || n.type === "event" || n.type === "announcement";
    if (activeFilter === "chat") return n.type === "dm" || n.type === "mention" || n.type === "reply" || n.type === "reaction";
    return true;
  });

  const handleItemClick = (notif) => {
    markAsRead(notif.id);
    onClose();
    if (notif.link) {
      if (notif.link.startsWith("/events")) onViewChange("events");
      else if (notif.link.startsWith("/placements")) onViewChange("placements");
      else if (notif.link.startsWith("/study")) onViewChange("study");
      else if (notif.link.startsWith("/departments")) onViewChange("departments");
      else if (notif.link.startsWith("/chat")) onViewChange("chat");
    }
  };

  const getTagColor = (type) => {
    switch (type) {
      case "placement":
        return "green";
      case "event":
        return "orange";
      case "study":
        return "blue";
      case "announcement":
        return "red";
      case "reply":
      case "mention":
        return "violet";
      default:
        return "cyan";
    }
  };

  return (
    <Drawer
      size={isMobile ? "full" : "sm"}
      open={isOpen}
      onClose={onClose}
      placement="right"
    >
      <Drawer.Header>
        <Drawer.Title className="d-flex align-items-center gap-2">
          <span>🔔 Campus Notification Center</span>
          {unreadCount > 0 && <Badge content={`${unreadCount} New`} />}
        </Drawer.Title>
        <Drawer.Actions>
          <Button size="xs" appearance="ghost" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <CheckIcon /> Mark All Read
          </Button>
          <Button size="xs" appearance="subtle" color="red" onClick={clearAllNotifications} disabled={notifications.length === 0}>
            <TrashIcon /> Clear
          </Button>
        </Drawer.Actions>
      </Drawer.Header>

      <Drawer.Body style={{ padding: "12px 16px" }}>
        <Nav
          appearance="subtle"
          activeKey={activeFilter}
          onSelect={setActiveFilter}
          style={{ marginBottom: "16px", borderBottom: "1px solid var(--border-subtle)" }}
        >
          <Nav.Item eventKey="all">All</Nav.Item>
          <Nav.Item eventKey="unread">
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </Nav.Item>
          <Nav.Item eventKey="careers">Careers</Nav.Item>
          <Nav.Item eventKey="academics">Academics</Nav.Item>
          <Nav.Item eventKey="chat">Messages</Nav.Item>
        </Nav>

        {filteredNotifications.length === 0 ? (
          <div className="text-center p-5 text-muted">
            <div style={{ fontSize: "36px", marginBottom: "10px" }}>🔕</div>
            <h6>No notifications in this category.</h6>
            <p style={{ fontSize: "12px" }}>You are completely caught up with campus updates!</p>
          </div>
        ) : (
          <List hover bordered className="custom-scroll">
            {filteredNotifications.map((notif) => (
              <List.Item
                key={notif.id}
                style={{
                  padding: "12px 14px",
                  cursor: "pointer",
                  background: notif.isRead ? "transparent" : "rgba(37, 99, 235, 0.04)",
                  borderLeft: notif.isRead ? "3px solid transparent" : "3px solid var(--brand-primary)",
                  transition: "background 0.15s ease",
                }}
                onClick={() => handleItemClick(notif)}
              >
                <div className="d-flex justify-content-between align-items-start mb-1">
                  <div style={{ fontWeight: notif.isRead ? 600 : 700, fontSize: "13px", color: "var(--text-primary)" }}>
                    {notif.title}
                  </div>
                  <Tag color={getTagColor(notif.type)} size="sm">
                    {notif.tag || notif.type}
                  </Tag>
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                  {notif.message}
                </div>
                <div className="d-flex justify-content-between align-items-center mt-2" style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  <TimeAgo datetime={notif.timestamp} />
                  <Button
                    size="xs"
                    appearance="subtle"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                  >
                    Dismiss
                  </Button>
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
