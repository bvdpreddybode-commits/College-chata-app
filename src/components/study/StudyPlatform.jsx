import React, { useState } from "react";
import { Input, InputGroup, Button, Nav, SelectPicker } from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import StudyMaterialCard from "./StudyMaterialCard";

const SAMPLE_MATERIALS = [
  { id: "sm-1", title: "DBMS Normalization & BCNF Complete Notes", subject: "DBMS", department: "Computer Science", uploadedBy: "Dr. Rao", fileType: "pdf", fileSize: "2.3 MB", tags: ["Unit 3", "Normalization", "BCNF"], uploadDate: "2026-08-20" },
  { id: "sm-2", title: "Cloud Computing — IaaS, PaaS, SaaS Comparison", subject: "Cloud Computing", department: "Computer Science", uploadedBy: "Prof. Sharma", fileType: "pdf", fileSize: "1.8 MB", tags: ["Unit 1", "Service Models"], uploadDate: "2026-08-18" },
  { id: "sm-3", title: "OS Process Scheduling Algorithms — Solved Numericals", subject: "Operating Systems", department: "Computer Science", uploadedBy: "Priya M. (TA)", fileType: "pdf", fileSize: "3.1 MB", tags: ["Unit 2", "Scheduling", "Numericals"], uploadDate: "2026-08-15" },
  { id: "sm-4", title: "Data Structures — Binary Search Tree Implementation", subject: "DSA", department: "Information Technology", uploadedBy: "Ravi K.", fileType: "pdf", fileSize: "1.2 MB", tags: ["Trees", "BST", "Code"], uploadDate: "2026-08-12" },
  { id: "sm-5", title: "Computer Networks — TCP/IP Protocol Stack", subject: "CN", department: "Computer Science", uploadedBy: "Prof. Reddy", fileType: "ppt", fileSize: "4.5 MB", tags: ["Unit 4", "TCP", "Protocols"], uploadDate: "2026-08-10" },
  { id: "sm-6", title: "Machine Learning — Linear Regression Notes", subject: "AI/ML", department: "Computer Science", uploadedBy: "Dr. Gupta", fileType: "pdf", fileSize: "2.0 MB", tags: ["Unit 1", "Regression", "Supervised"], uploadDate: "2026-08-08" },
];

const SUBJECTS = [
  { label: "All Subjects", value: "all" },
  { label: "DBMS", value: "DBMS" },
  { label: "Cloud Computing", value: "Cloud Computing" },
  { label: "Operating Systems", value: "Operating Systems" },
  { label: "DSA", value: "DSA" },
  { label: "Computer Networks", value: "CN" },
  { label: "AI/ML", value: "AI/ML" },
];

const StudyPlatform = ({ onViewChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  const filtered = SAMPLE_MATERIALS.filter((m) => {
    const matchesSearch =
      !searchQuery.trim() ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = selectedSubject === "all" || m.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="h-100 custom-scroll" style={{ overflowY: "auto", padding: "20px 24px 80px 24px" }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap" style={{ gap: "12px" }}>
        <div>
          <h4 style={{ margin: 0, fontWeight: 800 }}>📚 Study Platform</h4>
          <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>
            Browse, search, and download shared lecture notes, assignments, and study materials.
          </p>
        </div>
        <div className="d-flex gap-2" style={{ gap: "8px" }}>
          <Button appearance="primary" color="blue" onClick={() => onViewChange && onViewChange("ai")} style={{ fontWeight: 600 }}>
            🤖 Ask AI Assistant
          </Button>
          <Button appearance="ghost" color="blue" onClick={() => onViewChange && onViewChange("ai_quiz")} style={{ fontWeight: 600 }}>
            📝 Generate Quiz
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="d-flex gap-2 mb-4 flex-wrap" style={{ gap: "10px" }}>
        <InputGroup inside style={{ flex: 1, minWidth: "240px" }}>
          <InputGroup.Addon><SearchIcon /></InputGroup.Addon>
          <Input
            placeholder="Search notes, subjects, topics..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </InputGroup>
        <SelectPicker
          data={SUBJECTS}
          value={selectedSubject}
          onChange={setSelectedSubject}
          cleanable={false}
          searchable={false}
          style={{ width: 200 }}
        />
      </div>

      {/* Tabs */}
      <Nav appearance="subtle" activeKey={activeTab} onSelect={setActiveTab} style={{ marginBottom: "16px", borderBottom: "1px solid var(--border-subtle)" }}>
        <Nav.Item eventKey="all">📁 All Materials ({SAMPLE_MATERIALS.length})</Nav.Item>
        <Nav.Item eventKey="notes">📝 Lecture Notes</Nav.Item>
        <Nav.Item eventKey="assignments">📋 Assignments</Nav.Item>
        <Nav.Item eventKey="qpapers">📄 Question Papers</Nav.Item>
      </Nav>

      {/* Results */}
      <div className="d-flex flex-column" style={{ gap: "10px" }}>
        {filtered.length === 0 ? (
          <div className="text-center p-5 text-muted">
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>📭</div>
            <h6>No study materials match your search.</h6>
            <p style={{ fontSize: "12px" }}>Try different keywords or clear filters.</p>
          </div>
        ) : (
          filtered.map((mat) => (
            <StudyMaterialCard key={mat.id} material={mat} onPreview={() => {}} />
          ))
        )}
      </div>
    </div>
  );
};

export default StudyPlatform;
