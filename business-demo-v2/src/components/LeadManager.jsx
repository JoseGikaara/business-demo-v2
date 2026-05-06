import React, { useState, useEffect } from 'react';
import { buildWhatsAppLink, buildWhatsAppMessage, copyMessageToClipboard } from '../lib/whatsapp';
import { saveDemoSite, loadDemoSites, updateSiteStatus, deleteSite, bulkDeleteInactive } from '../lib/demoSites';

async function shortenURL(longUrl) {
  try {
    const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
    if (!res.ok) throw new Error('Failed');
    return (await res.text()).trim();
  } catch { return null; }
}

const LeadManager = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('leads');
  const [leads, setLeads] = useState([]);
  const [team, setTeam] = useState([]);
  const [newTeamMember, setNewTeamMember] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [selectedLeads, setSelectedLeads] = useState(new Set());
  const [assignToDropdown, setAssignToDropdown] = useState('');
  const [bulkCount, setBulkCount] = useState(0);
  const [shorteningLeadId, setShorteningLeadId] = useState(null);
  const [bulkShorteningProgress, setBulkShorteningProgress] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [openMessageId, setOpenMessageId] = useState(null);

  // Site manager state
  const [sites, setSites] = useState([]);
  const [sitesLoading, setSitesLoading] = useState(false);
  const [siteFilter, setSiteFilter] = useState('all');
  const [deleteProgress, setDeleteProgress] = useState('');

  // Filters
  const [searchName, setSearchName] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAssigned, setFilterAssigned] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    const savedLeads = localStorage.getItem('demobuilder_leads');
    const savedTeam = localStorage.getItem('demobuilder_team');
    if (savedLeads) setLeads(JSON.parse(savedLeads));
    if (savedTeam) setTeam(JSON.parse(savedTeam));
  }, []);

  useEffect(() => {
    if (activeTab === 'sites') loadSites();
  }, [activeTab]);

  const loadSites = async () => {
    setSitesLoading(true);
    const { data } = await loadDemoSites();
    setSites(data || []);
    setSitesLoading(false);
  };

  const saveLeads = (updated) => { setLeads(updated); localStorage.setItem('demobuilder_leads', JSON.stringify(updated)); };
  const saveTeam = (updated) => { setTeam(updated); localStorage.setItem('demobuilder_team', JSON.stringify(updated)); };

  const handleAddTeamMember = () => {
    if (newTeamMember.trim()) { saveTeam([...team, newTeamMember.trim()]); setNewTeamMember(''); }
  };
  const handleRemoveTeamMember = (name) => saveTeam(team.filter(m => m !== name));

  const handleAddLeads = () => {
    const lines = bulkInput.trim().split('\n').filter(l => l.trim());
    const newLeads = lines.map(line => {
      const [name, phone, whatsapp, category, address, facebookUrl, instagramUrl] = line.split('|').map(i => i.trim());
      if (!name) return null;
      return { id: crypto.randomUUID(), name, phone: phone||'', whatsapp: whatsapp||'', category: category||'', address: address||'', facebookUrl: facebookUrl||'', instagramUrl: instagramUrl||'', status: 'new', assignedTo: '', demoUrl: '', shortUrl: '', notes: '', createdAt: new Date().toISOString(), builtAt: null };
    }).filter(Boolean);
    setBulkCount(newLeads.length);
    if (newLeads.length > 0) { saveLeads([...leads, ...newLeads]); setBulkInput(''); setTimeout(() => setBulkCount(0), 3000); }
  };

  const getStatusColor = (s) => ({ new:'#334155', assigned:'#1e3a8a', built:'#14532d', sent:'#713f12', closed:'#166534', dead:'#450a0a' }[s]||'#334155');
  const getStatusTextColor = (s) => ({ new:'#cbd5e1', assigned:'#93c5fd', built:'#86efac', sent:'#fbbf24', closed:'#4ade80', dead:'#fca5a5' }[s]||'#cbd5e1');

  const filteredLeads = leads.filter(lead => {
    return lead.name.toLowerCase().includes(searchName.toLowerCase())
      && (filterStatus === 'all' || lead.status === filterStatus)
      && (filterAssigned === 'all' || lead.assignedTo === filterAssigned)
      && (filterCategory === 'all' || lead.category === filterCategory);
  });

  const counts = { total: leads.length, new: leads.filter(l=>l.status==='new').length, assigned: leads.filter(l=>l.status==='assigned').length, built: leads.filter(l=>l.status==='built').length, sent: leads.filter(l=>l.status==='sent').length, closed: leads.filter(l=>l.status==='closed').length, dead: leads.filter(l=>l.status==='dead').length };
  const categories = [...new Set(leads.map(l => l.category).filter(Boolean))];

  const handleBulkAssign = () => {
    if (!assignToDropdown || selectedLeads.size === 0) return;
    saveLeads(leads.map(l => selectedLeads.has(l.id) ? { ...l, assignedTo: assignToDropdown, status: 'assigned' } : l));
    setSelectedLeads(new Set()); setAssignToDropdown('');
  };
  const handleBulkMarkDead = () => {
    if (selectedLeads.size === 0) return;
    if (!window.confirm(`Mark ${selectedLeads.size} leads as dead?`)) return;
    saveLeads(leads.map(l => selectedLeads.has(l.id) ? { ...l, status: 'dead' } : l));
    setSelectedLeads(new Set());
  };
  const handleBulkDelete = () => {
    if (selectedLeads.size === 0) return;
    if (!window.confirm(`Delete ${selectedLeads.size} leads permanently?`)) return;
    saveLeads(leads.filter(l => !selectedLeads.has(l.id)));
    setSelectedLeads(new Set());
  };
  const updateLead = (id, updates) => saveLeads(leads.map(l => l.id === id ? { ...l, ...updates } : l));
  const deleteLead = (id) => { if (!window.confirm('Delete this lead?')) return; saveLeads(leads.filter(l => l.id !== id)); };
  const markBuilt = (id) => updateLead(id, { status: 'built', builtAt: new Date().toISOString() });

  const handleExportCSV = () => {
    const builtLeads = leads.filter(l => l.status === 'built');
    if (builtLeads.length === 0) { alert('No built leads to export'); return; }
    const csv = [['Name','Phone','Demo URL','Short URL','Assigned To','Built At'].join(','), ...builtLeads.map(l => [`"${l.name}"`, `"${l.phone}"`, `"${l.demoUrl}"`, `"${l.shortUrl}"`, `"${l.assignedTo}"`, `"${new Date(l.builtAt).toLocaleString()}"`].join(','))].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const toggleSelect = (id) => { const s = new Set(selectedLeads); s.has(id) ? s.delete(id) : s.add(id); setSelectedLeads(s); };
  const toggleSelectAll = () => setSelectedLeads(selectedLeads.size === filteredLeads.length ? new Set() : new Set(filteredLeads.map(l => l.id)));

  const handleShortenURL = async (leadId) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead?.demoUrl) return;
    setShorteningLeadId(leadId);
    const shortUrl = await shortenURL(lead.demoUrl);
    if (shortUrl) {
      updateLead(leadId, { shortUrl });
      // Also save to Supabase
      await saveDemoSite({ leadId, businessName: lead.name, phone: lead.phone || lead.whatsapp, category: lead.category, fullUrl: lead.demoUrl, shortUrl });
    }
    setShorteningLeadId(null);
  };

  const handleBulkShortenURLs = async () => {
    const toShorten = leads.filter(l => l.status === 'built' && l.demoUrl && !l.shortUrl);
    if (toShorten.length === 0) { alert('No URLs to shorten'); return; }
    setBulkShorteningProgress({ current: 0, total: toShorten.length });
    const updated = [...leads];
    for (let i = 0; i < toShorten.length; i++) {
      const lead = toShorten[i];
      const shortUrl = await shortenURL(lead.demoUrl);
      if (shortUrl) {
        const idx = updated.findIndex(l => l.id === lead.id);
        if (idx >= 0) updated[idx] = { ...updated[idx], shortUrl };
        await saveDemoSite({ leadId: lead.id, businessName: lead.name, phone: lead.phone || lead.whatsapp, category: lead.category, fullUrl: lead.demoUrl, shortUrl });
      }
      setBulkShorteningProgress({ current: i + 1, total: toShorten.length });
      if (i < toShorten.length - 1) await new Promise(r => setTimeout(r, 300));
    }
    saveLeads(updated);
    setTimeout(() => setBulkShorteningProgress(null), 2000);
  };

  const handleCopyMessage = async (lead) => {
    const url = lead.shortUrl || lead.demoUrl;
    if (!url) { alert('No URL yet — shorten the URL first'); return; }
    const fakeBusiness = { name: lead.name, category: lead.category };
    await copyMessageToClipboard(fakeBusiness, url);
    setCopiedId(lead.id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleOpenWhatsApp = (lead) => {
    const url = lead.shortUrl || lead.demoUrl;
    if (!url) { alert('No URL yet — shorten the URL first'); return; }
    const phone = (lead.whatsapp || lead.phone || '').replace(/\D/g, '');
    if (!phone) { alert('No phone number for this lead'); return; }
    const fakeBusiness = { name: lead.name, category: lead.category };
    const waLink = buildWhatsAppLink(phone, fakeBusiness, url);
    window.open(waLink, '_blank');
  };

  // Site manager handlers
  const handleToggleSiteStatus = async (site) => {
    const newStatus = site.status === 'active' ? 'inactive' : 'active';
    await updateSiteStatus(site.id, newStatus);
    setSites(sites.map(s => s.id === site.id ? { ...s, status: newStatus } : s));
  };

  const handleDeleteSite = async (id) => {
    if (!window.confirm('Delete this demo site permanently?')) return;
    await deleteSite(id);
    setSites(sites.filter(s => s.id !== id));
  };

  const handleBulkDeleteInactive = async (days) => {
    if (!window.confirm(`Delete all inactive sites older than ${days} days?`)) return;
    setDeleteProgress('Deleting...');
    const { count, error } = await bulkDeleteInactive({ olderThanDays: days });
    setDeleteProgress(error ? `Error: ${error.message}` : `Deleted ${count} sites`);
    await loadSites();
    setTimeout(() => setDeleteProgress(''), 4000);
  };

  const filteredSites = sites.filter(s => siteFilter === 'all' || s.status === siteFilter);

  const cs = { padding: '24px', backgroundColor: '#020617', fontFamily: 'Outfit, sans-serif', color: '#e2e8f0', minHeight: '100vh' };
  const cardS = { backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '20px', marginBottom: '20px' };
  const btnS = { padding: '8px 16px', backgroundColor: '#0ea5e9', color: '#020617', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', fontFamily: 'Outfit, sans-serif' };
  const btnDanger = { ...btnS, backgroundColor: '#e11d48', color: '#fff' };
  const btnGreen = { ...btnS, backgroundColor: '#16a34a', color: '#fff' };
  const btnAmber = { ...btnS, backgroundColor: '#d97706', color: '#fff' };
  const inpS = { padding: '8px 12px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', fontSize: '14px', fontFamily: 'Outfit, sans-serif' };

  const tabStyle = (t) => ({ padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: 14, fontFamily: 'Outfit, sans-serif', background: activeTab === t ? '#0ea5e9' : '#1e293b', color: activeTab === t ? '#020617' : '#94a3b8' });

  return (
    <div style={cs}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#0ea5e9', cursor: 'pointer', fontSize: 24 }}>←</button>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>Lead Manager</h1>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <button style={tabStyle('leads')} onClick={() => setActiveTab('leads')}>📋 Leads CRM</button>
        <button style={tabStyle('sites')} onClick={() => setActiveTab('sites')}>🌐 Site Manager</button>
      </div>

      {/* ═══════════ LEADS TAB ═══════════ */}
      {activeTab === 'leads' && (
        <>
          {/* ADD LEADS */}
          <div style={cardS}>
            <h2 style={{ marginTop: 0, marginBottom: 16, fontSize: 20 }}>Add Leads</h2>
            <textarea value={bulkInput} onChange={e => setBulkInput(e.target.value)}
              placeholder={"BusinessName | phone | whatsapp | category | address | facebookUrl | instagramUrl\nOne per line. URLs optional."}
              style={{ ...inpS, width: '100%', minHeight: 120, resize: 'vertical', fontFamily: 'monospace', fontSize: 12, padding: 12, boxSizing: 'border-box' }}
            />
            <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
              <button onClick={handleAddLeads} style={btnS}>Add All Leads</button>
              {bulkCount > 0 && <span style={{ color: '#4ade80', fontWeight: 600 }}>✓ {bulkCount} leads added</span>}
            </div>
          </div>

          {/* TEAM */}
          <div style={cardS}>
            <h2 style={{ marginTop: 0, marginBottom: 16, fontSize: 20 }}>Team Members</h2>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input type="text" value={newTeamMember} onChange={e => setNewTeamMember(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddTeamMember()} placeholder="Enter team member name" style={{ ...inpS, flex: 1 }} />
              <button onClick={handleAddTeamMember} style={btnS}>Add</button>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {team.map(member => (
                <div key={member} style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 20, padding: '6px 12px', fontSize: 13 }}>
                  {member}
                  <button onClick={() => handleRemoveTeamMember(member)} style={{ background: 'none', border: 'none', color: '#e11d48', cursor: 'pointer', fontSize: 16 }}>×</button>
                </div>
              ))}
            </div>
          </div>

          {/* STATS */}
          <div style={{ ...cardS, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[['total',counts.total],['new',counts.new],['assigned',counts.assigned],['built',counts.built],['sent',counts.sent],['closed',counts.closed],['dead',counts.dead]].map(([s,c]) => (
              <button key={s} onClick={() => setFilterStatus(filterStatus===s?'all':s)} style={{ padding: '6px 16px', backgroundColor: filterStatus===s?'#0ea5e9':'#1e293b', color: filterStatus===s?'#020617':'#cbd5e1', border: filterStatus===s?'none':'1px solid #334155', borderRadius: 20, cursor: 'pointer', fontSize: 13, fontWeight: 500, textTransform: 'capitalize', fontFamily: 'Outfit, sans-serif' }}>
                {s === 'total' ? 'Total' : s} <strong>({c})</strong>
              </button>
            ))}
            <div style={{ marginLeft: 'auto' }}>
              <button onClick={handleExportCSV} style={btnS}>📥 Export CSV</button>
            </div>
          </div>

          {/* FILTERS */}
          <div style={{ ...cardS, marginBottom: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
              <input type="text" value={searchName} onChange={e => setSearchName(e.target.value)} placeholder="Search by name..." style={inpS} />
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={inpS}>
                <option value="all">All Status</option>
                {['new','assigned','built','sent','closed','dead'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={filterAssigned} onChange={e => setFilterAssigned(e.target.value)} style={inpS}>
                <option value="all">All Team</option>
                {team.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={inpS}>
                <option value="all">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* BULK ACTIONS */}
          {selectedLeads.size > 0 && (
            <div style={{ ...cardS, backgroundColor: '#1e3a8a', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 600 }}>{selectedLeads.size} selected</span>
              <select value={assignToDropdown} onChange={e => setAssignToDropdown(e.target.value)} style={inpS}>
                <option value="">Assign to...</option>
                {team.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <button onClick={handleBulkAssign} style={btnS}>Assign</button>
              <button onClick={handleBulkMarkDead} style={btnDanger}>Mark Dead</button>
              <button onClick={handleBulkDelete} style={btnDanger}>Delete</button>
            </div>
          )}

          {/* BULK SHORTEN PROGRESS */}
          {bulkShorteningProgress && (
            <div style={{ ...cardS, backgroundColor: '#0ea5e9', color: '#020617', display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ fontWeight: 600 }}>Shortening {bulkShorteningProgress.current}/{bulkShorteningProgress.total}...</span>
              <div style={{ flex: 1, height: 8, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: '#020617', width: `${(bulkShorteningProgress.current/bulkShorteningProgress.total)*100}%`, transition: 'width 0.3s' }} />
              </div>
            </div>
          )}

          {/* SHORTEN ALL */}
          <div style={{ ...cardS, display: 'flex', gap: 12, alignItems: 'center' }}>
            <button onClick={handleBulkShortenURLs} style={btnS}>🔗 Shorten All Built URLs</button>
            <span style={{ color: '#94a3b8', fontSize: 13 }}>{leads.filter(l => l.status==='built' && l.demoUrl && !l.shortUrl).length} URLs pending</span>
          </div>

          {/* LEADS TABLE */}
          <div style={{ overflowX: 'auto' }}>
            {filteredLeads.length === 0 ? (
              <div style={{ ...cardS, textAlign: 'center', color: '#94a3b8', padding: '40px 20px' }}>
                {leads.length === 0 ? 'No leads yet. Add some above.' : 'No leads match current filters.'}
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: 8, overflow: 'hidden' }}>
                <thead>
                  <tr style={{ backgroundColor: '#1e293b', borderBottom: '1px solid #334155' }}>
                    <th style={{ padding: 12, textAlign: 'left', width: 40 }}>
                      <input type="checkbox" checked={selectedLeads.size === filteredLeads.length && filteredLeads.length > 0} onChange={toggleSelectAll} style={{ cursor: 'pointer', width: 18, height: 18 }} />
                    </th>
                    {['Business','Category','Location','Assigned','Status','URL / WhatsApp','Actions'].map(h => (
                      <th key={h} style={{ padding: 12, textAlign: 'left', fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map(lead => (
                    <React.Fragment key={lead.id}>
                      <tr style={{ borderBottom: '1px solid #1e293b', backgroundColor: selectedLeads.has(lead.id) ? '#1e3a5f' : 'transparent' }}>
                        <td style={{ padding: 12 }}><input type="checkbox" checked={selectedLeads.has(lead.id)} onChange={() => toggleSelect(lead.id)} style={{ cursor: 'pointer', width: 18, height: 18 }} /></td>
                        <td style={{ padding: 12, fontWeight: 500 }}>{lead.name}</td>
                        <td style={{ padding: 12, color: '#cbd5e1' }}>{lead.category || '—'}</td>
                        <td style={{ padding: 12, color: '#cbd5e1', fontSize: 12 }}>{lead.address || '—'}</td>
                        <td style={{ padding: 12 }}>
                          <select value={lead.assignedTo} onChange={e => updateLead(lead.id, { assignedTo: e.target.value })} style={inpS}>
                            <option value="">Unassigned</option>
                            {team.map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: 12 }}>
                          <select value={lead.status} onChange={e => updateLead(lead.id, { status: e.target.value })} style={{ ...inpS, backgroundColor: getStatusColor(lead.status), color: getStatusTextColor(lead.status), fontWeight: 600, border: 'none' }}>
                            {['new','assigned','built','sent','closed','dead'].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: 12 }}>
                          {lead.status === 'built' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              <input type="text" value={lead.demoUrl} onChange={e => updateLead(lead.id, { demoUrl: e.target.value })} placeholder="Paste demo URL" style={{ ...inpS, width: 140, fontSize: 12 }} />
                              {lead.shortUrl ? (
                                <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
                                  <span style={{ fontSize: 11, color: '#4ade80', fontFamily: 'monospace', background: '#052e16', padding: '3px 8px', borderRadius: 4 }}>{lead.shortUrl}</span>
                                  <button onClick={() => { navigator.clipboard.writeText(lead.shortUrl); }} style={{ ...btnS, padding: '3px 8px', fontSize: 11 }}>Copy</button>
                                </div>
                              ) : (
                                <button onClick={() => handleShortenURL(lead.id)} disabled={shorteningLeadId === lead.id} style={{ ...btnS, fontSize: 11, padding: '4px 10px', opacity: shorteningLeadId === lead.id ? 0.6 : 1 }}>
                                  {shorteningLeadId === lead.id ? '⏳ Shortening...' : '🔗 Shorten URL'}
                                </button>
                              )}
                              {/* WhatsApp outreach buttons */}
                              <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
                                <button onClick={() => handleOpenWhatsApp(lead)} style={{ ...btnS, background: 'linear-gradient(135deg, #16a34a, #15803d)', color: '#fff', fontSize: 11, padding: '4px 10px' }}>
                                  💬 Send WA
                                </button>
                                <button onClick={() => handleCopyMessage(lead)} style={{ ...btnS, background: copiedId === lead.id ? '#16a34a' : '#1e3a8a', color: copiedId === lead.id ? '#fff' : '#93c5fd', fontSize: 11, padding: '4px 10px' }}>
                                  {copiedId === lead.id ? '✅ Copied!' : '📋 Copy Msg'}
                                </button>
                                <button onClick={() => setOpenMessageId(openMessageId === lead.id ? null : lead.id)} style={{ ...btnS, background: '#334155', color: '#94a3b8', fontSize: 11, padding: '4px 8px' }}>
                                  👁️
                                </button>
                              </div>
                            </div>
                          ) : (
                            <span style={{ color: '#64748b' }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: 12 }}>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {lead.status !== 'built' && (
                              <button onClick={() => markBuilt(lead.id)} style={{ padding: '4px 8px', backgroundColor: '#14532d', color: '#86efac', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>✓ Built</button>
                            )}
                            <button onClick={() => deleteLead(lead.id)} style={{ padding: '4px 8px', backgroundColor: '#450a0a', color: '#fca5a5', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                      {/* Expandable message preview */}
                      {openMessageId === lead.id && (
                        <tr>
                          <td colSpan={8} style={{ padding: '0 12px 16px', backgroundColor: '#0a1628' }}>
                            <div style={{ background: '#0f172a', borderRadius: 8, padding: 16, border: '1px solid #1e3a5f' }}>
                              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8, fontWeight: 600 }}>PREVIEW — WhatsApp outreach message</div>
                              <pre style={{ fontSize: 12, color: '#e2e8f0', fontFamily: 'inherit', whiteSpace: 'pre-wrap', margin: 0, lineHeight: 1.6 }}>
                                {buildWhatsAppMessage({ name: lead.name, category: lead.category }, lead.shortUrl || lead.demoUrl || '[URL pending]')}
                              </pre>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* ═══════════ SITE MANAGER TAB ═══════════ */}
      {activeTab === 'sites' && (
        <>
          <div style={{ ...cardS, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0, fontSize: 20 }}>Demo Sites</h2>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              {deleteProgress && <span style={{ color: deleteProgress.startsWith('Error') ? '#fca5a5' : '#4ade80', fontSize: 13, fontWeight: 600 }}>{deleteProgress}</span>}
              <select value={siteFilter} onChange={e => setSiteFilter(e.target.value)} style={inpS}>
                <option value="all">All Sites</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <button onClick={() => handleBulkDeleteInactive(30)} style={btnDanger}>🗑 Delete Inactive (30d+)</button>
              <button onClick={() => handleBulkDeleteInactive(7)} style={{ ...btnDanger, backgroundColor: '#991b1b' }}>🗑 Delete Inactive (7d+)</button>
              <button onClick={loadSites} style={btnS}>↻ Refresh</button>
            </div>
          </div>

          {sitesLoading ? (
            <div style={{ textAlign: 'center', color: '#94a3b8', padding: 40 }}>Loading sites...</div>
          ) : filteredSites.length === 0 ? (
            <div style={{ ...cardS, textAlign: 'center', color: '#94a3b8', padding: 40 }}>
              {sites.length === 0 ? (
                <div>
                  <div style={{ fontSize: 16, marginBottom: 8 }}>No sites saved yet</div>
                  <div style={{ fontSize: 13 }}>Sites are automatically saved when you shorten a URL in the Leads tab, or when Supabase is connected.</div>
                  <div style={{ marginTop: 12, padding: 12, background: '#0f172a', borderRadius: 8, fontSize: 12, textAlign: 'left' }}>
                    <div style={{ color: '#38bdf8', fontWeight: 600, marginBottom: 8 }}>📋 Supabase setup — run this SQL:</div>
                    <pre style={{ color: '#e2e8f0', margin: 0, fontSize: 11, overflowX: 'auto' }}>{`create table demo_sites (
  id uuid default gen_random_uuid() primary key,
  lead_id text,
  business_name text not null,
  phone text default '',
  category text default '',
  full_url text not null,
  short_url text default '',
  slug text unique,
  status text default 'active' check (status in ('active','inactive','deleted')),
  created_at timestamptz default now()
);`}</pre>
                  </div>
                </div>
              ) : 'No sites match this filter.'}
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {/* Site count summary */}
              <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#94a3b8' }}>
                <span>Total: <strong style={{ color: '#e2e8f0' }}>{sites.length}</strong></span>
                <span>Active: <strong style={{ color: '#4ade80' }}>{sites.filter(s=>s.status==='active').length}</strong></span>
                <span>Inactive: <strong style={{ color: '#fca5a5' }}>{sites.filter(s=>s.status==='inactive').length}</strong></span>
              </div>

              {filteredSites.map(site => (
                <div key={site.id} style={{ background: '#0f172a', border: `1px solid ${site.status === 'active' ? '#1e3a5f' : '#450a0a'}`, borderRadius: 10, padding: 16, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>{site.business_name}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{site.category} · {site.phone}</div>
                    <div style={{ fontSize: 11, marginTop: 6 }}>
                      {site.short_url && <span style={{ color: '#4ade80', fontFamily: 'monospace', background: '#052e16', padding: '2px 8px', borderRadius: 4 }}>{site.short_url}</span>}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', minWidth: 100 }}>
                    {new Date(site.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, backgroundColor: site.status === 'active' ? '#14532d' : '#450a0a', color: site.status === 'active' ? '#4ade80' : '#fca5a5' }}>
                      {site.status}
                    </span>
                    <button onClick={() => handleToggleSiteStatus(site)} style={{ ...btnS, padding: '5px 12px', fontSize: 12, background: site.status === 'active' ? '#d97706' : '#16a34a', color: '#fff' }}>
                      {site.status === 'active' ? '⏸ Deactivate' : '▶ Activate'}
                    </button>
                    {site.short_url && (
                      <button onClick={() => navigator.clipboard.writeText(site.short_url)} style={{ ...btnS, padding: '5px 12px', fontSize: 12 }}>Copy URL</button>
                    )}
                    <button onClick={() => handleDeleteSite(site.id)} style={{ ...btnDanger, padding: '5px 12px', fontSize: 12 }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LeadManager;
