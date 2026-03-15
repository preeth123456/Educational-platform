import React, { useState } from 'react';
import StudentLayout from '../components/StudentLayout';
import SupportTickets from './SupportTickets';
import GrievancePage from './GrievancePage';

const UnifiedSupportPage = () => {
  const [activeTab, setActiveTab] = useState('help');

  const helpCategories = [
    {
      title: "Technical Issues",
      description: "Login problems, app crashes, loading issues",
      action: "Create Support Ticket",
      type: "ticket",
      icon: "🔧"
    },
    {
      title: "Course Questions", 
      description: "Content doubts, assignment help, study materials",
      action: "Create Support Ticket",
      type: "ticket",
      icon: "📚"
    },
    {
      title: "Billing & Payments",
      description: "Payment issues, refunds, subscription problems",
      action: "Create Support Ticket", 
      type: "ticket",
      icon: "💳"
    },
    {
      title: "Unfair Treatment",
      description: "Biased grading, discrimination, harassment",
      action: "File Grievance",
      type: "grievance",
      icon: "⚖️"
    },
    {
      title: "Policy Violations",
      description: "Terms violation, inappropriate behavior, disputes",
      action: "File Grievance", 
      type: "grievance",
      icon: "🚨"
    }
  ];

  const handleCategorySelect = (type) => {
    setActiveTab(type);
  };

  return (
    <StudentLayout>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Support & Help Center</h1>
          
          {/* Tab Navigation */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('help')}
              className={`px-6 py-3 rounded-lg font-medium ${
                activeTab === 'help' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Get Help
            </button>
            <button
              onClick={() => setActiveTab('ticket')}
              className={`px-6 py-3 rounded-lg font-medium ${
                activeTab === 'ticket' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Support Tickets
            </button>
            <button
              onClick={() => setActiveTab('grievance')}
              className={`px-6 py-3 rounded-lg font-medium ${
                activeTab === 'grievance' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Grievances
            </button>
          </div>

          {/* Help Categories */}
          {activeTab === 'help' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {helpCategories.map((category, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{category.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                      <p className="text-gray-600 mb-4">{category.description}</p>
                      <button
                        onClick={() => handleCategorySelect(category.type)}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          category.type === 'grievance'
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {category.action}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Support Tickets Tab */}
          {activeTab === 'ticket' && (
            <SupportTickets />
          )}

          {/* Grievances Tab */}
          {activeTab === 'grievance' && (
            <GrievancePage />
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default UnifiedSupportPage;