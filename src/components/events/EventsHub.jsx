import React, { useState } from "react";
import { Button, Tag, Nav, Input, InputGroup, Modal } from "rsuite";
import SearchIcon from "@rsuite/icons/Search";

const SAMPLE_EVENTS = [
  { id: "ev-1", title: "VNR HackOverflow 2026", type: "Hackathon", date: "2026-09-05", time: "9:00 AM", venue: "Main Auditorium", description: "36-Hour National Hackathon with prizes worth ₹2,00,000. Open to all branches.", organizer: "Turing Coding Club", image: "🏆", registrations: 280, maxCapacity: 500, tags: ["Coding", "Innovation", "National"], status: "open" },
  { id: "ev-2", title: "AWS Cloud Workshop", type: "Workshop", date: "2026-09-10", time: "2:00 PM", venue: "Seminar Hall A", description: "Hands-on AWS Cloud workshop covering EC2, S3, Lambda, and RDS with real deployment exercises.", organizer: "Google DSC VNR", image: "☁️", registrations: 120, maxCapacity: 200, tags: ["Cloud", "AWS", "Hands-on"], status: "open" },
  { id: "ev-3", title: "AI/ML Research Symposium", type: "Seminar", date: "2026-09-15", time: "10:00 AM", venue: "Conference Hall", description: "Research paper presentations and keynote by Dr. Anand Kumar on Transformer Architectures in NLP.", organizer: "AI & Robotics Society", image: "🤖", registrations: 95, maxCapacity: 150, tags: ["AI", "ML", "Research"], status: "open" },
  { id: "ev-4", title: "Annual Cultural Fest — Vibrance 2026", type: "Cultural", date: "2026-10-01", time: "All Day", venue: "Open Air Theatre", description: "Three-day cultural extravaganza featuring music, dance, drama, art exhibitions, and food stalls.", organizer: "Student Council", image: "🎭", registrations: 500, maxCapacity: 2000, tags: ["Cultural", "Music", "Dance"], status: "upcoming" },
  { id: "ev-5", title: "Resume Building & Mock Interview Bootcamp", type: "Placement Talk", date: "2026-09-08", time: "3:00 PM", venue: "Placement Cell", description: "Career guidance session with HR professionals from TCS, Infosys, and Wipro.", organizer: "Training & Placement Cell", image: "💼", registrations: 180, maxCapacity: 250, tags: ["Career", "Interview", "Resume"], status: "open" },
];

const CATEGORIES = ["All", "Hackathon", "Workshop", "Seminar", "Cultural", "Placement Talk"];

const EventDetailsModal = ({ event, isOpen, onClose }) => {
  const [registered, setRegistered] = useState(false);
  if (!event) return null;
  return (
    <Modal open={isOpen} onClose={onClose} size="sm">
      <Modal.Header>
        <Modal.Title>{event.image} {event.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-wrap gap-2 mb-3" style={{ gap: "6px" }}>
          <Tag color="blue">{event.type}</Tag>
          <Tag color="green">{event.status === "open" ? "Registration Open" : "Upcoming"}</Tag>
          {event.tags.map((t) => <Tag key={t} size="sm">{t}</Tag>)}
        </div>
        <div style={{ fontSize: "14px", lineHeight: 1.6, marginBottom: "16px" }}>{event.description}</div>
        <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
          <div>📅 <strong>Date:</strong> {event.date} at {event.time}</div>
          <div>📍 <strong>Venue:</strong> {event.venue}</div>
          <div>🎯 <strong>Organizer:</strong> {event.organizer}</div>
          <div>👥 <strong>Registered:</strong> {event.registrations}/{event.maxCapacity}</div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} appearance="subtle">Close</Button>
        <Button
          color={registered ? "green" : "blue"}
          appearance="primary"
          onClick={() => setRegistered(true)}
          disabled={registered}
          style={{ fontWeight: 600 }}
        >
          {registered ? "✓ Registered" : "Register Now"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const EventsHub = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = SAMPLE_EVENTS.filter((e) => {
    const matchSearch = !search.trim() || e.title.toLowerCase().includes(search.toLowerCase()) || e.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || e.type === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="h-100 custom-scroll" style={{ overflowY: "auto", padding: "20px 24px 80px 24px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap" style={{ gap: "12px" }}>
        <div>
          <h4 style={{ margin: 0, fontWeight: 800 }}>🗓️ Campus Events & Hackathons</h4>
          <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>
            Discover hackathons, workshops, seminars, cultural fests, and placement talks.
          </p>
        </div>
      </div>

      <InputGroup inside style={{ marginBottom: "16px" }}>
        <InputGroup.Addon><SearchIcon /></InputGroup.Addon>
        <Input placeholder="Search events..." value={search} onChange={setSearch} />
      </InputGroup>

      <Nav appearance="subtle" activeKey={category} onSelect={setCategory} style={{ marginBottom: "16px", borderBottom: "1px solid var(--border-subtle)" }}>
        {CATEGORIES.map((c) => <Nav.Item key={c} eventKey={c}>{c}</Nav.Item>)}
      </Nav>

      <div className="d-flex flex-column" style={{ gap: "12px" }}>
        {filtered.length === 0 ? (
          <div className="text-center p-5 text-muted">
            <div style={{ fontSize: "40px" }}>📭</div>
            <h6>No events found</h6>
          </div>
        ) : (
          filtered.map((ev) => (
            <div key={ev.id} className="modern-card" style={{ padding: "16px", cursor: "pointer" }} onClick={() => { setSelectedEvent(ev); setModalOpen(true); }}>
              <div className="d-flex align-items-start gap-3" style={{ gap: "14px" }}>
                <div style={{ width: 52, height: 52, borderRadius: "12px", background: "rgba(37, 99, 235, 0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", flexShrink: 0 }}>
                  {ev.image}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "15px", color: "var(--text-primary)" }}>{ev.title}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                        📅 {ev.date} • {ev.time} • 📍 {ev.venue}
                      </div>
                    </div>
                    <Tag color={ev.status === "open" ? "green" : "yellow"} size="sm">
                      {ev.status === "open" ? "Open" : "Upcoming"}
                    </Tag>
                  </div>
                  <div className="d-flex align-items-center gap-2 mt-2 flex-wrap" style={{ gap: "6px" }}>
                    <Tag color="blue" size="sm">{ev.type}</Tag>
                    {ev.tags.slice(0, 2).map((t) => <Tag key={t} size="sm">{t}</Tag>)}
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>👥 {ev.registrations}/{ev.maxCapacity}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <EventDetailsModal event={selectedEvent} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default EventsHub;
