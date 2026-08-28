import React, { useEffect, useRef, useState } from "react";
import { Button, Nav } from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import CreateRoomBtnModal from "./CreateRoomBtnModal";
import DashboardToggle from "./dashboard/DashboardToggle";
import ChatRoomList from "./rooms/ChatRoomList";
import StartDmModal from "./direct_messages/StartDmModal";
import AiStudyRoomTabs from "./chat_window/AiStudyRoomTabs";
import { useProfile } from "../context/profile.context";

const Sidebar = () => {
  const topSidebarRef = useRef();
  const [height, setHeight] = useState(0);
  const [activeTab, setActiveTab] = useState("channels");
  const [isDmModalOpen, setIsDmModalOpen] = useState(false);
  const [isAiHubOpen, setIsAiHubOpen] = useState(false);
  const { profile } = useProfile();

  useEffect(() => {
    if (topSidebarRef.current) {
      setHeight(topSidebarRef.current.scrollHeight);
    }
  }, [topSidebarRef, activeTab]);

  return (
    <div className="sidebar-glass pt-2" style={{ paddingRight: "6px", display: "flex", flexDirection: "column" }}>
      <div ref={topSidebarRef} style={{ flexShrink: 0 }}>
        {/* Campus Header with animated gradient */}
        <div className="campus-header d-flex align-items-center justify-content-between" style={{ position: "relative", zIndex: 1 }}>
          <div className="d-flex align-items-center" style={{ gap: "10px" }}>
            <div
              style={{
                fontSize: "22px",
                background: "rgba(255,255,255,0.12)",
                borderRadius: "50%",
                width: 38,
                height: 38,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            >
              🎓
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "15px", letterSpacing: "0.3px" }}>
                CampusConnect
              </div>
              <div style={{ fontSize: "11px", opacity: 0.75, fontWeight: 500 }}>
                {profile?.department || "University Hub"} • <span style={{ color: "#4ade80" }}>●</span> Online
              </div>
            </div>
          </div>
          <DashboardToggle />
        </div>

        {/* Action Buttons Row */}
        <div className="d-flex gap-2 mb-2" style={{ gap: "6px", padding: "0 4px" }}>
          <div style={{ flex: 1 }}>
            <CreateRoomBtnModal />
          </div>
          <Button
            color="violet"
            appearance="primary"
            onClick={() => setIsDmModalOpen(true)}
            style={{ fontWeight: 700, fontSize: "12px", borderRadius: "var(--radius-md)" }}
            title="Find campus peers and start a private conversation"
            className="btn-pulse"
          >
            <SearchIcon /> New DM
          </Button>
        </div>

        {/* AI Study Hub Quick Access */}
        <div className="mb-2" style={{ padding: "0 4px" }}>
          <button
            type="button"
            onClick={() => setIsAiHubOpen(true)}
            style={{
              width: "100%",
              padding: "8px 14px",
              background: "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(139,92,246,0.08))",
              border: "1px solid rgba(37,99,235,0.12)",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              fontWeight: 700,
              color: "var(--primary)",
              transition: "all var(--transition-smooth)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(37,99,235,0.14), rgba(139,92,246,0.14))";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "var(--shadow-md)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(139,92,246,0.08))";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <span style={{ fontSize: "16px" }}>🤖</span>
            <span>AI Study Buddy & Cloud Hub</span>
            <span className="kbd-hint" style={{ marginLeft: "auto" }}>NEW</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <Nav
          appearance="subtle"
          activeKey={activeTab}
          onSelect={setActiveTab}
          justified
          style={{
            marginBottom: "4px",
            borderBottom: "2px solid var(--border-subtle)",
            padding: "0 4px",
          }}
        >
          <Nav.Item eventKey="channels" style={{ fontWeight: 700, fontSize: "12px", borderRadius: "var(--radius-sm) var(--radius-sm) 0 0" }}>
            🏛️ Channels
          </Nav.Item>
          <Nav.Item eventKey="dms" style={{ fontWeight: 700, fontSize: "12px", borderRadius: "var(--radius-sm) var(--radius-sm) 0 0" }}>
            🔒 Private DMs
          </Nav.Item>
        </Nav>
      </div>

      {/* Room List */}
      <ChatRoomList aboveElHeight={height} activeTab={activeTab} />

      {/* Modals */}
      <StartDmModal
        isOpen={isDmModalOpen}
        onClose={() => setIsDmModalOpen(false)}
      />
      <AiStudyRoomTabs
        isOpen={isAiHubOpen}
        onClose={() => setIsAiHubOpen(false)}
      />
    </div>
  );
};

export default Sidebar;
