import React, { useEffect, useMemo, useState } from "react";
import "../styles/MathMazeAdventure.css";

type Topic = "fractions" | "decimals" | "geometry";

interface PathNode {
  id: string;
  prompt: string;
  answer: string; // canonical string answer (e.g., "1/2", "0.75", "180")
}

interface LevelConfig {
  id: number;
  topic: Topic;
  timeLimitSec: number;
  nodes: PathNode[];
}

const sampleLevels: LevelConfig[] = [
  {
    id: 1,
    topic: "fractions",
    timeLimitSec: 45,
    nodes: [
      { id: "A", prompt: "Simplify: 2/4", answer: "1/2" },
      { id: "B", prompt: "Add: 1/4 + 1/4", answer: "1/2" },
      { id: "C", prompt: "Which is bigger? 3/5 or 1/2 (enter 3/5 or 1/2)", answer: "3/5" },
    ],
  },
  {
    id: 2,
    topic: "decimals",
    timeLimitSec: 45,
    nodes: [
      { id: "A", prompt: "0.25 + 0.5 = ?", answer: "0.75" },
      { id: "B", prompt: "Write 1/4 as decimal", answer: "0.25" },
      { id: "C", prompt: "Round 3.141 to 2 decimals", answer: "3.14" },
    ],
  },
  {
    id: 3,
    topic: "geometry",
    timeLimitSec: 45,
    nodes: [
      { id: "A", prompt: "Sum of angles in triangle?", answer: "180" },
      { id: "B", prompt: "Right angle in degrees?", answer: "90" },
      { id: "C", prompt: "How many sides in a hexagon?", answer: "6" },
    ],
  },
];

const normalize = (s: string) => s.trim().replace(/^\+/, "");

const MathMazeAdventure: React.FC = () => {
  const [levelIndex, setLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [stars, setStars] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [selectedNode, setSelectedNode] = useState<PathNode | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(sampleLevels[0].timeLimitSec);
  const [finished, setFinished] = useState(false);
  const [visited, setVisited] = useState<Record<string, boolean>>({});
  const [completedAll, setCompletedAll] = useState(false);

  const level = sampleLevels[levelIndex];

  useEffect(() => {
    setTimeLeft(level.timeLimitSec);
    setVisited({});
    setSelectedNode(null);
    setInput("");
    setFeedback("");
  }, [levelIndex]);

  useEffect(() => {
    if (finished) return;
    if (timeLeft <= 0) {
      // time over -> finish game and show summary
      finalizeRun();
      return;
    }
    const t = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, finished]);

  const handlePickNode = (node: PathNode) => {
    setSelectedNode(node);
    setInput("");
    setFeedback("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNode) return;
    if (normalize(input) === normalize(selectedNode.answer)) {
      setScore((s) => s + 10);
      setStreak((k) => k + 1);
      setFeedback("✅ Path unlocked!");
      // Proceed to next node or next level
      setSelectedNode(null);
      setVisited((v) => ({ ...v, [selectedNode.id]: true }));
      // When all nodes attempted, go next level
      if (score + 10 >= (levelIndex + 1) * 30) {
        advanceLevel();
      }
    } else {
      handleTrap();
    }
  };

  const handleTrap = () => {
    setScore((s) => Math.max(0, s - 5));
    setStreak(0);
    setFeedback("⚠️ Trap! You lost time.");
    setTimeLeft((t) => Math.max(0, t - 5));
  };

  const advanceLevel = () => {
    const next = levelIndex + 1;
    // award stars based on remaining time
    const newStars = timeLeft > 25 ? 3 : timeLeft > 10 ? 2 : 1;
    setStars((st) => st + newStars);
    if (next >= sampleLevels.length) {
      setCompletedAll(true);
      finalizeRun(newStars);
      return;
    }
    setLevelIndex(next);
    setSelectedNode(null);
    setFeedback("");
    setInput("");
  };

  const finalizeRun = (lastStars = 0) => {
    const totalStars = stars + lastStars;
    const earned: string[] = [];
    if (totalStars >= 7) earned.push("Maze Master");
    if (score >= 60) earned.push("Speed Runner");
    if (streak >= 3) earned.push("Hot Streak");
    setBadges(earned);
    setFinished(true);
  };

  const progress = useMemo(
    () => (completedAll ? 100 : Math.round(((levelIndex) / sampleLevels.length) * 100)),
    [levelIndex, completedAll]
  );

  return (
    <div className="maze-wrapper">
      <header className="maze-header">
        <div className="maze-title">🧩 Math Maze Adventure</div>
        <div className="maze-stats">
          <div className="mz-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="mz-stat"><span>Streak</span><strong>{streak}🔥</strong></div>
          <div className="mz-stat"><span>Stars</span><strong>{stars}⭐</strong></div>
          <div className="mz-stat"><span>Time</span><strong>{timeLeft}s</strong></div>
        </div>
      </header>

      <div className="maze-progress"><div className="maze-progress-inner" style={{ width: `${progress}%` }} /></div>

      {!finished ? (
        <div className="maze-card">
          <div className="maze-level-pill">Level {level.id} · {level.topic}</div>
          <div className="maze-grid">
            {level.nodes.map((n) => (
              <button key={n.id} className={`maze-node ${visited[n.id] ? "done" : ""} ${selectedNode?.id === n.id ? "active" : ""}`} onClick={() => handlePickNode(n)}>
                Path {n.id}
              </button>
            ))}
          </div>

          <div className="maze-minimap">
            {level.nodes.map((n) => (
              <div key={n.id} className={`mm-cell ${visited[n.id] ? "mm-done" : ""} ${selectedNode?.id === n.id ? "mm-current" : ""}`}>{n.id}</div>
            ))}
          </div>

          {selectedNode ? (
            <form className="maze-form" onSubmit={handleSubmit}>
              <div className="maze-prompt">{selectedNode.prompt}</div>
              <input className="maze-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Your answer" />
              <button className="maze-btn primary" type="submit">Unlock Path</button>
            </form>
          ) : (
            <div className="maze-helper">Pick a path to attempt the problem.</div>
          )}

          {feedback && <div className="maze-feedback">{feedback}</div>}
        </div>
      ) : (
        <div className="maze-finish">
          <h3>🎉 Treasure found!</h3>
          <p>Total Score: <strong>{score}</strong> · Stars: <strong>{stars}</strong></p>
          {badges.length > 0 && (
            <div className="maze-badges">
              {badges.map((b) => (
                <span key={b} className="maze-badge">{b}</span>
              ))}
            </div>
          )}
          <button className="maze-btn" onClick={() => window.location.reload()}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default MathMazeAdventure;


