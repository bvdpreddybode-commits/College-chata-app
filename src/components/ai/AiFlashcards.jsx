import React, { useState } from "react";
import { Button, SelectPicker, Tag, Progress } from "rsuite";
import { aiService } from "../../misc/aiService";

const TOPIC_OPTIONS = [
  { label: "DBMS", value: "dbms" },
  { label: "Cloud Computing", value: "cloud" },
  { label: "Operating Systems", value: "os" },
];

const AiFlashcards = () => {
  const [topic, setTopic] = useState("dbms");
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [markedDifficult, setMarkedDifficult] = useState({});
  const [reviewedCount, setReviewedCount] = useState(0);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const result = await aiService.generateFlashcards({ topic, count: 8 });
      setCards(result);
      setCurrentIndex(0);
      setIsFlipped(false);
      setStarted(true);
      setMarkedDifficult({});
      setReviewedCount(0);
    } catch (err) {
      console.error("Flashcard generation failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlip = () => setIsFlipped((prev) => !prev);

  const handleNext = () => {
    setReviewedCount((prev) => Math.min(prev + 1, cards.length));
    if (currentIndex + 1 < cards.length) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  };

  const toggleDifficult = () => {
    setMarkedDifficult((prev) => ({
      ...prev,
      [currentIndex]: !prev[currentIndex],
    }));
  };

  // Setup screen
  if (!started) {
    return (
      <div className="h-100 custom-scroll" style={{ overflowY: "auto", padding: "20px 24px 80px 24px" }}>
        <div style={{ maxWidth: 480, margin: "60px auto", textAlign: "center" }}>
          <div style={{ fontSize: "56px", marginBottom: "12px" }}>🗂️</div>
          <h3 style={{ fontWeight: 800 }}>AI Flashcards</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "24px" }}>
            Interactive 3D flip flashcards for rapid revision. Mark difficult cards for later review.
          </p>
          <div style={{ maxWidth: 300, margin: "0 auto", textAlign: "left" }}>
            <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "4px" }}>Topic</label>
            <SelectPicker data={TOPIC_OPTIONS} value={topic} onChange={setTopic} cleanable={false} block />
            <Button block color="blue" appearance="primary" onClick={handleGenerate} loading={isLoading} style={{ fontWeight: 700, marginTop: "16px" }}>
              🗂️ Generate Flashcards
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const card = cards[currentIndex];
  const difficultCount = Object.values(markedDifficult).filter(Boolean).length;

  return (
    <div className="h-100 custom-scroll" style={{ overflowY: "auto", padding: "20px 24px 80px 24px" }}>
      <div style={{ maxWidth: 540, margin: "20px auto" }}>
        {/* Progress bar */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Tag color="blue" size="sm">Card {currentIndex + 1}/{cards.length}</Tag>
          <Tag color="orange" size="sm">🔴 {difficultCount} Marked Difficult</Tag>
          <Tag color="green" size="sm">Reviewed: {Math.min(reviewedCount, cards.length)}</Tag>
        </div>
        <Progress.Line percent={Math.round(((currentIndex + 1) / cards.length) * 100)} strokeColor="var(--brand-primary)" />

        {/* Topic badge */}
        {card?.topic && (
          <div style={{ textAlign: "center", marginTop: "12px" }}>
            <Tag size="sm">{card.topic}</Tag>
          </div>
        )}

        {/* 3D Flashcard */}
        <div className="flashcard-container" onClick={handleFlip}>
          <div className={`flashcard-inner ${isFlipped ? "flipped" : ""}`}>
            <div className="flashcard-front">
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "10px", textTransform: "uppercase", fontWeight: 700 }}>
                Question
              </div>
              <div style={{ fontSize: "16px", fontWeight: 600, lineHeight: 1.6 }}>{card?.front}</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "16px" }}>
                Click to flip →
              </div>
            </div>
            <div className="flashcard-back">
              <div style={{ fontSize: "12px", opacity: 0.8, marginBottom: "10px", textTransform: "uppercase", fontWeight: 700 }}>
                Answer
              </div>
              <div style={{ fontSize: "15px", lineHeight: 1.6 }}>{card?.back}</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="d-flex justify-content-between align-items-center mt-3" style={{ gap: "8px" }}>
          <Button appearance="subtle" onClick={handlePrev} disabled={currentIndex === 0} style={{ fontWeight: 600 }}>
            ← Previous
          </Button>
          <div className="d-flex gap-2" style={{ gap: "8px" }}>
            <Button
              size="sm"
              appearance={markedDifficult[currentIndex] ? "primary" : "ghost"}
              color="red"
              onClick={toggleDifficult}
              style={{ fontWeight: 600 }}
            >
              {markedDifficult[currentIndex] ? "🔴 Difficult" : "Mark Difficult"}
            </Button>
          </div>
          <Button
            appearance={currentIndex + 1 >= cards.length ? "ghost" : "primary"}
            color="blue"
            onClick={handleNext}
            disabled={currentIndex + 1 >= cards.length}
            style={{ fontWeight: 600 }}
          >
            Next →
          </Button>
        </div>

        {currentIndex + 1 >= cards.length && (
          <div className="text-center mt-4">
            <h5 style={{ fontWeight: 700 }}>🎉 Deck Complete!</h5>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              You've reviewed all {cards.length} flashcards. {difficultCount > 0 ? `${difficultCount} marked for review.` : "Great job!"}
            </p>
            <Button color="blue" appearance="primary" onClick={() => setStarted(false)} style={{ fontWeight: 600 }}>
              Generate New Deck
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiFlashcards;
