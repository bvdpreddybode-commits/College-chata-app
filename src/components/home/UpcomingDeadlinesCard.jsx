import React from "react";
import { Progress } from "rsuite";

const DEADLINES = [
  {
    id: "dl-1",
    title: "DBMS Lab Project Submission & Viva",
    detail: "Submit complete ER diagrams, SQL DDL/DML scripts, and normalized schemas.",
    dueLabel: "Due in 2 Days",
    percent: 75,
    color: "#ef4444",
  },
  {
    id: "dl-2",
    title: "Cloud Computing Term Paper on Virtualization",
    detail: "Comparative study of Type 1 vs Type 2 Hypervisors and container orchestration.",
    dueLabel: "Due in 5 Days",
    percent: 40,
    color: "#f59e0b",
  },
  {
    id: "dl-3",
    title: "OS Assignment: Page Replacement Simulation",
    detail: "Implement LRU, FIFO, and Optimal page replacement algorithms with comparison charts.",
    dueLabel: "Due in 8 Days",
    percent: 20,
    color: "#10b981",
  },
];

const UpcomingDeadlinesCard = () => {
  return (
    <div className="modern-card mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 style={{ margin: 0, fontWeight: 700 }}>⏳ Upcoming Academic Deadlines</h5>
        <span className="badge-pill badge-ta">Semester 6</span>
      </div>
      <div className="d-flex flex-column gap-2" style={{ gap: "10px" }}>
        {DEADLINES.map((dl) => (
          <div
            key={dl.id}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              background: "var(--bg-surface-subtle)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <strong style={{ fontSize: "13px" }}>{dl.title}</strong>
              <span style={{ color: dl.color, fontWeight: 700, fontSize: "12px" }}>
                {dl.dueLabel}
              </span>
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
              {dl.detail}
            </div>
            <Progress.Line
              percent={dl.percent}
              strokeColor={dl.color}
              status="active"
              style={{ padding: "4px 0 0 0" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingDeadlinesCard;
