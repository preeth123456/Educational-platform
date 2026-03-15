import React, { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

interface ComplianceSectionProps {
    userId: number;
    userType: 'student' | 'teacher';
}

const ComplianceSection: React.FC<ComplianceSectionProps> = ({ userId, userType }) => {
    const [rules, setRules] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchRules();
    }, [userId]);

    const fetchRules = async () => {
        try {
            const res = await fetch('http://localhost:8001/api/compliance/rules/');
            const data = await res.json();
            
            const rulesWithStatus = await Promise.all(data.map(async (rule: any) => {
                const checkRes = await fetch(`http://localhost:8001/api/compliance/check/?user_id=${userId}&rule_id=${rule.id}`);
                const checkData = await checkRes.json();
                return { 
                    ...rule, 
                    accepted: checkData.accepted, 
                    status: checkData.status,
                    hasAction: checkData.status !== null
                };
            }));
            
            setRules(rulesWithStatus);
        } catch (error) {
            console.error('Error fetching rules:', error);
        }
    };

    const handleAction = async (ruleId: number, action: string) => {
        setLoading(true);
        try {
            await fetch('http://localhost:8001/api/compliance/log/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rule_id: ruleId,
                    user_id: userId,
                    user_type: userType,
                    action: action,
                    ip_address: '0.0.0.0'
                })
            });
            
            // Update local state immediately
            setRules(prevRules => 
                prevRules.map(rule => 
                    rule.id === ruleId 
                        ? { ...rule, status: action, accepted: action === 'Accepted', hasAction: true }
                        : rule
                )
            );
            
            alert(`${action}!`);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="info-card">
            <h2 className="info-card-header"><FaCheckCircle className="header-icon"/> Privacy & Compliance</h2>
            <div style={{ padding: '20px' }}>
                {rules.map(rule => (
                    <div key={rule.id} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                        <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{rule.name}</h3>
                        <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '14px' }}>{rule.description}</p>
                        
                        {rule.hasAction ? (
                            rule.status === 'Accepted' ? (
                                <div style={{ color: '#4CAF50', fontWeight: 'bold' }}>✓ Accepted</div>
                            ) : (
                                <div style={{ color: '#f44336', fontWeight: 'bold' }}>✗ Rejected</div>
                            )
                        ) : (
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button 
                                    onClick={() => handleAction(rule.id, 'Accepted')} 
                                    disabled={loading}
                                    style={{
                                        background: '#4CAF50',
                                        color: 'white',
                                        padding: '8px 16px',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontWeight: '600'
                                    }}
                                >
                                    Accept
                                </button>
                                <button 
                                    onClick={() => handleAction(rule.id, 'Rejected')} 
                                    disabled={loading}
                                    style={{
                                        background: '#f44336',
                                        color: 'white',
                                        padding: '8px 16px',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontWeight: '600'
                                    }}
                                >
                                    Reject
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ComplianceSection;
