import React, { useState } from "react";
import { Tag } from "rsuite";

const LAYERS = [
  {
    id: "saas",
    label: "SaaS — Software as a Service",
    icon: "📱",
    color: "#10b981",
    description: "End-user applications: CampusConnect Chat, AI Study Tools, Event Portals",
    components: ["Chat Interface", "AI Assistant", "Study Platform", "Admin Dashboard"],
    examples: "Google Workspace, Salesforce, Slack",
    detail: "Users consume fully managed applications over the internet without worrying about infrastructure or platform layers.",
  },
  {
    id: "paas",
    label: "PaaS — Platform as a Service",
    icon: "⚙️",
    color: "#2563eb",
    description: "Runtime & middleware: Supabase Realtime, Firebase Auth, Serverless Functions",
    components: ["Supabase (DB + Realtime)", "Firebase Auth", "Edge Functions", "PostgREST API"],
    examples: "Heroku, Google App Engine, AWS Elastic Beanstalk",
    detail: "Developers deploy code without managing servers. The platform handles OS patching, scaling, and runtime configuration.",
  },
  {
    id: "iaas",
    label: "IaaS — Infrastructure as a Service",
    icon: "🖥️",
    color: "#8b5cf6",
    description: "Virtual machines, storage, networking — the foundation layer",
    components: ["Virtual Machines (EC2/GCE)", "Block Storage (S3/GCS)", "VPC & Load Balancers", "CDN & DNS"],
    examples: "AWS EC2, Google Compute Engine, Azure VMs",
    detail: "Organizations rent virtual compute, storage, and networking resources on-demand, paying only for what they use.",
  },
  {
    id: "physical",
    label: "Physical Infrastructure",
    icon: "🏭",
    color: "#64748b",
    description: "Data centers, servers, switches, racks — managed by cloud providers",
    components: ["Physical Servers", "Network Switches", "Cooling Systems", "Power & UPS"],
    examples: "Google Data Centers, AWS Regions, Azure Zones",
    detail: "The physical layer is fully managed by cloud providers, hidden from end users and developers alike.",
  },
];

const CloudArchitectureDiagram = () => {
  const [selectedLayer, setSelectedLayer] = useState(LAYERS[0]);
  const [hoveredLayer, setHoveredLayer] = useState(null);

  return (
    <div>
      <h5 style={{ fontWeight: 700, marginBottom: "16px" }}>🏗️ Cloud Service Model Stack (CampusConnect Cloud)</h5>

      {/* Interactive Stack Diagram */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginBottom: "24px" }}>
        {LAYERS.map((layer, i) => (
          <div
            key={layer.id}
            onClick={() => setSelectedLayer(layer)}
            onMouseEnter={() => setHoveredLayer(layer.id)}
            onMouseLeave={() => setHoveredLayer(null)}
            style={{
              padding: "16px 20px",
              borderRadius: i === 0 ? "12px 12px 2px 2px" : i === LAYERS.length - 1 ? "2px 2px 12px 12px" : "2px",
              background: selectedLayer?.id === layer.id
                ? `${layer.color}18`
                : hoveredLayer === layer.id
                  ? `${layer.color}0a`
                  : "var(--bg-surface)",
              border: selectedLayer?.id === layer.id ? `2px solid ${layer.color}` : "1px solid var(--border-subtle)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              transform: hoveredLayer === layer.id ? "scale(1.01)" : "scale(1)",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-3" style={{ gap: "10px" }}>
                <span style={{ fontSize: "24px" }}>{layer.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: layer.color }}>{layer.label}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>{layer.description}</div>
                </div>
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", fontStyle: "italic" }}>
                {layer.examples}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Layer Detail */}
      {selectedLayer && (
        <div className="modern-card" style={{ padding: "20px", borderLeft: `4px solid ${selectedLayer.color}` }}>
          <div className="d-flex align-items-center gap-3 mb-3" style={{ gap: "10px" }}>
            <span style={{ fontSize: "28px" }}>{selectedLayer.icon}</span>
            <h5 style={{ margin: 0, fontWeight: 800, color: selectedLayer.color }}>{selectedLayer.label}</h5>
          </div>
          <p style={{ fontSize: "14px", lineHeight: 1.6, color: "var(--text-secondary)", marginBottom: "16px" }}>
            {selectedLayer.detail}
          </p>

          <div style={{ marginBottom: "16px" }}>
            <h6 style={{ fontWeight: 700, fontSize: "13px", marginBottom: "8px" }}>
              Components in CampusConnect Cloud:
            </h6>
            <div className="d-flex flex-wrap gap-2" style={{ gap: "6px" }}>
              {selectedLayer.components.map((c) => (
                <Tag key={c} color={selectedLayer.color === "#10b981" ? "green" : selectedLayer.color === "#2563eb" ? "blue" : selectedLayer.color === "#8b5cf6" ? "violet" : "cyan"} size="sm">
                  {c}
                </Tag>
              ))}
            </div>
          </div>

          <div>
            <h6 style={{ fontWeight: 700, fontSize: "13px", marginBottom: "8px" }}>
              Industry Examples:
            </h6>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{selectedLayer.examples}</div>
          </div>
        </div>
      )}

      {/* Data Flow Arrows */}
      <div className="modern-card mt-4" style={{ padding: "16px", textAlign: "center" }}>
        <h6 style={{ fontWeight: 700, marginBottom: "8px" }}>🔄 Data Flow in CampusConnect Cloud</h6>
        <div style={{ fontSize: "13px", lineHeight: 2.2, color: "var(--text-secondary)" }}>
          <div>📱 <strong>User (Browser)</strong> → 🌐 CDN/DNS → ⚖️ Load Balancer</div>
          <div>→ ⚙️ Edge Functions (Auth, API) → 🗄️ Supabase PostgreSQL + Realtime</div>
          <div>→ 💾 Storage Buckets → 📡 WebSocket Subscriptions → 📱 <strong>User</strong></div>
        </div>
      </div>
    </div>
  );
};

export default CloudArchitectureDiagram;
