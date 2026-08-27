import React, { useState } from "react";
import { Button, SelectPicker, Tag, Progress, Message, toaster } from "rsuite";
import { aiService } from "../../misc/aiService";

const DIFFICULTY_OPTIONS = [
  { label: "Easy", value: "Easy" },
  { label: "Medium", value: "Medium" },
  { label: "Hard", value: "Hard" },
];

const TOPIC_OPTIONS = [
  { label: "DBMS", value: "dbms" },
  { label: "Cloud Computing", value: "cloud" },
  { label: "Operating Systems", value: "os" },
];

const COUNT_OPTIONS = [
  { label: "5 Questions", value: 5 },
  { label: "10 Questions", value: 10 },
  { label: "15 Questions", value: 15 },
  { label: "20 Questions", value: 20 },
];

const AiQuizGenerator = () => {
  const [topic, setTopic] = useState("dbms");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionCount, setQuestionCount] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [weakTopics, setWeakTopics] = useState([]);

  const handleGenerateQuiz = async () => {
    setIsLoading(true);
    try {
      const result = await aiService.generateQuiz({ topic, difficulty, questionCount });
      setQuestions(result);
      setCurrentIndex(0);
      setScore(0);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setIsQuizComplete(false);
      setQuizStarted(true);
      setWeakTopics([]);
    } catch (err) {
      toaster.push(<Message type="error" closable duration={3000}>Failed to generate quiz</Message>);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (optionIndex) => {
    if (isAnswered) return;
    setSelectedAnswer(optionIndex);
    setIsAnswered(true);
    const q = questions[currentIndex];
    if (optionIndex === q.correctIndex) {
      setScore((prev) => prev + 1);
    } else {
      setWeakTopics((prev) => [...prev, q.topic]);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setIsQuizComplete(true);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsQuizComplete(false);
    setWeakTopics([]);
  };

  // Setup screen
  if (!quizStarted) {
    return (
      <div className="h-100 custom-scroll" style={{ overflowY: "auto", padding: "20px 24px 80px 24px" }}>
        <div style={{ maxWidth: 520, margin: "40px auto", textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📝</div>
          <h3 style={{ fontWeight: 800, marginBottom: "8px" }}>AI Quiz Generator</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "24px" }}>
            Generate practice questions powered by CampusConnect AI. Test your knowledge, track weak topics, and improve exam performance.
          </p>

          <div className="d-flex flex-column gap-3" style={{ gap: "16px", textAlign: "left" }}>
            <div>
              <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "4px" }}>Subject / Topic</label>
              <SelectPicker data={TOPIC_OPTIONS} value={topic} onChange={setTopic} cleanable={false} block />
            </div>
            <div>
              <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "4px" }}>Difficulty Level</label>
              <SelectPicker data={DIFFICULTY_OPTIONS} value={difficulty} onChange={setDifficulty} cleanable={false} block />
            </div>
            <div>
              <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "4px" }}>Number of Questions</label>
              <SelectPicker data={COUNT_OPTIONS} value={questionCount} onChange={setQuestionCount} cleanable={false} block />
            </div>
            <Button block color="blue" appearance="primary" onClick={handleGenerateQuiz} loading={isLoading} style={{ fontWeight: 700, marginTop: "8px" }}>
              🚀 Generate Quiz
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Results screen
  if (isQuizComplete) {
    const pct = Math.round((score / questions.length) * 100);
    const uniqueWeak = [...new Set(weakTopics)];
    return (
      <div className="h-100 custom-scroll" style={{ overflowY: "auto", padding: "20px 24px 80px 24px" }}>
        <div style={{ maxWidth: 520, margin: "40px auto", textAlign: "center" }}>
          <div style={{ fontSize: "56px", marginBottom: "12px" }}>{pct >= 80 ? "🏆" : pct >= 50 ? "📈" : "📚"}</div>
          <h3 style={{ fontWeight: 800 }}>Quiz Complete!</h3>
          <div style={{ fontSize: "48px", fontWeight: 900, color: pct >= 80 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#ef4444", margin: "16px 0" }}>
            {score}/{questions.length}
          </div>
          <Progress.Line percent={pct} strokeColor={pct >= 80 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#ef4444"} />
          <p style={{ color: "var(--text-secondary)", marginTop: "12px", fontSize: "14px" }}>
            {pct >= 80 ? "Excellent work! You have a strong grasp of this topic." : pct >= 50 ? "Good effort! Review the weak areas identified below." : "Keep studying! Focus on the topics listed below for improvement."}
          </p>
          {uniqueWeak.length > 0 && (
            <div style={{ marginTop: "16px", textAlign: "left" }}>
              <h6 style={{ fontWeight: 700, marginBottom: "8px" }}>🔴 Weak Topics to Review:</h6>
              <div className="d-flex flex-wrap gap-2" style={{ gap: "6px" }}>
                {uniqueWeak.map((t) => (<Tag key={t} color="red" size="sm">{t}</Tag>))}
              </div>
            </div>
          )}
          <div className="d-flex gap-2 mt-4" style={{ gap: "10px", justifyContent: "center" }}>
            <Button appearance="primary" color="blue" onClick={handleRetry} style={{ fontWeight: 600 }}>🔄 Retry Quiz</Button>
            <Button appearance="ghost" onClick={() => { setQuizStarted(false); }} style={{ fontWeight: 600 }}>New Quiz</Button>
          </div>
        </div>
      </div>
    );
  }

  // Question screen
  const q = questions[currentIndex];
  return (
    <div className="h-100 custom-scroll" style={{ overflowY: "auto", padding: "20px 24px 80px 24px" }}>
      <div style={{ maxWidth: 600, margin: "20px auto" }}>
        {/* Progress */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Tag color="blue" size="sm">Question {currentIndex + 1}/{questions.length}</Tag>
          <Tag color="green" size="sm">Score: {score}</Tag>
          <Tag size="sm">{difficulty}</Tag>
        </div>
        <Progress.Line percent={Math.round(((currentIndex + 1) / questions.length) * 100)} strokeColor="var(--brand-primary)" />

        {/* Question */}
        <div className="modern-card mt-3" style={{ padding: "20px" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "6px", fontWeight: 600, textTransform: "uppercase" }}>
            Topic: {q.topic}
          </div>
          <h5 style={{ fontWeight: 700, lineHeight: 1.5, marginBottom: "16px" }}>{q.question}</h5>

          <div className="d-flex flex-column" style={{ gap: "8px" }}>
            {q.options.map((opt, i) => {
              let bg = "var(--bg-surface-subtle)";
              let border = "1px solid var(--border-subtle)";
              let fontWeight = 500;
              if (isAnswered) {
                if (i === q.correctIndex) { bg = "rgba(16, 185, 129, 0.12)"; border = "2px solid #10b981"; fontWeight = 700; }
                else if (i === selectedAnswer && i !== q.correctIndex) { bg = "rgba(239, 68, 68, 0.12)"; border = "2px solid #ef4444"; }
              } else if (selectedAnswer === i) {
                bg = "rgba(37, 99, 235, 0.08)"; border = "2px solid var(--brand-primary)";
              }

              return (
                <div
                  key={i}
                  onClick={() => handleAnswer(i)}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "10px",
                    background: bg,
                    border,
                    cursor: isAnswered ? "default" : "pointer",
                    transition: "all 0.15s ease",
                    fontWeight,
                    fontSize: "14px",
                    color: "var(--text-primary)",
                  }}
                >
                  <span style={{ marginRight: "10px", fontSize: "13px", opacity: 0.6 }}>{String.fromCharCode(65 + i)}.</span>
                  {opt}
                  {isAnswered && i === q.correctIndex && <span style={{ float: "right", color: "#10b981" }}>✓</span>}
                  {isAnswered && i === selectedAnswer && i !== q.correctIndex && <span style={{ float: "right", color: "#ef4444" }}>✕</span>}
                </div>
              );
            })}
          </div>

          {isAnswered && (
            <div style={{ marginTop: "16px", padding: "12px", background: "var(--bg-surface-subtle)", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
              <div style={{ fontWeight: 700, fontSize: "13px", marginBottom: "4px", color: selectedAnswer === q.correctIndex ? "#10b981" : "#ef4444" }}>
                {selectedAnswer === q.correctIndex ? "✅ Correct!" : "❌ Incorrect"}
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>{q.explanation}</div>
            </div>
          )}

          {isAnswered && (
            <Button block color="blue" appearance="primary" onClick={handleNext} style={{ marginTop: "14px", fontWeight: 700 }}>
              {currentIndex + 1 >= questions.length ? "View Results" : "Next Question →"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiQuizGenerator;
