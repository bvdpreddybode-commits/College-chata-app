import React, { useState, useEffect } from "react";
import { Button, Input, InputGroup, List, Loader, Modal } from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import { useHistory } from "react-router-dom";
import { supabase } from "../../misc/supabaseClient";
import { useProfile } from "../../context/profile.context";
import ProfileAvatar from "../ProfileAvatar";
import PresenceDot from "../PresenceDot";

const DEFAULT_CAMPUS_DIRECTORY = [
  { uid: "peer-priya-01", name: "Priya Sharma", email: "priya.s@vnrvjiet.in", department: "Computer Science", rollNo: "21241A0545", batch: "3rd Year", role: "Student", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" },
  { uid: "peer-ravi-02", name: "Ravi Kumar", email: "ravi.k@vnrvjiet.in", department: "Information Technology", rollNo: "21241A1208", batch: "3rd Year", role: "Teaching Assistant", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ravi" },
  { uid: "peer-rao-03", name: "Dr. K. V. Rao", email: "kv_rao@vnrvjiet.in", department: "Computer Science", rollNo: "FAC-CSE-012", batch: "Faculty", role: "Faculty", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DrRao" },
  { uid: "peer-sneha-04", name: "Sneha Reddy", email: "sneha.r@vnrvjiet.in", department: "Electronics & Communication", rollNo: "22241A0419", batch: "2nd Year", role: "Student", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha" },
];

const StartDmModal = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
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
  }, [isOpen, profile]);

  const filteredUsers = users.filter((u) => {
    const term = search.toLowerCase();
    const nameMatch = (u.name || "").toLowerCase().includes(term);
    const deptMatch = (u.department || "").toLowerCase().includes(term);
    const rollMatch = (u.rollNo || "").toLowerCase().includes(term);
    const roleMatch = (u.role || "").toLowerCase().includes(term);
    return nameMatch || deptMatch || rollMatch || roleMatch;
  });

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

  return (
    <Modal open={isOpen} onClose={onClose} size="sm">
      <Modal.Header>
        <Modal.Title>🔒 Start Private Message (Campus Directory)</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup inside style={{ marginBottom: 15 }}>
          <Input
            placeholder="Search by student name, roll no, department..."
            value={search}
            onChange={setSearch}
          />
          <InputGroup.Addon>
            <SearchIcon />
          </InputGroup.Addon>
        </InputGroup>

        {loading && <Loader center content="Searching campus directory..." />}

        {!loading && filteredUsers.length === 0 && (
          <div className="text-center p-3 text-black-45">
            {search ? "No campus members match your search." : "No other users found in campus directory."}
          </div>
        )}

        {!loading && filteredUsers.length > 0 && (
          <List hover bordered style={{ maxHeight: "350px", overflowY: "auto" }}>
            {filteredUsers.map((u) => (
              <List.Item
                key={u.uid}
                style={{ cursor: "pointer", padding: "10px 14px" }}
                onClick={() => onSelectUser(u)}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <PresenceDot uid={u.uid} />
                    <ProfileAvatar
                      src={u.avatar}
                      name={u.name || "Student"}
                      size="sm"
                      className="ml-2 mr-2"
                    />
                    <div>
                      <div style={{ fontWeight: 600, color: "#1e293b" }}>
                        {u.name}
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>
                        {u.department || "General"} {u.rollNo ? `• ${u.rollNo}` : ""}
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="badge-pill badge-student">
                      {u.role || "Student"}
                    </span>
                  </div>
                </div>
              </List.Item>
            ))}
          </List>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} appearance="subtle">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StartDmModal;
