import React, { useState, useEffect } from "react";
import { Input, InputGroup, Tag, Loader } from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import { supabase } from "../../misc/supabaseClient";

const getBadgeColor = (role) => {
  if (role === "Faculty") return "orange";
  if (role === "Teaching Assistant") return "cyan";
  if (role === "Admin") return "red";
  if (role === "Club Coordinator") return "violet";
  return "blue";
};

const UserManagementTable = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRealUsers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          const realUsers = data.filter(
            (u) => !u.id?.startsWith("peer-") && !u.id?.startsWith("demo-")
          );
          setUsers(realUsers);
        }
      } catch (err) {
        console.error("Error loading real campus users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRealUsers();
  }, []);

  const filtered = users.filter((u) => {
    const term = search.toLowerCase();
    return (
      !term.trim() ||
      (u.name || "").toLowerCase().includes(term) ||
      (u.email || "").toLowerCase().includes(term) ||
      (u.department || "").toLowerCase().includes(term) ||
      (u.roll_no || "").toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <InputGroup inside style={{ marginBottom: "16px" }}>
        <InputGroup.Addon>
          <SearchIcon />
        </InputGroup.Addon>
        <Input
          placeholder="Search registered members by name, email, or roll no..."
          value={search}
          onChange={setSearch}
        />
      </InputGroup>

      {loading ? (
        <div style={{ padding: "40px 0", textAlign: "center" }}>
          <Loader content="Loading registered campus members..." />
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            padding: "40px 20px",
            textAlign: "center",
            background: "var(--surface-sunken)",
            borderRadius: "var(--radius-md)",
            color: "var(--text-secondary)",
          }}
        >
          <h6>No registered members found</h6>
          <p style={{ fontSize: "13px", marginTop: "6px" }}>
            Real students and faculty will appear here as they register with their university credentials.
          </p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border-subtle)", textAlign: "left" }}>
                <th style={{ padding: "10px 12px", fontWeight: 700, color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase" }}>Name</th>
                <th style={{ padding: "10px 12px", fontWeight: 700, color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase" }}>Roll No</th>
                <th style={{ padding: "10px 12px", fontWeight: 700, color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase" }}>Email</th>
                <th style={{ padding: "10px 12px", fontWeight: 700, color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase" }}>Department</th>
                <th style={{ padding: "10px 12px", fontWeight: 700, color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase" }}>Role</th>
                <th style={{ padding: "10px 12px", fontWeight: 700, color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 600 }}>{user.name}</td>
                  <td style={{ padding: "10px 12px", color: "var(--text-secondary)" }}>{user.roll_no || "—"}</td>
                  <td style={{ padding: "10px 12px", color: "var(--text-secondary)" }}>{user.email}</td>
                  <td style={{ padding: "10px 12px" }}>{user.department || "General"}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <Tag size="sm" color={getBadgeColor(user.role)}>
                      {user.role || "Student"}
                    </Tag>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <Tag size="sm" color={user.status === "online" ? "green" : "blue"}>
                      {user.status || "Registered"}
                    </Tag>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagementTable;
