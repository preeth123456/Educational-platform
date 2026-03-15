import React from "react";
import "../PerformancePage.css";
import { FaDownload } from "react-icons/fa";

// Define props type
type SubjectCardProps = {
  subject: string;
  progress: number; // e.g. 0 to 100
  score: number; // percentage
  badge?: string; // e.g., "Gold", "Silver", etc.
  onClick: () => void;
  onDownload: () => void;
};

const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  progress,
  score,
  badge,
  onClick,
  onDownload
}) => {
  return (
    <div className="subject-card" onClick={onClick} style={{ cursor: "pointer" }}>
      <div className="subject-header">
        <h3>{subject}</h3>
        {badge && <span className={`subject-badge ${badge.toLowerCase()}`}>{badge}</span>}
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="score-row">
        <span className="score">{score}%</span>
        <button
          className="download-btn"
          onClick={(e) => {
            e.stopPropagation(); // prevents modal from opening
            onDownload();        // trigger download
          }}
        >
          <FaDownload /> Report
        </button>
      </div>
    </div>
  );
};

export default SubjectCard;
