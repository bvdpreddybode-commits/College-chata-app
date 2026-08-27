import React, { useState } from "react";
import { Input, InputGroup, Tag } from "rsuite";
import SearchIcon from "@rsuite/icons/Search";

const SAMPLE_USERS = [
  { id: "u-1", name: "Ananya Sharma", email: "ananya@vnrvjiet.in", department: "Computer Science", role: "Student", batch: "3rd Year", status: "active", badges: ["Top Contributor"] },
  { id: "u-2", name: "Dr. Anand Rao", email: "anand.rao@vnrvjiet.in", department: "Computer Science", role: "Faculty", batch: "Faculty / Staff", status: "active", badges: ["Verified Faculty"] },
  { id: "u-3", name: "Ravi Kumar", email: "ravi.k@vnrvjiet.in", department: "Information Technology", role: "Teaching Assistant", batch: "4th Year", status: "active", badges: ["Verified TA", "Study Helper"] },
  { id: "u-4", name: "Priya Menon", email: "priya.m@vnrvjiet.in", department: "Electronics & Communication", role: "Student", batch: "2nd Year", status: "active", badges: [] },
  { id: "u-5", name: "Vikram Patel", email: "vikram.p@vnrvjiet.in", department: "Computer Science", role: "Student", batch: "3rd Year", status: "warned", badges: [] },
  { id: "u-6", name: "Kiran Teja", email: "kiran.t@vnrvjiet.in", department: "Mechanical Engineering", role: "Club Coordinator", batch: "4th Year", status: "active", badges: ["Verified Club Lead", "Mentor"] },
];

const getBadgeColor = (badge) => {
  if (badge.includes("Faculty")) return "orange";
  if (badge.includes("TA")) return "cyan";
  if (badge.includes("Club")) return "violet";
  if (badge.includes("Contributor")) return "green";
  if (badge.includes("Helper")) return "blue";
  if (badge.includes("Mentor")) return "yellow";
  return "blue";
};

const UserManagementTable = () => {
  const [search, setSearch] = useState("");

  const filtered = SAMPLE_USERS.filter((u) =>
    !search.trim() || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || u.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <InputGroup inside style={{ marginBottom: "16px" }}>
        <InputGroup.Addon><SearchIcon /></InputGroup.Addon>
        <Input placeholder="Search users by name, email, or department..." value={search} onChange={setSearch} />
      </InputGroup>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--border-subtle)", textAlign: "left" }}>
              <th style={{ padding: "10px 12px", fontWeight: 700, color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase" }}>Name</th>
              <th style={{ padding: "10px 12px", fontWeight: 700, color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase" }}>Email</th>
              <th style={{ padding: "10px 12px", fontWeight: 700, color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase" }}>Department</th>
              <th style={{ padding: "10px 12px", fontWeight: 700, color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase" }}>Role</th>
              <th style={{ padding: "10px 12px", fontWeight: 700, color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase" }}>Badges</th>
              <th style={{ padding: "10px 12px", fontWeight: 700, color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <td style={{ padding: "10px 12px", fontWeight: 600 }}>{user.name}</td>
                <td style={{ padding: "10px 12px", color: "var(--text-secondary)" }}>{user.email}</td>
                <td style={{ padding: "10px 12px" }}>{user.department}</td>
                <td style={{ padding: "10px 12px" }}>
                  <Tag size="sm" color={user.role === "Faculty" ? "orange" : user.role === "Teaching Assistant" ? "cyan" : user.role === "Club Coordinator" ? "violet" : "blue"}>
                    {user.role}
                  </Tag>
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <div className="d-flex flex-wrap gap-1" style={{ gap: "4px" }}>
                    {user.badges.length > 0 ? user.badges.map((b) => <Tag key={b} size="sm" color={getBadgeColor(b)}>{b}</Tag>) : <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>—</span>}
                  </div>
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <Tag size="sm" color={user.status === "active" ? "green" : user.status === "warned" ? "orange" : "red"}>
                    {user.status}
                  </Tag>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementTable;
