import React, { useState } from "react";
import { Button, Tag, Progress, SelectPicker } from "rsuite";

const ALGORITHMS = [
  { label: "Round Robin (Sequential Dispatch)", value: "round-robin" },
  { label: "Least Connections (Dynamic Load)", value: "least-conn" },
  { label: "IP Hash (Sticky Session Affinity)", value: "ip-hash" },
  { label: "Weighted Round Robin", value: "weighted" },
];

const INITIAL_SERVERS = [
  { id: "srv-1", name: "Backend Server A (US-East)", ip: "10.0.1.101", weight: 3, activeConn: 14, healthy: true, handledReqs: 1420 },
  { id: "srv-2", name: "Backend Server B (US-East)", ip: "10.0.1.102", weight: 2, activeConn: 8, healthy: true, handledReqs: 980 },
  { id: "srv-3", name: "Backend Server C (US-West)", ip: "10.0.2.201", weight: 1, activeConn: 24, healthy: true, handledReqs: 640 },
  { id: "srv-4", name: "Backend Server D (Backup)", ip: "10.0.2.202", weight: 1, activeConn: 0, healthy: false, handledReqs: 110 },
];

const LoadBalancerSimulator = () => {
  const [algorithm, setAlgorithm] = useState("round-robin");
  const [servers, setServers] = useState(INITIAL_SERVERS);
  const [lastDispatched, setLastDispatched] = useState(null);
  const [totalRequests, setTotalRequests] = useState(3150);

  const toggleHealth = (id) => {
    setServers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, healthy: !s.healthy, activeConn: !s.healthy ? 5 : 0 } : s))
    );
  };

  const handleSendRequest = () => {
    const activeHealthy = servers.filter((s) => s.healthy);
    if (activeHealthy.length === 0) {
      alert("503 Service Unavailable: No healthy backend nodes in pool!");
      return;
    }

    let chosenServer = activeHealthy[0];

    if (algorithm === "round-robin") {
      const lastIdx = activeHealthy.findIndex((s) => s.id === lastDispatched);
      const nextIdx = (lastIdx + 1) % activeHealthy.length;
      chosenServer = activeHealthy[nextIdx];
    } else if (algorithm === "least-conn") {
      chosenServer = [...activeHealthy].sort((a, b) => a.activeConn - b.activeConn)[0];
    } else if (algorithm === "ip-hash") {
      chosenServer = activeHealthy[Math.floor(Math.random() * activeHealthy.length)];
    } else if (algorithm === "weighted") {
      chosenServer = [...activeHealthy].sort((a, b) => b.weight - a.weight)[0];
    }

    setLastDispatched(chosenServer.id);
    setTotalRequests((prev) => prev + 1);

    setServers((prev) =>
      prev.map((s) =>
        s.id === chosenServer.id
          ? { ...s, activeConn: s.activeConn + 1, handledReqs: s.handledReqs + 1 }
          : s
      )
    );
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap" style={{ gap: "10px" }}>
        <div>
          <h5 style={{ margin: 0, fontWeight: 700 }}>⚖️ Application Load Balancer (ALB) Simulator</h5>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>
            Explore Layer 7 distribution policies, health check heartbeats, and circuit breaking.
          </p>
        </div>
        <div style={{ width: 280 }}>
          <SelectPicker
            data={ALGORITHMS}
            value={algorithm}
            onChange={setAlgorithm}
            cleanable={false}
            searchable={false}
            block
          />
        </div>
      </div>

      {/* Dispatch Control */}
      <div className="modern-card mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <strong style={{ fontSize: "13px" }}>🔀 Dispatch Ingress HTTP/WebSocket Requests</strong>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
              Total Dispatched: {totalRequests.toLocaleString()} reqs • Selected Algorithm: <strong>{algorithm}</strong>
            </div>
          </div>
          <div className="d-flex gap-2">
            <Button color="blue" appearance="primary" size="sm" onClick={handleSendRequest} style={{ fontWeight: 600 }}>
              ⚡ Send 1 Request
            </Button>
            <Button
              color="cyan"
              appearance="ghost"
              size="sm"
              onClick={() => {
                for (let i = 0; i < 10; i++) handleSendRequest();
              }}
              style={{ fontWeight: 600 }}
            >
              🚀 Burst 10 Reqs
            </Button>
          </div>
        </div>
      </div>

      {/* Server Pool */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
        {servers.map((srv) => {
          const isTarget = lastDispatched === srv.id;
          return (
            <div
              key={srv.id}
              className="modern-card"
              style={{
                padding: "16px",
                borderLeft: srv.healthy ? "4px solid #10b981" : "4px solid #ef4444",
                transform: isTarget ? "scale(1.02)" : "scale(1)",
                boxShadow: isTarget ? "0 0 0 2px var(--brand-primary)" : "var(--shadow-sm)",
                transition: "all 0.2s ease",
              }}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <strong style={{ fontSize: "13px" }}>{srv.name}</strong>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{srv.ip}</div>
                </div>
                <Tag color={srv.healthy ? "green" : "red"} size="sm">
                  {srv.healthy ? "● Healthy" : "✕ Unhealthy"}
                </Tag>
              </div>

              <div className="d-flex gap-2 my-2 flex-wrap" style={{ gap: "6px", fontSize: "11px" }}>
                <Tag size="sm">Weight: {srv.weight}</Tag>
                <Tag size="sm" color="blue">Active: {srv.activeConn} conn</Tag>
                <Tag size="sm">Total: {srv.handledReqs}</Tag>
              </div>

              <div style={{ margin: "8px 0" }}>
                <div style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "2px" }}>
                  Active Connection Pressure
                </div>
                <Progress.Line percent={Math.min(100, srv.activeConn * 4)} strokeColor={srv.healthy ? "#2563eb" : "#ef4444"} />
              </div>

              <div className="d-flex justify-content-between mt-2 pt-2" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                <Button
                  size="xs"
                  appearance="ghost"
                  color={srv.healthy ? "red" : "green"}
                  onClick={() => toggleHealth(srv.id)}
                >
                  {srv.healthy ? "Simulate Failure" : "Restore Health"}
                </Button>
                {isTarget && <Tag color="cyan" size="sm">⚡ Last Dispatched</Tag>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoadBalancerSimulator;
