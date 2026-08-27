import React, { useState, useRef } from "react";
import { Button, Message, Modal, toaster } from "rsuite";
import AvatarEditor from "react-avatar-editor";
import { useModalState } from "../../misc/custom-hooks";
import { useProfile } from "../../context/profile.context";
import { supabase } from "../../misc/supabaseClient";
import ProfileAvatar from "../ProfileAvatar";

const fileInputTypes = ".png, .jpeg, .jpg";
const acceptedFileTypes = ["image/png", "image/jpeg", "image/pjpeg"];
const isValidFile = (file) => acceptedFileTypes.includes(file.type);

const getBlob = (canvas) => {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("File process error"));
      }
    });
  });
};

const AvatarUploadBtn = () => {
  const { isOpen, open, close } = useModalState();
  const { profile, setProfile } = useProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [img, setImg] = useState(null);
  const avatarEditorRef = useRef();

  const onFileInputChange = (ev) => {
    const currentFiles = ev.target.files;

    if (currentFiles.length === 1) {
      const file = currentFiles[0];

      if (isValidFile(file)) {
        setImg(file);
        open();
      } else {
        toaster.push(
          <Message type="warning" duration={4000} closable>
            {`Wrong file type ${file.type}`}
          </Message>
        );
      }
    }
  };

  const onUploadClick = async () => {
    const canvas = avatarEditorRef.current.getImageScaledToCanvas();

    setIsLoading(true);

    try {
      const blob = await getBlob(canvas);
      const uid = profile?.uid || profile?.id;
      const filePath = `avatars/${uid}_${Date.now()}.png`;

      const { error: uploadError } = await supabase.storage
        .from("chat-attachments")
        .upload(filePath, blob, {
          contentType: "image/png",
          upsert: true,
        });

      let downloadUrl;
      if (!uploadError) {
        const { data } = supabase.storage
          .from("chat-attachments")
          .getPublicUrl(filePath);
        downloadUrl = data?.publicUrl;
      } else {
        downloadUrl = canvas.toDataURL();
      }

      await supabase
        .from("profiles")
        .update({ avatar: downloadUrl })
        .eq("id", uid);

      setProfile((prev) => ({
        ...prev,
        avatar: downloadUrl,
      }));

      setIsLoading(false);
      toaster.push(
        <Message type="info" closable duration={4000}>
          Avatar has been uploaded successfully!
        </Message>
      );
      close();
    } catch (error) {
      setIsLoading(false);
      toaster.push(
        <Message type="error" closable duration={4000}>
          {error.message || "Failed to upload avatar"}
        </Message>
      );
    }
  };

  return (
    <div className="mt-3 text-center">
      <ProfileAvatar
        src={profile?.avatar}
        name={profile?.name || "Student"}
        className="width-200 height-200 img-fullsize font-huge"
      />

      <div>
        <label
          htmlFor="avatar-upload"
          className="d-block cursor-pointer padded"
        >
          Select new avatar
          <input
            type="file"
            className="d-none"
            id="avatar-upload"
            accept={fileInputTypes}
            onChange={(e) => onFileInputChange(e)}
          />
        </label>

        <Modal open={isOpen} onClose={close}>
          <Modal.Header>
            <Modal.Title>Adjust and upload new avatar</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex justify-content-center align-items-center h-100">
              {img && (
                <AvatarEditor
                  ref={avatarEditorRef}
                  image={img}
                  width={200}
                  height={200}
                  border={10}
                  borderRadius={100}
                  rotate={0}
                />
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              block
              appearance="ghost"
              onClick={onUploadClick}
              disabled={isLoading}
            >
              Upload new avatar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AvatarUploadBtn;
