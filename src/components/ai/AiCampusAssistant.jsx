import React, { useState, useRef, useEffect } from "react";
import { Input, InputGroup, Button, Loader, SelectPicker } from "rsuite";
import SendIcon from "@rsuite/icons/Send";
import { aiService } from "../../misc/aiService";

const TOPIC_OPTIONS = [
  { label: "General", value: "General" },
  { label: "DBMS", value: "DBMS" },
  { label: "Cloud Computing", value: "Cloud Computing" },
  { label: "Operating Systems", value: "Operating Systems" },
  { label: "Data Structures", value: "DSA" },
  { label: "AI / Machine Learning", value: "AI/ML" },
  { label: "Computer Networks", value: "CN" },
];

const AiCampusAssistant = ({ onViewChange }) => {
  const [messages, setMessages] = useState([
    {
      id: "ai-welcome",
      role: "ai",
      text: "### 🎓 Welcome to CampusConnect AI!\n\nI'm your intelligent campus study assistant. Ask me anything about:\n\n• **DBMS** — Normalization, SQL, ACID, Indexing\n• **Cloud Computing** — IaaS, PaaS, SaaS, Virtualization, Load Balancing\n• **Operating Systems** — Process Scheduling, Deadlocks, Paging\n• **DSA** — Trees, Graphs, Sorting, Complexity Analysis\n\nYou can also:\n- 📝 Generate a practice quiz\n- 🗂️ Create flashcard decks\n- 📄 Summarize uploaded documents\n- 📅 Build a revision study plan\n\nWhat would you like to study today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [topic, setTopic] = useState("General");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = {
      id: "user-" + Date.now(),
      role: "user",
      text: input.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await aiService.askQuestion({ query: userMsg.text, topic });
      const aiMsg = {
        id: "ai-" + Date.now(),
        role: "ai",
        text: result.answer,
        sources: result.sources,
        suggestedActions: result.suggestedActions,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: "ai-err-" + Date.now(), role: "ai", text: "Sorry, I encountered an error. Please try again.", timestamp: new Date().toISOString() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedAction = (action) => {
    if (action.includes("Quiz")) {
      onViewChange && onViewChange("ai_quiz");
    } else if (action.includes("Flashcard")) {
      onViewChange && onViewChange("ai_flashcards");
    } else {
      setInput(action);
    }
  };

  return (
    <div className="h-100" style={{ display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border-subtle)",
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
          color: "#ffffff",
        }}
      >
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <span style={{ fontSize: "24px" }}>🤖</span>
            <div>
              <h5 style={{ margin: 0, fontWeight: 800, color: "#ffffff" }}>CampusConnect AI Assistant</h5>
              <div style={{ fontSize: "11px", opacity: 0.85 }}>Academic Q&A • PDF Summarizer • Quiz & Flashcard Generator</div>
            </div>
          </div>
          <SelectPicker
            data={TOPIC_OPTIONS}
            value={topic}
            onChange={setTopic}
            cleanable={false}
            searchable={false}
            size="sm"
            style={{ width: 160 }}
            placeholder="Select Topic"
          />
        </div>
      </div>

      {/* Chat Messages */}
      <div ref={scrollRef} className="custom-scroll" style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              marginBottom: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "85%",
                padding: "12px 16px",
                borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background: msg.role === "user" ? "var(--brand-primary)" : "var(--bg-surface)",
                color: msg.role === "user" ? "#ffffff" : "var(--text-primary)",
                border: msg.role === "user" ? "none" : "1px solid var(--border-subtle)",
                boxShadow: "var(--shadow-sm)",
                fontSize: "14px",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.text}
            </div>
            {msg.suggestedActions && msg.suggestedActions.length > 0 && (
              <div className="d-flex gap-2 mt-2 flex-wrap" style={{ gap: "6px", maxWidth: "85%" }}>
                {msg.suggestedActions.map((action) => (
                  <Button
                    key={action}
                    size="xs"
                    appearance="ghost"
                    color="blue"
                    onClick={() => handleSuggestedAction(action)}
                    style={{ fontWeight: 600, fontSize: "11px" }}
                  >
                    {action}
                  </Button>
                ))}
              </div>
            )}
            {msg.sources && (
              <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "4px" }}>
                Sources: {msg.sources.join(", ")}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Loader size="sm" />
            <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>AI is thinking...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border-subtle)", background: "var(--bg-surface)" }}>
        <InputGroup>
          <Input
            placeholder="Ask any academic question..."
            value={input}
            onChange={setInput}
            onKeyDown={(e) => e.keyCode === 13 && handleSend()}
            disabled={isLoading}
          />
          <InputGroup.Button color="violet" appearance="primary" onClick={handleSend} disabled={isLoading}>
            <SendIcon />
          </InputGroup.Button>
        </InputGroup>
      </div>
    </div>
  );
};

export default AiCampusAssistant;
