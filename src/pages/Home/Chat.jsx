import React, { useState } from "react";
import { useParams } from "react-router";
import { Button, Form, Input, Loader, Message, toaster } from "rsuite";
import LockIcon from "@rsuite/icons/legacy/Lock";
import ChatBottom from "../../components/chat_window/bottom";
import Messages from "../../components/chat_window/messages";
import ChatTop from "../../components/chat_window/top";
import { CurrentRoomProvider } from "../../context/current-room.context";
import { useRoomsContext } from "../../context/rooms.context";
import { useProfile } from "../../context/profile.context";
import { transformToArr } from "../../misc/helpers";

const Chat = () => {
  const { chatId } = useParams();
  const { profile } = useProfile();
  const roomsContext = useRoomsContext();
  const rooms = roomsContext ? roomsContext.rooms : null;
  const unlockedRooms = roomsContext ? roomsContext.unlockedRooms : {};
  const unlockRoom = roomsContext ? roomsContext.unlockRoom : () => {};

  const [enteredPasscode, setEnteredPasscode] = useState("");

  if (!rooms) {
    return <Loader center vertical size="md" content="Loading campus channel..." speed="slow" />;
  }

  const currentRoom = rooms.find((room) => room.id === chatId);

  if (!currentRoom) {
    return <h6 className="text-center mt-page">Campus Channel {chatId} not found</h6>;
  }

  const { name, description, isPrivate, passcode, category, type, members } = currentRoom;

  const currentUid = profile?.uid || profile?.id;
  const admins = transformToArr(currentRoom.admins);
  const isAdmin = admins.includes(currentUid) || currentRoom.created_by === currentUid;
  const isMember = members && (Array.isArray(members) ? members.includes(currentUid) : members[currentUid]);

  // Private study room passcode check
  const isLocked =
    isPrivate &&
    passcode &&
    !isAdmin &&
    !unlockedRooms[chatId];

  const handleUnlock = () => {
    if (enteredPasscode.trim() === passcode.trim()) {
      unlockRoom(chatId);
      toaster.push(
        <Message type="success" closable duration={4000}>
          Private study room unlocked!
        </Message>
      );
    } else {
      toaster.push(
        <Message type="error" closable duration={4000}>
          Incorrect passcode. Please request access from group admin.
        </Message>
      );
    }
  };

  if (isLocked) {
    return (
      <div className="study-passcode-box">
        <div style={{ fontSize: "40px", marginBottom: "12px", color: "#dc2626" }}>
          <LockIcon />
        </div>
        <h4 style={{ color: "#0f172a", fontWeight: 700 }}>{name}</h4>
        <span className="badge-pill badge-private" style={{ marginBottom: "16px" }}>
          Private Study Group
        </span>
        <p style={{ color: "#64748b", fontSize: "13px", margin: "14px 0" }}>
          This is a protected study group. Please enter the group secret passcode to enter and view discussions.
        </p>

        <Form fluid style={{ maxWidth: 280, margin: "0 auto" }}>
          <Form.Group>
            <Input
              type="password"
              placeholder="Enter room passcode..."
              value={enteredPasscode}
              onChange={setEnteredPasscode}
              onKeyDown={(e) => e.keyCode === 13 && handleUnlock()}
            />
          </Form.Group>
          <Button
            block
            color="red"
            appearance="primary"
            onClick={handleUnlock}
            style={{ fontWeight: 600 }}
          >
            Unlock Room
          </Button>
        </Form>
      </div>
    );
  }

  const currentRoomData = {
    name,
    description,
    admins,
    isAdmin,
    isPrivate,
    category,
    type,
    isMember,
  };

  return (
    <CurrentRoomProvider data={currentRoomData}>
      <div className="chat-top">
        <ChatTop />
      </div>

      <div className="chat-middle">
        <Messages />
      </div>

      <div className="chat-bottom">
        <ChatBottom />
      </div>
    </CurrentRoomProvider>
  );
};

export default Chat;
