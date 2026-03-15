import React, { useEffect, useState } from "react";
import "../styles/FractionChefGame.css";

interface Fraction {
  num: number;
  den: number;
}

const gcd = (a: number, b: number): number => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
};

const simplify = (f: Fraction): Fraction => {
  const g = gcd(f.num, f.den);
  const sign = f.den < 0 ? -1 : 1;
  return {
    num: sign * (f.num / g),
    den: Math.abs(f.den / g)
  };
};

const subtract = (a: Fraction, b: Fraction): Fraction => {
  const lcm = (a.den * b.den) / gcd(a.den, b.den);
  const diff = {
    num: a.num * (lcm / a.den) - b.num * (lcm / b.den),
    den: lcm
  };
  return simplify(diff);
};

const fractionToString = (f: Fraction): string => {
  const s = simplify(f);
  if (s.den === 1) return `${s.num}`;
  return `${s.num}/${s.den}`;
};

const parseAnswer = (raw: string): string => {
  const t = raw.trim();
  if (/^[-+]?\d+$/.test(t)) return t.replace(/^\+/, "");
  const m = t.match(/^\s*([-+]?\d+)\s*\/?\s*(\d+)\s*$/);
  if (m) {
    const num = parseInt(m[1], 10);
    const den = parseInt(m[2], 10);
    if (den === 0) return t;
    return fractionToString({ num, den });
  }
  return t;
};

const recipes = [
  { name: "🥞 Pancakes", need: { num: 3, den: 4 } },
  { name: "🍕 Pizza Slice", need: { num: 1, den: 2 } },
  { name: "🍰 Cake", need: { num: 5, den: 6 } },
  { name: "🥗 Salad", need: { num: 2, den: 3 } },
  { name: "🍪 Cookie", need: { num: 1, den: 4 } }
];

const randomFraction = (): Fraction => {
  const den = Math.floor(Math.random() * 6) + 2;
  const num = Math.floor(Math.random() * (den - 1)) + 1;
  return { num, den };
};

const FractionChefGame: React.FC = () => {
  const [recipe, setRecipe] = useState(() => recipes[Math.floor(Math.random() * recipes.length)]);
  const [given, setGiven] = useState(() => randomFraction());
  const [score, setScore] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [streak, setStreak] = useState(0);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  const nextRound = () => {
    if (round >= 5) {
      setGameOver(true);
      return;
    }
    setRecipe(recipes[Math.floor(Math.random() * recipes.length)]);
    setGiven(randomFraction());
    setInput("");
    setFeedback("");
    setRound(round + 1);
  };

  const checkAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const correct = subtract(recipe.need, given);
    const userAnswer = parseAnswer(input);
    const correctAnswer = fractionToString(correct);

    if (userAnswer === correctAnswer) {
      setScore(score + 10);
      setStreak(streak + 1);
      setFeedback(`✅ Perfect! You cooked ${recipe.name}!`);
    } else {
      setScore(Math.max(0, score - 5));
      setStreak(0);
      setFeedback(`❌ Oops! You need ${correctAnswer} more sugar`);
    }
    setTimeout(nextRound, 1500);
  };

  const resetGame = () => {
    setRecipe(recipes[Math.floor(Math.random() * recipes.length)]);
    setGiven(randomFraction());
    setScore(0);
    setInput("");
    setFeedback("");
    setStreak(0);
    setRound(1);
    setGameOver(false);
  };

  return (
    <div className="chef-wrapper">
      <h1 className="chef-title">👨‍🍳 Fraction Chef</h1>
      <div className="chef-score">Score: {score} | 🔥 Streak: {streak} | Round: {round}/5</div>

      {!gameOver ? (
        <>
          <div className="chef-recipe-card">
            <h2>{recipe.name}</h2>
            <p>Recipe needs: {fractionToString(recipe.need)} cup sugar</p>
            <p>You have: {fractionToString(given)} cup sugar</p>
            <p className="chef-task">How much more sugar is needed?</p>
          </div>

          <form onSubmit={checkAnswer} className="chef-form">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter fraction e.g. 1/2"
              className="chef-input"
            />
            <button type="submit" className="chef-btn">Cook! 🍳</button>
          </form>

          {feedback && <div className="chef-feedback">{feedback}</div>}
        </>
      ) : (
        <div className="chef-end-screen">
          <h2>🎉 Game Complete!</h2>
          <p>Final Score: {score}</p>
          <h3>🏅 Your Badges:</h3>
          <div className="chef-badges">
            {score >= 30 && <span className="chef-badge">🥗 Salad Star</span>}
            {score >= 60 && <span className="chef-badge">🍕 Pizza Pro</span>}
            {score >= 100 && <span className="chef-badge">👨‍🍳 Master Chef</span>}
            {streak >= 3 && <span className="chef-badge">🔥 Hot Streak</span>}
          </div>
          <button onClick={resetGame} className="chef-btn">Play Again 🔄</button>
        </div>
      )}
    </div>
  );
};

export default FractionChefGame;
