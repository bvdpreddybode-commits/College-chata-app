import React, { useState } from "react";
import { Button, Tag } from "rsuite";
import TimeAgo from "timeago-react";

const PollCard = ({ poll, currentUid, onVote }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);

  if (!poll) return null;

  const { question, options = [], isMultiChoice, isAnonymousVote, createdAt, status } = poll;

  const handleOptionClick = (optId) => {
    if (hasVoted) return;
    if (isMultiChoice) {
      setSelectedOptions((prev) =>
        prev.includes(optId) ? prev.filter((id) => id !== optId) : [...prev, optId]
      );
    } else {
      setSelectedOptions([optId]);
    }
  };

  const handleSubmitVote = () => {
    if (selectedOptions.length === 0) return;
    setHasVoted(true);
    if (onVote) onVote(poll.id, selectedOptions);
  };

  // Compute display percentages
  const computedTotalVotes = Math.max(
    1,
    options.reduce((sum, o) => sum + (o.votes?.length || 0), 0) + (hasVoted ? 1 : 0)
  );

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "12px",
        padding: "16px",
        margin: "8px 0",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="d-flex align-items-center gap-2">
          <span style={{ fontSize: "18px" }}>📊</span>
          <Tag color="blue" size="sm">Poll</Tag>
          {status === "active" && <Tag color="green" size="sm">Active</Tag>}
          {status === "closed" && <Tag color="red" size="sm">Closed</Tag>}
        </div>
        {createdAt && (
          <TimeAgo datetime={createdAt} style={{ fontSize: "11px", color: "var(--text-muted)" }} />
        )}
      </div>

      <h6 style={{ fontWeight: 700, fontSize: "14px", margin: "8px 0 12px 0", color: "var(--text-primary)" }}>
        {question}
      </h6>

      <div className="d-flex flex-column" style={{ gap: "8px" }}>
        {options.map((opt) => {
          const voteCount = (opt.votes?.length || 0) + (hasVoted && selectedOptions.includes(opt.id) ? 1 : 0);
          const pct = Math.round((voteCount / computedTotalVotes) * 100);
          const isSelected = selectedOptions.includes(opt.id);

          return (
            <div
              key={opt.id}
              onClick={() => handleOptionClick(opt.id)}
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                background: isSelected ? "rgba(37, 99, 235, 0.08)" : "var(--bg-surface-subtle)",
                border: isSelected ? "2px solid var(--brand-primary)" : "1px solid var(--border-subtle)",
                cursor: hasVoted ? "default" : "pointer",
                transition: "all 0.15s ease",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {hasVoted && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: `${pct}%`,
                    background: isSelected ? "rgba(37, 99, 235, 0.12)" : "rgba(100, 116, 139, 0.06)",
                    transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                    borderRadius: "8px",
                  }}
                />
              )}
              <div
                className="d-flex justify-content-between align-items-center"
                style={{ position: "relative", zIndex: 1 }}
              >
                <div className="d-flex align-items-center gap-2">
                  <span style={{ fontSize: "14px" }}>
                    {isMultiChoice ? (isSelected ? "☑️" : "⬜") : isSelected ? "🔘" : "⚪"}
                  </span>
                  <span style={{ fontWeight: isSelected ? 700 : 500, fontSize: "13px", color: "var(--text-primary)" }}>
                    {opt.text}
                  </span>
                </div>
                {hasVoted && (
                  <span style={{ fontWeight: 700, fontSize: "13px", color: "var(--brand-primary)" }}>
                    {pct}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
          {isAnonymousVote ? "🕵️ Anonymous Voting" : "👤 Public Voting"} •{" "}
          {isMultiChoice ? "Multi-select" : "Single-select"} • {computedTotalVotes - (hasVoted ? 0 : 1)} vote
          {computedTotalVotes - (hasVoted ? 0 : 1) !== 1 ? "s" : ""}
        </span>
        {!hasVoted && (
          <Button
            size="sm"
            color="blue"
            appearance="primary"
            onClick={handleSubmitVote}
            disabled={selectedOptions.length === 0}
            style={{ fontWeight: 600 }}
          >
            Vote
          </Button>
        )}
        {hasVoted && (
          <Tag color="green" size="sm">
            ✓ Voted
          </Tag>
        )}
      </div>
    </div>
  );
};

export default PollCard;
