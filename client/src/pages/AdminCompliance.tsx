import React, { useState, useEffect } from 'react';
import './AdminCompliance.css';
import AdminLayout from '../components/AdminLayout';

const AdminCompliance = () => {
  const [rules, setRules] = useState([]);
  const [newRule, setNewRule] = useState({ name: '', description: '' });
  const [report, setReport] = useState(null);
  const [selectedRule, setSelectedRule] = useState(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const res = await fetch('http://localhost:8001/api/compliance/rules/');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setRules(data);
    } catch (error) {
      console.error('Error fetching rules:', error);
    }
  };

  const createRule = async () => {
    try {
      await fetch('http://localhost:8001/api/compliance/rules/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRule)
      });
      setNewRule({ name: '', description: '' });
      fetchRules();
    } catch (error) {
      console.error('Error creating rule:', error);
    }
  };

  const fetchReport = async (ruleId) => {
    try {
      const res = await fetch(`http://localhost:8001/api/compliance/report/?rule_id=${ruleId}`);
      if (!res.ok) throw new Error('Failed to fetch report');
      const data = await res.json();
      setReport(data);
      setSelectedRule(ruleId);
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  };

  return (
    <AdminLayout>
    <div className="compliance-container">
      <h1>Compliance Management</h1>

      <div className="create-rule">
        <h2>Create New Rule</h2>
        
        <input
          placeholder="Rule Name"
          value={newRule.name}
          onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newRule.description}
          onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
        />
        <button onClick={createRule}>Create Rule</button>
      </div>

      <div className="rules-list">
        <h2>Active Rules</h2>
        {rules.map(rule => (
          <div key={rule.id} className="rule-card">
            <h3>{rule.name}</h3>
            <p>{rule.description}</p>
            <button onClick={() => fetchReport(rule.id)}>View Report</button>
          </div>
        ))}
      </div>

      {report && (
        <div className="report">
          <h2>Compliance Report</h2>
          <p>Total Actions: {report.total_actions}</p>
          <h3>By User Type:</h3>
          {report.by_user_type.filter(item => item.user_type !== 'ADMIN').map(item => (
            <p key={item.user_type}>{item.user_type}: {item.count}</p>
          ))}
          <h3>Recent Logs:</h3>
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Action</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {report.recent_logs.filter(log => {
                try {
                  const details = typeof log.details === 'string' ? JSON.parse(log.details) : log.details;
                  return details?.context?.actor_type !== 'ADMIN';
                } catch {
                  return true;
                }
              }).map((log, i) => (
                <tr key={i}>
                  <td>{log.user_id}</td>
                  <td>{log.action}</td>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </AdminLayout>
  );
};

export default AdminCompliance;
