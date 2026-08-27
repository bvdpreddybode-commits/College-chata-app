import React, { useState } from "react";
import { Drawer, Input, InputGroup } from "rsuite";
import SendIcon from "@rsuite/icons/Send";
import TimeAgo from "timeago-react";
import ProfileAvatar from "../../ProfileAvatar";

const ThreadDrawer = ({ isOpen, onClose, rootMessage, replies = [], onSendReply }) => {
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);

  if (!rootMessage) return null;

  const handleSend = async () => {
    if (!replyText.trim() || isSending) return;
    setIsSending(true);
    try {
      if (onSendReply) {
        await onSendReply(rootMessage.id, replyText.trim());
      }
      setReplyText("");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Drawer open={isOpen} onClose={onClose} placement="right" size="sm">
      <Drawer.Header>
        <Drawer.Title>💬 Thread Discussion</Drawer.Title>
      </Drawer.Header>
      <Drawer.Body style={{ display: "flex", flexDirection: "column", padding: "16px" }}>
        {/* Root Message Preview */}
        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "16px",
          }}
        >
          <div className="d-flex align-items-center mb-1">
            <ProfileAvatar
              src={rootMessage.author?.avatar}
              name={rootMessage.author?.name || "Student"}
              size="xs"
              className="mr-2"
            />
            <strong style={{ fontSize: "13px", color: "#0f172a" }}>
              {rootMessage.author?.name || "Student"}
            </strong>
            <TimeAgo
              datetime={rootMessage.created_at || rootMessage.createdAt}
              className="font-normal text-muted ml-2"
              style={{ fontSize: "11px" }}
            />
          </div>
          <div style={{ fontSize: "13px", color: "#334155", marginLeft: "28px" }}>
            {rootMessage.text}
          </div>
        </div>

        <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", marginBottom: "8px" }}>
          Replies ({replies.length})
        </div>

        {/* Replies List */}
        <div style={{ flex: 1, overflowY: "auto", marginBottom: "16px" }} className="custom-scroll">
          {replies.length === 0 ? (
            <div className="text-center text-muted p-4" style={{ fontSize: "13px" }}>
              No replies yet. Start the thread conversation below!
            </div>
          ) : (
            replies.map((reply, idx) => (
              <div
                key={reply.id || idx}
                style={{
                  padding: "8px 10px",
                  borderBottom: "1px solid #f1f5f9",
                  marginBottom: "4px",
                }}
              >
                <div className="d-flex align-items-center mb-1">
                  <ProfileAvatar
                    src={reply.author?.avatar}
                    name={reply.author?.name || "Student"}
                    size="xs"
                    className="mr-2"
                  />
                  <strong style={{ fontSize: "12px", color: "#1e293b" }}>
                    {reply.author?.name || "Student"}
                  </strong>
                  <TimeAgo
                    datetime={reply.created_at || reply.createdAt}
                    className="font-normal text-muted ml-2"
                    style={{ fontSize: "10px" }}
                  />
                </div>
                <div style={{ fontSize: "13px", color: "#334155", marginLeft: "28px" }}>
                  {reply.text}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Bar */}
        <InputGroup>
          <Input
            placeholder="Reply to this thread..."
            value={replyText}
            onChange={setReplyText}
            onKeyDown={(e) => e.keyCode === 13 && handleSend()}
          />
          <InputGroup.Button
            color="blue"
            appearance="primary"
            onClick={handleSend}
            disabled={isSending || !replyText.trim()}
          >
            <SendIcon />
          </InputGroup.Button>
        </InputGroup>
      </Drawer.Body>
    </Drawer>
  );
};

export default ThreadDrawer;
