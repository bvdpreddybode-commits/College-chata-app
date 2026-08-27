import React, { useState } from "react";
import { Modal, Nav, Button } from "rsuite";
import AiCampusAssistant from "../ai/AiCampusAssistant";
import AiQuizGenerator from "../ai/AiQuizGenerator";
import AiFlashcards from "../ai/AiFlashcards";
import CloudArchitectureDiagram from "../cloud/CloudArchitectureDiagram";
import ScalabilitySimulator from "../cloud/ScalabilitySimulator";
import LoadBalancerSimulator from "../cloud/LoadBalancerSimulator";
import EventsHub from "../events/EventsHub";

const AiStudyRoomTabs = ({ isOpen, onClose, initialTab = "ai" }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <Modal open={isOpen} onClose={onClose} size="lg">
      <Modal.Header>
        <Modal.Title style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>🎓 CampusConnect Study & Innovation Hub</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ minHeight: "520px", padding: "12px 20px" }}>
        <Nav
          appearance="subtle"
          activeKey={activeTab}
          onSelect={setActiveTab}
          style={{ marginBottom: "16px", borderBottom: "1px solid #e2e8f0", overflowX: "auto" }}
        >
          <Nav.Item eventKey="ai" style={{ fontWeight: 600 }}>
            🤖 AI Study Assistant
          </Nav.Item>
          <Nav.Item eventKey="quiz" style={{ fontWeight: 600 }}>
            📝 Academic Quiz
          </Nav.Item>
          <Nav.Item eventKey="flashcards" style={{ fontWeight: 600 }}>
            🗂️ Flashcards Deck
          </Nav.Item>
          <Nav.Item eventKey="cloud_arch" style={{ fontWeight: 600 }}>
            ☁️ Cloud Architecture
          </Nav.Item>
          <Nav.Item eventKey="cloud_sim" style={{ fontWeight: 600 }}>
            📈 Auto-Scaling Simulator
          </Nav.Item>
          <Nav.Item eventKey="events" style={{ fontWeight: 600 }}>
            🗓️ Events & Hackathons
          </Nav.Item>
        </Nav>

        <div style={{ minHeight: "440px" }}>
          {activeTab === "ai" && <AiCampusAssistant />}
          {activeTab === "quiz" && <AiQuizGenerator />}
          {activeTab === "flashcards" && <AiFlashcards />}
          {activeTab === "cloud_arch" && (
            <div>
              <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "12px" }}>
                Interactive architecture map showing CampusConnect SaaS, PaaS, IaaS, Cloud Database, and Realtime layers.
              </p>
              <CloudArchitectureDiagram />
            </div>
          )}
          {activeTab === "cloud_sim" && (
            <div>
              <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "12px" }}>
                Test traffic load spikes and watch virtual nodes auto-scale dynamically in real-time.
              </p>
              <ScalabilitySimulator />
              <div style={{ marginTop: "20px" }}>
                <LoadBalancerSimulator />
              </div>
            </div>
          )}
          {activeTab === "events" && <EventsHub />}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} appearance="subtle">
          Close Hub
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AiStudyRoomTabs;
