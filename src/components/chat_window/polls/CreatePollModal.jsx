import React, { useState } from "react";
import { Button, Form, Input, InputGroup, Message, Modal, toaster } from "rsuite";
import PlusIcon from "@rsuite/icons/Plus";
import TrashIcon from "@rsuite/icons/legacy/Trash";

const CreatePollModal = ({ isOpen, onClose, onCreatePoll }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (value, index) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async () => {
    if (!question.trim()) {
      toaster.push(<Message type="warning">Please enter a poll question.</Message>);
      return;
    }

    const filledOptions = options.map((opt) => opt.trim()).filter(Boolean);
    if (filledOptions.length < 2) {
      toaster.push(<Message type="warning">Please provide at least 2 poll choices.</Message>);
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreatePoll({
        question: question.trim(),
        options: filledOptions.map((text, id) => ({
          id: `opt-${id}`,
          text,
          votes: [],
        })),
        totalVotes: 0,
        createdAt: new Date().toISOString(),
      });

      setQuestion("");
      setOptions(["", ""]);
      onClose();
    } catch (err) {
      toaster.push(<Message type="error">{err.message}</Message>);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} size="sm">
      <Modal.Header>
        <Modal.Title>📊 Create Campus Channel Poll</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form fluid>
          <Form.Group controlId="poll-question">
            <Form.ControlLabel style={{ fontWeight: 600 }}>Poll Question / Topic *</Form.ControlLabel>
            <Input
              placeholder="e.g., When should we schedule our DBMS revision session?"
              value={question}
              onChange={setQuestion}
            />
          </Form.Group>

          <div className="mb-2">
            <Form.ControlLabel style={{ fontWeight: 600 }}>Poll Choices *</Form.ControlLabel>
            {options.map((opt, idx) => (
              <InputGroup key={idx} style={{ marginBottom: "8px" }}>
                <InputGroup.Addon style={{ fontSize: "12px", fontWeight: 700 }}>
                  {idx + 1}
                </InputGroup.Addon>
                <Input
                  placeholder={`Option ${idx + 1}...`}
                  value={opt}
                  onChange={(val) => handleOptionChange(val, idx)}
                />
                {options.length > 2 && (
                  <InputGroup.Button
                    onClick={() => handleRemoveOption(idx)}
                    title="Remove option"
                    color="red"
                    appearance="subtle"
                  >
                    <TrashIcon />
                  </InputGroup.Button>
                )}
              </InputGroup>
            ))}
          </div>

          {options.length < 6 && (
            <Button
              size="xs"
              appearance="ghost"
              color="blue"
              onClick={handleAddOption}
              style={{ fontWeight: 600 }}
            >
              <PlusIcon /> Add Another Option
            </Button>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} appearance="subtle">
          Cancel
        </Button>
        <Button
          appearance="primary"
          color="blue"
          onClick={handleSubmit}
          loading={isSubmitting}
          style={{ fontWeight: 600 }}
        >
          Launch Poll
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreatePollModal;
