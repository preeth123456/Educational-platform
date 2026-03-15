import React, { useMemo, useState } from 'react';
import './PerformanceDemo.css';
import EduyataSidebarDemo from '../components/NewSidebar';
import NewHeader from '../components/NewHeader';
import { FaSearch, FaSortNumericDown, FaThLarge, FaList } from 'react-icons/fa';

type SubjectPerf = {
  id: string;
  name: string;
  category: string;
  score: number; // 0-100
  classAvg: number; // 0-100
  trend: number[]; // last 6 weeks
  badges: string[]; // short badges
};

const mockStudent = {
  name: 'Virat Kohli',
  role: 'Student',
  avatar:
    'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120',
};

const categories = [
  { id: 'all', name: 'All' },
  { id: 'foundation', name: 'Foundation' },
  { id: 'advanced', name: 'Advanced' },
  { id: 'language', name: 'Language' },
];

const subjects: SubjectPerf[] = [
  { id: 'math', name: 'Mathematics', category: 'foundation', score: 90, classAvg: 80, trend: [78, 82, 85, 88, 90, 90], badges: ['🏆 Top', '🔥 Streak'] },
  { id: 'physics', name: 'Physics', category: 'advanced', score: 80, classAvg: 75, trend: [68, 70, 73, 77, 79, 80], badges: ['📈 +5'] },
  { id: 'chem', name: 'Chemistry', category: 'advanced', score: 70, classAvg: 65, trend: [60, 62, 64, 66, 68, 70], badges: ['🔬 Lab'] },
  { id: 'eng', name: 'English', category: 'language', score: 85, classAvg: 80, trend: [80, 81, 82, 83, 84, 85], badges: ['📚 Reader'] },
  { id: 'bio', name: 'Biology', category: 'foundation', score: 60, classAvg: 70, trend: [58, 59, 60, 60, 60, 60], badges: ['🎯 Focus'] },
  { id: 'hist', name: 'History', category: 'language', score: 76, classAvg: 72, trend: [72, 73, 74, 75, 75, 76], badges: ['⭐ Consistent'] },
  { id: 'cs', name: 'Computer', category: 'advanced', score: 88, classAvg: 81, trend: [80, 83, 85, 86, 87, 88], badges: ['💡 Project'] },
];

export default function PerformanceDemo() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'score-desc' | 'score-asc' | 'diff-desc' | 'diff-asc'>('score-desc');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filtered = useMemo(() => {
    return subjects
      .filter(
        s => (filter === 'all' || s.category === filter) && s.name.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'score-desc') return b.score - a.score;
        if (sortBy === 'score-asc') return a.score - b.score;
        const ad = a.score - a.classAvg;
        const bd = b.score - b.classAvg;
        if (sortBy === 'diff-desc') return bd - ad;
        return ad - bd;
      });
  }, [filter, search, sortBy]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f7f7fa' }}>
      <EduyataSidebarDemo open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="perf-demo-wrapper" style={{ flex: 1, paddingTop: '80px', marginLeft: sidebarOpen ? '250px' : '60px', transition: 'margin-left 0.3s ease', width: sidebarOpen ? 'calc(100% - 250px)' : 'calc(100% - 60px)' }}>
        <NewHeader avatar={mockStudent.avatar} name={mockStudent.name} role={mockStudent.role} searchPlaceholder="Search performance..." onSearch={() => {}} />

        <h1 className="perf-demo-title">Performance Overview</h1>
        <p className="perf-demo-subtext">Explore your subject performance with filters, search, and sorting.</p>

        <div className="perf-demo-categories">
          {categories.map(cat => (
            <button key={cat.id} className={`perf-demo-pill${filter === cat.id ? ' active' : ''}`} onClick={() => setFilter(cat.id)}>
              {cat.name}
            </button>
          ))}
        </div>

        <div className="perf-demo-controls">
          <div className="perf-demo-searchbar">
            <FaSearch className="perf-demo-searchicon" />
            <input
              type="text"
              placeholder="Search subject..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="perf-demo-sortview">
            <span className="perf-demo-sorticon"><FaSortNumericDown /></span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="perf-demo-dropdown">
              <option value="score-desc">Score (High→Low)</option>
              <option value="score-asc">Score (Low→High)</option>
              <option value="diff-desc">Vs Class (High→Low)</option>
              <option value="diff-asc">Vs Class (Low→High)</option>
            </select>
            <button className={`perf-demo-toggle${view === 'grid' ? ' active' : ''}`} onClick={() => setView('grid')} aria-label="Grid view">
              <FaThLarge />
            </button>
            <button className={`perf-demo-toggle${view === 'list' ? ' active' : ''}`} onClick={() => setView('list')} aria-label="List view">
              <FaList />
            </button>
          </div>
        </div>

        <div className={`perf-demo-cards ${view}`}>
          {filtered.map(s => {
            const radius = 48;
            const circ = 2 * Math.PI * radius;
            const offset = circ * (1 - s.score / 100);
            const classOffset = circ * (1 - s.classAvg / 100);
            const diff = s.score - s.classAvg;
            const trend = s.trend || [];
            const W = 120, H = 36, P = 2; // sparkline width/height/padding
            const xStep = trend.length > 1 ? (W - P * 2) / (trend.length - 1) : 0;
            const points = trend
              .map((v, i) => {
                const x = P + i * xStep;
                const y = H - P - (v / 100) * (H - P * 2);
                return `${x},${y}`;
              })
              .join(' ');
            return (
              <div key={s.id} className="perf-demo-card">
                <div className="perf-demo-donut">
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r={48} stroke="#e5e7eb" strokeWidth={10} fill="none" />
                    <circle cx="60" cy="60" r={48} stroke="#a084e8" strokeWidth={8} fill="none" strokeDasharray={circ} strokeDashoffset={classOffset} style={{ opacity: 0.5, strokeLinecap: 'round' }} />
                    <circle cx="60" cy="60" r={48} stroke="#6C63FF" strokeWidth={10} fill="none" strokeDasharray={circ} strokeDashoffset={offset} style={{ strokeLinecap: 'round' }} />
                    <text x="60" y="70" textAnchor="middle" fontSize="20" fill="#6C63FF" fontWeight="bold">{s.score}%</text>
                  </svg>
                </div>
                <div className="perf-demo-content">
                  <h3 className="perf-demo-name">{s.name}</h3>
                  <div className="perf-demo-meta">
                    <span className="me">You</span>
                    <span className="class">Class Avg: {s.classAvg}%</span>
                    <span className={`diff ${diff >= 0 ? 'up' : 'down'}`}>{diff >= 0 ? `+${diff}` : diff}%</span>
                  </div>
                  {trend.length > 0 && (
                    <div className="perf-demo-trend" aria-label="Weekly trend">
                      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
                        <polyline points={points} fill="none" stroke="#6C63FF" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                      </svg>
                      <span className="trend-label">Last 6 weeks</span>
                    </div>
                  )}
                  {s.badges?.length ? (
                    <div className="perf-demo-badges">
                      {s.badges.map((b, i) => (
                        <span className="perf-demo-badge" key={i}>{b}</span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


