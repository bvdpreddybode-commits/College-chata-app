import React from "react";
import { Button, Tag } from "rsuite";
import AttachmentIcon from "@rsuite/icons/Attachment";

const getFileIcon = (type = "") => {
  if (type.includes("pdf")) return "📄";
  if (type.includes("ppt") || type.includes("presentation")) return "📊";
  if (type.includes("doc") || type.includes("word")) return "📝";
  if (type.includes("xls") || type.includes("sheet")) return "📈";
  if (type.includes("image")) return "🖼️";
  if (type.includes("zip")) return "📦";
  return "📁";
};

const StudyMaterialCard = ({ material, onPreview }) => {
  if (!material) return null;

  const { title, subject, department, uploadedBy, fileType, fileSize, tags = [] } = material;

  return (
    <div
      className="modern-card"
      style={{ cursor: "pointer", padding: "14px" }}
      onClick={() => onPreview && onPreview(material)}
    >
      <div className="d-flex align-items-start gap-3" style={{ gap: "12px" }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "10px",
            background: "rgba(37, 99, 235, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            flexShrink: 0,
          }}
        >
          {getFileIcon(fileType)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: "14px",
              color: "var(--text-primary)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
            {subject} • {department}
          </div>
          <div className="d-flex align-items-center gap-2 mt-1 flex-wrap" style={{ gap: "4px" }}>
            {tags.map((tag) => (
              <Tag key={tag} size="sm" color="blue">{tag}</Tag>
            ))}
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              {fileSize} • Uploaded by {uploadedBy}
            </span>
          </div>
        </div>
        <Button size="sm" appearance="ghost" color="blue" style={{ flexShrink: 0 }}>
          <AttachmentIcon /> View
        </Button>
      </div>
    </div>
  );
};

export default StudyMaterialCard;
