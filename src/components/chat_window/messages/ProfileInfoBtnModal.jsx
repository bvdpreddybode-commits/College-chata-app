import React from 'react';
import { Button, Modal } from 'rsuite';
import { useHistory } from 'react-router-dom';
import { useModalState } from '../../../misc/custom-hooks';
import { useProfile } from '../../../context/profile.context';
import ProfileAvatar from '../../ProfileAvatar';
import { supabase } from '../../../misc/supabaseClient';

const ProfileInfoBtnModal = ({ profile: targetProfile, children, ...btnProps }) => {
  const { isOpen, close, open } = useModalState();
  const history = useHistory();
  const { profile: currentProfile } = useProfile();

  const {
    name = "Student",
    avatar,
    createdAt,
    created_at,
    department = "Computer Science",
    rollNo = "",
    roll_no = "",
    batch = "3rd Year",
    role = "Student",
    bio = "",
    uid,
    id,
  } = targetProfile || {};

  const peerId = uid || id;
  const currentUid = currentProfile?.uid || currentProfile?.id;
  const shortName = name.split(' ')[0];
  const dateVal = created_at || createdAt;
  const memberSince = dateVal ? new Date(dateVal).toLocaleDateString() : "N/A";
  const isSelf = currentUid && currentUid === peerId;

  const startDirectMessage = async () => {
    if (!currentUid || isSelf || !peerId) return;

    const dmId = ["dm", currentUid, peerId].sort().join("_");

    try {
      const { data: existingRoom } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", dmId)
        .single();

      if (!existingRoom) {
        await supabase.from("rooms").insert({
          id: dmId,
          name: `${name} & ${currentProfile?.name || "Peer"}`,
          description: "Private 1-on-1 Direct Message",
          created_at: new Date().toISOString(),
          created_by: currentUid,
        });
      }

      close();
      history.push(`/chat/${dmId}`);
    } catch (err) {
      console.error("Error creating direct message room:", err);
    }
  };

  return (
    <>
      <Button {...btnProps} onClick={open}>
        {shortName}
      </Button>
      <Modal open={isOpen} onClose={close}>
        <Modal.Header>
          <Modal.Title>Campus Profile: {name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <ProfileAvatar
            src={avatar}
            name={name}
            className="width-200 height-200 img-fullsize font-huge mx-auto"
          />

          <h4 className="mt-2" style={{ color: "#0f172a", fontWeight: 700 }}>
            {name}
          </h4>

          <div className="mt-1 mb-2">
            <span className="badge-pill badge-student">
              {role}
            </span>
            <span className="badge-pill badge-dept">
              {department}
            </span>
            <span className="badge-pill badge-category">
              {batch}
            </span>
          </div>

          {(rollNo || roll_no) && (
            <p style={{ fontSize: "13px", color: "#475569", margin: "4px 0" }}>
              <strong>Roll No / ID:</strong> {rollNo || roll_no}
            </p>
          )}

          {bio && (
            <p style={{ fontSize: "13px", color: "#64748b", margin: "8px 0", fontStyle: "italic" }}>
              "{bio}"
            </p>
          )}

          <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: 10 }}>
            Member of campus portal since {memberSince}
          </p>

          {!isSelf && peerId && (
            <div className="mt-3">
              <Button
                block
                color="blue"
                appearance="primary"
                onClick={startDirectMessage}
              >
                🔒 Send Private Message (1-on-1 DM)
              </Button>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {children}
          <Button block appearance="subtle" onClick={close}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfileInfoBtnModal;