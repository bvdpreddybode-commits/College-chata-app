import React from "react";
import { Button } from "rsuite";

const PinnedMessagesBanner = ({ pinnedMessages = [], onViewPinned }) => {
  if (!pinnedMessages || pinnedMessages.length === 0) return null;

  const latest = pinnedMessages[pinnedMessages.length - 1];

  return (
    <div className="pinned-banner">
      <div className="d-flex align-items-center gap-2" style={{ flex: 1, overflow: "hidden" }}>
        <span style={{ fontSize: "14px" }}>📌</span>
        <span
          style={{
            fontWeight: 600,
            fontSize: "12px",
            color: "var(--text-primary)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {latest.text || "Pinned message"}
        </span>
      </div>
      <div className="d-flex align-items-center gap-2">
        {pinnedMessages.length > 1 && (
          <span style={{ fontSize: "11px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
            +{pinnedMessages.length - 1} more
          </span>
        )}
        <Button
          size="xs"
          appearance="ghost"
          color="blue"
          onClick={onViewPinned}
          style={{ fontWeight: 600, whiteSpace: "nowrap" }}
        >
          View All
        </Button>
      </div>
    </div>
  );
};

export default PinnedMessagesBanner;
