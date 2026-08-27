import React, { useEffect, useState } from "react";
import { Button, List, Loader, Modal } from "rsuite";
import AttachmentIcon from "@rsuite/icons/Attachment";
import { useParams } from "react-router";
import TimeAgo from "timeago-react";
import { supabase } from "../../../misc/supabaseClient";

const getFileIcon = (contentType = "") => {
  if (contentType.includes("pdf")) return "📄";
  if (contentType.includes("image")) return "🖼️";
  if (contentType.includes("audio")) return "🎵";
  if (contentType.includes("zip") || contentType.includes("tar")) return "📦";
  if (contentType.includes("word") || contentType.includes("document")) return "📝";
  return "📁";
};

const StudyMaterialsModal = ({ isOpen, onClose, roomName }) => {
  const { chatId } = useParams();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !chatId) return;

    const fetchFiles = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("room_id", chatId)
          .not("file", "is", null)
          .order("created_at", { ascending: false });

        if (error) throw error;

        const fileList = (data || [])
          .filter((msg) => msg.file && msg.file.url)
          .map((msg) => ({
            id: msg.id,
            ...msg.file,
            sender: msg.author?.name || "Campus Member",
            createdAt: msg.created_at,
          }));

        setFiles(fileList);
      } catch (err) {
        console.error("Error fetching study materials:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [isOpen, chatId]);

  return (
    <Modal open={isOpen} onClose={onClose} size="md">
      <Modal.Header>
        <Modal.Title>📁 Study Materials & Notes: {roomName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && <Loader center content="Loading shared notes & documents..." />}

        {!loading && files.length === 0 && (
          <div className="text-center p-4" style={{ color: "#64748b" }}>
            <div style={{ fontSize: "36px", marginBottom: "10px" }}>📚</div>
            <h6>No study materials or files uploaded yet in this channel.</h6>
            <p style={{ fontSize: "12px", color: "#94a3b8" }}>
              Upload PDFs, assignments, or notes using the attachment button in chat.
            </p>
          </div>
        )}

        {!loading && files.length > 0 && (
          <List hover bordered style={{ maxHeight: "400px", overflowY: "auto" }}>
            {files.map((file) => (
              <List.Item key={file.id} style={{ padding: "12px 16px" }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center" style={{ minWidth: 0 }}>
                    <span style={{ fontSize: "28px", marginRight: "12px" }}>
                      {getFileIcon(file.contentType || "")}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontWeight: 600,
                          color: "#2563eb",
                          textDecoration: "none",
                          fontSize: "14px",
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {file.name}
                      </a>
                      <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                        Uploaded by <strong>{file.sender}</strong> •{" "}
                        <TimeAgo datetime={file.createdAt} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rs-btn rs-btn-primary rs-btn-xs"
                      style={{ fontWeight: 600, textDecoration: "none" }}
                    >
                      <AttachmentIcon /> Download
                    </a>
                  </div>
                </div>
              </List.Item>
            ))}
          </List>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} appearance="subtle">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StudyMaterialsModal;
