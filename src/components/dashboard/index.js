import React, { useState } from "react";
import { Button, Divider, Drawer, Message, SelectPicker, Toggle, toaster } from "rsuite";
import { useProfile } from "../../context/profile.context";
import { supabase } from "../../misc/supabaseClient";
import EditableInput from "../EditableInput";
import AvatarUploadBtn from "./AvatarUploadBtn";

const DEPARTMENTS = [
  { label: "Computer Science & Engineering", value: "Computer Science" },
  { label: "Information Technology", value: "Information Technology" },
  { label: "Electronics & Communication", value: "Electronics & Communication" },
  { label: "Electrical Engineering", value: "Electrical Engineering" },
  { label: "Mechanical Engineering", value: "Mechanical Engineering" },
  { label: "Civil Engineering", value: "Civil Engineering" },
  { label: "Biotechnology & Bioinformatics", value: "Biotechnology" },
  { label: "Business & Management", value: "Business & Management" },
  { label: "Applied Sciences & Math", value: "Applied Sciences" },
];

const ROLES = [
  { label: "🎓 Student", value: "Student" },
  { label: "👨‍🏫 Faculty / Professor", value: "Faculty" },
  { label: "📘 Teaching Assistant (TA)", value: "Teaching Assistant" },
  { label: "🛡️ Club Coordinator / Lead", value: "Club Coordinator" },
];

const BATCHES = [
  { label: "1st Year", value: "1st Year" },
  { label: "2nd Year", value: "2nd Year" },
  { label: "3rd Year", value: "3rd Year" },
  { label: "4th Year", value: "4th Year" },
  { label: "Postgraduate", value: "Postgraduate" },
  { label: "Faculty / Staff", value: "Faculty / Staff" },
];

const Dashboard = ({ onSignOut }) => {
  const { profile, setProfile } = useProfile();
  const [hidePresence, setHidePresence] = useState(profile?.hidePresence || false);

  const onSave = async (key, newData) => {
    try {
      const uid = profile?.uid || profile?.id;
      if (!uid) return;

      const dbKey = key === "rollNo" ? "roll_no" : key === "hidePresence" ? "hide_presence" : key;

      const { error } = await supabase
        .from("profiles")
        .update({ [dbKey]: newData })
        .eq("id", uid);

      if (error) throw error;

      setProfile((prev) => ({
        ...prev,
        [key]: newData,
      }));

      toaster.push(
        <Message type="success" closable duration={4000}>
          Profile updated successfully
        </Message>
      );
    } catch (error) {
      toaster.push(
        <Message type="error" closable duration={4000}>
          {error.message}
        </Message>
      );
    }
  };

  const togglePresence = async (checked) => {
    setHidePresence(checked);
    await onSave("hidePresence", checked);
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Student / Faculty Dashboard</Drawer.Title>
      </Drawer.Header>

      <Drawer.Body>
        <div style={{ paddingBottom: "30px" }}>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h3 style={{ margin: 0 }}>{profile?.name || "Student"}</h3>
              <span className="badge-pill badge-student" style={{ marginLeft: 0, marginTop: 4 }}>
                {profile?.role || "Student"} • {profile?.department || "Computer Science"}
              </span>
            </div>
          </div>

          <Divider />

          <h5 className="mb-2">🎓 Academic Details</h5>
          
          <EditableInput
            name="name"
            initialValue={profile?.name}
            onSave={(val) => onSave("name", val)}
            label={<h6 className="mb-2">Full Name</h6>}
          />

          <EditableInput
            name="rollNo"
            initialValue={profile?.rollNo || profile?.roll_no || ""}
            onSave={(val) => onSave("rollNo", val)}
            label={<h6 className="mb-2">Roll No / Student ID</h6>}
          />

          <div className="mb-2">
            <h6 className="mb-1">Department</h6>
            <SelectPicker
              data={DEPARTMENTS}
              cleanable={false}
              block
              value={profile?.department || "Computer Science"}
              onChange={(val) => onSave("department", val)}
            />
          </div>

          <div className="mb-2">
            <h6 className="mb-1">Academic Year / Batch</h6>
            <SelectPicker
              data={BATCHES}
              cleanable={false}
              block
              value={profile?.batch || "3rd Year"}
              onChange={(val) => onSave("batch", val)}
            />
          </div>

          <div className="mb-2">
            <h6 className="mb-1">Campus Role</h6>
            <SelectPicker
              data={ROLES}
              cleanable={false}
              block
              value={profile?.role || "Student"}
              onChange={(val) => onSave("role", val)}
            />
          </div>

          <EditableInput
            name="bio"
            initialValue={profile?.bio || ""}
            onSave={(val) => onSave("bio", val)}
            label={<h6 className="mb-2">Bio / Project Interests</h6>}
          />

          <AvatarUploadBtn />

          <Divider />

          <h5 className="mb-2">🔒 Privacy & Stealth</h5>
          <div className="d-flex justify-content-between align-items-center mt-2 p-2" style={{ background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>Stealth Mode</div>
              <div style={{ color: "#64748b", fontSize: 12 }}>Hide online status from peers</div>
            </div>
            <Toggle checked={hidePresence} onChange={togglePresence} />
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <Drawer.Actions>
            <Button block color="red" appearance="primary" onClick={onSignOut}>
              Sign Out from Campus Portal
            </Button>
          </Drawer.Actions>
        </div>
      </Drawer.Body>
    </>
  );
};

export default Dashboard;
