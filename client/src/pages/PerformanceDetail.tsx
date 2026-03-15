import React, { useState } from "react";
import { Link, useRoute } from "wouter";
import './PerformanceDetail.css';
import StudentLayout from '../components/StudentLayout';
 
// Enhanced subject data with more detailed tracking
const sampleSubjects = [
  {
    id: "math",
    name: "Mathematics",
    score: 90,
    classAvg: 80,
    grade: "B+",
    trend: [70, 78, 80, 84, 86, 82],
    badges: ["Top scorer", "Quick Learner", "Consistent"],
    topics: [
      { name: "Algebra", mastery: 85, tests: 12, avgScore: 85, lastTest: "A-", improvement: "+5%" },
      { name: "Calculus", mastery: 78, tests: 8, avgScore: 78, lastTest: "B+", improvement: "+2%" },
      { name: "Geometry", mastery: 88, tests: 10, avgScore: 88, lastTest: "A", improvement: "+8%" },
      { name: "Statistics", mastery: 72, tests: 6, avgScore: 72, lastTest: "B", improvement: "-3%" },
    ],
    teacherNotes: ["Great improvement on integrals", "Practice word problems", "Excellent problem-solving skills"],
    strengths: ["Problem solving", "Logical thinking", "Quick calculations"],
    weaknesses: ["Word problems", "Complex equations"],
    nextGoals: ["Master differential equations", "Improve statistics performance"],
    timeSpent: "24h this month",
    rank: "3rd in class",
    attendance: 95
  },
  {
    id: "physics",
    name: "Physics",
    score: 80,
    classAvg: 75,
    grade: "C+",
    trend: [72, 68, 66, 65, 64, 64],
    badges: ["Needs attention", "Improving"],
    topics: [
      { name: "Mechanics", mastery: 60, tests: 8, avgScore: 60, lastTest: "C", improvement: "-5%" },
      { name: "Thermodynamics", mastery: 58, tests: 6, avgScore: 58, lastTest: "C-", improvement: "-2%" },
      { name: "Optics", mastery: 72, tests: 7, avgScore: 72, lastTest: "B", improvement: "+10%" },
      { name: "Electricity", mastery: 65, tests: 5, avgScore: 65, lastTest: "C+", improvement: "+3%" },
    ],
    teacherNotes: ["Strengthen fundamentals in mechanics", "Good progress in optics", "Need more practice problems"],
    strengths: ["Theoretical understanding", "Lab work"],
    weaknesses: ["Mathematical applications", "Problem solving speed"],
    nextGoals: ["Improve mechanics fundamentals", "Practice more numerical problems"],
    timeSpent: "18h this month",
    rank: "12th in class",
    attendance: 88
  },
  {
    id: "chem",
    name: "Chemistry",
    score: 70,
    classAvg: 65,
    grade: "B",
    trend: [60, 62, 64, 66, 68, 70],
    badges: ["Lab expert", "Improving"],
    topics: [
      { name: "Organic Chemistry", mastery: 75, tests: 8, avgScore: 75, lastTest: "B+", improvement: "+5%" },
      { name: "Inorganic Chemistry", mastery: 68, tests: 6, avgScore: 68, lastTest: "B-", improvement: "+2%" },
      { name: "Physical Chemistry", mastery: 72, tests: 7, avgScore: 72, lastTest: "B", improvement: "+8%" },
    ],
    teacherNotes: ["Good lab techniques", "Need to work on theory", "Steady improvement"],
    strengths: ["Lab experiments", "Practical work"],
    weaknesses: ["Memorization of formulas", "Complex equations"],
    nextGoals: ["Improve theoretical understanding", "Practice more numerical problems"],
    timeSpent: "22h this month",
    rank: "8th in class",
    attendance: 92
  },
  {
    id: "eng",
    name: "English",
    score: 85,
    classAvg: 80,
    grade: "A-",
    trend: [80, 81, 82, 83, 84, 85],
    badges: ["Reader", "Writer", "Consistent"],
    topics: [
      { name: "Literature", mastery: 88, tests: 10, avgScore: 88, lastTest: "A-", improvement: "+3%" },
      { name: "Grammar", mastery: 85, tests: 12, avgScore: 85, lastTest: "A-", improvement: "+2%" },
      { name: "Writing", mastery: 82, tests: 8, avgScore: 82, lastTest: "B+", improvement: "+5%" },
      { name: "Comprehension", mastery: 86, tests: 9, avgScore: 86, lastTest: "A", improvement: "+4%" },
    ],
    teacherNotes: ["Excellent reading skills", "Creative writing ability", "Good analytical thinking"],
    strengths: ["Reading comprehension", "Creative writing", "Vocabulary"],
    weaknesses: ["Grammar rules", "Essay structure"],
    nextGoals: ["Master advanced grammar", "Improve essay writing"],
    timeSpent: "18h this month",
    rank: "4th in class",
    attendance: 96
  },
  {
    id: "bio",
    name: "Biology",
    score: 60,
    classAvg: 70,
    grade: "C",
    trend: [58, 59, 60, 60, 60, 60],
    badges: ["Focus needed", "Steady"],
    topics: [
      { name: "Cell Biology", mastery: 65, tests: 6, avgScore: 65, lastTest: "C+", improvement: "+2%" },
      { name: "Genetics", mastery: 55, tests: 5, avgScore: 55, lastTest: "C-", improvement: "-1%" },
      { name: "Ecology", mastery: 62, tests: 7, avgScore: 62, lastTest: "C", improvement: "+3%" },
      { name: "Human Anatomy", mastery: 58, tests: 4, avgScore: 58, lastTest: "C-", improvement: "0%" },
    ],
    teacherNotes: ["Need more practice", "Concepts are challenging", "Requires extra attention"],
    strengths: ["Interest in nature", "Observation skills"],
    weaknesses: ["Complex processes", "Memorization", "Diagram interpretation"],
    nextGoals: ["Improve genetics understanding", "Practice more diagrams"],
    timeSpent: "15h this month",
    rank: "15th in class",
    attendance: 85
  }
];
 
interface PerformanceDetailProps {
  subjectId?: string;
}
 
export default function PerformanceDetail({ subjectId }: PerformanceDetailProps) {
  const [match, params] = useRoute('/performance-detail/:id');
  const id = subjectId || params?.id;
  const [activeTab, setActiveTab] = useState('overview');
 
  React.useEffect(() => {
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
            } else if (data.data.theme === 'light') {
              root.classList.remove('dark-theme');
            }
          }
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
   
    loadUserTheme();
  }, []);
 
  React.useEffect(() => {
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
            } else if (data.data.theme === 'light') {
              root.classList.remove('dark-theme');
            }
          }
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
   
    loadUserTheme();
  }, []);
 
  if (!id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8">
          <p className="text-gray-600 mb-4">No subject selected</p>
          <Link href="/performance" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all">
            Back to Performance
          </Link>
        </div>
      </div>
    );
  }
 
  const subject = sampleSubjects.find((s) => s.id === id);
 
  if (!subject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8">
          <p className="text-gray-600 mb-4">Subject not found</p>
          <Link href="/performance" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all">
            Back to Performance
          </Link>
        </div>
      </div>
    );
  }
 
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'from-green-400 to-emerald-500';
    if (score >= 80) return 'from-blue-400 to-cyan-500';
    if (score >= 70) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };
 
  const getMasteryColor = (mastery: number) => {
    if (mastery >= 85) return 'bg-gradient-to-r from-green-500 to-emerald-600';
    if (mastery >= 75) return 'bg-gradient-to-r from-blue-500 to-cyan-600';
    if (mastery >= 65) return 'bg-gradient-to-r from-yellow-500 to-orange-600';
    return 'bg-gradient-to-r from-red-500 to-pink-600';
  };
 
  return (
    <StudentLayout>
        <div style={{ height: '5rem' }}></div>
        <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        {/* Page Header with Subject Info */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/performance" className="text-gray-500 hover:text-purple-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {subject.name}
                  </h1>
                  <p className="text-gray-600">Detailed Progress Analysis</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Current Grade</p>
                  <p className="text-2xl font-bold text-purple-600">{subject.grade}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Class Rank</p>
                  <p className="text-2xl font-bold text-blue-600">{subject.rank}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
     
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8 performance-detail-content">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white rounded-xl p-1 shadow-lg mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'topics', label: 'Topic Analysis', icon: '📚' },
            { id: 'progress', label: 'Progress Tracking', icon: '📈' },
            { id: 'insights', label: 'Insights', icon: '💡' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
 
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Score Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <h3 className="text-xl font-semibold mb-6 text-gray-800">Current Performance</h3>
                <div className={`mx-auto w-32 h-32 rounded-full bg-gradient-to-br ${getScoreColor(subject.score)} flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4`}>
                  {subject.score}%
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600">Class Average: <span className="font-semibold">{subject.classAvg}%</span></p>
                  <p className="text-gray-600">Time Spent: <span className="font-semibold text-purple-600">{subject.timeSpent}</span></p>
                  <p className="text-gray-600">Attendance: <span className="font-semibold text-green-600">{subject.attendance}%</span></p>
                </div>
              </div>
            </div>
 
            {/* Enhanced Performance Trend */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">Performance Trend</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Your Score</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                      <span className="text-sm text-gray-600">Class Average</span>
                    </div>
                  </div>
                </div>
               
                {/* Trend Statistics */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {subject.trend[subject.trend.length - 1] > subject.trend[0] ? '+' : ''}
                      {subject.trend[subject.trend.length - 1] - subject.trend[0]}
                    </div>
                    <div className="text-sm text-gray-600">Overall Change</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.max(...subject.trend)}
                    </div>
                    <div className="text-sm text-gray-600">Highest Score</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {(subject.trend.reduce((a, b) => a + b, 0) / subject.trend.length).toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">Average</div>
                  </div>
                </div>
 
                <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
                  <svg width="100%" height="250" viewBox="0 0 600 250" className="overflow-visible">
                    <defs>
                      <linearGradient id="trendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#3B82F6" />
                      </linearGradient>
                      <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                   
                    {/* Grid lines */}
                    {[0, 1, 2, 3, 4].map(i => (
                      <line key={i} x1="50" y1={50 + i * 40} x2="550" y2={50 + i * 40} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="5,5" />
                    ))}
                   
                    {/* Y-axis labels */}
                    {[100, 80, 60, 40, 20].map((value, i) => (
                      <text key={i} x="40" y={55 + i * 40} textAnchor="end" fontSize="12" fill="#6B7280">{value}</text>
                    ))}
                   
                    {/* Class average line */}
                    <line
                      x1="50"
                      y1={250 - (subject.classAvg * 2)}
                      x2="550"
                      y2={250 - (subject.classAvg * 2)}
                      stroke="#9CA3AF"
                      strokeWidth="2"
                      strokeDasharray="8,4"
                    />
                   
                    {/* Area under curve */}
                    <path
                      d={`M 50,250 L ${subject.trend
                        .map((v, i) => `${50 + i * (500 / (subject.trend.length - 1))},${250 - (v * 2)}`)
                        .join(" L ")} L 550,250 Z`}
                      fill="url(#areaGradient)"
                    />
                   
                    {/* Main trend line */}
                    <polyline
                      fill="none"
                      stroke="url(#trendGradient)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={subject.trend
                        .map((v, i) => `${50 + i * (500 / (subject.trend.length - 1))},${250 - (v * 2)}`)
                        .join(" ")}
                    />
                   
                    {/* Data points with hover effects */}
                    {subject.trend.map((v, i) => (
                      <g key={i}>
                        <circle
                          cx={50 + i * (500 / (subject.trend.length - 1))}
                          cy={250 - (v * 2)}
                          r="8"
                          fill="white"
                          stroke="url(#trendGradient)"
                          strokeWidth="3"
                          className="hover:r-10 transition-all cursor-pointer"
                        />
                        <circle
                          cx={50 + i * (500 / (subject.trend.length - 1))}
                          cy={250 - (v * 2)}
                          r="4"
                          fill="url(#trendGradient)"
                        />
                        {/* Data labels */}
                        <text
                          x={50 + i * (500 / (subject.trend.length - 1))}
                          y={250 - (v * 2) - 15}
                          textAnchor="middle"
                          fontSize="12"
                          fontWeight="bold"
                          fill="#374151"
                        >
                          {v}%
                        </text>
                        {/* Week labels */}
                        <text
                          x={50 + i * (500 / (subject.trend.length - 1))}
                          y={270}
                          textAnchor="middle"
                          fontSize="11"
                          fill="#6B7280"
                        >
                          Week {i + 1}
                        </text>
                      </g>
                    ))}
                   
                    {/* Class average label */}
                    <text
                      x="560"
                      y={250 - (subject.classAvg * 2) + 5}
                      fontSize="12"
                      fill="#6B7280"
                    >
                      Class Avg: {subject.classAvg}%
                    </text>
                  </svg>
                </div>
               
                {/* Trend Analysis */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">📈</span>
                    <h4 className="font-semibold text-gray-800">Trend Analysis</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    {subject.trend[subject.trend.length - 1] > subject.trend[0]
                      ? `Great progress! You've improved by ${subject.trend[subject.trend.length - 1] - subject.trend[0]} points over the last ${subject.trend.length} weeks.`
                      : subject.trend[subject.trend.length - 1] < subject.trend[0]
                      ? `Your performance has declined by ${subject.trend[0] - subject.trend[subject.trend.length - 1]} points. Consider reviewing study strategies.`
                      : 'Your performance has been stable. Focus on consistency to improve further.'}
                  </p>
                </div>
              </div>
            </div>
 
 
            {/* Badges */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-semibold mb-6 text-gray-800">Achievements & Badges</h3>
                <div className="flex flex-wrap gap-3">
                  {subject.badges.map((badge, i) => (
                    <span key={i} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full font-medium shadow-lg">
                      🏆 {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
 
        {/* Topics Tab */}
        {activeTab === 'topics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subject.topics.map((topic, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{topic.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getMasteryColor(topic.mastery)}`}>
                    {topic.mastery}%
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tests Taken:</span>
                    <span className="font-medium">{topic.tests}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Average Score:</span>
                    <span className="font-medium">{topic.avgScore}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Test:</span>
                    <span className="font-medium">{topic.lastTest}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Improvement:</span>
                    <span className={`font-medium ${topic.improvement.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {topic.improvement}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      style={{ width: `${topic.mastery}%` }}
                      className={`h-2 rounded-full ${getMasteryColor(topic.mastery)}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
 
        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                <span className="mr-2">💪</span> Strengths
              </h3>
              <div className="space-y-3">
                {subject.strengths.map((strength, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">{strength}</span>
                  </div>
                ))}
              </div>
            </div>
 
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                <span className="mr-2">🎯</span> Areas for Improvement
              </h3>
              <div className="space-y-3">
                {subject.weaknesses.map((weakness, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700">{weakness}</span>
                  </div>
                ))}
              </div>
            </div>
 
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                <span className="mr-2">🚀</span> Next Goals
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subject.nextGoals.map((goal, i) => (
                  <div key={i} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border-l-4 border-purple-500">
                    <span className="text-gray-700">{goal}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
 
        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                <span className="mr-2">👨‍🏫</span> Teacher Notes
              </h3>
              <div className="space-y-4">
                {subject.teacherNotes.map((note, i) => (
                  <div key={i} className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <p className="text-gray-700">{note}</p>
                  </div>
                ))}
              </div>
            </div>
 
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl shadow-xl p-6 text-white">
                <div className="text-3xl mb-2">📈</div>
                <h4 className="text-lg font-semibold mb-2">Performance Trend</h4>
                <p className="text-green-100">
                  {subject.trend[subject.trend.length - 1] > subject.trend[0] ? 'Improving' : 'Needs Attention'}
                </p>
              </div>
 
              <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl shadow-xl p-6 text-white">
                <div className="text-3xl mb-2">🎯</div>
                <h4 className="text-lg font-semibold mb-2">Focus Area</h4>
                <p className="text-blue-100">
                  {subject.topics.reduce((min, topic) => topic.mastery < min.mastery ? topic : min).name}
                </p>
              </div>
 
              <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl shadow-xl p-6 text-white">
                <div className="text-3xl mb-2">⭐</div>
                <h4 className="text-lg font-semibold mb-2">Best Topic</h4>
                <p className="text-purple-100">
                  {subject.topics.reduce((max, topic) => topic.mastery > max.mastery ? topic : max).name}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </StudentLayout>
  );
}

 