import React, { useState } from "react";
import { Button, Tag, Input, InputGroup, Modal, SelectPicker } from "rsuite";
import SearchIcon from "@rsuite/icons/Search";

const PLACEMENTS = [
  { id: "pl-1", company: "Google", position: "SWE Intern 2027", type: "Internship", ctc: "₹80,000/month", location: "Bangalore", department: "CSE, IT", eligibility: "3rd & 4th Year, CGPA ≥ 8.0", deadline: "2026-09-15", tags: ["FAANG", "SDE", "Intern"], status: "open" },
  { id: "pl-2", company: "Amazon", position: "SDE-1 Full Time", type: "Full-time", ctc: "₹32 LPA", location: "Hyderabad", department: "CSE, IT, ECE", eligibility: "4th Year, No active backlogs", deadline: "2026-09-20", tags: ["FAANG", "SDE", "Full-time"], status: "open" },
  { id: "pl-3", company: "Microsoft", position: "Software Engineer Intern", type: "Internship", ctc: "₹60,000/month", location: "Noida", department: "CSE, IT", eligibility: "3rd Year, CGPA ≥ 7.5", deadline: "2026-09-25", tags: ["Product", "SDE", "Intern"], status: "open" },
  { id: "pl-4", company: "TCS Digital", position: "Digital Engineer", type: "Full-time", ctc: "₹9 LPA", location: "Pan India", department: "All Branches", eligibility: "4th Year, 60% aggregate", deadline: "2026-10-01", tags: ["Mass", "Service", "Full-time"], status: "open" },
  { id: "pl-5", company: "Flipkart", position: "Backend Developer Intern", type: "Internship", ctc: "₹70,000/month", location: "Bangalore", department: "CSE, IT", eligibility: "3rd Year, CGPA ≥ 7.0", deadline: "2026-09-18", tags: ["E-commerce", "Backend", "Intern"], status: "open" },
  { id: "pl-6", company: "Deloitte", position: "Analyst Trainee", type: "Full-time", ctc: "₹7.5 LPA", location: "Hyderabad", department: "All Branches", eligibility: "4th Year, 65% aggregate", deadline: "2026-10-05", tags: ["Consulting", "Analyst", "Full-time"], status: "upcoming" },
];

const TYPE_FILTER = [
  { label: "All Types", value: "all" },
  { label: "Internship", value: "Internship" },
  { label: "Full-time", value: "Full-time" },
];

const PlacementApplyModal = ({ placement, isOpen, onClose }) => {
  const [applied, setApplied] = useState(false);
  if (!placement) return null;
  return (
    <Modal open={isOpen} onClose={onClose} size="sm">
      <Modal.Header>
        <Modal.Title>💼 {placement.company} — {placement.position}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-wrap gap-2 mb-3" style={{ gap: "6px" }}>
          <Tag color={placement.type === "Internship" ? "violet" : "blue"}>{placement.type}</Tag>
          <Tag color="green" size="sm">{placement.status === "open" ? "Accepting Applications" : "Upcoming"}</Tag>
          {placement.tags.map((t) => <Tag key={t} size="sm">{t}</Tag>)}
        </div>
        <div style={{ fontSize: "14px", lineHeight: 1.8, color: "var(--text-secondary)" }}>
          <div>🏢 <strong>Company:</strong> {placement.company}</div>
          <div>💰 <strong>CTC/Stipend:</strong> {placement.ctc}</div>
          <div>📍 <strong>Location:</strong> {placement.location}</div>
          <div>🎓 <strong>Eligible Departments:</strong> {placement.department}</div>
          <div>📋 <strong>Eligibility:</strong> {placement.eligibility}</div>
          <div>📅 <strong>Application Deadline:</strong> {placement.deadline}</div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} appearance="subtle">Close</Button>
        <Button color={applied ? "green" : "blue"} appearance="primary" onClick={() => setApplied(true)} disabled={applied} style={{ fontWeight: 600 }}>
          {applied ? "✓ Application Submitted" : "Apply Now"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const PlacementsHub = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = PLACEMENTS.filter((p) => {
    const matchSearch = !search.trim() || p.company.toLowerCase().includes(search.toLowerCase()) || p.position.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || p.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="h-100 custom-scroll" style={{ overflowY: "auto", padding: "20px 24px 80px 24px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap" style={{ gap: "12px" }}>
        <div>
          <h4 style={{ margin: 0, fontWeight: 800 }}>💼 Placements & Internships</h4>
          <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>Browse opportunities, filter by type, and apply directly.</p>
        </div>
      </div>

      <div className="d-flex gap-2 mb-4 flex-wrap" style={{ gap: "10px" }}>
        <InputGroup inside style={{ flex: 1, minWidth: "240px" }}>
          <InputGroup.Addon><SearchIcon /></InputGroup.Addon>
          <Input placeholder="Search companies, positions..." value={search} onChange={setSearch} />
        </InputGroup>
        <SelectPicker data={TYPE_FILTER} value={typeFilter} onChange={setTypeFilter} cleanable={false} searchable={false} style={{ width: 180 }} />
      </div>

      <div className="d-flex flex-column" style={{ gap: "10px" }}>
        {filtered.length === 0 ? (
          <div className="text-center p-5 text-muted">
            <div style={{ fontSize: "40px" }}>📭</div>
            <h6>No placement drives match your filters.</h6>
          </div>
        ) : (
          filtered.map((pl) => (
            <div key={pl.id} className="modern-card" style={{ padding: "16px", cursor: "pointer" }} onClick={() => { setSelected(pl); setModalOpen(true); }}>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div style={{ fontWeight: 700, fontSize: "15px", color: "var(--text-primary)" }}>{pl.company} — {pl.position}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
                    💰 {pl.ctc} • 📍 {pl.location} • 📅 Deadline: {pl.deadline}
                  </div>
                  <div className="d-flex align-items-center gap-2 mt-2 flex-wrap" style={{ gap: "6px" }}>
                    <Tag color={pl.type === "Internship" ? "violet" : "blue"} size="sm">{pl.type}</Tag>
                    <Tag size="sm">{pl.department}</Tag>
                    {pl.tags.slice(0, 2).map((t) => <Tag key={t} size="sm" color="cyan">{t}</Tag>)}
                  </div>
                </div>
                <Button size="sm" color="blue" appearance="primary" style={{ fontWeight: 600, flexShrink: 0 }}>
                  Apply →
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <PlacementApplyModal placement={selected} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default PlacementsHub;
