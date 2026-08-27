import React, { useState } from "react";
import { useParams } from "react-router";
import { Button, InputGroup, Message, Modal, toaster, Uploader } from "rsuite";
import { useModalState } from "../../../misc/custom-hooks";
import { supabase } from "../../../misc/supabaseClient";

const MAX_FILE_SIZE = 1000 * 1024 * 5;

const AttchmentBtnModal = ({ afterUpload }) => {
  const { chatId } = useParams();
  const { isOpen, open, close } = useModalState();

  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (fileArr) => {
    const filtered = fileArr
      .filter((el) => el.blobFile.size <= MAX_FILE_SIZE)
      .slice(0, 5);

    setFileList(filtered);
  };

  const onUpload = async () => {
    try {
      setIsLoading(true);

      const files = [];

      for (const f of fileList) {
        const filePath = `${chatId}/${Date.now()}_${f.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        
        const { error: uploadError } = await supabase.storage
          .from("chat-attachments")
          .upload(filePath, f.blobFile, {
            cacheControl: "3600",
            upsert: false,
          });

        let publicUrl;
        if (!uploadError) {
          const { data } = supabase.storage
            .from("chat-attachments")
            .getPublicUrl(filePath);
          publicUrl = data?.publicUrl;
        } else {
          // If storage bucket isn't created yet in console, fallback to object URL for local preview
          console.warn("Storage upload notice:", uploadError);
          publicUrl = URL.createObjectURL(f.blobFile);
        }

        files.push({
          contentType: f.blobFile.type || "application/octet-stream",
          name: f.name,
          url: publicUrl,
        });
      }

      await afterUpload(files);

      setIsLoading(false);
      setFileList([]);
      close();
    } catch (err) {
      setIsLoading(false);
      toaster.push(
        <Message type="error" closable duration={4000}>
          {err.message}
        </Message>
      );
    }
  };

  return (
    <>
      <InputGroup.Button onClick={open}>
        <i className="fa-solid fa-paperclip"></i>
      </InputGroup.Button>

      <Modal open={isOpen} onClose={close}>
        <Modal.Header>
          <Modal.Title>📎 Upload Study Materials & Attachments</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Uploader
            autoUpload={false}
            action=""
            fileList={fileList}
            onChange={onChange}
            multiple
            listType="picture-text"
            className="w-100"
            disabled={isLoading}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            block
            appearance="primary"
            disabled={isLoading || fileList.length === 0}
            onClick={onUpload}
          >
            Send to chat
          </Button>
          <div className="text-right mt-2">
            <small style={{ color: "#64748b" }}>* files up to 5 MB supported (PDF, images, notes)</small>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AttchmentBtnModal;
