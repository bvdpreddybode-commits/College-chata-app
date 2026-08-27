import React, { createContext, useContext, useState, useEffect } from "react";
import { toaster, Message } from "rsuite";

const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    type: "placement",
    title: "New Placement Opportunity: Google SWE Intern",
    message: "Google 2027 Summer SWE Internship applications are now open for 3rd & 4th Year CSE/IT students.",
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    isRead: false,
    link: "/placements",
    tag: "Career",
  },
  {
    id: "notif-2",
    type: "event",
    title: "Campus Hackathon: VNR HackOverflow 2026",
    message: "Registration ends in 2 days. 36-Hour National Hackathon with prizes worth ₹2,00,000.",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    isRead: false,
    link: "/events",
    tag: "Hackathon",
  },
  {
    id: "notif-3",
    type: "study",
    title: "New Study Material: DBMS Normalization CheatSheet",
    message: "Prof. Dr. John Doe uploaded 'Unit-3 Relational Normalization & BCNF Notes' in CS Dept Hub.",
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    isRead: false,
    link: "/study",
    tag: "Academics",
  },
  {
    id: "notif-4",
    type: "reply",
    title: "Alex Johnson replied to your message",
    message: "'Yes, the project presentation is scheduled for Thursday 2 PM in Lab 4.'",
    timestamp: new Date(Date.now() - 1000 * 60 * 450).toISOString(),
    isRead: true,
    link: "/chat/cs-dept",
    tag: "Chat",
  },
  {
    id: "notif-5",
    type: "announcement",
    title: "Mid-Term Examination Schedule Released",
    message: "Dean of Academics published the official timetable for Semester 6 Examinations.",
    timestamp: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
    isRead: true,
    link: "/departments",
    tag: "Admin",
  },
];

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem("campusconnect_notifications");
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("campusconnect_notifications", JSON.stringify(notifications));
    } catch (e) {
      console.error("Failed to store notifications:", e);
    }
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const addNotification = (notif) => {
    const newNotif = {
      id: "notif-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toISOString(),
      isRead: false,
      ...notif,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    toaster.push(
      <Message type="info" closable duration={5000}>
        <strong>{notif.title}</strong>
        <div>{notif.message}</div>
      </Message>
    );
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);
