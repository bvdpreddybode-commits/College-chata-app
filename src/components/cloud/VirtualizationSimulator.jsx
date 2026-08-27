import React, { useState } from "react";
import { Button, Tag, Progress, Input, Slider } from "rsuite";

const INITIAL_VMS = [
  { id: "vm-1", name: "VM-Web-Prod-01", os: "Ubuntu 22.04 LTS", vCpu: 2, ramGb: 4, diskGb: 40, status: "running", cpuUsage: 42, ramUsage: 65, ip: "192.168.1.10" },
  { id: "vm-2", name: "VM-DB-Primary", os: "Debian 12", vCpu: 4, ramGb: 8, diskGb: 100, status: "running", cpuUsage: 78, ramUsage: 82, ip: "192.168.1.20" },
  { id: "vm-3", name: "VM-AI-Inference", os: "Ubuntu 22.04 (GPU)", vCpu: 8, ramGb: 16, diskGb: 120, status: "stopped", cpuUsage: 0, ramUsage: 0, ip: "192.168.1.30" },
  { id: "vm-4", name: "VM-Redis-Cache", os: "Alpine Linux", vCpu: 1, ramGb: 2, diskGb: 20, status: "running", cpuUsage: 15, ramUsage: 35, ip: "192.168.1.40" },
];

const HOST_TOTAL = { vCpu: 32, ramGb: 64, diskGb: 1000 };

const VirtualizationSimulator = () => {
  const [hypervisorType, setHypervisorType] = useState("Type-1");
  const [vms, setVms] = useState(INITIAL_VMS);
  const [newVmName, setNewVmName] = useState("");
  const [newVmCpu, setNewVmCpu] = useState(2);
  const [newVmRam, setNewVmRam] = useState(4);
  const [newVmOs, setNewVmOs] = useState("Ubuntu 22.04");

  const runningVms = vms.filter((v) => v.status === "running");
  const usedCpu = runningVms.reduce((sum, v) => sum + v.vCpu, 0);
  const usedRam = runningVms.reduce((sum, v) => sum + v.ramGb, 0);
  const usedDisk = vms.reduce((sum, v) => sum + v.diskGb, 0);

  const toggleVm = (id) => {
    setVms((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          const nextStatus = v.status === "running" ? "stopped" : "running";
          return {
            ...v,
            status: nextStatus,
            cpuUsage: nextStatus === "running" ? Math.floor(Math.random() * 40 + 20) : 0,
            ramUsage: nextStatus === "running" ? Math.floor(Math.random() * 40 + 30) : 0,
          };
        }
        return v;
      })
    );
  };

  const handleCreateVm = () => {
    if (!newVmName.trim()) return;
    const newVm = {
      id: "vm-" + Date.now(),
      name: newVmName.trim(),
      os: newVmOs,
      vCpu: newVmCpu,
      ramGb: newVmRam,
      diskGb: 30,
      status: "running",
      cpuUsage: Math.floor(Math.random() * 30 + 15),
      ramUsage: Math.floor(Math.random() * 30 + 25),
      ip: `192.168.1.${Math.floor(Math.random() * 150 + 50)}`,
    };
    setVms((prev) => [...prev, newVm]);
    setNewVmName("");
  };

  const handleDeleteVm = (id) => {
    setVms((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap" style={{ gap: "10px" }}>
        <div>
          <h5 style={{ margin: 0, fontWeight: 700 }}>🖥️ Hypervisor & Virtualization Laboratory</h5>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>
            Simulate bare-metal (Type-1) vs hosted (Type-2) hypervisor resource provisioning and multi-tenancy.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button
            size="sm"
            appearance={hypervisorType === "Type-1" ? "primary" : "subtle"}
            color="blue"
            onClick={() => setHypervisorType("Type-1")}
          >
            Type-1 (Bare Metal / ESXi / KVM)
          </Button>
          <Button
            size="sm"
            appearance={hypervisorType === "Type-2" ? "primary" : "subtle"}
            color="violet"
            onClick={() => setHypervisorType("Type-2")}
          >
            Type-2 (Hosted / VirtualBox)
          </Button>
        </div>
      </div>

      {/* Host Physical Hardware Pool */}
      <div className="modern-card mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <strong style={{ fontSize: "13px" }}>🏢 Physical Host Resource Allocation ({hypervisorType} Hypervisor)</strong>
          <Tag color={hypervisorType === "Type-1" ? "green" : "violet"}>
            {hypervisorType === "Type-1" ? "Direct Hardware Access • 99.2% Efficiency" : "Host OS Layer • 88.5% Efficiency"}
          </Tag>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          <div>
            <div className="d-flex justify-content-between" style={{ fontSize: "12px", marginBottom: "4px" }}>
              <span>vCPU Cores</span>
              <strong>{usedCpu} / {HOST_TOTAL.vCpu} Cores</strong>
            </div>
            <Progress.Line percent={Math.round((usedCpu / HOST_TOTAL.vCpu) * 100)} strokeColor="#2563eb" />
          </div>
          <div>
            <div className="d-flex justify-content-between" style={{ fontSize: "12px", marginBottom: "4px" }}>
              <span>RAM Pool</span>
              <strong>{usedRam} / {HOST_TOTAL.ramGb} GB</strong>
            </div>
            <Progress.Line percent={Math.round((usedRam / HOST_TOTAL.ramGb) * 100)} strokeColor="#10b981" />
          </div>
          <div>
            <div className="d-flex justify-content-between" style={{ fontSize: "12px", marginBottom: "4px" }}>
              <span>Storage SAN</span>
              <strong>{usedDisk} / {HOST_TOTAL.diskGb} GB</strong>
            </div>
            <Progress.Line percent={Math.round((usedDisk / HOST_TOTAL.diskGb) * 100)} strokeColor="#f59e0b" />
          </div>
        </div>
      </div>

      {/* Provision New VM */}
      <div className="modern-card mb-4" style={{ padding: "16px" }}>
        <h6 style={{ fontWeight: 700, marginBottom: "12px" }}>⚡ Provision New Virtual Machine</h6>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", alignItems: "end" }}>
          <div>
            <label style={{ fontSize: "11px", fontWeight: 600, display: "block", marginBottom: "4px" }}>VM Instance Name</label>
            <Input placeholder="e.g. VM-Analytics-02" value={newVmName} onChange={setNewVmName} size="sm" />
          </div>
          <div>
            <label style={{ fontSize: "11px", fontWeight: 600, display: "block", marginBottom: "4px" }}>Guest OS</label>
            <Input value={newVmOs} onChange={setNewVmOs} size="sm" />
          </div>
          <div>
            <label style={{ fontSize: "11px", fontWeight: 600, display: "block", marginBottom: "4px" }}>vCPUs ({newVmCpu})</label>
            <Slider min={1} max={8} value={newVmCpu} onChange={setNewVmCpu} progress />
          </div>
          <div>
            <label style={{ fontSize: "11px", fontWeight: 600, display: "block", marginBottom: "4px" }}>RAM ({newVmRam} GB)</label>
            <Slider min={1} max={16} value={newVmRam} onChange={setNewVmRam} progress />
          </div>
          <div>
            <Button block color="blue" appearance="primary" size="sm" onClick={handleCreateVm} style={{ fontWeight: 600 }}>
              + Launch Instance
            </Button>
          </div>
        </div>
      </div>

      {/* Virtual Machines Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
        {vms.map((vm) => (
          <div key={vm.id} className="modern-card" style={{ padding: "14px", borderLeft: vm.status === "running" ? "4px solid #10b981" : "4px solid #94a3b8" }}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <strong style={{ fontSize: "14px" }}>{vm.name}</strong>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{vm.os} • {vm.ip}</div>
              </div>
              <Tag color={vm.status === "running" ? "green" : "default"} size="sm">
                {vm.status === "running" ? "● Running" : "○ Stopped"}
              </Tag>
            </div>

            <div className="d-flex gap-2 my-2 flex-wrap" style={{ gap: "6px", fontSize: "11px" }}>
              <Tag size="sm">⚡ {vm.vCpu} vCPUs</Tag>
              <Tag size="sm">🧠 {vm.ramGb} GB RAM</Tag>
              <Tag size="sm">💾 {vm.diskGb} GB SSD</Tag>
            </div>

            {vm.status === "running" && (
              <div style={{ margin: "8px 0" }}>
                <div className="d-flex justify-content-between" style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                  <span>CPU: {vm.cpuUsage}%</span>
                  <span>RAM: {vm.ramUsage}%</span>
                </div>
                <Progress.Line percent={vm.cpuUsage} strokeColor={vm.cpuUsage > 75 ? "#ef4444" : "#2563eb"} />
              </div>
            )}

            <div className="d-flex justify-content-between mt-2 pt-2" style={{ borderTop: "1px solid var(--border-subtle)" }}>
              <Button
                size="xs"
                appearance="ghost"
                color={vm.status === "running" ? "orange" : "green"}
                onClick={() => toggleVm(vm.id)}
              >
                {vm.status === "running" ? "⏹ Stop" : "▶ Start"}
              </Button>
              <Button size="xs" appearance="subtle" color="red" onClick={() => handleDeleteVm(vm.id)}>
                🗑️ Terminate
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualizationSimulator;
