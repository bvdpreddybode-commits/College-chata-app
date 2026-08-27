import React, { useState } from "react";
import { Drawer, Input, InputGroup, List, Message, toaster } from "rsuite";
import SendIcon from "@rsuite/icons/Send";
import TimeAgo from "timeago-react";
import { useProfile } from "../../../context/profile.context";
import ProfileAvatar from "../../ProfileAvatar";

const ThreadDrawer = ({ isOpen, onClose, parentMessage, roomId }) => {
  const { profile } = useProfile();
  const [replies, setReplies] = useState([
    {
      id: "thread-demo-1",
      text: "Great question! I think the answer involves normalization to BCNF first.",
      author: { name: "Priya Sharma", role: "Student", department: "Computer Science" },
      created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: "thread-demo-2",
      text: "Agreed, also don't forget about the functional dependency closure algorithm.",
      author: { name: "Ravi Kumar", role: "Teaching Assistant", department: "Computer Science" },
      created_at: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    },
  ]);
  const [replyInput, setReplyInput] = useState("");

  const handleSendReply = () => {
    if (!replyInput.trim()) return;
    const newReply = {
      id: "thread-" + Date.now(),
      text: replyInput.trim(),
      author: {
        name: profile?.name || "Student",
        role: profile?.role || "Student",
        department: profile?.department || "Computer Science",
        avatar: profile?.avatar,
      },
      created_at: new Date().toISOString(),
    };
    setReplies((prev) => [...prev, newReply]);
    setReplyInput("");
    toaster.push(
      <Message type="info" closable duration={3000}>
        Reply posted in thread
      </Message>
    );
  };

  return (
    <Drawer size="sm" open={isOpen} onClose={onClose} placement="right">
      <Drawer.Header>
        <Drawer.Title>💬 Thread — {replies.length} Replies</Drawer.Title>
      </Drawer.Header>
      <Drawer.Body style={{ padding: "16px", display: "flex", flexDirection: "column" }}>
        {/* Parent Message */}
        {parentMessage && (
          <div
            style={{
              padding: "12px 14px",
              background: "var(--bg-surface-subtle)",
              borderRadius: "10px",
              borderLeft: "4px solid var(--brand-primary)",
              marginBottom: "16px",
            }}
          >
            <div className="d-flex align-items-center gap-2 mb-1">
              <ProfileAvatar
                src={parentMessage.author?.avatar}
                name={parentMessage.author?.name || "Student"}
                size="xs"
              />
              <strong style={{ fontSize: "13px" }}>
                {parentMessage.isAnonymous
                  ? "🕵️ Anonymous Student"
                  : parentMessage.author?.name || "Student"}
              </strong>
              <TimeAgo
                datetime={parentMessage.created_at || parentMessage.createdAt}
                style={{ fontSize: "11px", color: "var(--text-muted)" }}
              />
            </div>
            <div style={{ fontSize: "14px", color: "var(--text-primary)", whiteSpace: "pre-wrap" }}>
              {parentMessage.text}
            </div>
          </div>
        )}

        {/* Thread Replies */}
        <div style={{ flex: 1, overflowY: "auto" }} className="custom-scroll">
          <List hover>
            {replies.map((reply) => (
              <List.Item key={reply.id} style={{ padding: "10px 12px" }}>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <ProfileAvatar
                    src={reply.author?.avatar}
                    name={reply.author?.name || "Student"}
                    size="xs"
                  />
                  <strong style={{ fontSize: "13px", color: "var(--text-primary)" }}>
                    {reply.author?.name}
                  </strong>
                  {reply.author?.role === "Teaching Assistant" && (
                    <span className="badge-pill badge-ta">📘 TA</span>
                  )}
                  {reply.author?.role === "Faculty" && (
                    <span className="badge-pill badge-faculty">👨‍🏫 Faculty</span>
                  )}
                  <TimeAgo
                    datetime={reply.created_at}
                    style={{ fontSize: "11px", color: "var(--text-muted)" }}
                  />
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    marginLeft: "28px",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {reply.text}
                </div>
              </List.Item>
            ))}
          </List>
        </div>

        {/* Reply Input */}
        <div style={{ marginTop: "12px", borderTop: "1px solid var(--border-subtle)", paddingTop: "12px" }}>
          <InputGroup>
            <Input
              placeholder="Reply in this thread..."
              value={replyInput}
              onChange={setReplyInput}
              onKeyDown={(e) => e.keyCode === 13 && handleSendReply()}
            />
            <InputGroup.Button color="blue" appearance="primary" onClick={handleSendReply}>
              <SendIcon />
            </InputGroup.Button>
          </InputGroup>
        </div>
      </Drawer.Body>
    </Drawer>
  );
};

export default ThreadDrawer;
