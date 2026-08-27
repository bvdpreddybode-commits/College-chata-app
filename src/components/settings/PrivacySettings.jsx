import React, { useState } from "react";
import { Toggle, Divider, Message, toaster, Tag } from "rsuite";
import { useProfile } from "../../context/profile.context";
import { supabase } from "../../misc/supabaseClient";

const PrivacySettings = () => {
  const { profile, setProfile } = useProfile();
  const [stealthMode, setStealthMode] = useState(profile?.hidePresence || false);
  const [anonymousStudyAllowed, setAnonymousStudyAllowed] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);

  const toggleStealth = async (checked) => {
    try {
      setStealthMode(checked);
      const uid = profile?.uid || profile?.id;
      if (!uid) return;

      const { error } = await supabase
        .from("profiles")
        .update({ hide_presence: checked })
        .eq("id", uid);

      if (error) throw error;

      setProfile((prev) => ({
        ...prev,
        hidePresence: checked,
        hide_presence: checked,
      }));

      toaster.push(
        <Message type="info" closable duration={3000}>
          {checked ? "🕵️ Stealth Mode Activated: Online presence is now hidden" : "🟢 Stealth Mode Deactivated: Online presence visible"}
        </Message>
      );
    } catch (err) {
      toaster.push(<Message type="error" closable duration={3000}>{err.message}</Message>);
    }
  };

  return (
    <div className="h-100 custom-scroll" style={{ overflowY: "auto", padding: "20px 24px 80px 24px" }}>
      <div className="mb-4">
        <h4 style={{ margin: 0, fontWeight: 800 }}>🔒 Privacy & Security Center</h4>
        <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>
          Manage your presence visibility, read receipts, and anonymous study modes.
        </p>
      </div>

      <div className="modern-card mb-4" style={{ padding: "20px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <div style={{ fontWeight: 700, fontSize: "14px" }}>🕵️ Stealth Mode (Presence Masking)</div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
              Hides the green online status indicator across public channels, study rooms, and member lists.
            </div>
          </div>
          <Toggle checked={stealthMode} onChange={toggleStealth} />
        </div>

        <Divider />

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <div style={{ fontWeight: 700, fontSize: "14px" }}>🎭 Anonymous Question Posting</div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
              Allows you to ask questions in study circles without exposing your student name or roll number.
            </div>
          </div>
          <Toggle checked={anonymousStudyAllowed} onChange={setAnonymousStudyAllowed} />
        </div>

        <Divider />

        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div style={{ fontWeight: 700, fontSize: "14px" }}>👁️ Read Receipts</div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
              Show double checkmarks when messages are seen in 1-on-1 chats.
            </div>
          </div>
          <Toggle checked={readReceipts} onChange={setReadReceipts} />
        </div>
      </div>

      <div className="modern-card" style={{ padding: "20px" }}>
        <h6 style={{ fontWeight: 700, marginBottom: "8px" }}>🏛️ Institutional Compliance & RLS</h6>
        <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          CampusConnect Cloud implements end-to-end PostgreSQL Row Level Security. Only enrolled students and faculty from verified domains can access internal campus communication. Passcodes and private rooms are encrypted and protected at the database tier.
        </p>
        <div className="d-flex gap-2 mt-2">
          <Tag color="green" size="sm">TLS 1.3 Active</Tag>
          <Tag color="blue" size="sm">Row Level Security Active</Tag>
          <Tag color="violet" size="sm">Zero-Knowledge Study Passcodes</Tag>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
