import React, { useState } from "react";
import { Nav, Tag } from "rsuite";
import CloudArchitectureDiagram from "./CloudArchitectureDiagram";
import VirtualizationSimulator from "./VirtualizationSimulator";
import ScalabilitySimulator from "./ScalabilitySimulator";
import LoadBalancerSimulator from "./LoadBalancerSimulator";
import ResourceMonitoringView from "./ResourceMonitoringView";
import CloudSecurityView from "./CloudSecurityView";

const CloudHub = () => {
  const [activeTab, setActiveTab] = useState("architecture");

  return (
    <div className="h-100 custom-scroll" style={{ overflowY: "auto", padding: "20px 24px 80px 24px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap" style={{ gap: "12px" }}>
        <div>
          <h4 style={{ margin: 0, fontWeight: 800 }}>☁️ Cloud Architecture & Simulation Hub</h4>
          <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>
            Interactive cloud computing simulations demonstrating IaaS, PaaS, SaaS, virtualization, auto-scaling, load balancing, and distributed systems concepts.
          </p>
        </div>
        <Tag color="violet" size="sm">Cloud Computing Lab</Tag>
      </div>

      <Nav appearance="subtle" activeKey={activeTab} onSelect={setActiveTab} style={{ marginBottom: "20px", borderBottom: "1px solid var(--border-subtle)", overflowX: "auto" }}>
        <Nav.Item eventKey="architecture" style={{ fontWeight: 600 }}>🏗️ Architecture</Nav.Item>
        <Nav.Item eventKey="virtualization" style={{ fontWeight: 600 }}>🖥️ Virtualization</Nav.Item>
        <Nav.Item eventKey="scalability" style={{ fontWeight: 600 }}>📈 Auto-Scaling</Nav.Item>
        <Nav.Item eventKey="loadbalancer" style={{ fontWeight: 600 }}>⚖️ Load Balancer</Nav.Item>
        <Nav.Item eventKey="monitoring" style={{ fontWeight: 600 }}>📊 Monitoring</Nav.Item>
        <Nav.Item eventKey="security" style={{ fontWeight: 600 }}>🔒 Security</Nav.Item>
      </Nav>

      {activeTab === "architecture" && <CloudArchitectureDiagram />}
      {activeTab === "virtualization" && <VirtualizationSimulator />}
      {activeTab === "scalability" && <ScalabilitySimulator />}
      {activeTab === "loadbalancer" && <LoadBalancerSimulator />}
      {activeTab === "monitoring" && <ResourceMonitoringView />}
      {activeTab === "security" && <CloudSecurityView />}
    </div>
  );
};

export default CloudHub;
