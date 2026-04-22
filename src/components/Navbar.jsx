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
    flexWrap: 'wrap',
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
    whiteSpace: 'nowrap',
  });

  return (
    <div style={containerStyle} className="navbar-container">
      <style>{`
        @media (max-width: 768px) {
          .navbar-container {
            padding: 0 16px !important;
            height: 56px !important;
          }
          .logo-text {
            font-size: 16px !important;
          }
          .logo-subtext {
            display: none !important;
          }
          .nav-buttons {
            gap: 4px !important;
          }
          .nav-button {
            padding: 6px 12px !important;
            font-size: 12px !important;
          }
        }
      `}</style>
      {/* Logo */}
      <div style={logoStyle}>
        <div style={logoBadgeStyle}>⚡</div>
        <span style={logoTextStyle} className="logo-text">DemoBuilder</span>
        <span style={logoSubtextStyle} className="logo-subtext">by Giks Studio</span>
      </div>

      {/* Navigation */}
      <div style={navStyle} className="nav-buttons">
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            style={getButtonStyle(activeView === view.id, view.color)}
            className="nav-button"
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
