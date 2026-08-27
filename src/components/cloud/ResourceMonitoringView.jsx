import React from "react";
import { Progress, Tag } from "rsuite";

const METRICS = [
  { name: "Global API Latency (p99)", value: "48ms", status: "Optimal", color: "#10b981", percent: 25 },
  { name: "PostgreSQL Connection Pool", value: "42 / 100", status: "Healthy", color: "#2563eb", percent: 42 },
  { name: "Realtime WebSocket Bandwidth", value: "3.4 MB/s", status: "Normal", color: "#8b5cf6", percent: 35 },
  { name: "Supabase Storage Bucket Egress", value: "18.2 GB/day", status: "Normal", color: "#f59e0b", percent: 48 },
  { name: "Edge Function Invocations", value: "184,200 reqs", status: "High Traffic", color: "#10b981", percent: 72 },
  { name: "Cache Hit Ratio (Cloudflare CDN)", value: "94.2%", status: "Excellent", color: "#10b981", percent: 94 },
];

const ResourceMonitoringView = () => {
  return (
    <div>
      <div className="mb-4">
        <h5 style={{ margin: 0, fontWeight: 700 }}>📊 Live Cloud Resource & Telemetry Monitoring</h5>
        <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>
          Real-time metrics, telemetry alarms, and distributed tracing across the infrastructure stack.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px", marginBottom: "20px" }}>
        {METRICS.map((m) => (
          <div key={m.name} className="modern-card" style={{ padding: "16px" }}>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <strong style={{ fontSize: "13px" }}>{m.name}</strong>
              <Tag size="sm" color={m.percent > 80 ? "red" : m.percent > 60 ? "orange" : "green"}>{m.status}</Tag>
            </div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: m.color, margin: "6px 0" }}>{m.value}</div>
            <Progress.Line percent={m.percent} strokeColor={m.color} />
          </div>
        ))}
      </div>

      <div className="modern-card">
        <h6 style={{ fontWeight: 700, marginBottom: "12px" }}>📋 Infrastructure Telemetry & Alarms</h6>
        {[
          { time: "10:14 AM", level: "INFO", message: "Edge Function scale-up triggered (5 instances provisioned)" },
          { time: "09:45 AM", level: "SUCCESS", message: "Database automated snapshot completed (2.4 GB)" },
          { time: "08:30 AM", level: "INFO", message: "Daily CDN cache purge completed" },
          { time: "06:12 AM", level: "WARN", message: "Temporary latency spike detected in Region ap-south-1 (Resolved)" },
        ].map((log, idx) => (
          <div key={idx} className="d-flex align-items-center justify-content-between py-2" style={{ borderBottom: idx < 3 ? "1px solid var(--border-subtle)" : "none", fontSize: "12px" }}>
            <div className="d-flex align-items-center gap-2">
              <Tag size="sm" color={log.level === "SUCCESS" ? "green" : log.level === "WARN" ? "orange" : "blue"}>{log.level}</Tag>
              <span>{log.message}</span>
            </div>
            <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>{log.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceMonitoringView;
