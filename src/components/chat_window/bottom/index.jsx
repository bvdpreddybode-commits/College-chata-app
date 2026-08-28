import React, { useCallback, useState } from "react";
import { Checkbox, Input, InputGroup, Message, toaster } from "rsuite";
import SendIcon from "@rsuite/icons/Send";
import { useParams } from "react-router";
import { useProfile } from "../../../context/profile.context";
import { supabase } from "../../../misc/supabaseClient";
import AttchmentBtnModal from "./AttchmentBtnModal";
import AudioMsgBtn from "./AudioMsgBtn";
import CreatePollModal from "../polls/CreatePollModal";

function assembleMessage(profile, chatId, isAnonymous = false) {
  const uid = profile?.uid || profile?.id || "guest";
  if (isAnonymous) {
    return {
      room_id: chatId,
      author: {
        name: "Anonymous Student",
        uid: "anon_" + (uid ? uid.slice(0, 6) : "guest"),
        createdAt: Date.now(),
        role: "Student",
        department: "Campus",
      },
      created_at: new Date().toISOString(),
      like_count: 0,
      likes: {},
    };
  }

  return {
    room_id: chatId,
    author: {
      name: profile?.name || "Student",
      uid: uid,
      createdAt: profile?.created_at || Date.now(),
      department: profile?.department || "Computer Science",
      rollNo: profile?.rollNo || profile?.roll_no || "",
      role: profile?.role || "Student",
      batch: profile?.batch || "3rd Year",
      ...(profile?.avatar ? { avatar: profile.avatar } : {}),
    },
    created_at: new Date().toISOString(),
    like_count: 0,
    likes: {},
  };
}

const ChatBottom = () => {
  const [input, setInput] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);

  const { chatId } = useParams();
  const { profile } = useProfile();

  const onInputChange = useCallback((value) => {
    setInput(value);
  }, []);

  const handleCreatePoll = async (pollData) => {
    const messageId = "msg-" + Date.now() + "-" + Math.random().toString(36).substr(2, 6);
    const msgData = {
      id: messageId,
      ...assembleMessage(profile, chatId, isAnonymous),
      text: `📊 Poll: ${pollData.question}`,
      poll: pollData,
    };

    try {
      await supabase.from("messages").insert(msgData);
      await supabase
        .from("rooms")
        .update({ last_message: msgData })
        .eq("id", chatId);
    } catch (err) {
      console.error("Poll send error:", err);
    }
  };

  const onSendClick = async () => {
    if (input.trim() === "") return;

    const messageId = "msg-" + Date.now() + "-" + Math.random().toString(36).substr(2, 6);
    const msgData = {
      id: messageId,
      ...assembleMessage(profile, chatId, isAnonymous),
      text: input.trim(),
    };

    setInput("");
    setIsLoading(true);

    // Optimistic local dispatch
    try {
      const cachedRaw = localStorage.getItem("campus_messages_" + chatId);
      const list = cachedRaw ? JSON.parse(cachedRaw) : [];
      if (!list.some((m) => m.id === msgData.id)) {
        list.push(msgData);
        localStorage.setItem("campus_messages_" + chatId, JSON.stringify(list));
      }
      window.dispatchEvent(new CustomEvent("campus_new_message_" + chatId, { detail: msgData }));
    } catch (e) {
      // ignore
    }

    try {
      // 1. Ensure room exists in Supabase to prevent foreign key violation
      const { data: existingRoom } = await supabase
        .from("rooms")
        .select("id")
        .eq("id", chatId)
        .maybeSingle();

      if (!existingRoom) {
        const isDm = chatId.startsWith("dm_") || chatId.startsWith("dm-");
        await supabase.from("rooms").upsert({
          id: chatId,
          name: isDm ? "Private Direct Message" : "Campus Study Group",
          description: isDm ? "Private 1-on-1 Direct Message" : "Campus Study Channel",
          created_at: new Date().toISOString(),
          is_dm: isDm,
          admins: { system: true },
          members: [],
        });
      }

      // 2. Insert message into Supabase
      const { error } = await supabase.from("messages").insert(msgData);
      if (error) {
        console.warn("Supabase message insert notice:", error.message);
      }

      // 3. Update room last_message
      await supabase
        .from("rooms")
        .update({ last_message: msgData })
        .eq("id", chatId);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Send message error:", error);
    }
  };

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      onSendClick();
    }
  };

  const afterUpload = useCallback(
    async (files) => {
      setIsLoading(true);

      try {
        for (const file of files) {
          const messageId = "msg-" + Date.now() + "-" + Math.random().toString(36).substr(2, 6);
          const msgData = {
            id: messageId,
            ...assembleMessage(profile, chatId, isAnonymous),
            file: file,
          };

          await supabase.from("messages").insert(msgData);
          await supabase
            .from("rooms")
            .update({ last_message: msgData })
            .eq("id", chatId);
        }
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        toaster.push(
          <Message type="error" closable duration={4000}>
            {err.message}
          </Message>
        );
      }
    },
    [profile, chatId, isAnonymous]
  );

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-1" style={{ fontSize: "11px", color: "var(--text-muted)" }}>
        <Checkbox
          checked={isAnonymous}
          onChange={(val, checked) => setIsAnonymous(checked)}
          style={{ margin: 0, padding: 0 }}
        >
          <span style={{
            fontSize: "11px",
            fontWeight: isAnonymous ? 700 : 400,
            color: isAnonymous ? "var(--accent)" : "var(--text-muted)",
            transition: "all var(--transition-fast)",
          }}>
            🕵️ {isAnonymous ? "Anonymous Mode ON" : "Ask Anonymously"}
          </span>
        </Checkbox>

        <div className="d-flex align-items-center" style={{ gap: "4px" }}>
          <button
            type="button"
            onClick={() => {
              setInput((prev) => (prev ? `${prev}\n\`\`\`javascript\n// Write code here\n\`\`\`` : `\`\`\`javascript\n// Write code here\n\`\`\``));
            }}
            title="Insert Code Snippet block"
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-full)",
              padding: "3px 10px",
              fontSize: "11px",
              fontWeight: 600,
              cursor: "pointer",
              color: "var(--text-secondary)",
              transition: "all var(--transition-fast)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.color = "var(--primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
          >
            💻 Code
          </button>

          <button
            type="button"
            onClick={() => setIsPollModalOpen(true)}
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-full)",
              padding: "3px 10px",
              fontSize: "11px",
              fontWeight: 600,
              cursor: "pointer",
              color: "var(--text-secondary)",
              transition: "all var(--transition-fast)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
          >
            📊 Poll
          </button>
        </div>
      </div>

      <InputGroup
        style={{
          borderRadius: "var(--radius-lg)",
          border: "1.5px solid var(--border)",
          overflow: "hidden",
          boxShadow: "var(--shadow-sm)",
          transition: "all var(--transition-fast)",
        }}
      >
        <AttchmentBtnModal afterUpload={afterUpload} />
        <AudioMsgBtn afterUpload={afterUpload} />
        <Input
          placeholder={isAnonymous ? "Type your anonymous question…" : "Type a message…"}
          value={input}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          style={{ fontSize: "13px" }}
        />
        <InputGroup.Button
          color="blue"
          appearance="primary"
          onClick={onSendClick}
          disabled={isLoading || !input.trim()}
          style={{
            background: input.trim() ? "linear-gradient(135deg, var(--primary), var(--accent))" : undefined,
            transition: "all var(--transition-fast)",
          }}
        >
          <SendIcon />
        </InputGroup.Button>
      </InputGroup>

      <CreatePollModal
        isOpen={isPollModalOpen}
        onClose={() => setIsPollModalOpen(false)}
        onCreatePoll={handleCreatePoll}
      />
    </div>
  );
};

export default ChatBottom;
