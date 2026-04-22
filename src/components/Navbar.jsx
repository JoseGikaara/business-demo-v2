import React from 'react';

export default function Navbar({ activeView, onViewChange }) {
  const views = [
    { id: 'admin', label: '🏗️ Builder', color: '#0ea5e9' },
    { id: 'demo', label: '👁️ Preview', color: '#06b6d4' },
    { id: 'bulk', label: '⚡ Bulk', color: '#f97316' },
    { id: 'leads', label: '📋 Leads', color: '#8b5cf6' },
  ];

  const containerStyle = {
    background: '#0f172a',
    borderBottom: '1px solid #1e293b',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
    fontFamily: "'Outfit', sans-serif",
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const logoBadgeStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
  };

  const logoTextStyle = {
    fontWeight: '700',
    fontSize: '18px',
    color: '#f1f5f9',
  };

  const logoSubtextStyle = {
    fontSize: '12px',
    color: '#64748b',
    marginLeft: '4px',
  };

  const navStyle = {
    display: 'flex',
    gap: '8px',
  };

  const getButtonStyle = (isActive, color) => ({
    padding: '8px 16px',
    background: isActive ? `linear-gradient(135deg, ${color}, ${color}dd)` : 'transparent',
    border: isActive ? 'none' : `1px solid #334155`,
    borderRadius: '6px',
    color: isActive ? '#fff' : '#cbd5e1',
    fontWeight: isActive ? '700' : '500',
    fontSize: '13px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
  });

  return (
    <div style={containerStyle}>
      {/* Logo */}
      <div style={logoStyle}>
        <div style={logoBadgeStyle}>⚡</div>
        <span style={logoTextStyle}>DemoBuilder</span>
        <span style={logoSubtextStyle}>by Giks Studio</span>
      </div>

      {/* Navigation */}
      <div style={navStyle}>
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            style={getButtonStyle(activeView === view.id, view.color)}
            onMouseOver={(e) => {
              if (activeView !== view.id) {
                e.target.style.borderColor = view.color;
                e.target.style.color = view.color;
              }
            }}
            onMouseOut={(e) => {
              if (activeView !== view.id) {
                e.target.style.borderColor = '#334155';
                e.target.style.color = '#cbd5e1';
              }
            }}
          >
            {view.label}
          </button>
        ))}
      </div>
    </div>
  );
}
