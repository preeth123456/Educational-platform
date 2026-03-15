import React, { useState, useMemo, useEffect } from "react";
import "./PerformancePage.css";
import { Chart, ArcElement, Tooltip, Legend, RadialLinearScale, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from "chart.js";
import jsPDF from "jspdf";
import StudentLayout from "../components/StudentLayout";
import { FaBookOpen, FaClipboardCheck, FaBullseye } from "react-icons/fa";
import { Link } from "wouter";
 
 
Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);
 
const studentName = "Virat";
 
const radialStats = [
  { label: "Course Completion", value: 75, delta: 10, color: "#6C63FF", icon: <FaBookOpen /> },
  { label: "Assignments Submitted", value: 80, delta: 5, color: "#a084e8", icon: <FaClipboardCheck /> },
  { label: "Average Score", value: 85, delta: 3, color: "#6C63FF", icon: <FaBullseye /> },
];
 
const strengthsData = [
  { subject: "Math", score: 85 },
  { subject: "English", score: 78 },
];
 
const improvementsData = [
  {
    subject: "Physics",
    score: 65,
    tip: "Try visual simulations and practice problems",
  },
  {
    subject: "Chemistry",
    score: 72,
    tip: "Focus on molecular models and equations",
  },
];
 
const achievements = [
  { icon: "⚡", title: "Fast Learner", desc: "Completed 5 lessons in one day" },
  { icon: "🔥", title: "7-Day Streak", desc: "Studied for 7 consecutive days" },
  { icon: "🎯", title: "Perfect Score", desc: "Got 100% on recent quiz" },
];
 
// ===== Extra Data =====
const leaderboard = [
  { name: "Aarav", score: 92 },
  { name: "Virat", score: 90 },
  { name: "Isha", score: 88 },
  { name: "Rohan", score: 85 },
  { name: "Meera", score: 82 },
];
 
const recommendations = [
  { subject: "Calculus", action: "Watch 'Limits & Derivatives' video" },
  { subject: "Organic Chemistry", action: "Practice Quiz: Hydrocarbons" },
];
 
const streakData = [true, false, true, true, true, false, true]; // 7 days streak
const xp = 350;
const xpGoal = 500;
 
const PerformancePage: React.FC = () => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"score-desc" | "score-asc" | "diff-desc" | "diff-asc">("score-desc");
  const [view, setView] = useState<"grid" | "list">("grid");
 
  useEffect(() => {
    const loadUserTheme = async () => {
      try {
        const studentSession = JSON.parse(localStorage.getItem('studentSession') || '{}');
        if (studentSession?.id) {
          const response = await fetch(`http://localhost:8001/api/auth/get_user_preferences/?student_id=${studentSession.id}`);
          const data = await response.json();
         
          if (data.status === 'success') {
            const root = document.documentElement;
            if (data.data.theme === 'dark') {
              root.classList.add('dark-theme');
              document.body.classList.add('dark-theme');
            } else if (data.data.theme === 'light') {
              root.classList.remove('dark-theme');
              document.body.classList.remove('dark-theme');
            }
          }
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
   
    loadUserTheme();
  }, []);
 
  const demoSubjects = [
    { id: "math", name: "Mathematics", category: "foundation", score: 90, classAvg: 80, trend: [78, 82, 85, 88, 90, 90], badges: ["🏆 Top", "🔥 Streak"] },
    { id: "physics", name: "Physics", category: "advanced", score: 80, classAvg: 75, trend: [68, 70, 73, 77, 79, 80], badges: ["📈 +5"] },
    { id: "chem", name: "Chemistry", category: "advanced", score: 70, classAvg: 65, trend: [60, 62, 64, 66, 68, 70], badges: ["🔬 Lab"] },
    { id: "eng", name: "English", category: "language", score: 85, classAvg: 80, trend: [80, 81, 82, 83, 84, 85], badges: ["📚 Reader"] },
    { id: "bio", name: "Biology", category: "foundation", score: 60, classAvg: 70, trend: [58, 59, 60, 60, 60, 60], badges: ["🎯 Focus"] },
  ];
 
  const filtered = useMemo(() => {
    return demoSubjects
      .filter((s) => (filter === "all" || s.category === filter) && s.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === "score-desc") return b.score - a.score;
        if (sortBy === "score-asc") return a.score - b.score;
        const ad = a.score - a.classAvg;
        const bd = b.score - b.classAvg;
        if (sortBy === "diff-desc") return bd - ad;
        return ad - bd;
      });
  }, [filter, search, sortBy]);
 
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Performance Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Student: ${studentName}`, 20, 35);
    doc.text("Course Completion: 75%", 20, 45);
    doc.text("Assignments Submitted: 80%", 20, 55);
    doc.text("Average Score: 85%", 20, 65);
    doc.text("Strengths: Algebra, Grammar", 20, 75);
    doc.text("Weaknesses: Calculus, Organic Chemistry", 20, 85);
    doc.text("Badges: Fast Learner, Top Scorer, Bookworm", 20, 95);
    doc.text("Weekly Goals: 7/10", 20, 105);
    doc.save("Performance_Report.pdf");
  };
 
 
 
  return (
    <StudentLayout>
      <div className="performance-page-outer" style={{ minHeight: "100vh" }}>
        <div className="perf-root">
          {/* Top 1% Card */}
          <div className="perf-top-percent-card">
            <span className="perf-top-percent-icon">🥇</span>
            <span className="perf-top-percent-text">Top 1% in your class for <b>Math</b>!</span>
          </div>
 
          {/* Metric Cards */}
          <div className="perf-metrics">
            {radialStats.map((stat) => (
              <div className="perf-metric-card" key={stat.label}>
                <span className={`perf-metric-delta ${stat.delta && stat.delta >= 0 ? "up" : "down"}`}>
                  {stat.delta && stat.delta >= 0 ? `+${stat.delta}%` : `${stat.delta}%`}
                </span>
                <div className="perf-metric-header">
                  <div className="perf-metric-icon">{stat.icon}</div>
                  <div className="perf-metric-value">{stat.value}%</div>
                </div>
                <div className="perf-metric-label">{stat.label}</div>
                <div className="perf-metric-bar">
                  <div className="perf-metric-fill" style={{ width: `${stat.value}%`, background: `linear-gradient(90deg, #6C63FF, #a084e8)` }} />
                </div>
              </div>
            ))}
         
 
            {/* Streak Tracker */}
          <div className="perf-card streak-card">
            <h2>🔥 Study Streak</h2>
            <div className="perf-streak-grid">
            {streakData.map((day, i) => (
            <div
            key={i}
            className={`perf-streak-day ${day ? "active" : ""}`}
            title={["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][i]}
            />
           ))}
    </div>
    <p>
      Current Streak: <b>5 days</b> 🔥 <br />
      Longest Streak: <b>7 days</b> 🏆
    </p>
  </div>
 </div>
          {/* Subjects Section */}
          <div className="perf-demo-controls">
            <div className="perf-demo-categories">
              {["all", "foundation", "advanced", "language"].map((cat) => (
                <button key={cat} className={`perf-demo-pill${filter === cat ? " active" : ""}`} onClick={() => setFilter(cat)}>
                  {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
            <div className="perf-demo-controls-row">
              <div className="perf-demo-searchbar">
                <span className="perf-demo-searchicon">🔎</span>
                <input type="text" placeholder="Search subject..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="perf-demo-sortview">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="perf-demo-dropdown">
                  <option value="score-desc">Score (High→Low)</option>
                  <option value="score-asc">Score (Low→High)</option>
                  <option value="diff-desc">Vs Class (High→Low)</option>
                  <option value="diff-asc">Vs Class (Low→High)</option>
                </select>
                <button className={`perf-demo-toggle${view === "grid" ? " active" : ""}`} onClick={() => setView("grid")}>⬛⬛</button>
                <button className={`perf-demo-toggle${view === "list" ? " active" : ""}`} onClick={() => setView("list")}>≣</button>
                <a className="perf-demo-cta" href="/fraction-chef">Play Fraction Chef</a>
              </div>
            </div>
          </div>
 
 
          <div className={`perf-demo-cards ${view}`}>
           {filtered.map((s) => {
          const radius = 48;
          const circ = 2 * Math.PI * radius;
          const offset = circ * (1 - s.score / 100);
          const classOffset = circ * (1 - s.classAvg / 100);
          const diff = s.score - s.classAvg;
          const W = 120, H = 36, P = 2;
          const xStep = s.trend.length > 1 ? (W - P * 2) / (s.trend.length - 1) : 0;
          const points = s.trend.map((v, i) =>
            `${P + i * xStep},${H - P - (v / 100) * (H - P * 2)}`
          ).join(" ");
 
          const isStrength = s.score >= 70;
 
        return (
      <Link
        to={`/performance-detail/${s.id}`} // ✅ use to= not href=
        key={s.id}
        className="perf-demo-card-link"
      >
        <div className="perf-demo-card hover:shadow-lg hover:scale-[1.02] transition-transform duration-200">
          {/* TOP: Donut + Content */}
          <div className="perf-demo-top">
            <div className="perf-demo-donut">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r={48} stroke="#e5e7eb" strokeWidth={10} fill="none" />
                <circle
                  cx="60"
                  cy="60"
                  r={48}
                  stroke="#a084e8"
                  strokeWidth={8}
                  fill="none"
                  strokeDasharray={circ}
                  strokeDashoffset={classOffset}
                  style={{ opacity: 0.5, strokeLinecap: "round" }}
                />
                <circle
                  cx="60"
                  cy="60"
                  r={48}
                  stroke="#6C63FF"
                  strokeWidth={10}
                  fill="none"
                  strokeDasharray={circ}
                  strokeDashoffset={offset}
                  style={{ strokeLinecap: "round" }}
                />
                <text
                  x="60"
                  y="70"
                  textAnchor="middle"
                  fontSize="20"
                  fill="#6C63FF"
                  fontWeight="bold"
                >
                  {s.score}%
                </text>
              </svg>
            </div>
 
            <div className="perf-demo-content">
              <h3 className="perf-demo-name">{s.name}</h3>
              <div className="perf-demo-meta">
                <span className="me">You</span>
                <span className="class">Class Avg: {s.classAvg}%</span>
                <span className={`diff ${diff >= 0 ? "up" : "down"}`}>
                  {diff >= 0 ? `+${diff}` : diff}%
                </span>
              </div>
 
              {s.trend.length > 0 && (
                <div className="perf-demo-trend" aria-label="Weekly trend">
                  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
                    <polyline
                      points={points}
                      fill="none"
                      stroke="#6C63FF"
                      strokeWidth="2"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="trend-label">Last 6 weeks</span>
                </div>
              )}
            </div>
          </div>
 
          {/* BOTTOM */}
          {isStrength ? (
            <div className="perf-strength-card">
              🌟 Great job! Keep excelling in {s.name}.
            </div>
          ) : (
            <div className="perf-improve-card">
              <div className="perf-improve-tip">
                💡 Focus more on {s.name} to boost performance.
              </div>
            </div>
          )}
 
          {/* Badges */}
          {s.badges?.length ? (
            <div className="perf-demo-badges">
              {s.badges.map((b, i) => (
                <span className="perf-demo-badge" key={i}>
                  {b}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </Link>
    );
  })}
</div>
<br/>
 
          {/* Achievements */}
          <div className="perf-achievements-section">
            <h3>🏆 Your Achievements</h3>
            <div className="perf-achievements-list">
              {achievements.map((a) => (
                <div className="perf-achievement-card" key={a.title}>
                  <div className="perf-achievement-icon">{a.icon}</div>
                  <div className="perf-achievement-title">{a.title}</div>
                  <div className="perf-achievement-desc">{a.desc}</div>
                </div>
              ))}
            </div>
          </div>
 
          {/* ===== Extra Features Section ===== */}
          <div className="perf-extra-grid">
            {/* Leaderboard */}
          <div className="perf-card leaderboard-card">
            <h2>🏅 Leaderboard</h2>
            <ol>
              {leaderboard.map((s, i) => (
                <li
                  key={s.name}
                  className={`leaderboard-item ${s.name === studentName ? "me" : ""}`}
                >
                  <span className="rank"># {i + 1}.</span>
                  <span className="name">{s.name}</span>
                  <span className="score">{s.score}%</span>
                  {s.name === studentName && <span className="tag">✨ You</span>}
                </li>
              ))}
            </ol>
            <p className="leaderboard-tip">
              Climb higher by completing quizzes & assignments!
            </p>
          </div>
 
  {/* Recommendations */}
    <div className="right-column">
  <div className="perf-card recommendations-card">
    <h2>🎯 Recommended for You</h2>
    <ul>
      {recommendations.map((r, i) => (
        <li key={i}>
          <span className="rec-subject">📘 {r.subject}</span>
          <span className="rec-action">{r.action}</span>
          <button className="rec-done-btn">Mark Done ✅</button>
        </li>
      ))}
    </ul>
  </div>
 
  {/* XP Progress */}
  <div className="perf-card xp-card">
    <h2>⭐ XP Progress</h2>
    <p>Level 3 – Keep pushing to Level 4!</p>
    <div className="perf-xp-bar">
      <div
        className="perf-xp-fill"
        style={{ width: `${(xp / xpGoal) * 100}%` }}
      />
    </div>
    <p>{xp} / {xpGoal} XP · {xpGoal - xp} XP to next level</p>
  </div>
</div>
</div>
          {/* Download Report */}
          <div className="perf-download-row">
            <button className="perf-btn perf-btn-download" onClick={handleDownloadPDF}>📥 Download Report</button>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};
 
export default PerformancePage;
 