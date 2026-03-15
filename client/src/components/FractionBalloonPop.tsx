import React, { useEffect, useState } from "react";
import "../styles/FractionBalloonPop.css";

interface Balloon {
  id: number;
  fraction: string;
  top: number;
  left: number;
}

// Utility to trim trailing zeros in decimals
const trimDecimal = (n: number, digits = 2): string => {
  const s = n.toFixed(digits);
  return s.replace(/\.?0+$/, "");
};

// Generate a value string that may be a proper fraction, mixed fraction, or decimal
const generateValueString = (): string => {
  const mode = Math.random(); // < 0.4 fraction, < 0.7 mixed, else decimal
  const den = Math.floor(Math.random() * 8) + 2; // 2..9
  const num = Math.floor(Math.random() * (den - 1)) + 1; // 1..den-1
  const whole = Math.floor(Math.random() * 3); // 0..2

  if (mode < 0.4) {
    // proper fraction
    return `${num}/${den}`;
  } else if (mode < 0.7) {
    // mixed fraction, ensure whole >= 1
    const w = Math.max(1, whole);
    return `${w} ${num}/${den}`;
  }
  // decimal
  const value = whole + num / den;
  return trimDecimal(value, 2);
};

// Convert a displayed value string (e.g., "3/4", "1 1/2", "0.75") to a numeric value
const toNumber = (s: string): number | null => {
  const t = s.trim();
  // mixed fraction: a b/c
  const mixed = t.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) {
    const a = parseInt(mixed[1], 10);
    const b = parseInt(mixed[2], 10);
    const c = parseInt(mixed[3], 10);
    if (c === 0) return null;
    return a + b / c;
  }
  // fraction: a/b
  const frac = t.match(/^(\d+)\/(\d+)$/);
  if (frac) {
    const a = parseInt(frac[1], 10);
    const b = parseInt(frac[2], 10);
    if (b === 0) return null;
    return a / b;
  }
  // decimal or integer
  const n = Number(t);
  return Number.isNaN(n) ? null : n;
};

const FractionBalloonPop: React.FC = () => {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [target, setTarget] = useState(generateValueString());
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [badges, setBadges] = useState<string[]>([]);
  const [poppedId, setPoppedId] = useState<number | null>(null);

  const generateBalloons = () => {
    const newBalloons: Balloon[] = [];
    for (let i = 0; i < 5; i++) {
      newBalloons.push({
        id: i,
        fraction: i === 0 ? target : generateValueString(),
        top: Math.random() * 70 + 10,
        left: Math.random() * 70 + 10,
      });
    }
    setBalloons(newBalloons.sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    if (!gameOver) generateBalloons();
  }, [round, target, gameOver]);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameOver) {
      nextRound(false);
    }
  }, [timeLeft, gameOver]);

  const popBalloon = (id: number, fraction: string) => {
    if (gameOver) return;
    setPoppedId(id);
    const fv = toNumber(fraction);
    const tv = toNumber(target);
    const correct = fv !== null && tv !== null && Math.abs(fv - tv) < 1e-9;
    if (correct) {
      setScore((s) => s + 10);
    } else {
      setScore((s) => Math.max(0, s - 5));
    }
    setTimeout(() => nextRound(correct), 300);
  };

  const nextRound = (correct: boolean) => {
    const newStars = timeLeft > 15 ? 3 : timeLeft > 7 ? 2 : 1;
    setStars((st) => st + (correct ? newStars : 0));
    if (round >= 5) {
      setGameOver(true);
      awardBadges();
    } else {
      setRound((r) => r + 1);
      setTarget(generateValueString());
      setTimeLeft(20);
      setBalloons([]);
      setPoppedId(null);
    }
  };

  const awardBadges = () => {
    const earned: string[] = [];
    if (score >= 50) earned.push("Balloon Master 🏅");
    if (stars >= 10) earned.push("Star Collector ⭐");
    if (score >= 30) earned.push("Quick Popper ⚡");
    if (score < 30) earned.push("Resilient Popper ✅");
    setBadges(earned);
  };

  return (
    <div className="balloon-game">
      <h1>🎈 Fraction Balloon Pop</h1>
      {!gameOver ? (
        <>
          <h2>Round {round} / 5</h2>
          <p className="balloon-target">Pop the fraction: {target}</p>
          <p className="balloon-timer">⏳ Time Left: {timeLeft}s</p>
          <div className="balloon-container">
            {balloons.map((b) => (
              <button
                key={b.id}
                className={`balloon ${poppedId === b.id ? "popped" : ""}`}
                style={{ top: `${b.top}%`, left: `${b.left}%` }}
                onClick={() => popBalloon(b.id, b.fraction)}
              >
                {b.fraction}
              </button>
            ))}
          </div>
          <p className="balloon-score">Score: {score} · Stars: {stars}</p>
        </>
      ) : (
        <div className="balloon-end">
          <h2>🎉 Game Over!</h2>
          <p>Final Score: {score} · Stars: {stars}</p>
          <h3>🏅 Badges Earned:</h3>
          <div className="balloon-badges">
            {badges.map((b, i) => (
              <span key={i} className="balloon-badge">{b}</span>
            ))}
          </div>
          <button onClick={() => window.location.reload()}>Play Again 🔄</button>
        </div>
      )}
    </div>
  );
};

export default FractionBalloonPop;


