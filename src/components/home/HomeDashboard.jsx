import React from "react";
import { Col, Grid, Row, Button, Tag, Progress } from "rsuite";
import ArrowRightIcon from "@rsuite/icons/ArrowRight";
import { useProfile } from "../../context/profile.context";
import { useRooms } from "../../context/rooms.context";
import { useNotifications } from "../../context/notifications.context";
import QuickStatsCard from "./QuickStatsCard";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const HomeDashboard = ({ onViewChange, onSelectChat }) => {
  const { profile } = useProfile();
  const rooms = useRooms() || [];
  const { unreadCount } = useNotifications();

  const firstName = profile?.name ? profile.name.split(" ")[0] : "Student";
  const department = profile?.department || "Computer Science";
  const rollNo = profile?.rollNo || profile?.roll_no || "Campus ID";
  const role = profile?.role || "Student";
  const batch = profile?.batch || "3rd Year";

  const publicChannels = rooms.filter((r) => !r.is_dm);

  return (
    <div className="custom-scroll" style={{ overflowY: "auto", padding: "20px 24px 80px 24px", minHeight: "100%" }}>
      {/* Welcome Hero Banner */}
      <div
        className="mb-4 p-4"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)",
          borderRadius: "16px",
          color: "#ffffff",
          boxShadow: "0 10px 25px rgba(37,99,235,0.2)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", zIndex: 2 }}>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span style={{ fontSize: "14px", opacity: 0.9 }}>
              🏛️ VNR Vignana Jyothi Institute of Engineering & Technology
            </span>
            <Tag color="cyan" size="sm">
              Cloud Campus
            </Tag>
          </div>
          <h2 style={{ fontWeight: 800, margin: "6px 0", color: "#ffffff", fontSize: "28px" }}>
            {getGreeting()}, {firstName} 👋
          </h2>
          <p style={{ opacity: 0.85, fontSize: "14px", maxWidth: "680px", margin: "4px 0 16px 0" }}>
            Welcome to your digital campus workspace. Collaborate in real-time, ask AI academic questions, participate in hackathons, and explore career drives.
          </p>

          <div className="d-flex flex-wrap gap-2 align-items-center">
            <span className="badge-pill badge-student" style={{ marginLeft: 0 }}>
              🎓 {role}
            </span>
            <span className="badge-pill badge-faculty">
              🏛️ {department}
            </span>
            <span className="badge-pill badge-ta">
              📅 {batch}
            </span>
            <span className="badge-pill badge-dept">
              🆔 {rollNo}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Metrics Cards */}
      <Grid fluid className="p-0 mb-4">
        <Row gutter={16}>
          <Col xs={24} sm={12} md={6} className="mb-3">
            <QuickStatsCard
              icon="💬"
              title="Active Channels"
              value={publicChannels.length || 4}
              subtitle="Campus discussion hubs"
              color="#2563eb"
              onClick={() => onViewChange("chat")}
            />
          </Col>
          <Col xs={24} sm={12} md={6} className="mb-3">
            <QuickStatsCard
              icon="🔔"
              title="Unread Alerts"
              value={unreadCount}
              subtitle="Mentions, replies & notices"
              color="#ef4444"
              onClick={() => onViewChange("notifications")}
            />
          </Col>
          <Col xs={24} sm={12} md={6} className="mb-3">
            <QuickStatsCard
              icon="🗓️"
              title="Upcoming Events"
              value="3"
              subtitle="Hackathons & Workshops"
              color="#f59e0b"
              onClick={() => onViewChange("events")}
            />
          </Col>
          <Col xs={24} sm={12} md={6} className="mb-3">
            <QuickStatsCard
              icon="💼"
              title="Placement Drives"
              value="8"
              subtitle="Google, Amazon & Microsoft"
              color="#10b981"
              onClick={() => onViewChange("placements")}
            />
          </Col>
        </Row>
      </Grid>

      {/* Main Grid: Quick Actions & Feeds */}
      <Grid fluid className="p-0">
        <Row gutter={20}>
          {/* Left Column: Quick Actions & Channels */}
          <Col xs={24} lg={16}>
            {/* Quick Actions Panel */}
            <div className="modern-card mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 style={{ margin: 0, fontWeight: 700 }}>⚡ Quick Campus Actions</h5>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Instant Shortcuts</span>
              </div>
              <div className="d-flex flex-wrap gap-2" style={{ gap: "10px" }}>
                <Button
                  color="blue"
                  appearance="primary"
                  onClick={() => onViewChange("ai")}
                  style={{ fontWeight: 600, padding: "8px 16px" }}
                >
                  🤖 Ask AI Assistant
                </Button>
                <Button
                  color="green"
                  appearance="primary"
                  onClick={() => onViewChange("ai_quiz")}
                  style={{ fontWeight: 600, padding: "8px 16px" }}
                >
                  📝 Practice AI Quiz
                </Button>
                <Button
                  color="violet"
                  appearance="primary"
                  onClick={() => onViewChange("study")}
                  style={{ fontWeight: 600, padding: "8px 16px" }}
                >
                  📚 Study Materials
                </Button>
                <Button
                  appearance="ghost"
                  onClick={() => onViewChange("cloud")}
                  style={{ fontWeight: 600, padding: "8px 16px" }}
                >
                  ☁️ Cloud Architecture
                </Button>
                {(profile?.isAdmin || profile?.role === "Admin" || profile?.email === "bvdpreddybode@gmail.com") && (
                  <Button
                    color="red"
                    appearance="primary"
                    onClick={() => onViewChange("admin")}
                    style={{ fontWeight: 600, padding: "8px 16px" }}
                  >
                    🛡️ Admin Portal
                  </Button>
                )}
              </div>
            </div>

            {/* Active Channels Grid */}
            <div className="modern-card mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 style={{ margin: 0, fontWeight: 700 }}>🏛️ Active Campus Discussion Channels</h5>
                <Button size="xs" appearance="link" onClick={() => onViewChange("chat")}>
                  View All Channels <ArrowRightIcon />
                </Button>
              </div>

              <div className="d-flex flex-column gap-2" style={{ gap: "8px" }}>
                {publicChannels.slice(0, 4).map((room) => (
                  <div
                    key={room.id}
                    onClick={() => {
                      onViewChange("chat");
                      if (onSelectChat) onSelectChat(room.id);
                    }}
                    style={{
                      padding: "12px 14px",
                      borderRadius: "8px",
                      background: "var(--bg-surface-subtle)",
                      border: "1px solid var(--border-subtle)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)" }}>
                        {room.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                        {room.description || "Campus discussion hub"}
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <Tag color="blue" size="sm">
                        {room.category || "General"}
                      </Tag>
                      <Button size="xs" appearance="primary" color="blue">
                        Open Chat
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Academic Deadlines */}
            <div className="modern-card mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 style={{ margin: 0, fontWeight: 700 }}>⏳ Upcoming Academic Deadlines</h5>
                <span className="badge-pill badge-ta">Semester 6</span>
              </div>
              <div className="d-flex flex-column gap-2" style={{ gap: "10px" }}>
                <div style={{ padding: "10px 14px", borderRadius: 8, background: "var(--bg-surface-subtle)", border: "1px solid var(--border-subtle)" }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <strong style={{ fontSize: "13px" }}>DBMS Lab Project Submission & Viva</strong>
                    <span style={{ color: "#ef4444", fontWeight: 700, fontSize: "12px" }}>Due in 2 Days</span>
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                    Submit complete ER diagrams, SQL DDL/DML scripts, and normalized schemas to Dr. John Doe.
                  </div>
                  <Progress.Line percent={75} strokeColor="#ef4444" status="active" style={{ padding: "4px 0 0 0" }} />
                </div>

                <div style={{ padding: "10px 14px", borderRadius: 8, background: "var(--bg-surface-subtle)", border: "1px solid var(--border-subtle)" }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <strong style={{ fontSize: "13px" }}>Cloud Computing Term Paper on Virtualization</strong>
                    <span style={{ color: "#f59e0b", fontWeight: 700, fontSize: "12px" }}>Due in 5 Days</span>
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                    Comparative study of Type 1 vs Type 2 Hypervisors and container orchestration.
                  </div>
                  <Progress.Line percent={40} strokeColor="#f59e0b" status="active" style={{ padding: "4px 0 0 0" }} />
                </div>
              </div>
            </div>
          </Col>

          {/* Right Column: AI Assistant Teaser & Recommended Hubs */}
          <Col xs={24} lg={8}>
            {/* AI Assistant Quick Card */}
            <div
              className="mb-4 p-3"
              style={{
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                borderRadius: "12px",
                color: "#ffffff",
                boxShadow: "0 4px 15px rgba(124, 58, 237, 0.25)",
              }}
            >
              <div className="d-flex align-items-center gap-2 mb-2">
                <span style={{ fontSize: "24px" }}>🤖</span>
                <h5 style={{ margin: 0, fontWeight: 700, color: "#ffffff" }}>Campus AI Study Buddy</h5>
              </div>
              <p style={{ fontSize: "12px", opacity: 0.9, lineHeight: 1.4 }}>
                Instant explanations for complex DBMS, Cloud, and OS topics. Summarize uploaded lecture PDFs and practice generated quizzes.
              </p>
              <Button
                block
                appearance="default"
                onClick={() => onViewChange("ai")}
                style={{ fontWeight: 700, color: "#4f46e5", background: "#ffffff", marginTop: "10px" }}
              >
                Launch AI Assistant
              </Button>
            </div>

            {/* Cloud Architecture Status Card */}
            <div className="modern-card mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 style={{ margin: 0, fontWeight: 700 }}>☁️ Cloud Architecture Status</h6>
                <span className="badge-pill badge-dept" style={{ color: "#10b981", background: "rgba(16,185,129,0.1)" }}>
                  ● Operational
                </span>
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                <div>• <strong>SaaS:</strong> CampusConnect Web Application</div>
                <div>• <strong>PaaS:</strong> Supabase PostgreSQL & WebSockets</div>
                <div>• <strong>IaaS:</strong> Virtual Compute Instances & CDN</div>
              </div>
              <Button
                block
                size="sm"
                appearance="subtle"
                color="blue"
                onClick={() => onViewChange("cloud")}
                style={{ marginTop: "10px", fontWeight: 600 }}
              >
                Open Architecture & Simulators →
              </Button>
            </div>

            {/* Featured Campus Clubs */}
            <div className="modern-card mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 style={{ margin: 0, fontWeight: 700 }}>🎭 Featured Student Clubs</h6>
                <Button size="xs" appearance="link" onClick={() => onViewChange("clubs")}>
                  Explore All
                </Button>
              </div>
              <div className="d-flex flex-column gap-2" style={{ gap: "8px" }}>
                <div className="d-flex align-items-center justify-content-between p-2" style={{ background: "var(--bg-surface-subtle)", borderRadius: 6 }}>
                  <div className="d-flex align-items-center gap-2">
                    <span style={{ fontSize: "18px" }}>💻</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "12px" }}>Turing Coding Club</div>
                      <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>140 Members</div>
                    </div>
                  </div>
                  <Button size="xs" color="blue" appearance="ghost" onClick={() => onViewChange("clubs")}>
                    Join
                  </Button>
                </div>
                <div className="d-flex align-items-center justify-content-between p-2" style={{ background: "var(--bg-surface-subtle)", borderRadius: 6 }}>
                  <div className="d-flex align-items-center gap-2">
                    <span style={{ fontSize: "18px" }}>🤖</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "12px" }}>Robotics & AI Society</div>
                      <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>98 Members</div>
                    </div>
                  </div>
                  <Button size="xs" color="blue" appearance="ghost" onClick={() => onViewChange("clubs")}>
                    Join
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

export default HomeDashboard;
