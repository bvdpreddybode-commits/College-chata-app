import React, { memo, useState } from "react";
import { Button, Message, toaster } from "rsuite";
import TimeAgo from "timeago-react";
import AttachmentIcon from "@rsuite/icons/Attachment";
import CopyIcon from "@rsuite/icons/Copy";
import CheckIcon from "@rsuite/icons/Check";
import { useCurrentRoom } from "../../../context/current-room.context";
import { useHover, useMediaQuery } from "../../../misc/custom-hooks";
import { useProfile } from "../../../context/profile.context";
import PresenceDot from "../../PresenceDot";
import ProfileAvatar from "../../ProfileAvatar";
import IconBtnControl from "./IconBtnControl";
import ImgBtnModal from "./ImgBtnModal";
import ProfileInfoBtnModal from "./ProfileInfoBtnModal";
import ReactionsBar from "./ReactionsBar";
import PollCard from "../polls/PollCard";
import MessageContextMenu from "./MessageContextMenu";

const getFileIcon = (contentType = "") => {
  if (contentType.includes("pdf")) return "📄";
  if (contentType.includes("image")) return "🖼️";
  if (contentType.includes("audio")) return "🎵";
  if (contentType.includes("zip") || contentType.includes("tar")) return "📦";
  if (contentType.includes("word") || contentType.includes("document")) return "📝";
  return "📁";
};

const CodeBlock = ({ codeText, language = "code" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        background: "#0f172a",
        color: "#f8fafc",
        borderRadius: "8px",
        padding: "10px 14px",
        margin: "6px 0",
        fontSize: "12px",
        fontFamily: "Consolas, Monaco, 'Courier New', monospace",
        position: "relative",
        overflowX: "auto",
        border: "1px solid #1e293b",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #334155",
          paddingBottom: "4px",
          marginBottom: "8px",
          color: "#94a3b8",
          fontSize: "11px",
          textTransform: "uppercase",
          fontWeight: 700,
        }}
      >
        <span>💻 {language}</span>
        <button
          type="button"
          onClick={handleCopy}
          style={{
            background: "transparent",
            border: "none",
            color: copied ? "#4ade80" : "#94a3b8",
            cursor: "pointer",
            fontSize: "11px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {copied ? <CheckIcon /> : <CopyIcon />} {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre style={{ margin: 0, whiteSpace: "pre-wrap", color: "#e2e8f0" }}>{codeText}</pre>
    </div>
  );
};

const renderMessageContent = (text) => {
  if (!text) return null;

  // Check for code blocks ```lang ... ```
  if (text.includes("```")) {
    const parts = text.split(/```/);
    return parts.map((part, idx) => {
      if (idx % 2 === 1) {
        // Code block
        const lines = part.split("\n");
        const firstLine = lines[0].trim();
        const hasLang = /^[a-zA-Z0-9_-]+$/.test(firstLine);
        const language = hasLang ? firstLine : "code";
        const code = hasLang ? lines.slice(1).join("\n") : part;
        return <CodeBlock key={idx} codeText={code.trim()} language={language} />;
      }
      if (!part.trim()) return null;
      return (
        <span key={idx} style={{ whiteSpace: "pre-wrap" }}>
          {part}
        </span>
      );
    });
  }

  return (
    <div
      className="word-break-all"
      style={{
        fontSize: "14px",
        color: "#1e293b",
        lineHeight: 1.5,
        whiteSpace: "pre-wrap",
      }}
    >
      {text}
    </div>
  );
};

const renderFileMessage = (file) => {
  if (!file) return null;

  if (file.contentType && file.contentType.includes("image")) {
    return (
      <div className="height-220 mt-1">
        <ImgBtnModal src={file.url} fileName={file.name} />
      </div>
    );
  }

  if (file.contentType && file.contentType.includes("audio")) {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <audio controls style={{ marginTop: "4px" }}>
        <source src={file.url} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    );
  }

  return (
    <a
      href={file.url}
      target="_blank"
      rel="noreferrer"
      className="study-file-card"
    >
      <span className="file-icon">{getFileIcon(file.contentType || "")}</span>
      <div>
        <div style={{ fontWeight: 600, fontSize: "13px" }}>{file.name}</div>
        <div style={{ fontSize: "11px", color: "#64748b" }}>
          Click to view / download study material
        </div>
      </div>
      <AttachmentIcon style={{ marginLeft: "12px", color: "#2563eb" }} />
    </a>
  );
};

const MessageItem = ({
  message,
  handleAdmin,
  handleLike,
  handleDelete,
  onOpenThread,
  onToggleReaction,
  onPinMessage,
  onVotePoll,
  isPinned,
}) => {
  const { author, createdAt, text, file, likes, likeCount, isAnonymous, poll, reactions } = message;
  const { profile } = useProfile();

  const [selfRef, isHovered] = useHover();
  const isMobile = useMediaQuery("(max-width: 992px)");

  const isAdmin = useCurrentRoom((v) => v?.isAdmin);
  const admins = useCurrentRoom((v) => v?.admins) || [];

  const currentUid = profile?.uid || profile?.id;
  const isMsgAuthorAdmin = author && admins.includes(author.uid);
  const isAuthor = author && currentUid && currentUid === author.uid;
  const canGrantAdmin = isAdmin && !isAuthor && !isAnonymous;

  const canShowIcons = isMobile || isHovered;
  const isLiked = likes && currentUid && Object.keys(likes).includes(currentUid);

  const handleCopyText = (content) => {
    navigator.clipboard.writeText(content);
    toaster.push(<Message type="info" duration={2000}>Message text copied!</Message>);
  };

  return (
    <li
      className={`padded mb-1 cursor-pointer ${isHovered ? "bg-black-02" : ""}`}
      ref={selfRef}
    >
      <div className="d-flex align-items-center font-bolder mb-1 flex-wrap">
        {!isAnonymous && <PresenceDot uid={author?.uid} />}

        <ProfileAvatar
          src={isAnonymous ? null : author?.avatar}
          name={isAnonymous ? "Anon" : author?.name || "Student"}
          className="ml-1"
          size="xs"
        />

        {isAnonymous ? (
          <span style={{ marginLeft: "6px", color: "#475569", fontWeight: 600, fontSize: "13px" }}>
            🕵️ Anonymous Student
          </span>
        ) : (
          <ProfileInfoBtnModal
            profile={author || {}}
            appearance="link"
            className="p-0 ml-1 text-black"
          >
            {canGrantAdmin && (
              <Button
                block
                onClick={() => handleAdmin(author.uid)}
                color="blue"
                appearance="primary"
              >
                {isMsgAuthorAdmin
                  ? "Remove admin permission"
                  : "Give admin in this room"}
              </Button>
            )}
          </ProfileInfoBtnModal>
        )}

        {/* Academic Role Badges */}
        {!isAnonymous && author?.role === "Faculty" && (
          <span className="badge-pill badge-faculty">👨‍🏫 Faculty</span>
        )}
        {!isAnonymous && author?.role === "Teaching Assistant" && (
          <span className="badge-pill badge-ta">📘 TA</span>
        )}
        {isMsgAuthorAdmin && (
          <span className="badge-pill badge-admin">🛡️ Admin</span>
        )}
        {!isAnonymous && author?.department && (
          <span className="badge-pill badge-dept">
            {author.department.split(" ")[0]}
          </span>
        )}

        <TimeAgo
          datetime={createdAt}
          className="font-normal text-black-45 ml-2"
          style={{ fontSize: "11px" }}
        />

        <IconBtnControl
          {...(isLiked ? { color: "red" } : {})}
          isVisible={canShowIcons}
          iconName="heart"
          tooltip="Like this message"
          onClick={() => handleLike(message.id)}
          badgeContent={likeCount}
        />

        {canShowIcons && (
          <div style={{ marginLeft: "6px" }}>
            <MessageContextMenu
              message={message}
              isAuthor={isAuthor}
              isAdmin={isAdmin}
              isPinned={isPinned}
              onToggleReaction={(emoji) => onToggleReaction && onToggleReaction(message.id, emoji)}
              onPinMessage={onPinMessage}
              onOpenThread={onOpenThread}
              onDeleteMessage={handleDelete}
              onCopyText={handleCopyText}
            />
          </div>
        )}
      </div>

      <div style={{ marginLeft: "24px" }}>
        {renderMessageContent(text)}

        {poll && (
          <PollCard
            poll={poll}
            currentUid={currentUid}
            onVote={(p, optId) => onVotePoll && onVotePoll(message.id, optId)}
          />
        )}

        {file && renderFileMessage(file)}

        <ReactionsBar
          reactions={reactions || {}}
          currentUid={currentUid}
          onToggleReaction={(emoji) => onToggleReaction && onToggleReaction(message.id, emoji)}
        />
      </div>
    </li>
  );
};

export default memo(MessageItem);
