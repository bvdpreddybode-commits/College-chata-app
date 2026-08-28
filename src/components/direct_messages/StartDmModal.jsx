import React, { useState, useEffect, useMemo } from "react";
import { Button, Input, InputGroup, Loader, Modal, Tag } from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import { useHistory } from "react-router-dom";
import { supabase } from "../../misc/supabaseClient";
import { useProfile } from "../../context/profile.context";
import ProfileAvatar from "../ProfileAvatar";

const DEFAULT_CAMPUS_DIRECTORY = [
  { uid: "peer-priya-01", name: "Priya Sharma", email: "priya.s@vnrvjiet.in", department: "Computer Science", rollNo: "21241A0545", batch: "3rd Year", role: "Student", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya", status: "online" },
  { uid: "peer-ravi-02", name: "Ravi Kumar", email: "ravi.k@vnrvjiet.in", department: "Information Technology", rollNo: "21241A1208", batch: "3rd Year", role: "Teaching Assistant", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ravi", status: "online" },
  { uid: "peer-rao-03", name: "Dr. K. V. Rao", email: "kv_rao@vnrvjiet.in", department: "Computer Science", rollNo: "FAC-CSE-012", batch: "Faculty", role: "Faculty", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DrRao", status: "away" },
  { uid: "peer-sneha-04", name: "Sneha Reddy", email: "sneha.r@vnrvjiet.in", department: "Electronics & Communication", rollNo: "22241A0419", batch: "2nd Year", role: "Student", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha", status: "online" },
  { uid: "peer-arjun-05", name: "Arjun Patel", email: "arjun.p@vnrvjiet.in", department: "Computer Science", rollNo: "21241A0512", batch: "3rd Year", role: "Student", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun", status: "online" },
  { uid: "peer-meera-06", name: "Meera Joshi", email: "meera.j@vnrvjiet.in", department: "Mechanical Engineering", rollNo: "22241A0318", batch: "2nd Year", role: "Student", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meera", status: "offline" },
  { uid: "peer-vikram-07", name: "Vikram Singh", email: "vikram.s@vnrvjiet.in", department: "Information Technology", rollNo: "21241A1245", batch: "3rd Year", role: "Student", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram", status: "online" },
  { uid: "peer-ananya-08", name: "Ananya Rao", email: "ananya.r@vnrvjiet.in", department: "Computer Science", rollNo: "22241A0501", batch: "2nd Year", role: "Student", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya", status: "away" },
];

const STATUS_CONFIG = {
  online: { color: "#10b981", label: "Online", dot: "●" },
  away: { color: "#f59e0b", label: "Away", dot: "●" },
  offline: { color: "#94a3b8", label: "Offline", dot: "○" },
};

const StartDmModal = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const history = useHistory();
  const { profile } = useProfile();

  useEffect(() => {
    if (!isOpen) return;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const currentUid = profile?.uid || profile?.id;
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .neq("id", currentUid || "none")
          .limit(50);

        if (error) throw error;

        let formatted = (data || []).map((u) => ({
          uid: u.id,
          name: u.name,
          email: u.email,
          avatar: u.avatar,
          rollNo: u.roll_no,
          department: u.department,
          batch: u.batch,
          role: u.role,
          status: ["online", "away", "offline"][Math.floor(Math.random() * 3)],
        }));

        if (formatted.length === 0) {
          formatted = DEFAULT_CAMPUS_DIRECTORY.filter((u) => u.uid !== currentUid);
        }

        setUsers(formatted);
      } catch (err) {
        console.error("Error fetching campus users:", err);
        const currentUid = profile?.uid || profile?.id;
        setUsers(DEFAULT_CAMPUS_DIRECTORY.filter((u) => u.uid !== currentUid));
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    setSearch("");
    setSelectedFilter("all");
  }, [isOpen, profile]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const term = search.toLowerCase();
      const textMatch =
        (u.name || "").toLowerCase().includes(term) ||
        (u.department || "").toLowerCase().includes(term) ||
        (u.rollNo || "").toLowerCase().includes(term) ||
        (u.role || "").toLowerCase().includes(term);

      if (!textMatch) return false;

      if (selectedFilter === "online") return u.status === "online";
      if (selectedFilter === "students") return u.role === "Student";
      if (selectedFilter === "faculty") return u.role === "Faculty" || u.role === "Teaching Assistant";
      return true;
    });
  }, [users, search, selectedFilter]);

  const onlineCount = users.filter((u) => u.status === "online").length;

  const onSelectUser = async (targetUser) => {
    const currentUid = profile?.uid || profile?.id;
    if (!currentUid) return;

    const peerUid = targetUser.uid;
    const dmId = ["dm", currentUid, peerUid].sort().join("_");

    try {
      const { data: existingRoom } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", dmId)
        .single();

      if (!existingRoom) {
        await supabase.from("rooms").insert({
          id: dmId,
          name: `${targetUser.name} & ${profile?.name || "Peer"}`,
          description: "Private 1-on-1 Direct Message",
          created_at: new Date().toISOString(),
          created_by: currentUid,
          is_dm: true,
          type: "dm",
          isPrivate: true,
          members: [currentUid, peerUid],
          admins: { [currentUid]: true, [peerUid]: true },
        });
      }

      onClose();
      history.push(`/chat/${dmId}`);
    } catch (err) {
      console.error("Error starting direct message:", err);
      onClose();
      history.push(`/chat/${dmId}`);
    }
  };

  const filters = [
    { key: "all", label: `All (${users.length})` },
    { key: "online", label: `Online (${onlineCount})` },
    { key: "students", label: "Students" },
    { key: "faculty", label: "Faculty" },
  ];

  return (
    <Modal open={isOpen} onClose={onClose} size="sm">
      <Modal.Header>
        <Modal.Title style={{ fontWeight: 800, fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span>💬</span> Start Private Conversation
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "12px 20px" }}>
        {/* Search */}
        <InputGroup
          inside
          style={{
            marginBottom: 12,
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
            overflow: "hidden",
          }}
        >
          <Input
            placeholder="Search by name, roll no, department…"
            value={search}
            onChange={setSearch}
            style={{ fontSize: "13px" }}
          />
          <InputGroup.Addon>
            <SearchIcon />
          </InputGroup.Addon>
        </InputGroup>

        {/* Filter Chips */}
        <div className="d-flex gap-2 mb-2" style={{ gap: "6px", flexWrap: "wrap" }}>
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setSelectedFilter(f.key)}
              style={{
                padding: "4px 12px",
                border: selectedFilter === f.key ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                borderRadius: "var(--radius-full)",
                background: selectedFilter === f.key ? "var(--primary-light)" : "var(--surface-elevated)",
                color: selectedFilter === f.key ? "var(--primary)" : "var(--text-secondary)",
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all var(--transition-fast)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* User List */}
        {loading && <Loader center content="Searching campus directory…" style={{ padding: "30px 0" }} />}

        {!loading && filteredUsers.length === 0 && (
          <div style={{ textAlign: "center", padding: "30px 0", color: "var(--text-muted)" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>🔍</div>
            <p style={{ fontSize: "13px" }}>
              {search ? "No students match your search." : "No campus members found."}
            </p>
          </div>
        )}

        {!loading && filteredUsers.length > 0 && (
          <div className="custom-scroll" style={{ maxHeight: "360px", overflowY: "auto" }}>
            {filteredUsers.map((u) => {
              const statusCfg = STATUS_CONFIG[u.status] || STATUS_CONFIG.offline;
              return (
                <div
                  key={u.uid}
                  className="dm-peer-card"
                  onClick={() => onSelectUser(u)}
                  style={{ marginBottom: "4px" }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center" style={{ gap: "12px" }}>
                      <div className="dm-peer-avatar-wrap">
                        <ProfileAvatar
                          src={u.avatar}
                          name={u.name || "Student"}
                          size="sm"
                        />
                        {u.status === "online" && <div className="dm-online-dot" />}
                      </div>

                      <div>
                        <div style={{ fontWeight: 600, fontSize: "13px", color: "var(--text-primary)" }}>
                          {u.name}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                          <span>{u.department || "General"}</span>
                          {u.rollNo && (
                            <>
                              <span style={{ color: "var(--border)" }}>•</span>
                              <span>{u.rollNo}</span>
                            </>
                          )}
                        </div>
                        <div style={{ fontSize: "10px", color: statusCfg.color, fontWeight: 600, marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <span>{statusCfg.dot}</span>
                          <span>{statusCfg.label}</span>
                          {u.batch && <span style={{ color: "var(--text-muted)" }}>• {u.batch}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="d-flex flex-column align-items-end" style={{ gap: "4px" }}>
                      <Tag
                        size="sm"
                        style={{
                          fontSize: "10px",
                          fontWeight: 600,
                          background: u.role === "Faculty" ? "linear-gradient(135deg, #fef3c7, #fde68a)" :
                                     u.role === "Teaching Assistant" ? "linear-gradient(135deg, #e0f2fe, #bae6fd)" :
                                     "linear-gradient(135deg, #e0e7ff, #c7d2fe)",
                          color: u.role === "Faculty" ? "#92400e" :
                                 u.role === "Teaching Assistant" ? "#0369a1" : "#3730a3",
                          border: "none",
                        }}
                      >
                        {u.role || "Student"}
                      </Tag>
                      <span style={{ fontSize: "10px", color: "var(--primary)", fontWeight: 600, opacity: 0.7 }}>
                        Message →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer style={{ borderTop: "1px solid var(--border-subtle)", padding: "12px 20px" }}>
        <div className="d-flex align-items-center justify-content-between w-100">
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            🔒 All messages are private & encrypted
          </span>
          <Button onClick={onClose} appearance="subtle" style={{ fontWeight: 600 }}>
            Close
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default StartDmModal;
