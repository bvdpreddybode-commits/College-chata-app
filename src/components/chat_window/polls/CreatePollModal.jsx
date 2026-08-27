import React, { useState } from "react";
import { Modal, Button, Input, Checkbox, Message, toaster, Tag } from "rsuite";

const CreatePollModal = ({ isOpen, onClose, onCreatePoll }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [isMultiChoice, setIsMultiChoice] = useState(false);
  const [isAnonymousVote, setIsAnonymousVote] = useState(true);

  const addOption = () => {
    if (options.length >= 8) return;
    setOptions((prev) => [...prev, ""]);
  };

  const removeOption = (index) => {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateOption = (index, value) => {
    setOptions((prev) => prev.map((opt, i) => (i === index ? value : opt)));
  };

  const handleCreate = () => {
    if (!question.trim()) {
      toaster.push(<Message type="warning" closable duration={3000}>Please enter a poll question.</Message>);
      return;
    }
    const validOptions = options.filter((o) => o.trim() !== "");
    if (validOptions.length < 2) {
      toaster.push(<Message type="warning" closable duration={3000}>Please add at least 2 options.</Message>);
      return;
    }

    const poll = {
      id: "poll-" + Date.now(),
      question: question.trim(),
      options: validOptions.map((text, i) => ({
        id: "opt-" + i,
        text: text.trim(),
        votes: [],
        percentage: 0,
      })),
      isMultiChoice,
      isAnonymousVote,
      totalVotes: 0,
      createdAt: new Date().toISOString(),
      status: "active",
    };

    if (onCreatePoll) onCreatePoll(poll);
    setQuestion("");
    setOptions(["", ""]);
    setIsMultiChoice(false);
    setIsAnonymousVote(true);
    onClose();
    toaster.push(<Message type="success" closable duration={3000}>📊 Poll created successfully!</Message>);
  };

  return (
    <Modal open={isOpen} onClose={onClose} size="sm">
      <Modal.Header>
        <Modal.Title>📊 Create Channel Poll</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <label style={{ fontWeight: 600, fontSize: "13px", marginBottom: "4px", display: "block" }}>
            Poll Question
          </label>
          <Input
            as="textarea"
            rows={2}
            placeholder="What topic should we cover in the next study session?"
            value={question}
            onChange={setQuestion}
          />
        </div>

        <div className="mb-3">
          <label style={{ fontWeight: 600, fontSize: "13px", marginBottom: "4px", display: "block" }}>
            Options <Tag size="sm" color="blue">{options.length}/8</Tag>
          </label>
          {options.map((opt, i) => (
            <div key={i} className="d-flex align-items-center gap-2 mb-2" style={{ gap: "8px" }}>
              <Input
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={(val) => updateOption(i, val)}
                style={{ flex: 1 }}
              />
              {options.length > 2 && (
                <Button size="xs" appearance="subtle" color="red" onClick={() => removeOption(i)}>
                  ✕
                </Button>
              )}
            </div>
          ))}
          {options.length < 8 && (
            <Button size="sm" appearance="ghost" onClick={addOption} style={{ fontWeight: 600 }}>
              + Add Option
            </Button>
          )}
        </div>

        <div className="d-flex flex-column gap-2" style={{ gap: "6px" }}>
          <Checkbox checked={isMultiChoice} onChange={(_, checked) => setIsMultiChoice(checked)}>
            <span style={{ fontSize: "13px" }}>Allow selecting multiple options</span>
          </Checkbox>
          <Checkbox checked={isAnonymousVote} onChange={(_, checked) => setIsAnonymousVote(checked)}>
            <span style={{ fontSize: "13px" }}>Anonymous voting (hide voter names)</span>
          </Checkbox>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} appearance="subtle">Cancel</Button>
        <Button onClick={handleCreate} appearance="primary" color="blue" style={{ fontWeight: 600 }}>
          📊 Create Poll
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreatePollModal;
