import React, { memo } from "react";
import { Button } from "rsuite";
import TimeAgo from "timeago-react";
import AttachmentIcon from "@rsuite/icons/Attachment";
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

  const handleContextAction = (actionKey) => {
    if (actionKey === "reply" && onOpenThread) {
      onOpenThread(message);
    } else if (actionKey === "delete" && handleDelete) {
      handleDelete(message.id, file);
    } else if (actionKey === "react" && onToggleReaction) {
      onToggleReaction(message.id, "❤️");
    } else if (actionKey === "copy") {
      navigator.clipboard.writeText(text || "");
    }
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

        {canShowIcons && onOpenThread && (
          <Button
            size="xs"
            appearance="subtle"
            onClick={() => onOpenThread(message)}
            title="Reply in thread"
            style={{ padding: "2px 6px", fontSize: "11px", marginLeft: "4px" }}
          >
            💬 Reply
          </Button>
        )}

        {isAuthor && (
          <IconBtnControl
            isVisible={canShowIcons}
            iconName="close"
            tooltip="Delete this message"
            onClick={() => handleDelete(message.id, file)}
          />
        )}

        {canShowIcons && (
          <MessageContextMenu
            message={message}
            isAuthor={isAuthor}
            isAdmin={isAdmin}
            onAction={handleContextAction}
          >
            <Button
              size="xs"
              appearance="subtle"
              style={{ padding: "2px 4px", fontSize: "12px", marginLeft: "4px" }}
            >
              ⋮
            </Button>
          </MessageContextMenu>
        )}
      </div>

      <div style={{ marginLeft: "24px" }}>
        {text && (
          <div
            className="word-break-all"
            style={{
              fontSize: "14px",
              color: "var(--text-primary)",
              lineHeight: 1.5,
              whiteSpace: "pre-wrap",
            }}
          >
            {text}
          </div>
        )}

        {poll && <PollCard poll={poll} currentUid={currentUid} />}

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
