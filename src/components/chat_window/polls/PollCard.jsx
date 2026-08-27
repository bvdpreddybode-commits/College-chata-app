import React from "react";
import { Progress, Tag } from "rsuite";

const PollCard = ({ poll, currentUid, onVote }) => {
  if (!poll || !Array.isArray(poll.options)) return null;

  const totalVotes = poll.options.reduce(
    (sum, opt) => sum + (Array.isArray(opt.votes) ? opt.votes.length : 0),
    0
  );

  const hasVotedAny = poll.options.some((opt) =>
    Array.isArray(opt.votes) && opt.votes.includes(currentUid)
  );

  return (
    <div
      className="modern-card my-2 p-3"
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        maxWidth: "480px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex align-items-center gap-1">
          <span style={{ fontSize: "16px" }}>📊</span>
          <span style={{ fontWeight: 700, fontSize: "14px", color: "#0f172a" }}>
            Campus Poll
          </span>
        </div>
        <Tag color="blue" size="sm">
          {totalVotes} {totalVotes === 1 ? "Vote" : "Votes"}
        </Tag>
      </div>

      <h6 style={{ fontWeight: 600, color: "#1e293b", marginBottom: "12px", fontSize: "14px" }}>
        {poll.question}
      </h6>

      <div className="d-flex flex-column gap-2" style={{ gap: "8px" }}>
        {poll.options.map((opt) => {
          const voteCount = Array.isArray(opt.votes) ? opt.votes.length : 0;
          const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
          const isSelected = Array.isArray(opt.votes) && opt.votes.includes(currentUid);

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onVote && onVote(poll.id || poll, opt.id)}
              style={{
                background: isSelected ? "#eff6ff" : "#f8fafc",
                border: isSelected ? "2px solid #3b82f6" : "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "8px 12px",
                textAlign: "left",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.15s ease",
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span style={{ fontWeight: isSelected ? 700 : 500, fontSize: "13px", color: "#1e293b" }}>
                  {isSelected && <span style={{ marginRight: 4, color: "#2563eb" }}>✓</span>}
                  {opt.text}
                </span>
                <span style={{ fontSize: "12px", color: isSelected ? "#2563eb" : "#64748b", fontWeight: 600 }}>
                  {percentage}% ({voteCount})
                </span>
              </div>
              <Progress.Line
                percent={percentage}
                showInfo={false}
                strokeColor={isSelected ? "#2563eb" : "#94a3b8"}
                style={{ padding: 0 }}
              />
            </button>
          );
        })}
      </div>

      <div className="d-flex justify-content-between align-items-center mt-2 pt-2" style={{ borderTop: "1px solid #f1f5f9", fontSize: "11px", color: "#94a3b8" }}>
        <span>{hasVotedAny ? "You have voted in this poll" : "Click an option to cast your vote"}</span>
        <span>Anonymous & Live</span>
      </div>
    </div>
  );
};

export default PollCard;
