import React from "react";
import { Tag } from "rsuite";

const SECURITY_CONTROLS = [
  {
    title: "🔐 Role-Based Access Control (RBAC)",
    status: "Enforced",
    color: "green",
    description: "PostgreSQL Row Level Security (RLS) policies isolate private rooms, direct messages, and faculty-only channels.",
  },
  {
    title: "🛡️ DDoS & WAF Protection",
    status: "Active (Cloudflare)",
    color: "green",
    description: "Layer 3/4/7 DDoS mitigation, TLS 1.3 encryption in-transit, and automated rate limiting.",
  },
  {
    title: "🏛️ Institutional Domain Isolation",
    status: "Strict (@vnrvjiet.in)",
    color: "blue",
    description: "OAuth tokens verified against institutional domain whitelist at profile handshake.",
  },
  {
    title: "🔑 Secret Management & KMS",
    status: "Encrypted (AES-256)",
    color: "green",
    description: "Supabase JWTs, service role keys, and storage objects encrypted at rest.",
  },
  {
    title: "🕵️ Ephemeral Stealth & Presence Privacy",
    status: "User Configurable",
    color: "violet",
    description: "Optional heartbeat suppression prevents broadcast of online status across peer channels.",
  },
];

const CloudSecurityView = () => {
  return (
    <div>
      <div className="mb-4">
        <h5 style={{ margin: 0, fontWeight: 700 }}>🔒 Cloud Security & Compliance Matrix</h5>
        <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>
          Overview of security controls, data encryption standards, and compliance policies in CampusConnect Cloud.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "12px" }}>
        {SECURITY_CONTROLS.map((ctrl) => (
          <div key={ctrl.title} className="modern-card" style={{ padding: "16px" }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <strong style={{ fontSize: "13px" }}>{ctrl.title}</strong>
              <Tag size="sm" color={ctrl.color}>{ctrl.status}</Tag>
            </div>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
              {ctrl.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CloudSecurityView;
