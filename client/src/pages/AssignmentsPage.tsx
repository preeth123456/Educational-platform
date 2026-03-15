import React, { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaFileUpload,
  FaSortAmountDown,
  FaThLarge,
  FaList
} from "react-icons/fa";
import EduyataSidebarDemo from "../components/NewSidebar";
import NewHeader from "../components/NewHeader";
import { getHeaderProps } from '../utils/headerUtils';
import SessionManager from '../utils/sessionManager';
import "./AssignmentsPageStyles.css";
 
type Assignment = {
  assignment_id: number;
  title: string;
  subject: string;
  due_date: string;
  submission_date: string | null;
  status: "Pending" | "Completed";
};
 
type StudentData = {
  name: string;
  role: string;
  college: string;
  location: string;
  avatar: string;
};
 
const AssignmentsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Completed">("All");
  const [sortBy, setSortBy] = useState<"due-desc" | "due-asc" | "title-asc" | "title-desc">("due-desc");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadFiles, setUploadFiles] = useState<{ [id: number]: File }>({});
  const [uploading, setUploading] = useState<{ [id: number]: boolean }>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [studentSession, setStudentSession] = useState<any>(null);
  const fileInputs = useRef<{ [id: number]: HTMLInputElement | null }>({});
 
  useEffect(() => {
    const session = SessionManager.getSession();
    setStudentSession(session);
  }, []);
 
  const studentData: StudentData = {
    name: "Virat Kohli",
    role: "Student",
    college: "BASE PU College",
    location: "Bannerghatta road",
    avatar:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120"
  };
 
  useEffect(() => {
    setTimeout(() => {
      const mockAssignments: Assignment[] = [
        {
          assignment_id: 1,
          title: "Matrix Operations and Applications",
          subject: "Mathematics",
          due_date: "2025-05-20",
          submission_date: null,
          status: "Pending"
        },
        {
          assignment_id: 2,
          title: "Electromagnetic Wave Properties",
          subject: "Physics",
          due_date: "2025-05-18",
          submission_date: null,
          status: "Pending"
        },
        {
          assignment_id: 3,
          title: "Data Structures Implementation",
          subject: "Computer Science",
          due_date: "2025-05-15",
          submission_date: "2025-05-10",
          status: "Completed"
        }
      ];
      setAssignments(mockAssignments);
      setLoading(false);
    }, 1000);
  }, []);
 
  const handleFileChange = (assignmentId: number, file: File) => {
    if (file && file.type === "application/pdf") {
      setUploadFiles((files) => ({ ...files, [assignmentId]: file }));
    } else {
      alert("Please upload a valid PDF file.");
    }
  };
 
  const handleUpload = (assignment: Assignment) => {
    const file = uploadFiles[assignment.assignment_id];
    if (!file || file.type !== "application/pdf") {
      alert("Please select a valid PDF to upload.");
      return;
    }
 
    setUploading((u) => ({ ...u, [assignment.assignment_id]: true }));
 
    setTimeout(() => {
      setUploading((u) => ({ ...u, [assignment.assignment_id]: false }));
      setAssignments((as) =>
        as.map((a) =>
          a.assignment_id === assignment.assignment_id
            ? {
                ...a,
                status: "Completed",
                submission_date: new Date().toISOString().split("T")[0]
              }
            : a
        )
      );
    }, 1500);
  };
 
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
 
  const filteredAssignments = assignments.filter(
    (a) =>
      (a.subject?.toLowerCase().includes(search.toLowerCase()) ||
        a.title?.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === "All" || a.status === statusFilter)
  );
 
  const sortAssignments = (arr: Assignment[]) => {
    switch (sortBy) {
      case "title-asc":
        return [...arr].sort((a, b) => a.title.localeCompare(b.title));
      case "title-desc":
        return [...arr].sort((a, b) => b.title.localeCompare(a.title));
      case "due-desc":
        return [...arr].sort(
          (a, b) => new Date(b.due_date).getTime() - new Date(a.due_date).getTime()
        );
      case "due-asc":
        return [...arr].sort(
          (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
        );
      default:
        return arr;
    }
  };
 
  const sortedAssignments = sortAssignments(filteredAssignments);
 
  return (
    <div className="dashboard-container">
      <EduyataSidebarDemo open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="assignments-main-content" style={{ marginLeft: sidebarOpen ? '250px' : '60px', transition: 'margin-left 0.3s ease', width: sidebarOpen ? 'calc(100% - 250px)' : 'calc(100% - 60px)' }}>
        <NewHeader {...getHeaderProps()} studentId={studentSession?.id} />
        <div className="assignments-container">
          <h2>📚 My Assignments</h2>
          <p className="assignments-subtitle">Track, manage, and submit your assignments</p>
 
          {/* Filters row on top */}
          <div className="category-pills">
            {['All', 'Pending', 'Completed'].map((status) => (
              <button
                key={status}
                className={`category-pill ${statusFilter === status ? 'active' : ''}`}
                onClick={() => setStatusFilter(status as typeof statusFilter)}
              >
                {status}
              </button>
            ))}
          </div>
 
          {/* Controls row below */}
          <div className="filter-controls">
            <div className="search-bar-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by subject or assignment title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-bar"
              />
            </div>
            <div className="sort-view-group">
              <select
                className="sort-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              >
                <option value="due-desc">Due Date (Latest)</option>
                <option value="due-asc">Due Date (Oldest)</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
              </select>
              <button
                onClick={() => setViewMode('grid')}
                className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              >
                <FaThLarge />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              >
                <FaList />
              </button>
            </div>
          </div>
 
          {/* Content */}
          {loading ? (
            <div className="loader-container">
              <div className="spinner" />
              <p>Loading assignments...</p>
            </div>
          ) : sortedAssignments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3>No assignments found</h3>
              <p>Try adjusting your search or filter criteria</p>
              <button onClick={() => {
                setSearch("");
                setStatusFilter("All");
              }}>
                Reset filters
              </button>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "assignments-list" : "assignments-list list-mode"}>
              {sortedAssignments.map((a) => (
                <div key={a.assignment_id} className={`assignment-card ${a.status.toLowerCase()}`}>
                  <h3>{a.title}</h3>
                  <div className="assignment-info">
                    <p><strong>Subject:</strong> {a.subject}</p>
                    <p><strong>Due:</strong> {formatDate(a.due_date)}</p>
                    {a.submission_date && (
                      <p><strong>Submitted:</strong> {formatDate(a.submission_date)}</p>
                    )}
                  </div>
                  <div className="assignment-status-row">
                    <span className={`assignment-status ${a.status.toLowerCase()}`}>{a.status}</span>
                    {a.status === "Pending" && (
                      <div className="assignment-actions">
                        {uploadFiles[a.assignment_id] && (
                          <span className="selected-file-name">
                            📄 {uploadFiles[a.assignment_id].name}
                          </span>
                        )}
                        <input
                          type="file"
                          accept="application/pdf"
                          style={{ display: "none" }}
                          ref={(el) => (fileInputs.current[a.assignment_id] = el)}
                          onChange={(e) =>
                            e.target.files?.[0] && handleFileChange(a.assignment_id, e.target.files[0])
                          }
                        />
                        <button
                          className="upload-btn"
                          onClick={() => fileInputs.current[a.assignment_id]?.click()}
                        >
                          <FaFileUpload />
                          {uploadFiles[a.assignment_id] ? "Change PDF" : "Upload PDF"}
                        </button>
                        {uploadFiles[a.assignment_id]?.type === "application/pdf" && (
                          <button
                            className="submit-btn"
                            onClick={() => handleUpload(a)}
                            disabled={uploading[a.assignment_id]}
                          >
                            {uploading[a.assignment_id] ? "Uploading..." : "Submit"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
 
export default AssignmentsPage;
 
 
 
 