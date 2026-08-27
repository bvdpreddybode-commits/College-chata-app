import React, { useEffect, useRef, useState } from "react";
import { Button, Nav } from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import CreateRoomBtnModal from "./CreateRoomBtnModal";
import DashboardToggle from "./dashboard/DashboardToggle";
import ChatRoomList from "./rooms/ChatRoomList";
import StartDmModal from "./direct_messages/StartDmModal";
import { useProfile } from "../context/profile.context";

const Sidebar = () => {
  const topSidebarRef = useRef();
  const [height, setHeight] = useState(0);
  const [activeTab, setActiveTab] = useState("channels"); // 'channels' | 'dms'
  const [isDmModalOpen, setIsDmModalOpen] = useState(false);
  const { profile } = useProfile();

  useEffect(() => {
    if (topSidebarRef.current) {
      setHeight(topSidebarRef.current.scrollHeight);
    }
  }, [topSidebarRef, activeTab]);

  return (
    <div className="h-100 pt-2" style={{ paddingRight: "6px" }}>
      <div ref={topSidebarRef}>
        <div className="campus-header d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <div
              style={{
                fontSize: "24px",
                marginRight: "10px",
                background: "rgba(255,255,255,0.15)",
                borderRadius: "50%",
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              🎓
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "15px", letterSpacing: "0.5px" }}>
                CampusConnect
              </div>
              <div style={{ fontSize: "11px", opacity: 0.8 }}>
                {profile?.department || "University Hub"}
              </div>
            </div>
          </div>
          <DashboardToggle />
        </div>

        <div className="d-flex gap-2 mb-2" style={{ gap: "6px" }}>
          <div style={{ flex: 1 }}>
            <CreateRoomBtnModal />
          </div>
          <div>
            <Button
              color="cyan"
              appearance="primary"
              onClick={() => setIsDmModalOpen(true)}
              style={{ height: "100%", fontWeight: 600 }}
              title="Find campus peers and start private 1-on-1 chat"
            >
              <SearchIcon /> Private DM
            </Button>
          </div>
        </div>

        <Nav
          appearance="subtle"
          activeKey={activeTab}
          onSelect={setActiveTab}
          justified
          style={{ marginBottom: "6px", borderBottom: "1px solid #e2e8f0" }}
        >
          <Nav.Item eventKey="channels" style={{ fontWeight: 600, fontSize: "13px" }}>
            🏛️ Channels
          </Nav.Item>
          <Nav.Item eventKey="dms" style={{ fontWeight: 600, fontSize: "13px" }}>
            🔒 Private DMs
          </Nav.Item>
        </Nav>
      </div>

      <ChatRoomList aboveElHeight={height} activeTab={activeTab} />

      <StartDmModal
        isOpen={isDmModalOpen}
        onClose={() => setIsDmModalOpen(false)}
      />
    </div>
  );
};

export default Sidebar;

