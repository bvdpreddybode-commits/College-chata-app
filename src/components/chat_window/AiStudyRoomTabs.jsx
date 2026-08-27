import React, { useState } from "react";
import { Nav } from "rsuite";

const AiStudyRoomTabs = ({ chatContent, filesContent, aiContent, quizContent, flashcardsContent }) => {
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div className="h-100 d-flex flex-column">
      <Nav
        appearance="subtle"
        activeKey={activeTab}
        onSelect={setActiveTab}
        justified
        style={{
          borderBottom: "1px solid var(--border-subtle)",
          background: "var(--bg-surface)",
          padding: "0 8px",
        }}
      >
        <Nav.Item eventKey="chat" style={{ fontWeight: 600, fontSize: "13px" }}>💬 Chat</Nav.Item>
        <Nav.Item eventKey="files" style={{ fontWeight: 600, fontSize: "13px" }}>📁 Files</Nav.Item>
        <Nav.Item eventKey="ai" style={{ fontWeight: 600, fontSize: "13px" }}>🤖 AI Assistant</Nav.Item>
        <Nav.Item eventKey="quiz" style={{ fontWeight: 600, fontSize: "13px" }}>📝 Quiz</Nav.Item>
        <Nav.Item eventKey="flashcards" style={{ fontWeight: 600, fontSize: "13px" }}>🗂️ Flashcards</Nav.Item>
      </Nav>
      <div style={{ flex: 1, overflow: "hidden" }}>
        {activeTab === "chat" && (chatContent || <div className="p-4 text-center text-muted">Chat content loads here</div>)}
        {activeTab === "files" && (filesContent || <div className="p-4 text-center text-muted">Shared files appear here</div>)}
        {activeTab === "ai" && (aiContent || <div className="p-4 text-center text-muted">AI Assistant loads here</div>)}
        {activeTab === "quiz" && (quizContent || <div className="p-4 text-center text-muted">Quiz generator loads here</div>)}
        {activeTab === "flashcards" && (flashcardsContent || <div className="p-4 text-center text-muted">Flashcards load here</div>)}
      </div>
    </div>
  );
};

export default AiStudyRoomTabs;
