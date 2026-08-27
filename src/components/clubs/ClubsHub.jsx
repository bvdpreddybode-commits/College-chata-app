import React, { useState } from "react";
import { Button, Tag, Input, InputGroup, Modal } from "rsuite";
import SearchIcon from "@rsuite/icons/Search";

const SAMPLE_CLUBS = [
  { id: "cl-1", name: "Turing Coding Club", icon: "💻", description: "Competitive programming, hackathons, and system design sessions.", members: 142, faculty: "Dr. Anand Rao", category: "Technical", tags: ["Coding", "CP", "DSA"], isJoined: false },
  { id: "cl-2", name: "Google DSC VNR", icon: "🌐", description: "Google Developer Student Club — Web, Mobile, Cloud, and ML workshops.", members: 220, faculty: "Prof. Latha", category: "Technical", tags: ["Google", "Web", "Cloud"], isJoined: true },
  { id: "cl-3", name: "Robotics & AI Society", icon: "🤖", description: "Autonomous robots, drones, IoT, and computer vision projects.", members: 98, faculty: "Dr. Suresh K.", category: "Technical", tags: ["Robotics", "AI", "IoT"], isJoined: false },
  { id: "cl-4", name: "IEEE Student Branch", icon: "⚡", description: "IEEE conferences, technical paper publications, and industry networking.", members: 175, faculty: "Prof. Ramesh", category: "Technical", tags: ["IEEE", "Research", "Papers"], isJoined: false },
  { id: "cl-5", name: "E-Cell — Entrepreneurship Cell", icon: "🚀", description: "Startup workshops, pitch competitions, and investor networking.", members: 110, faculty: "Dr. Priya M.", category: "Business", tags: ["Startup", "Business", "Innovation"], isJoined: false },
  { id: "cl-6", name: "Arts & Cultural Forum", icon: "🎨", description: "Music, dance, drama, and art exhibitions throughout the academic year.", members: 160, faculty: "Ms. Swathi R.", category: "Cultural", tags: ["Music", "Dance", "Art"], isJoined: false },
];

const ClubDetailsModal = ({ club, isOpen, onClose }) => {
  const [joined, setJoined] = useState(club?.isJoined ?? false);
  if (!club) return null;
  return (
    <Modal open={isOpen} onClose={onClose} size="sm">
      <Modal.Header>
        <Modal.Title>{club.icon} {club.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-wrap gap-2 mb-3" style={{ gap: "6px" }}>
          <Tag color="blue">{club.category}</Tag>
          {club.tags.map((t) => <Tag key={t} size="sm">{t}</Tag>)}
        </div>
        <p style={{ fontSize: "14px", lineHeight: 1.6 }}>{club.description}</p>
        <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
          <div>👥 <strong>Members:</strong> {club.members}</div>
          <div>👨‍🏫 <strong>Faculty Coordinator:</strong> {club.faculty}</div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} appearance="subtle">Close</Button>
        <Button color={joined ? "green" : "blue"} appearance="primary" onClick={() => setJoined(true)} disabled={joined} style={{ fontWeight: 600 }}>
          {joined ? "✓ Joined" : "Join Club"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const ClubsHub = () => {
  const [search, setSearch] = useState("");
  const [selectedClub, setSelectedClub] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = SAMPLE_CLUBS.filter((c) =>
    !search.trim() || c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-100 custom-scroll" style={{ overflowY: "auto", padding: "20px 24px 80px 24px" }}>
      <div className="mb-4">
        <h4 style={{ margin: 0, fontWeight: 800 }}>🎭 Student Clubs & Societies</h4>
        <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>Explore clubs, join communities, and participate in campus activities.</p>
      </div>

      <InputGroup inside style={{ marginBottom: "16px" }}>
        <InputGroup.Addon><SearchIcon /></InputGroup.Addon>
        <Input placeholder="Search clubs..." value={search} onChange={setSearch} />
      </InputGroup>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "12px" }}>
        {filtered.map((club) => (
          <div key={club.id} className="modern-card" style={{ padding: "16px", cursor: "pointer" }} onClick={() => { setSelectedClub(club); setModalOpen(true); }}>
            <div className="d-flex align-items-center gap-3" style={{ gap: "12px" }}>
              <div style={{ width: 48, height: 48, borderRadius: "12px", background: "rgba(37, 99, 235, 0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>
                {club.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)" }}>{club.name}</div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>{club.description.slice(0, 60)}...</div>
                <div className="d-flex align-items-center gap-2 mt-1" style={{ gap: "6px" }}>
                  <Tag color="blue" size="sm">{club.category}</Tag>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>👥 {club.members}</span>
                  {club.isJoined && <Tag color="green" size="sm">Joined</Tag>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ClubDetailsModal club={selectedClub} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default ClubsHub;
