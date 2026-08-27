import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router";
import { Message, toaster } from "rsuite";
import { supabase } from "../../../misc/supabaseClient";
import { useProfile } from "../../../context/profile.context";
import { groupBy } from "../../../misc/helpers";
import MessageItem from "./MessageItem";
import ThreadDrawer from "../threads/ThreadDrawer";

const PAGE_SIZE = 50;

const Messages = ({ onPinMessage, pinnedMessageIds = [] }) => {
  const { chatId } = useParams();
  const { profile } = useProfile();
  const [messages, setMessages] = useState([]);
  const [activeThreadMessage, setActiveThreadMessage] = useState(null);
  const [threadReplies, setThreadReplies] = useState({});
  const [isThreadOpen, setIsThreadOpen] = useState(false);
  const selfRef = useRef();

  const isChatEmpty = messages && messages.length === 0;
  const canShowMessages = messages && messages.length > 0;

  const fetchMessages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("room_id", chatId)
        .order("created_at", { ascending: true })
        .limit(PAGE_SIZE);

      if (error) throw error;
      if (data) {
        setMessages(data);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  }, [chatId]);

  useEffect(() => {
    fetchMessages();

    // Subscribe to realtime messages in this room
    const channel = supabase
      .channel(`public:messages:${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${chatId}`,
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, fetchMessages]);

  useEffect(() => {
    const node = selfRef.current;
    if (node) {
      node.scrollTop = node.scrollHeight;
    }
  }, [messages]);

  const handleAdmin = useCallback(
    async (uid) => {
      toaster.push(
        <Message type="info" closable duration={4000}>
          Admin privileges updated for room.
        </Message>
      );
    },
    []
  );

  const handleLike = useCallback(
    async (msgId) => {
      const currentUid = profile?.uid || profile?.id;
      if (!currentUid) return;

      const targetMsg = messages.find((m) => m.id === msgId);
      if (!targetMsg) return;

      const currentLikes = targetMsg.likes || {};
      const isLiked = !!currentLikes[currentUid];

      const newLikes = { ...currentLikes };
      let newCount = targetMsg.like_count || targetMsg.likeCount || 0;

      if (isLiked) {
        delete newLikes[currentUid];
        newCount = Math.max(0, newCount - 1);
      } else {
        newLikes[currentUid] = true;
        newCount += 1;
      }

      // Optimistic update
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msgId
            ? { ...m, likes: newLikes, like_count: newCount, likeCount: newCount }
            : m
        )
      );

      try {
        await supabase
          .from("messages")
          .update({ likes: newLikes, like_count: newCount })
          .eq("id", msgId);
      } catch (err) {
        console.error("Like update failed:", err);
      }
    },
    [messages, profile]
  );

  const handleDelete = useCallback(
    async (msgId) => {
      if (!window.confirm("Delete this message?")) {
        return;
      }

      setMessages((prev) => prev.filter((m) => m.id !== msgId));

      try {
        await supabase.from("messages").delete().eq("id", msgId);
        toaster.push(
          <Message type="info" closable duration={4000}>
            Message has been deleted
          </Message>
        );
      } catch (err) {
        toaster.push(
          <Message type="error" closable duration={4000}>
            {err.message}
          </Message>
        );
      }
    },
    []
  );

  const handleOpenThread = (msg) => {
    setActiveThreadMessage(msg);
    setIsThreadOpen(true);
  };

  const handleSendThreadReply = async (rootMsgId, replyText) => {
    const currentUid = profile?.uid || profile?.id;
    const newReply = {
      id: "reply-" + Date.now(),
      author: {
        name: profile?.name || "Student",
        uid: currentUid,
        avatar: profile?.avatar,
      },
      text: replyText,
      createdAt: new Date().toISOString(),
    };

    setThreadReplies((prev) => ({
      ...prev,
      [rootMsgId]: [...(prev[rootMsgId] || []), newReply],
    }));

    toaster.push(<Message type="success" duration={2500}>Thread reply posted!</Message>);
  };

  const handleToggleReaction = useCallback(
    async (msgId, emoji) => {
      const currentUid = profile?.uid || profile?.id;
      if (!currentUid) return;

      const targetMsg = messages.find((m) => m.id === msgId);
      if (!targetMsg) return;

      const reactions = { ...(targetMsg.reactions || {}) };
      const currentList = Array.isArray(reactions[emoji]) ? [...reactions[emoji]] : [];

      if (currentList.includes(currentUid)) {
        reactions[emoji] = currentList.filter((u) => u !== currentUid);
      } else {
        reactions[emoji] = [...currentList, currentUid];
      }

      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, reactions } : m))
      );

      try {
        await supabase
          .from("messages")
          .update({ reactions })
          .eq("id", msgId);
      } catch (err) {
        console.error("Reaction update error:", err);
      }
    },
    [messages, profile]
  );

  const handleVotePoll = useCallback(
    async (msgId, optionId) => {
      const currentUid = profile?.uid || profile?.id;
      if (!currentUid) return;

      const targetMsg = messages.find((m) => m.id === msgId);
      if (!targetMsg || !targetMsg.poll) return;

      const updatedOptions = targetMsg.poll.options.map((opt) => {
        const votes = Array.isArray(opt.votes) ? [...opt.votes] : [];
        if (opt.id === optionId) {
          if (!votes.includes(currentUid)) {
            votes.push(currentUid);
          }
        } else {
          // Remove previous vote if single-choice
          const idx = votes.indexOf(currentUid);
          if (idx !== -1) votes.splice(idx, 1);
        }
        return { ...opt, votes };
      });

      const updatedPoll = { ...targetMsg.poll, options: updatedOptions };

      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, poll: updatedPoll } : m))
      );

      try {
        await supabase
          .from("messages")
          .update({ poll: updatedPoll })
          .eq("id", msgId);
      } catch (err) {
        console.error("Poll vote update error:", err);
      }
    },
    [messages, profile]
  );

  const renderMessages = () => {
    const groups = groupBy(messages, (item) =>
      new Date(item.created_at || item.createdAt).toDateString()
    );

    const items = [];

    Object.keys(groups).forEach((date) => {
      items.push(
        <li key={date} className="text-center mb-1 padded">
          {date}
        </li>
      );

      const msgs = groups[date].map((msg) => (
        <MessageItem
          key={msg.id}
          message={{
            ...msg,
            createdAt: msg.created_at || msg.createdAt,
            likeCount: msg.like_count !== undefined ? msg.like_count : msg.likeCount,
          }}
          handleAdmin={handleAdmin}
          handleLike={handleLike}
          handleDelete={handleDelete}
          onOpenThread={handleOpenThread}
          onToggleReaction={handleToggleReaction}
          onVotePoll={handleVotePoll}
          onPinMessage={onPinMessage}
          isPinned={pinnedMessageIds.includes(msg.id)}
        />
      ));

      items.push(...msgs);
    });

    return items;
  };

  return (
    <>
      <ul ref={selfRef} className="msg-list custom-scroll">
        {isChatEmpty && (
          <li className="text-center mt-3 text-muted">
            🎓 Welcome! Start the campus conversation below.
          </li>
        )}
        {canShowMessages && renderMessages()}
      </ul>

      <ThreadDrawer
        isOpen={isThreadOpen}
        onClose={() => setIsThreadOpen(false)}
        rootMessage={activeThreadMessage}
        replies={activeThreadMessage ? threadReplies[activeThreadMessage.id] || [] : []}
        onSendReply={handleSendThreadReply}
      />
    </>
  );
};

export default Messages;
