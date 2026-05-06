export default function Navbar({ activeView, onViewChange }) {
  const views = [
    { id: 'admin', label: '🏗️ Builder', color: '#0ea5e9' },
    { id: 'leads', label: '📋 Leads & CRM', color: '#8b5cf6' },
  ]

  return (
    <div style={{ background: '#0f172a', borderBottom: '1px solid #1e293b', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, fontFamily: "'Outfit', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⚡</div>
        <span style={{ fontWeight: 700, fontSize: 18, color: '#f1f5f9' }}>DemoBuilder</span>
        <span style={{ fontSize: 12, color: '#64748b', marginLeft: 4 }}>by Giks Studio</span>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {views.map(v => (
          <button key={v.id} onClick={() => onViewChange(v.id)} style={{
            padding: '8px 18px', background: activeView === v.id ? `linear-gradient(135deg, ${v.color}, ${v.color}cc)` : 'transparent',
            border: activeView === v.id ? 'none' : '1px solid #334155', borderRadius: 6,
            color: activeView === v.id ? '#fff' : '#cbd5e1', fontWeight: activeView === v.id ? 700 : 500,
            fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
          }}>{v.label}</button>
        ))}
      </div>
    </div>
  )
}
