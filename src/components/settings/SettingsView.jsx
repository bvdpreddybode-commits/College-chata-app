import React, { useState } from "react";
import { Toggle, Button, SelectPicker, Divider, Message, toaster } from "rsuite";
import { useProfile } from "../../context/profile.context";
import { useTheme } from "../../context/theme.context";
import { supabase } from "../../misc/supabaseClient";
import EditableInput from "../EditableInput";

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
  { label: "System Administration", value: "System Administration" },
];

const BATCHES = [
  { label: "1st Year", value: "1st Year" },
  { label: "2nd Year", value: "2nd Year" },
  { label: "3rd Year", value: "3rd Year" },
  { label: "4th Year", value: "4th Year" },
  { label: "Postgraduate", value: "Postgraduate" },
  { label: "Faculty / Staff", value: "Faculty / Staff" },
  { label: "Administration", value: "Administration" },
];

const SettingsView = ({ onViewChange }) => {
  const { profile, setProfile } = useProfile();
  const { theme, toggleTheme } = useTheme();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [stealthMode, setStealthMode] = useState(profile?.hidePresence || false);

  const onSave = async (key, val) => {
    try {
      const uid = profile?.uid || profile?.id;
      if (!uid) return;

      const dbKey = key === "rollNo" ? "roll_no" : key === "hidePresence" ? "hide_presence" : key;

      const { error } = await supabase
        .from("profiles")
        .update({ [dbKey]: val })
        .eq("id", uid);

      if (error) throw error;

      setProfile((prev) => ({
        ...prev,
        [key]: val,
      }));

      toaster.push(
        <Message type="success" closable duration={3000}>
          Setting updated successfully
        </Message>
      );
    } catch (err) {
      toaster.push(
        <Message type="error" closable duration={3000}>
          {err.message}
        </Message>
      );
    }
  };

  const handleStealthToggle = async (checked) => {
    setStealthMode(checked);
    await onSave("hidePresence", checked);
  };

  return (
    <div className="h-100 custom-scroll" style={{ overflowY: "auto", padding: "20px 24px 80px 24px" }}>
      <div className="mb-4">
        <h4 style={{ margin: 0, fontWeight: 800 }}>⚙️ Platform Settings & Preferences</h4>
        <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>
          Manage your campus profile, appearance themes, privacy settings, and notifications.
        </p>
      </div>

      {/* Profile & Academic Info */}
      <div className="modern-card mb-4" style={{ padding: "20px" }}>
        <h5 style={{ fontWeight: 700, marginBottom: "16px" }}>🎓 Academic Profile</h5>
        
        <EditableInput
          name="name"
          initialValue={profile?.name}
          onSave={(val) => onSave("name", val)}
          label={<h6 className="mb-2" style={{ fontSize: "13px" }}>Full Name</h6>}
        />

        <EditableInput
          name="rollNo"
          initialValue={profile?.rollNo || profile?.roll_no || ""}
          onSave={(val) => onSave("rollNo", val)}
          label={<h6 className="mb-2" style={{ fontSize: "13px" }}>Roll No / Institutional ID</h6>}
        />

        <div className="mb-3">
          <h6 className="mb-1" style={{ fontSize: "13px" }}>Department</h6>
          <SelectPicker
            data={DEPARTMENTS}
            cleanable={false}
            block
            value={profile?.department || "Computer Science"}
            onChange={(val) => onSave("department", val)}
          />
        </div>

        <div className="mb-3">
          <h6 className="mb-1" style={{ fontSize: "13px" }}>Batch / Year</h6>
          <SelectPicker
            data={BATCHES}
            cleanable={false}
            block
            value={profile?.batch || "3rd Year"}
            onChange={(val) => onSave("batch", val)}
          />
        </div>

        <EditableInput
          name="bio"
          initialValue={profile?.bio || ""}
          onSave={(val) => onSave("bio", val)}
          label={<h6 className="mb-2" style={{ fontSize: "13px" }}>Bio & Interests</h6>}
        />
      </div>

      {/* Appearance */}
      <div className="modern-card mb-4" style={{ padding: "20px" }}>
        <h5 style={{ fontWeight: 700, marginBottom: "16px" }}>🎨 Appearance & Theme</h5>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div style={{ fontWeight: 600, fontSize: "13px" }}>Dark Mode</div>
            <div style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
              Switch between Campus Dark and Sunburst Light themes
            </div>
          </div>
          <Toggle checked={theme === "dark"} onChange={toggleTheme} />
        </div>
      </div>

      {/* Privacy & Stealth */}
      <div className="modern-card mb-4" style={{ padding: "20px" }}>
        <h5 style={{ fontWeight: 700, marginBottom: "16px" }}>🔒 Privacy & Stealth Mode</h5>
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <div style={{ fontWeight: 600, fontSize: "13px" }}>Stealth Mode (Incognito Presence)</div>
            <div style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
              Hide your active online status across all campus channels
            </div>
          </div>
          <Toggle checked={stealthMode} onChange={handleStealthToggle} />
        </div>

        <Divider />

        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div style={{ fontWeight: 600, fontSize: "13px" }}>Direct Message Invitations</div>
            <div style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
              Allow verified classmates and faculty to initiate 1-on-1 direct messages
            </div>
          </div>
          <Toggle defaultChecked />
        </div>
      </div>

      {/* Notifications */}
      <div className="modern-card mb-4" style={{ padding: "20px" }}>
        <h5 style={{ fontWeight: 700, marginBottom: "16px" }}>🔔 Notification Preferences</h5>
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <div style={{ fontWeight: 600, fontSize: "13px" }}>Audio Alerts for Mentions</div>
            <div style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
              Play subtle chime when @mentioned in class or study channels
            </div>
          </div>
          <Toggle checked={soundEnabled} onChange={setSoundEnabled} />
        </div>

        <Divider />

        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div style={{ fontWeight: 600, fontSize: "13px" }}>Placement & Event Broadcasts</div>
            <div style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
              Receive instant alerts for new job postings and hackathons
            </div>
          </div>
          <Toggle checked={emailAlerts} onChange={setEmailAlerts} />
        </div>
      </div>

      {/* Super Admin Quick Access */}
      {(profile?.isAdmin || profile?.role === "Admin" || profile?.email === "bvdpreddybode@gmail.com") && (
        <div className="modern-card mb-4" style={{ padding: "20px", borderLeft: "4px solid #ef4444" }}>
          <h5 style={{ fontWeight: 700, marginBottom: "12px", color: "#ef4444" }}>🛡️ Super Admin Controls</h5>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "14px" }}>
            You are logged in as a verified Administrator ({profile?.email}). You have full administrative access to the platform moderation queue, user management, and cloud architecture simulators.
          </p>
          <Button color="red" appearance="primary" onClick={() => onViewChange && onViewChange("admin")} style={{ fontWeight: 600 }}>
            Open Admin Dashboard →
          </Button>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
