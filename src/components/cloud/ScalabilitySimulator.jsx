import React, { useState, useEffect } from "react";
import { Button, Tag, Progress, Slider } from "rsuite";

const ScalabilitySimulator = () => {
  const [scalingMode, setScalingMode] = useState("horizontal"); // "horizontal" | "vertical"
  const [userTraffic, setUserTraffic] = useState(1200); // concurrent users
  const [instances, setInstances] = useState(2);
  const [cpuPerInstance, setCpuPerInstance] = useState(2);
  const [autoScaleEnabled, setAutoScaleEnabled] = useState(true);
  const [costPerHour, setCostPerHour] = useState(0.08);

  // Auto-scaling logic simulation
  useEffect(() => {
    if (autoScaleEnabled && scalingMode === "horizontal") {
      const neededInstances = Math.max(1, Math.min(10, Math.ceil(userTraffic / 800)));
      setInstances(neededInstances);
    }
  }, [userTraffic, autoScaleEnabled, scalingMode]);

  // Cost calculation
  useEffect(() => {
    if (scalingMode === "horizontal") {
      setCostPerHour((instances * 0.04).toFixed(3));
    } else {
      setCostPerHour((cpuPerInstance * 0.035).toFixed(3));
    }
  }, [instances, cpuPerInstance, scalingMode]);

  const loadPerInstance = scalingMode === "horizontal"
    ? Math.min(100, Math.round((userTraffic / (instances * 800)) * 100))
    : Math.min(100, Math.round((userTraffic / (cpuPerInstance * 600)) * 100));

  const isOverloaded = loadPerInstance > 90;
  const isHealthy = loadPerInstance <= 75;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap" style={{ gap: "10px" }}>
        <div>
          <h5 style={{ margin: 0, fontWeight: 700 }}>📈 Elastic Auto-Scaling Simulator</h5>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>
            Compare Horizontal Scaling (Scale Out/In) vs Vertical Scaling (Scale Up/Down) under dynamic traffic.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button
            size="sm"
            appearance={scalingMode === "horizontal" ? "primary" : "subtle"}
            color="blue"
            onClick={() => setScalingMode("horizontal")}
          >
            Horizontal (Scale Out/In)
          </Button>
          <Button
            size="sm"
            appearance={scalingMode === "vertical" ? "primary" : "subtle"}
            color="violet"
            onClick={() => setScalingMode("vertical")}
          >
            Vertical (Scale Up/Down)
          </Button>
        </div>
      </div>

      {/* Traffic Control Panel */}
      <div className="modern-card mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <strong style={{ fontSize: "13px" }}>🌐 Ingress Traffic Simulator</strong>
          <Tag color="cyan" size="md">⚡ {userTraffic} Concurrent Active Users</Tag>
        </div>
        <Slider
          min={100}
          max={8000}
          step={100}
          value={userTraffic}
          onChange={setUserTraffic}
          progress
          style={{ marginBottom: "16px" }}
        />
        <div className="d-flex gap-2 flex-wrap">
          <Button size="xs" appearance="ghost" onClick={() => setUserTraffic(400)}>Low Traffic (400)</Button>
          <Button size="xs" appearance="ghost" onClick={() => setUserTraffic(2400)}>Midday Spike (2,400)</Button>
          <Button size="xs" appearance="ghost" color="red" onClick={() => setUserTraffic(6500)}>Flash Crowd / Exam Results (6,500)</Button>
        </div>
      </div>

      {/* Cluster Metrics */}
      <div className="modern-card mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <strong style={{ fontSize: "13px" }}>📊 Cluster Health & Load Factor</strong>
          <Tag color={isOverloaded ? "red" : isHealthy ? "green" : "orange"}>
            {isOverloaded ? "🔥 High Latency / Overloaded" : isHealthy ? "🟢 Optimal Cluster Health" : "⚠️ Approaching Threshold"}
          </Tag>
        </div>

        <div className="d-flex justify-content-between" style={{ fontSize: "12px", marginBottom: "4px" }}>
          <span>Aggregate Cluster Utilization</span>
          <strong>{loadPerInstance}%</strong>
        </div>
        <Progress.Line
          percent={loadPerInstance}
          strokeColor={isOverloaded ? "#ef4444" : isHealthy ? "#10b981" : "#f59e0b"}
        />

        <div className="d-flex justify-content-between mt-3 pt-2" style={{ borderTop: "1px solid var(--border-subtle)", fontSize: "12px" }}>
          <span>Estimated Compute Cost: <strong>${costPerHour}/hr</strong> (~${(costPerHour * 730).toFixed(2)}/mo)</span>
          <span>Scaling Target Metric: <strong>CPU &gt; 70% for 60s</strong></span>
        </div>
      </div>

      {/* Mode Specific Visualization */}
      {scalingMode === "horizontal" ? (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 style={{ margin: 0, fontWeight: 700 }}>🖥️ Active Node Replicas ({instances} Instances in Auto-Scaling Group)</h6>
            <Button
              size="xs"
              appearance={autoScaleEnabled ? "primary" : "subtle"}
              color="green"
              onClick={() => setAutoScaleEnabled(!autoScaleEnabled)}
            >
              {autoScaleEnabled ? "✓ Auto-Scaling Enabled" : "Manual Override"}
            </Button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
            {Array.from({ length: instances }).map((_, idx) => (
              <div
                key={idx}
                className="modern-card"
                style={{
                  padding: "12px",
                  background: isOverloaded ? "rgba(239, 68, 68, 0.05)" : "var(--bg-surface)",
                  border: isOverloaded ? "1px solid #ef4444" : "1px solid var(--border-subtle)",
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <strong style={{ fontSize: "12px" }}>Pod-{idx + 1} (c6g.large)</strong>
                  <Tag size="sm" color="green">Ready</Tag>
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", margin: "4px 0" }}>
                  Serving ~{Math.round(userTraffic / instances)} users
                </div>
                <Progress.Line percent={loadPerInstance} strokeColor="#2563eb" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="modern-card">
          <h6 style={{ fontWeight: 700, marginBottom: "12px" }}>⚡ Vertical Scale (Resize Instance Hardware)</h6>
          <div style={{ maxWidth: 400 }}>
            <label style={{ fontSize: "12px", display: "block", marginBottom: "4px" }}>
              Assigned CPU Cores: <strong>{cpuPerInstance} vCPUs (Single Large Node)</strong>
            </label>
            <Slider
              min={1}
              max={16}
              value={cpuPerInstance}
              onChange={setCpuPerInstance}
              progress
            />
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "8px" }}>
              ⚠️ Note: Vertical scaling requires a brief downtime / restart window compared to zero-downtime horizontal scaling.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScalabilitySimulator;
