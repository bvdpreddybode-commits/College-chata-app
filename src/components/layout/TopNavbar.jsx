import React from "react";
import { Badge, Button, Dropdown, Tooltip, Whisper } from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import NoticeIcon from "@rsuite/icons/Notice";
import MemberIcon from "@rsuite/icons/Member";
import GearIcon from "@rsuite/icons/Gear";
import ExitIcon from "@rsuite/icons/Exit";
import { useProfile } from "../../context/profile.context";
import { useTheme } from "../../context/theme.context";
import { useNotifications } from "../../context/notifications.context";
import ProfileAvatar from "../ProfileAvatar";
import PresenceDot from "../PresenceDot";

const NAV_ITEMS = [
  { key: "home", label: "Home", icon: "🏠" },
  { key: "chat", label: "Messages", icon: "💬" },
  { key: "study", label: "Study Hub", icon: "📚" },
  { key: "ai", label: "AI Assistant", icon: "🤖" },
  { key: "events", label: "Events", icon: "🗓️" },
  { key: "clubs", label: "Clubs", icon: "🎭" },
  { key: "placements", label: "Placements", icon: "💼" },
  { key: "departments", label: "Departments", icon: "🏛️" },
  { key: "cloud", label: "Cloud Hub", icon: "☁️" },
  { key: "admin", label: "Admin", icon: "🛡️" },
];

const TopNavbar = ({ activeView, onViewChange, onOpenCommandPalette, onOpenNotifications, onSignOut }) => {
  const { profile } = useProfile();
  const { isDark, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();

  const isSuperAdmin = profile?.email === "bvdpreddybode@gmail.com";
  const isAdmin = profile?.role === "Admin" || profile?.role === "Faculty" || profile?.isAdmin || isSuperAdmin;

  return (
    <header className="top-navbar">
      {/* Brand & Logo */}
      <div className="d-flex align-items-center gap-2">
        <div
          onClick={() => onViewChange("home")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              boxShadow: "0 2px 6px rgba(37,99,235,0.3)",
            }}
          >
            🎓
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "15px", letterSpacing: "0.5px", color: "var(--text-primary)" }}>
              CampusConnect <span style={{ color: "var(--brand-primary)", fontWeight: 900 }}>Cloud</span>
            </div>
            <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "-3px" }}>
              Digital Campus Platform
            </div>
          </div>
        </div>
      </div>

      {/* Center Navigation Links (Desktop) */}
      <nav className="d-none d-lg-flex align-items-center" style={{ gap: "4px" }}>
        {NAV_ITEMS.map((item) => {
          // Hide admin from non-faculty unless requested
          const isActive = activeView === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onViewChange(item.key)}
              style={{
                background: isActive ? "var(--bg-surface-subtle)" : "transparent",
                border: "none",
                borderBottom: isActive ? "2px solid var(--brand-primary)" : "2px solid transparent",
                padding: "8px 12px",
                borderRadius: "6px 6px 0 0",
                color: isActive ? "var(--brand-primary)" : "var(--text-secondary)",
                fontWeight: isActive ? 700 : 500,
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                transition: "all 0.15s ease",
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right Controls: Command Palette, Notifications, Theme, User */}
      <div className="d-flex align-items-center" style={{ gap: "10px" }}>
        {/* Command Palette Button */}
        <button
          className="command-palette-btn d-none d-sm-flex"
          onClick={onOpenCommandPalette}
          title="Search anything (Ctrl + K)"
        >
          <SearchIcon />
          <span>Search campus...</span>
          <span className="kbd-shortcut">Ctrl K</span>
        </button>

        {/* Search icon for mobile */}
        <Button
          className="d-flex d-sm-none"
          size="sm"
          appearance="subtle"
          onClick={onOpenCommandPalette}
        >
          <SearchIcon />
        </Button>

        {/* Notifications Center Bell */}
        <Whisper placement="bottomEnd" trigger="hover" speaker={<Tooltip>Campus Notifications</Tooltip>}>
          <div style={{ position: "relative" }}>
            <Badge content={unreadCount > 0 ? unreadCount : false}>
              <Button
                size="sm"
                appearance="subtle"
                onClick={onOpenNotifications}
                style={{ fontSize: "16px", padding: "6px 8px" }}
              >
                <NoticeIcon />
              </Button>
            </Badge>
          </div>
        </Whisper>

        {/* Dark / Light Theme Toggle */}
        <Whisper placement="bottomEnd" trigger="hover" speaker={<Tooltip>{isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}</Tooltip>}>
          <Button
            size="sm"
            appearance="subtle"
            onClick={toggleTheme}
            style={{ fontSize: "16px", padding: "6px 8px" }}
          >
            {isDark ? "☀️" : "🌙"}
          </Button>
        </Whisper>

        {/* User Profile Dropdown */}
        <Dropdown
          renderToggle={(props, ref) => (
            <div
              {...props}
              ref={ref}
              className="d-flex align-items-center gap-2 cursor-pointer p-1"
              style={{ borderRadius: "8px", background: "var(--bg-surface-subtle)" }}
            >
              <div style={{ position: "relative" }}>
                <ProfileAvatar
                  src={profile?.avatar}
                  name={profile?.name || "Student"}
                  size="xs"
                />
                <div style={{ position: "absolute", bottom: -2, right: -2 }}>
                  <PresenceDot uid={profile?.uid || profile?.id} />
                </div>
              </div>
              <div className="d-none d-md-block text-left" style={{ lineHeight: 1.2, paddingRight: "4px" }}>
                <div style={{ fontWeight: 600, fontSize: "12px", color: "var(--text-primary)" }}>
                  {profile?.name ? profile.name.split(" ")[0] : "Student"}
                </div>
                <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                  {profile?.role || "Student"}
                </div>
              </div>
            </div>
          )}
          placement="bottomEnd"
        >
          <Dropdown.Item onClick={() => onViewChange("profile")}>
            <MemberIcon /> My Campus Profile
          </Dropdown.Item>
          <Dropdown.Item onClick={() => onViewChange("settings")}>
            <GearIcon /> Settings & Stealth
          </Dropdown.Item>
          {isAdmin && (
            <Dropdown.Item onClick={() => onViewChange("admin")}>
              🛡️ Admin Moderation
            </Dropdown.Item>
          )}
          <Dropdown.Item divider />
          <Dropdown.Item onClick={onSignOut} style={{ color: "#ef4444" }}>
            <ExitIcon /> Sign Out
          </Dropdown.Item>
        </Dropdown>
      </div>
    </header>
  );
};

export default TopNavbar;
