import React, { useState } from "react";
import "./MaterialManager.css";

interface Material {
  id: number;
  title: string;
  type: 'ebook' | 'article' | 'reference';
  url: string;
}

interface MaterialManagerProps {
  courseId: number;
  courseTitle: string;
  onClose: () => void;
}

const MaterialManager: React.FC<MaterialManagerProps> = ({ courseId, courseTitle, onClose }) => {
  const [materials, setMaterials] = useState<Material[]>([
    { id: 1, title: "JavaScript Fundamentals", type: "ebook", url: "https://eloquentjavascript.net/" },
    { id: 2, title: "Advanced JS Concepts", type: "ebook", url: "https://github.com/getify/You-Dont-Know-JS" },
    { id: 3, title: "ES6 Features Guide", type: "ebook", url: "https://exploringjs.com/es6/" },
    { id: 4, title: "MDN JavaScript Guide", type: "article", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" },
    { id: 5, title: "JavaScript Best Practices", type: "article", url: "https://www.w3schools.com/js/js_best_practices.asp" },
    { id: 6, title: "Clean Code JS", type: "article", url: "https://github.com/ryanmcdermott/clean-code-javascript" },
    { id: 7, title: "JS Performance Tips", type: "article", url: "https://developers.google.com/web/fundamentals/performance" },
    { id: 8, title: "React Documentation", type: "article", url: "https://reactjs.org/docs" },
    { id: 9, title: "JavaScript.info", type: "reference", url: "https://javascript.info/" },
    { id: 10, title: "Can I Use", type: "reference", url: "https://caniuse.com/" }
  ]);

  const [activeTab, setActiveTab] = useState<'ebook' | 'article' | 'reference'>('ebook');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMaterial, setNewMaterial] = useState({ title: '', url: '' });

  const filteredMaterials = materials.filter(m => m.type === activeTab);

  const handleAddMaterial = () => {
    if (newMaterial.title && newMaterial.url) {
      const material: Material = {
        id: Date.now(),
        title: newMaterial.title,
        type: activeTab,
        url: newMaterial.url
      };
      setMaterials([...materials, material]);
      setNewMaterial({ title: '', url: '' });
      setShowAddForm(false);
    }
  };

  const handleOpenMaterial = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="material-manager-overlay">
      <div className="material-manager">
        <div className="material-header">
          <h2>📚 Course Materials - {courseTitle}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="material-tabs">
          <button 
            className={`tab-btn ${activeTab === 'ebook' ? 'active' : ''}`}
            onClick={() => setActiveTab('ebook')}
          >
            📚 Ebooks ({materials.filter(m => m.type === 'ebook').length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'article' ? 'active' : ''}`}
            onClick={() => setActiveTab('article')}
          >
            📄 Articles ({materials.filter(m => m.type === 'article').length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'reference' ? 'active' : ''}`}
            onClick={() => setActiveTab('reference')}
          >
            🔗 References ({materials.filter(m => m.type === 'reference').length})
          </button>
        </div>

        <div className="material-content">
          <div className="add-material-section">
            <button 
              className="add-material-btn"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              ➕ Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </button>
          </div>

          {showAddForm && (
            <div className="add-form">
              <input
                type="text"
                placeholder="Material Title"
                value={newMaterial.title}
                onChange={(e) => setNewMaterial({...newMaterial, title: e.target.value})}
              />
              <input
                type="url"
                placeholder="Material URL"
                value={newMaterial.url}
                onChange={(e) => setNewMaterial({...newMaterial, url: e.target.value})}
              />
              <div className="form-actions">
                <button onClick={handleAddMaterial} className="save-btn">Save</button>
                <button onClick={() => setShowAddForm(false)} className="cancel-btn">Cancel</button>
              </div>
            </div>
          )}

          <div className="materials-list">
            {filteredMaterials.map((material) => (
              <div key={material.id} className="material-item-card">
                <div className="material-info">
                  <h4>{material.title}</h4>
                  <p>{material.url}</p>
                </div>
                <button 
                  className="open-btn"
                  onClick={() => handleOpenMaterial(material.url)}
                >
                  Open
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialManager;
