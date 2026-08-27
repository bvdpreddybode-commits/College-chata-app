import React, { useState } from "react";
import { Col, Grid, Row, Tag, Nav, Progress } from "rsuite";
import ModerationQueue from "./ModerationQueue";
import UserManagementTable from "./UserManagementTable";
import QuickStatsCard from "../home/QuickStatsCard";
import { useProfile } from "../../context/profile.context";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { profile } = useProfile();
  const isSuperAdmin = profile?.email === "bvdpreddybode@gmail.com";

  const renderOverview = () => (
    <>
      <Grid fluid className="p-0 mb-4">
        <Row gutter={16}>
          <Col xs={24} sm={12} md={6} className="mb-3">
            <QuickStatsCard icon="👥" title="Total Users" value="1,247" subtitle="Active campus members" color="#2563eb" />
          </Col>
          <Col xs={24} sm={12} md={6} className="mb-3">
            <QuickStatsCard icon="💬" title="Active Channels" value="28" subtitle="Public & private rooms" color="#10b981" />
          </Col>
          <Col xs={24} sm={12} md={6} className="mb-3">
            <QuickStatsCard icon="📨" title="Messages Sent" value="12,450" subtitle="This semester" color="#8b5cf6" />
          </Col>
          <Col xs={24} sm={12} md={6} className="mb-3">
            <QuickStatsCard icon="🚩" title="Pending Reports" value="5" subtitle="Requires review" color="#ef4444" />
          </Col>
        </Row>
      </Grid>

      {/* Platform Health */}
      <div className="modern-card mb-4">
        <h6 style={{ fontWeight: 700, marginBottom: "12px" }}>📊 Platform Health</h6>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
          <div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600, marginBottom: "4px" }}>Server Uptime</div>
            <Progress.Line percent={99.9} strokeColor="#10b981" />
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600, marginBottom: "4px" }}>API Response Time</div>
            <Progress.Line percent={92} strokeColor="#2563eb" />
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600, marginBottom: "4px" }}>Storage Used</div>
            <Progress.Line percent={34} strokeColor="#f59e0b" />
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600, marginBottom: "4px" }}>Database Connections</div>
            <Progress.Line percent={45} strokeColor="#8b5cf6" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="modern-card">
        <h6 style={{ fontWeight: 700, marginBottom: "12px" }}>📋 Recent Admin Activity</h6>
        {[
          { action: "User report reviewed", details: "Spam message in General Campus Lounge", time: "2 hours ago", status: "resolved" },
          { action: "New channel created", details: "#cloud-computing-lab by Prof. Sharma", time: "5 hours ago", status: "approved" },
          { action: "Study material uploaded", details: "DBMS Unit-4 Notes by Dr. Rao", time: "1 day ago", status: "approved" },
          { action: "User warning issued", details: "Repeated off-topic posts in Study Circle", time: "2 days ago", status: "warning" },
        ].map((item, i) => (
          <div key={i} style={{ padding: "10px 0", borderBottom: i < 3 ? "1px solid var(--border-subtle)" : "none" }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div style={{ fontWeight: 600, fontSize: "13px" }}>{item.action}</div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{item.details}</div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Tag size="sm" color={item.status === "resolved" ? "green" : item.status === "warning" ? "orange" : "blue"}>
                  {item.status}
                </Tag>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{item.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="h-100 custom-scroll" style={{ overflowY: "auto", padding: "20px 24px 80px 24px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap" style={{ gap: "12px" }}>
        <div>
          <h4 style={{ margin: 0, fontWeight: 800 }}>🛡️ Campus Administration & Moderation Portal</h4>
          <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>
            Logged in as: <strong>{profile?.email || "Admin"}</strong> ({isSuperAdmin ? "Super Administrator" : profile?.role || "Admin"})
          </p>
        </div>
        <div className="d-flex gap-2">
          {isSuperAdmin && <Tag color="red" size="md">⚡ Super Admin</Tag>}
          <Tag color="blue" size="md">Role: {profile?.role || "Admin"}</Tag>
        </div>
      </div>

      <Nav appearance="subtle" activeKey={activeTab} onSelect={setActiveTab} style={{ marginBottom: "20px", borderBottom: "1px solid var(--border-subtle)" }}>
        <Nav.Item eventKey="overview">📊 Overview</Nav.Item>
        <Nav.Item eventKey="moderation">🚩 Moderation Queue (5)</Nav.Item>
        <Nav.Item eventKey="users">👥 User Management</Nav.Item>
      </Nav>

      {activeTab === "overview" && renderOverview()}
      {activeTab === "moderation" && <ModerationQueue />}
      {activeTab === "users" && <UserManagementTable />}
    </div>
  );
};

export default AdminDashboard;
