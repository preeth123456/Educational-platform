import React from "react";
import "./SubjectModal.css";

// Types for props
type Subject = {
  subject: keyof typeof mockTopicScores;
  score: number;
  progress: number;
};

type SubjectModalProps = {
  subject?: Subject;
  onClose: () => void;
};

// Mock data for topic scores
const mockTopicScores = {
  Mathematics: [
    { topic: "Algebra", score: 88 },
    { topic: "Calculus", score: 75 },
    { topic: "Geometry", score: 65 },
    { topic: "Trigonometry", score: 45 }
  ],
  Physics: [
    { topic: "Kinematics", score: 80 },
    { topic: "Thermodynamics", score: 60 },
    { topic: "Optics", score: 55 },
    { topic: "Magnetism", score: 72 }
  ],
  Chemistry: [
    { topic: "Organic", score: 58 },
    { topic: "Inorganic", score: 70 },
    { topic: "Physical", score: 45 }
  ],
  English: [
    { topic: "Grammar", score: 95 },
    { topic: "Reading", score: 92 },
    { topic: "Writing", score: 98 }
  ],
  Biology: [
    { topic: "Botany", score: 52 },
    { topic: "Zoology", score: 61 },
    { topic: "Genetics", score: 45 }
  ]
} as const;

// AI Suggestion based on score
const getAISuggestion = (score: number): string => {
  if (score >= 85) return "✅ Excellent! Move to advanced material.";
  if (score >= 60) return "📘 Good progress. Review and practice more.";
  return "⚠️ Needs improvement. Watch topic videos & revise notes.";
};

const SubjectModal: React.FC<SubjectModalProps> = ({ subject, onClose }) => {
  if (!subject) return null;

  const topics = mockTopicScores[subject.subject] || [];

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>{subject.subject} – Detailed View</h2>
        <p>
          <strong>Score:</strong> {subject.score}% |{" "}
          <strong>Progress:</strong> {subject.progress}%
        </p>

        <h4>📚 Topic-wise Performance</h4>
        <ul>
          {topics.map((t, i) => (
            <li key={i} style={{ marginBottom: "12px" }}>
              <strong>{t.topic}:</strong> {t.score}%<br />
              <em>{getAISuggestion(t.score)}</em>
            </li>
          ))}
        </ul>

        <div style={{ textAlign: "right", marginTop: "20px" }}>
          <button className="download-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectModal;
