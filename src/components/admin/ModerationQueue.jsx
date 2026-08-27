import React, { useState } from "react";
import { Button, Tag, Message, toaster } from "rsuite";

const SAMPLE_REPORTS = [
  { id: "rpt-1", reportedBy: "Ananya S.", reportedUser: "Unknown", channel: "General Campus Lounge", reason: "Spam", messageText: "Buy cheap assignments at www.example.com — guaranteed grades!!", timestamp: "2026-08-27T06:15:00Z", status: "pending" },
  { id: "rpt-2", reportedBy: "Ravi K.", reportedUser: "Vikram P.", channel: "CS Dept Hub", reason: "Harassment", messageText: "You're such a terrible coder, why do you even try?", timestamp: "2026-08-26T14:30:00Z", status: "pending" },
  { id: "rpt-3", reportedBy: "Priya M.", reportedUser: "Anonymous", channel: "Exam Prep & Study Circle", reason: "Misinformation", messageText: "The exam has been postponed to next month (THIS IS FALSE)", timestamp: "2026-08-25T10:00:00Z", status: "pending" },
  { id: "rpt-4", reportedBy: "System", reportedUser: "Guest_41a", channel: "Placements & Internships", reason: "Inappropriate", messageText: "Offensive content removed by auto-filter", timestamp: "2026-08-24T18:45:00Z", status: "pending" },
  { id: "rpt-5", reportedBy: "Kiran T.", reportedUser: "Suresh M.", channel: "General Campus Lounge", reason: "Spam", messageText: "Join my Telegram channel for leaked papers!", timestamp: "2026-08-23T09:20:00Z", status: "pending" },
];

const ModerationQueue = () => {
  const [reports, setReports] = useState(SAMPLE_REPORTS);

  const handleAction = (reportId, action) => {
    setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, status: action } : r)));
    const labels = { resolved: "Report resolved", warned: "Warning issued to user", deleted: "Message deleted & user warned" };
    toaster.push(<Message type="success" closable duration={3000}>✅ {labels[action] || "Action taken"}</Message>);
  };

  const getReasonColor = (reason) => {
    const map = { Spam: "orange", Harassment: "red", Misinformation: "violet", Inappropriate: "red" };
    return map[reason] || "blue";
  };

  const pending = reports.filter((r) => r.status === "pending");
  const resolved = reports.filter((r) => r.status !== "pending");

  return (
    <div>
      <h6 style={{ fontWeight: 700, marginBottom: "12px" }}>🚩 Pending Reports ({pending.length})</h6>
      {pending.length === 0 ? (
        <div className="text-center p-5 text-muted">
          <div style={{ fontSize: "40px" }}>✅</div>
          <h6>All reports have been reviewed!</h6>
        </div>
      ) : (
        <div className="d-flex flex-column" style={{ gap: "10px" }}>
          {pending.map((rpt) => (
            <div key={rpt.id} className="modern-card" style={{ padding: "14px" }}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <div className="d-flex align-items-center gap-2" style={{ gap: "6px" }}>
                    <Tag color={getReasonColor(rpt.reason)} size="sm">{rpt.reason}</Tag>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>in #{rpt.channel}</span>
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                    Reported by: {rpt.reportedBy} • User: {rpt.reportedUser}
                  </div>
                </div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  {new Date(rpt.timestamp).toLocaleDateString()}
                </span>
              </div>

              <div style={{ padding: "10px 12px", background: "var(--bg-surface-subtle)", borderRadius: "8px", fontSize: "13px", color: "var(--text-primary)", borderLeft: "3px solid #ef4444", marginBottom: "12px" }}>
                "{rpt.messageText}"
              </div>

              <div className="d-flex gap-2" style={{ gap: "8px" }}>
                <Button size="sm" color="green" appearance="primary" onClick={() => handleAction(rpt.id, "resolved")} style={{ fontWeight: 600 }}>
                  ✓ Dismiss
                </Button>
                <Button size="sm" color="orange" appearance="ghost" onClick={() => handleAction(rpt.id, "warned")} style={{ fontWeight: 600 }}>
                  ⚠️ Warn User
                </Button>
                <Button size="sm" color="red" appearance="ghost" onClick={() => handleAction(rpt.id, "deleted")} style={{ fontWeight: 600 }}>
                  🗑️ Delete & Warn
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {resolved.length > 0 && (
        <div style={{ marginTop: "24px" }}>
          <h6 style={{ fontWeight: 700, marginBottom: "12px", color: "var(--text-muted)" }}>✅ Resolved ({resolved.length})</h6>
          {resolved.map((rpt) => (
            <div key={rpt.id} style={{ padding: "8px 12px", borderRadius: "6px", background: "var(--bg-surface-subtle)", marginBottom: "6px", opacity: 0.6, fontSize: "13px" }}>
              <span style={{ fontWeight: 600 }}>{rpt.reason}</span> — "{rpt.messageText.slice(0, 50)}..." <Tag size="sm" color="green">{rpt.status}</Tag>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModerationQueue;
