import React, { useState, useCallback } from "react";
import { InputGroup, Message, toaster } from "rsuite";
import { ReactMic } from "react-mic";
import { useParams } from "react-router";
import { supabase } from "../../../misc/supabaseClient";

const AudioMsgBtn = ({ afterUpload }) => {
  const { chatId } = useParams();

  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const onClick = useCallback(() => {
    setIsRecording((p) => !p);
  }, []);

  const onUpload = useCallback(
    async (data) => {
      setIsUploading(true);
      try {
        const fileName = `audio_${Date.now()}.mp3`;
        const filePath = `${chatId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("chat-attachments")
          .upload(filePath, data.blob, {
            contentType: "audio/mp3",
            upsert: false,
          });

        let publicUrl;
        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from("chat-attachments")
            .getPublicUrl(filePath);
          publicUrl = urlData?.publicUrl;
        } else {
          publicUrl = URL.createObjectURL(data.blob);
        }

        const file = {
          contentType: "audio/mp3",
          name: fileName,
          url: publicUrl,
        };

        setIsUploading(false);
        afterUpload([file]);
      } catch (error) {
        setIsUploading(false);
        toaster.push(
          <Message type="error" closable duration={4000}>
            {error.message}
          </Message>
        );
      }
    },
    [afterUpload, chatId]
  );

  return (
    <InputGroup.Button
      onClick={onClick}
      disabled={isUploading}
      className={isRecording ? "animate-blink" : ""}
    >
      <i className="fa-solid fa-microphone"></i>
      <ReactMic
        record={isRecording}
        className="d-none"
        onStop={onUpload}
        mimeType="audio/mp3"
      />
    </InputGroup.Button>
  );
};

export default AudioMsgBtn;
