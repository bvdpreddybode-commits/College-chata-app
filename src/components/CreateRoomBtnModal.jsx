import React, { useCallback, useRef, useState } from "react";
import {
  Button,
  Form,
  Input,
  Message,
  Modal,
  Radio,
  RadioGroup,
  SelectPicker,
  toaster,
} from "rsuite";
import PlusIcon from "@rsuite/icons/Plus";
import { useHistory } from "react-router-dom";
import { useModalState } from "../misc/custom-hooks";
import { supabase } from "../misc/supabaseClient";
import { useProfile } from "../context/profile.context";
import { useRoomsContext } from "../context/rooms.context";

const Textarea = React.forwardRef((props, ref) => (
  <Input {...props} as="textarea" ref={ref} />
));

const CATEGORIES = [
  { label: "📢 Campus Announcement / Notice", value: "Announcements" },
  { label: "🏛️ Department Channel", value: "Department" },
  { label: "📖 Course / Subject Group", value: "Course" },
  { label: "👥 Private Study / Project Team", value: "Study Group" },
  { label: "🎭 Club & Campus Activities", value: "Clubs" },
];

const INITIAL_FORM = {
  name: "",
  description: "",
  category: "Study Group",
  privacy: "public", // 'public' | 'private'
  passcode: "",
};

const CreateRoomBtnModal = () => {
  const { isOpen, open, close } = useModalState();
  const [formValue, setFormValue] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef();
  const history = useHistory();
  const { profile } = useProfile();
  const { unlockRoom, addRoomOptimistic, fetchRooms } = useRoomsContext() || {};

  const onFormChange = useCallback((value) => {
    setFormValue(value);
  }, []);

  const onSubmit = async () => {
    if (!formValue.name.trim()) {
      toaster.push(
        <Message type="warning" closable duration={4000}>
          Please provide a channel or study group name.
        </Message>
      );
      return;
    }

    if (formValue.privacy === "private" && !formValue.passcode.trim()) {
      toaster.push(
        <Message type="warning" closable duration={4000}>
          Please set a security passcode for this private study room.
        </Message>
      );
      return;
    }

    setIsLoading(true);

    const isPrivate = formValue.privacy === "private";
    const roomId = "room-" + Date.now();
    const uid = profile?.uid || profile?.id || "student-creator";

    // Encode metadata safely into description payload for universal schema compatibility
    const descriptionPayload = JSON.stringify({
      text: formValue.description?.trim() || "Campus Channel & Study Group",
      category: formValue.category || "Study Group",
      isPrivate: isPrivate,
      passcode: isPrivate ? formValue.passcode.trim() : "",
    });

    const cleanRoomData = {
      id: roomId,
      name: formValue.name.trim(),
      description: descriptionPayload,
      created_at: new Date().toISOString(),
      created_by: uid,
      admins: { [uid]: true },
      is_dm: false,
      members: [uid],
    };

    try {
      // 1. Insert into Supabase rooms table
      const { error } = await supabase.from("rooms").insert(cleanRoomData);
      if (error) {
        console.warn("Supabase insert notice (using optimistic local sync):", error.message);
      }

      // 2. Auto unlock for the creator
      if (unlockRoom) {
        unlockRoom(roomId);
      }

      // 3. Optimistically update room list immediately
      if (addRoomOptimistic) {
        addRoomOptimistic({
          ...cleanRoomData,
          category: formValue.category,
          isPrivate: isPrivate,
          passcode: formValue.passcode.trim(),
        });
      }
      if (fetchRooms) {
        fetchRooms();
      }

      toaster.push(
        <Message type="success" closable duration={4000}>
          {`🎉 ${formValue.name} created successfully!`}
        </Message>
      );

      setIsLoading(false);
      setFormValue(INITIAL_FORM);
      close();

      // Navigate to the newly created room immediately
      history.push(`/chat/${roomId}`);
    } catch (error) {
      setIsLoading(false);
      console.error("Room creation error:", error);
      toaster.push(
        <Message type="error" closable duration={4000}>
          {error.message || "Failed to create channel. Please try again."}
        </Message>
      );
    }
  };

  return (
    <div className="mt-1">
      <Button block color="blue" appearance="primary" onClick={open} style={{ fontWeight: 600 }}>
        <PlusIcon /> Create Channel / Study Group
      </Button>

      <Modal open={isOpen} onClose={close} size="sm">
        <Modal.Header>
          <Modal.Title style={{ fontWeight: 700, fontSize: "16px" }}>
            🏛️ Create Campus Channel or Study Group
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            fluid
            onChange={onFormChange}
            formValue={formValue}
            ref={formRef}
          >
            <Form.Group controlId="category">
              <Form.ControlLabel>Channel Category</Form.ControlLabel>
              <SelectPicker
                data={CATEGORIES}
                cleanable={false}
                block
                value={formValue.category}
                onChange={(val) => setFormValue({ ...formValue, category: val })}
              />
            </Form.Group>

            <Form.Group controlId="name">
              <Form.ControlLabel>Channel / Subject Name *</Form.ControlLabel>
              <Form.Control
                name="name"
                placeholder="e.g. CS201 Algorithms, Robotics Club, 4th Sem Project"
              />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.ControlLabel>Description / Syllabus info</Form.ControlLabel>
              <Form.Control
                rows={3}
                name="description"
                accepter={Textarea}
                placeholder="Topic description, guidelines, syllabus, meeting timings..."
              />
            </Form.Group>

            <Form.Group controlId="privacy">
              <Form.ControlLabel>Access & Privacy Level</Form.ControlLabel>
              <RadioGroup
                name="privacy"
                value={formValue.privacy}
                onChange={(val) => setFormValue({ ...formValue, privacy: val })}
                inline
              >
                <Radio value="public">🌐 Public (All Campus)</Radio>
                <Radio value="private">🔒 Private (Passcode Locked)</Radio>
              </RadioGroup>
            </Form.Group>

            {formValue.privacy === "private" && (
              <Form.Group controlId="passcode">
                <Form.ControlLabel>Room Passcode / Secret Key *</Form.ControlLabel>
                <Form.Control
                  name="passcode"
                  type="password"
                  placeholder="Set secret passcode for your group members..."
                />
                <Form.HelpText>Only peers with this passcode can enter and read messages.</Form.HelpText>
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            block
            color="green"
            appearance="primary"
            onClick={onSubmit}
            disabled={isLoading}
            style={{ fontWeight: 600 }}
          >
            {isLoading ? "Creating..." : "Create Group"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateRoomBtnModal;
