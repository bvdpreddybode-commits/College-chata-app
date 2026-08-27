import React, { useState } from "react";
import { Tag, Input, InputGroup } from "rsuite";
import SearchIcon from "@rsuite/icons/Search";

const DEPARTMENTS = [
  {
    id: "dept-cse", name: "Computer Science & Engineering", icon: "💻", hod: "Dr. Anand Rao",
    courses: ["Data Structures & Algorithms", "DBMS", "Cloud Computing", "AI/ML", "Computer Networks", "Operating Systems"],
    faculty: ["Dr. Anand Rao", "Prof. Latha K.", "Dr. Suresh M.", "Prof. Ramesh B."],
    studentCount: 480, labCount: 8,
  },
  {
    id: "dept-it", name: "Information Technology", icon: "🖥️", hod: "Dr. Priya Menon",
    courses: ["Web Technologies", "Big Data Analytics", "Software Engineering", "Cybersecurity", "IoT"],
    faculty: ["Dr. Priya Menon", "Prof. Vinay K.", "Dr. Srinivas R."],
    studentCount: 360, labCount: 6,
  },
  {
    id: "dept-ece", name: "Electronics & Communication", icon: "📡", hod: "Dr. Raghav S.",
    courses: ["Digital Signal Processing", "VLSI Design", "Embedded Systems", "Communication Systems", "Antenna Design"],
    faculty: ["Dr. Raghav S.", "Prof. Meena D.", "Dr. Kiran T."],
    studentCount: 300, labCount: 7,
  },
  {
    id: "dept-eee", name: "Electrical Engineering", icon: "⚡", hod: "Dr. Narasimha R.",
    courses: ["Power Systems", "Control Systems", "Electrical Machines", "Power Electronics", "Renewable Energy"],
    faculty: ["Dr. Narasimha R.", "Prof. Swathi L.", "Dr. Ganesh P."],
    studentCount: 240, labCount: 5,
  },
  {
    id: "dept-mech", name: "Mechanical Engineering", icon: "⚙️", hod: "Dr. Kumar V.",
    courses: ["Thermodynamics", "Fluid Mechanics", "Manufacturing", "CAD/CAM", "Robotics"],
    faculty: ["Dr. Kumar V.", "Prof. Anil M.", "Dr. Bhavani S."],
    studentCount: 280, labCount: 6,
  },
  {
    id: "dept-civil", name: "Civil Engineering", icon: "🏗️", hod: "Dr. Satish B.",
    courses: ["Structural Analysis", "Geotechnical Engineering", "Environmental Engineering", "Transportation"],
    faculty: ["Dr. Satish B.", "Prof. Lakshmi N.", "Dr. Hari K."],
    studentCount: 200, labCount: 4,
  },
];

const DepartmentHub = () => {
  const [selectedDept, setSelectedDept] = useState(DEPARTMENTS[0]);
  const [search, setSearch] = useState("");

  const filteredDepts = DEPARTMENTS.filter((d) =>
    !search.trim() || d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-100 custom-scroll" style={{ overflowY: "auto", padding: "20px 24px 80px 24px" }}>
      <div className="mb-4">
        <h4 style={{ margin: 0, fontWeight: 800 }}>🏛️ Department Hub</h4>
        <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>
          Explore departments, faculty directories, semester courses, and departmental resources.
        </p>
      </div>

      <InputGroup inside style={{ marginBottom: "16px" }}>
        <InputGroup.Addon><SearchIcon /></InputGroup.Addon>
        <Input placeholder="Search departments..." value={search} onChange={setSearch} />
      </InputGroup>

      {/* Department Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px", marginBottom: "24px" }}>
        {filteredDepts.map((dept) => (
          <div
            key={dept.id}
            className="modern-card"
            onClick={() => setSelectedDept(dept)}
            style={{
              padding: "14px",
              cursor: "pointer",
              borderLeft: selectedDept?.id === dept.id ? "4px solid var(--brand-primary)" : "4px solid transparent",
            }}
          >
            <div className="d-flex align-items-center gap-3" style={{ gap: "10px" }}>
              <span style={{ fontSize: "28px" }}>{dept.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)" }}>{dept.name}</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  HOD: {dept.hod} • 👥 {dept.studentCount} students
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Department Detail */}
      {selectedDept && (
        <div className="modern-card" style={{ padding: "20px" }}>
          <div className="d-flex align-items-center gap-3 mb-3" style={{ gap: "10px" }}>
            <span style={{ fontSize: "36px" }}>{selectedDept.icon}</span>
            <div>
              <h5 style={{ margin: 0, fontWeight: 800 }}>{selectedDept.name}</h5>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                Head of Department: {selectedDept.hod}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
            {/* Stats */}
            <div style={{ padding: "12px", borderRadius: "8px", background: "var(--bg-surface-subtle)" }}>
              <div style={{ fontWeight: 700, fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>
                Students
              </div>
              <div style={{ fontWeight: 800, fontSize: "24px", color: "var(--brand-primary)" }}>{selectedDept.studentCount}</div>
            </div>
            <div style={{ padding: "12px", borderRadius: "8px", background: "var(--bg-surface-subtle)" }}>
              <div style={{ fontWeight: 700, fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>
                Labs
              </div>
              <div style={{ fontWeight: 800, fontSize: "24px", color: "var(--brand-primary)" }}>{selectedDept.labCount}</div>
            </div>
            <div style={{ padding: "12px", borderRadius: "8px", background: "var(--bg-surface-subtle)" }}>
              <div style={{ fontWeight: 700, fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>
                Faculty
              </div>
              <div style={{ fontWeight: 800, fontSize: "24px", color: "var(--brand-primary)" }}>{selectedDept.faculty.length}</div>
            </div>
          </div>

          {/* Courses */}
          <div style={{ marginTop: "20px" }}>
            <h6 style={{ fontWeight: 700, marginBottom: "8px" }}>📚 Semester Courses</h6>
            <div className="d-flex flex-wrap gap-2" style={{ gap: "6px" }}>
              {selectedDept.courses.map((c) => <Tag key={c} color="blue" size="sm">{c}</Tag>)}
            </div>
          </div>

          {/* Faculty Directory */}
          <div style={{ marginTop: "20px" }}>
            <h6 style={{ fontWeight: 700, marginBottom: "8px" }}>👨‍🏫 Faculty Directory</h6>
            <div className="d-flex flex-column gap-2" style={{ gap: "6px" }}>
              {selectedDept.faculty.map((f) => (
                <div key={f} style={{ padding: "8px 12px", borderRadius: "6px", background: "var(--bg-surface-subtle)", fontSize: "13px", fontWeight: 600 }}>
                  {f} {f === selectedDept.hod && <Tag color="orange" size="sm">HOD</Tag>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentHub;
