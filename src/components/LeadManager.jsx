import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Table from './ui/Table'
import StatusBadge from './ui/StatusBadge'

// URL Shortening function
async function shortenURL(longUrl) {
  try {
    const res = await fetch(
      `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`
    );
    if (!res.ok) throw new Error('Failed');
    const short = await res.text();
    return short.trim();
  } catch {
    return null;
  }
}

function buildWhatsAppLink(business, shortUrl) {
  const message = encodeURIComponent(
    `Hi ${business.name}! 👋\n\nI built a free demo website for your business — check it out here:\n👉 ${shortUrl}\n\nIt shows how your business could look online with features like:\n✅ Online booking\n✅ Customer reviews\n✅ Google Maps integration\n✅ Business hours & contact info\n\nThis is exactly what businesses in Nairobi are using to get more customers. Would you like to activate it? Takes 10 minutes. 🚀`
  );
  return `https://wa.me/${business.phone}?text=${message}`;
}

const LeadManager = ({ onBack }) => {
  const [leads, setLeads] = useState([]);
  const [team, setTeam] = useState([]);
  const [newTeamMember, setNewTeamMember] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [selectedLeads, setSelectedLeads] = useState(new Set());
  const [assignToDropdown, setAssignToDropdown] = useState('');
  const [bulkCount, setBulkCount] = useState(0);
  const [shorteningLeadId, setShorteningLeadId] = useState(null);
  const [bulkShorteningProgress, setBulkShorteningProgress] = useState(null);
  const [sites, setSites] = useState([]);
  const [selectedSites, setSelectedSites] = useState(new Set());

  // Filters
  const [searchName, setSearchName] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAssigned, setFilterAssigned] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterScore, setFilterScore] = useState('all');
  const [sortBy, setSortBy] = useState('none');
  const [sortDirection, setSortDirection] = useState('desc');
  const [activeTab, setActiveTab] = useState('leads');

  // Load data from localStorage on mount
  useEffect(() => {
    const savedLeads = localStorage.getItem('demobuilder_leads');
    const savedTeam = localStorage.getItem('demobuilder_team');
    if (savedLeads) setLeads(JSON.parse(savedLeads).map(normalizeLead));
    if (savedTeam) setTeam(JSON.parse(savedTeam));
    loadSites();
  }, []);

  const loadSites = async () => {
    const { data, error } = await supabase.from('demo_sites').select('*').order('created_at', { ascending: false });
    if (!error) setSites(data || []);
  };

  // Save leads to localStorage
  const saveLeads = (updatedLeads) => {
    const normalized = updatedLeads.map(normalizeLead);
    setLeads(normalized);
    localStorage.setItem('demobuilder_leads', JSON.stringify(normalized));
  };

  // Save team to localStorage
  const saveTeam = (updatedTeam) => {
    setTeam(updatedTeam);
    localStorage.setItem('demobuilder_team', JSON.stringify(updatedTeam));
  };

  // Add team member
  const handleAddTeamMember = () => {
    if (newTeamMember.trim()) {
      const updated = [...team, newTeamMember.trim()];
      saveTeam(updated);
      setNewTeamMember('');
    }
  };

  // Remove team member
  const handleRemoveTeamMember = (name) => {
    const updated = team.filter((m) => m !== name);
    saveTeam(updated);
  };

  // Parse and add bulk leads
  const handleAddLeads = () => {
    const lines = bulkInput
      .trim()
      .split('\n')
      .filter((line) => line.trim());

    const newLeads = lines
      .map((line) => {
        const [name, phone, whatsapp, category, address, facebookUrl, instagramUrl] = line
          .split('|')
          .map((item) => item.trim());

        if (!name) return null;

        const lead = {
          id: crypto.randomUUID(),
          name,
          phone: phone || '',
          whatsapp: whatsapp || '',
          category: category || '',
          address: address || '',
          facebookUrl: facebookUrl || '',
          instagramUrl: instagramUrl || '',
          status: 'new',
          assignedTo: '',
          demoUrl: '',
          shortUrl: '',
          notes: '',
          createdAt: new Date().toISOString(),
          builtAt: null,
        };

        return normalizeLead(lead);
      })
      .filter(Boolean);

    setBulkCount(newLeads.length);

    if (newLeads.length > 0) {
      const updated = [...leads, ...newLeads];
      saveLeads(updated);
      setBulkInput('');
      setTimeout(() => setBulkCount(0), 3000);
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      new: '#334155',
      assigned: '#1e3a8a',
      built: '#14532d',
      sent: '#713f12',
      closed: '#166534',
      dead: '#450a0a',
    };
    return colors[status] || '#334155';
  };

  // Get status text color
  const getStatusTextColor = (status) => {
    const colors = {
      new: '#cbd5e1',
      assigned: '#93c5fd',
      built: '#86efac',
      sent: '#fbbf24',
      closed: '#4ade80',
      dead: '#fca5a5',
    };
    return colors[status] || '#cbd5e1';
  };

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const nameMatch = lead.name.toLowerCase().includes(searchName.toLowerCase());
    const statusMatch = filterStatus === 'all' || lead.status === filterStatus;
    const assignedMatch = filterAssigned === 'all' || lead.assignedTo === filterAssigned;
    const categoryMatch = filterCategory === 'all' || lead.category === filterCategory;
    const scoreMatch = filterScore === 'all' || lead.lead_score === filterScore;
    return nameMatch && statusMatch && assignedMatch && categoryMatch && scoreMatch;
  });

  const sortedLeads = [...filteredLeads];
  if (sortBy === 'score') {
    sortedLeads.sort((a, b) => {
      const diff = getLeadScoreValue(b.lead_score) - getLeadScoreValue(a.lead_score);
      const result = sortDirection === 'desc' ? diff : -diff;
      return result !== 0 ? result : a.name.localeCompare(b.name);
    });
  }

  const visibleLeads = sortedLeads;

  // Count leads by status
  const counts = {
    total: leads.length,
    new: leads.filter((l) => l.status === 'new').length,
    assigned: leads.filter((l) => l.status === 'assigned').length,
    built: leads.filter((l) => l.status === 'built').length,
    sent: leads.filter((l) => l.status === 'sent').length,
    closed: leads.filter((l) => l.status === 'closed').length,
    dead: leads.filter((l) => l.status === 'dead').length,
  };

  // Get unique categories
  const categories = [...new Set(leads.map((l) => l.category).filter(Boolean))];

  const getLeadScoreValue = (score) => {
    if (score === 'hot') return 3;
    if (score === 'warm') return 2;
    if (score === 'low') return 1;
    return 0;
  };

  const evaluateLeadScore = (lead) => {
    const phoneValue = (lead.phone || lead.whatsapp || '').trim();
    const hasPhone = !!phoneValue;
    const websiteValue = (lead.website || '').trim();
    const facebookValue = (lead.facebookUrl || lead.instagramUrl || '').trim();
    const hasWebsite = !!websiteValue;
    const isSocialOnlyWebsite = /facebook\.com|instagram\.com|fb\.me|linktr\.ee|tinyurl\.com|bit\.ly|goo\.gl/i.test(websiteValue);

    if (!hasPhone) {
      return 'low';
    }

    if (!hasWebsite) {
      return facebookValue ? 'warm' : 'hot';
    }

    if (isSocialOnlyWebsite) {
      return 'warm';
    }

    return 'warm';
  };

  const normalizeLead = (lead) => ({
    ...lead,
    lead_score: evaluateLeadScore(lead),
  });

  const getScoreMeta = (score) => {
    if (score === 'hot') return { label: 'Hot', background: '#dc2626', color: '#fff' };
    if (score === 'warm') return { label: 'Warm', background: '#f59e0b', color: '#020617' };
    if (score === 'low') return { label: 'Low', background: '#334155', color: '#cbd5e1' };
    return { label: 'Unknown', background: '#334155', color: '#cbd5e1' };
  };

  // Bulk actions
  const handleBulkAssign = () => {
    if (!assignToDropdown || selectedLeads.size === 0) return;

    const updated = leads.map((lead) =>
      selectedLeads.has(lead.id) ? { ...lead, assignedTo: assignToDropdown, status: 'assigned' } : lead
    );

    saveLeads(updated);
    setSelectedLeads(new Set());
    setAssignToDropdown('');
  };

  const handleBulkMarkDead = () => {
    if (selectedLeads.size === 0) return;
    if (!window.confirm(`Mark ${selectedLeads.size} leads as dead?`)) return;

    const updated = leads.map((lead) =>
      selectedLeads.has(lead.id) ? { ...lead, status: 'dead' } : lead
    );
    saveLeads(updated);
    setSelectedLeads(new Set());
  };

  const handleBulkDeleteSites = async () => {
    if (selectedSites.size === 0) return;
    if (!window.confirm(`Delete ${selectedSites.size} sites permanently?`)) return;

    const { error } = await supabase.from('demo_sites').delete().in('id', Array.from(selectedSites));
    if (!error) {
      setSites(sites.filter(s => !selectedSites.has(s.id)));
      setSelectedSites(new Set());
    }
  };

  const handleBulkMarkInactive = async () => {
    if (selectedSites.size === 0) return;
    const { error } = await supabase.from('demo_sites').update({ status: 'inactive' }).in('id', Array.from(selectedSites));
    if (!error) {
      setSites(sites.map(s => selectedSites.has(s.id) ? { ...s, status: 'inactive' } : s));
      setSelectedSites(new Set());
    }
  };

  const handleBulkDelete = () => {
    if (selectedLeads.size === 0) return;
    if (!window.confirm(`Delete ${selectedLeads.size} leads permanently?`)) return;

    const updated = leads.filter((lead) => !selectedLeads.has(lead.id));
    saveLeads(updated);
    setSelectedLeads(new Set());
  };

  // Update lead
  const updateLead = (id, updates) => {
    const updated = leads.map((lead) =>
      lead.id === id ? normalizeLead({ ...lead, ...updates }) : lead
    );
    saveLeads(updated);
  };

  // Delete lead
  const deleteLead = (id) => {
    if (!window.confirm('Delete this lead?')) return;
    const updated = leads.filter((lead) => lead.id !== id);
    saveLeads(updated);
  };

  // Mark built
  const markBuilt = (id) => {
    updateLead(id, {
      status: 'built',
      builtAt: new Date().toISOString(),
    });
  };

  // Export CSV
  const handleExportCSV = () => {
    const builtLeads = leads.filter((l) => l.status === 'built');
    if (builtLeads.length === 0) {
      alert('No built leads to export');
      return;
    }

    const csv = [
      ['Name', 'Phone', 'Demo URL', 'Assigned To', 'Built At'].join(','),
      ...builtLeads.map((l) =>
        [
          `"${l.name.replace(/"/g, '""')}"`,
          `"${l.phone.replace(/"/g, '""')}"`,
          `"${l.demoUrl.replace(/"/g, '""')}"`,
          `"${l.assignedTo.replace(/"/g, '""')}"`,
          `"${new Date(l.builtAt).toLocaleString()}"`,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Toggle lead selection
  const toggleSelect = (id) => {
    const updated = new Set(selectedLeads);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setSelectedLeads(updated);
  };

  // Select all visible
  const toggleSelectAll = () => {
    if (selectedLeads.size === visibleLeads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(visibleLeads.map((l) => l.id)));
    }
  };

  // Shorten URL for a single lead
  const handleShortenURL = async (leadId) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead || !lead.demoUrl) return;

    setShorteningLeadId(leadId);
    const shortUrl = await shortenURL(lead.demoUrl);
    if (shortUrl) {
      updateLead(leadId, { shortUrl });
    }
    setShorteningLeadId(null);
  };

  // Refresh/reshortenURL
  const handleRefreshShortURL = async (leadId) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead || !lead.demoUrl) return;

    setShorteningLeadId(leadId);
    const shortUrl = await shortenURL(lead.demoUrl);
    if (shortUrl) {
      updateLead(leadId, { shortUrl });
    }
    setShorteningLeadId(null);
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  // Bulk shorten all built URLs
  const handleBulkShortenURLs = async () => {
    const toShorten = leads.filter(
      (l) => l.status === 'built' && l.demoUrl && !l.shortUrl
    );

    if (toShorten.length === 0) {
      alert('No URLs to shorten');
      return;
    }

    setBulkShorteningProgress({ current: 0, total: toShorten.length });

    const updated = [...leads];
    for (let i = 0; i < toShorten.length; i++) {
      const lead = toShorten[i];
      const shortUrl = await shortenURL(lead.demoUrl);
      if (shortUrl) {
        const leadIndex = updated.findIndex((l) => l.id === lead.id);
        if (leadIndex >= 0) {
          updated[leadIndex] = { ...updated[leadIndex], shortUrl };
        }
      }
      setBulkShorteningProgress({ current: i + 1, total: toShorten.length });
      if (i < toShorten.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    saveLeads(updated);
    setTimeout(() => setBulkShorteningProgress(null), 2000);
  };

  const containerStyle = {
    padding: '24px',
    backgroundColor: '#020617',
    fontFamily: 'Outfit, sans-serif',
    color: '#e2e8f0',
    minHeight: '100vh',
  };

  const cardStyle = {
    backgroundColor: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
  };

  const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: '#0ea5e9',
    color: '#020617',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'background-color 0.2s',
  };

  const buttonDangerStyle = {
    ...buttonStyle,
    backgroundColor: '#e11d48',
    color: '#fff',
  };

  const inputStyle = {
    padding: '8px 12px',
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '6px',
    color: '#e2e8f0',
    fontSize: '14px',
    fontFamily: 'Outfit, sans-serif',
  };

  const filterChipStyle = (isActive) => ({
    padding: '6px 16px',
    backgroundColor: isActive ? '#0ea5e9' : '#1e293b',
    color: isActive ? '#020617' : '#cbd5e1',
    border: isActive ? 'none' : '1px solid #334155',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s',
  });

  return (
    <div style={containerStyle}>
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: '#0ea5e9',
            cursor: 'pointer',
            fontSize: '24px',
            padding: '0',
          }}
        >
          ←
        </button>
        <h1 style={{ margin: '0', fontSize: '28px', fontWeight: '700' }}>Lead Manager</h1>
      </div>

      {/* ADD LEADS PANEL */}
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0, marginBottom: '16px', fontSize: '20px' }}>Add Leads</h2>
        <textarea
          value={bulkInput}
          onChange={(e) => setBulkInput(e.target.value)}
          placeholder="BusinessName | phone | whatsapp | category | address | facebookUrl | instagramUrl&#10;One per line. URLs optional."
          style={{
            ...inputStyle,
            width: '100%',
            minHeight: '120px',
            resize: 'vertical',
            fontFamily: 'monospace',
            fontSize: '12px',
            padding: '12px',
            boxSizing: 'border-box',
          }}
        />
        <div style={{ marginTop: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={handleAddLeads}
            style={buttonStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#06b6d4')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#0ea5e9')}
          >
            Add All Leads
          </button>
          {bulkCount > 0 && (
            <span style={{ color: '#4ade80', fontWeight: '600' }}>
              ✓ {bulkCount} leads parsed
            </span>
          )}
        </div>
      </div>

      {/* TEAM MEMBERS PANEL */}
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0, marginBottom: '16px', fontSize: '20px' }}>Team Members</h2>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <input
            type="text"
            value={newTeamMember}
            onChange={(e) => setNewTeamMember(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTeamMember()}
            placeholder="Enter team member name"
            style={{ ...inputStyle, flex: 1 }}
          />
          <button
            onClick={handleAddTeamMember}
            style={buttonStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#06b6d4')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#0ea5e9')}
          >
            Add
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {team.map((member) => (
            <div
              key={member}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '20px',
                padding: '6px 12px',
                fontSize: '13px',
              }}
            >
              {member}
              <button
                onClick={() => handleRemoveTeamMember(member)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#e11d48',
                  cursor: 'pointer',
                  fontSize: '16px',
                  padding: '0',
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* STATS BAR */}
      <div
        style={{
          ...cardStyle,
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '20px',
        }}
      >
        {[
          ['total', counts.total],
          ['new', counts.new],
          ['assigned', counts.assigned],
          ['built', counts.built],
          ['sent', counts.sent],
          ['closed', counts.closed],
          ['dead', counts.dead],
        ].map(([status, count]) => (
          <button
            key={status}
            onClick={() =>
              setFilterStatus(filterStatus === status ? 'all' : status)
            }
            style={{
              ...filterChipStyle(filterStatus === status),
              textTransform: 'capitalize',
            }}
          >
            {status === 'total' ? 'Total' : status} <strong>({count})</strong>
          </button>
        ))}
        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={handleExportCSV}
            style={buttonStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#06b6d4')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#0ea5e9')}
          >
            📥 Export Built Leads CSV
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div style={{ ...cardStyle, marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Search by name..."
            style={inputStyle}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={inputStyle}
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="assigned">Assigned</option>
            <option value="built">Built</option>
            <option value="sent">Sent</option>
            <option value="closed">Closed</option>
            <option value="dead">Dead</option>
          </select>
          <select
            value={filterAssigned}
            onChange={(e) => setFilterAssigned(e.target.value)}
            style={inputStyle}
          >
            <option value="all">All Team Members</option>
            {team.map((member) => (
              <option key={member} value={member}>
                {member}
              </option>
            ))}
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={inputStyle}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={filterScore}
            onChange={(e) => setFilterScore(e.target.value)}
            style={inputStyle}
          >
            <option value="all">All Scores</option>
            <option value="hot">Hot</option>
            <option value="warm">Warm</option>
            <option value="low">Low Quality</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={inputStyle}
          >
            <option value="none">Sort by</option>
            <option value="score">Score</option>
          </select>
          <select
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value)}
            style={inputStyle}
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>
      </div>

      {/* BULK ACTIONS */}
      {selectedLeads.size > 0 && (
        <div
          style={{
            ...cardStyle,
            backgroundColor: '#1e3a8a',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <span style={{ fontWeight: '600' }}>
            {selectedLeads.size} lead{selectedLeads.size !== 1 ? 's' : ''} selected
          </span>
          <select
            value={assignToDropdown}
            onChange={(e) => setAssignToDropdown(e.target.value)}
            style={inputStyle}
          >
            <option value="">Assign to...</option>
            {team.map((member) => (
              <option key={member} value={member}>
                {member}
              </option>
            ))}
          </select>
          <button
            onClick={handleBulkAssign}
            style={buttonStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#06b6d4')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#0ea5e9')}
          >
            Assign Selected
          </button>
          <button
            onClick={handleBulkMarkDead}
            style={buttonDangerStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#991b1b')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#e11d48')}
          >
            Mark Dead
          </button>
          <button
            onClick={handleBulkDelete}
            style={buttonDangerStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#991b1b')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#e11d48')}
          >
            Delete
          </button>
        </div>
      )}

      {/* BULK SHORTENING PROGRESS */}
      {bulkShorteningProgress && (
        <div
          style={{
            ...cardStyle,
            backgroundColor: '#0ea5e9',
            color: '#020617',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <span style={{ fontWeight: '600' }}>
            Shortening {bulkShorteningProgress.current} of {bulkShorteningProgress.total}...
          </span>
          <div
            style={{
              flex: 1,
              height: '8px',
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                backgroundColor: '#020617',
                width: `${(bulkShorteningProgress.current / bulkShorteningProgress.total) * 100}%`,
                transition: 'width 0.3s',
              }}
            />
          </div>
        </div>
      )}

      {/* SHORTEN ALL BUTTON */}
      <div style={{ ...cardStyle, marginBottom: '20px', display: 'flex', gap: '12px' }}>
        <button
          onClick={handleBulkShortenURLs}
          style={buttonStyle}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#06b6d4')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#0ea5e9')}
        >
          🔗 Shorten All Built URLs
        </button>
        <span style={{ color: '#94a3b8', fontSize: '13px', alignSelf: 'center' }}>
          {leads.filter((l) => l.status === 'built' && l.demoUrl && !l.shortUrl).length} URLs to shorten
        </span>
      </div>

      {/* LEADS TABLE */}
      <div style={{ overflowX: 'auto' }}>
        {visibleLeads.length === 0 ? (
          <div
            style={{
              ...cardStyle,
              textAlign: 'center',
              color: '#94a3b8',
              padding: '40px 20px',
            }}
          >
            {leads.length === 0
              ? 'No leads yet. Add some above.'
              : 'No leads match the current filters.'}
          </div>
        ) : (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#1e293b', borderBottom: '1px solid #334155' }}>
                <th style={{ padding: '12px', textAlign: 'left', width: '40px' }}>
                  <input
                    type="checkbox"
                    checked={selectedLeads.size === visibleLeads.length && visibleLeads.length > 0}
                    onChange={toggleSelectAll}
                    style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                  />
                </th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Business Name</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Category</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Location</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Score</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Assigned To</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Demo URL</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleLeads.map((lead) => (
                <tr
                  key={lead.id}
                  style={{
                    borderBottom: '1px solid #334155',
                    backgroundColor: selectedLeads.has(lead.id) ? '#1e3a8a' : 'transparent',
                  }}
                >
                  <td style={{ padding: '12px', textAlign: 'left' }}>
                    <input
                      type="checkbox"
                      checked={selectedLeads.has(lead.id)}
                      onChange={() => toggleSelect(lead.id)}
                      style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                    />
                  </td>
                  <td style={{ padding: '12px', textAlign: 'left', fontWeight: '500' }}>
                    {lead.name}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'left', color: '#cbd5e1' }}>
                    {lead.category || '—'}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'left', color: '#cbd5e1' }}>
                    {lead.address || '—'}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'left' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '6px 12px',
                        borderRadius: '999px',
                        fontSize: '12px',
                        fontWeight: '700',
                        backgroundColor: getScoreMeta(lead.lead_score).background,
                        color: getScoreMeta(lead.lead_score).color,
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {getScoreMeta(lead.lead_score).label}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'left' }}>
                    <select
                      value={lead.assignedTo}
                      onChange={(e) => updateLead(lead.id, { assignedTo: e.target.value })}
                      style={{
                        ...inputStyle,
                        backgroundColor: '#1e293b',
                      }}
                    >
                      <option value="">Unassigned</option>
                      {team.map((member) => (
                        <option key={member} value={member}>
                          {member}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'left' }}>
                    <select
                      value={lead.status}
                      onChange={(e) => updateLead(lead.id, { status: e.target.value })}
                      style={{
                        ...inputStyle,
                        backgroundColor: getStatusColor(lead.status),
                        color: getStatusTextColor(lead.status),
                        fontWeight: '600',
                        border: 'none',
                      }}
                    >
                      <option value="new">New</option>
                      <option value="assigned">Assigned</option>
                      <option value="built">Built</option>
                      <option value="sent">Sent</option>
                      <option value="closed">Closed</option>
                      <option value="dead">Dead</option>
                    </select>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'left' }}>
                    {lead.status === 'built' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <input
                          type="text"
                          value={lead.demoUrl}
                          onChange={(e) => updateLead(lead.id, { demoUrl: e.target.value })}
                          placeholder="Paste demo URL"
                          style={{
                            ...inputStyle,
                            width: '140px',
                            fontSize: '12px',
                          }}
                        />
                        {lead.shortUrl ? (
                          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                            <input
                              type="text"
                              value={lead.shortUrl}
                              readOnly
                              style={{
                                ...inputStyle,
                                width: '100px',
                                fontSize: '11px',
                                backgroundColor: '#14532d',
                                color: '#86efac',
                              }}
                            />
                            <button
                              onClick={() => copyToClipboard(lead.shortUrl)}
                              style={{
                                padding: '4px 6px',
                                backgroundColor: '#0ea5e9',
                                color: '#020617',
                                border: 'none',
                                borderRadius: '3px',
                                cursor: 'pointer',
                                fontSize: '10px',
                                fontWeight: '600',
                              }}
                            >
                              Copy
                            </button>
                            <button
                              onClick={() => handleRefreshShortURL(lead.id)}
                              disabled={shorteningLeadId === lead.id}
                              style={{
                                padding: '4px 6px',
                                backgroundColor: '#1e3a8a',
                                color: '#93c5fd',
                                border: 'none',
                                borderRadius: '3px',
                                cursor: shorteningLeadId === lead.id ? 'wait' : 'pointer',
                                fontSize: '10px',
                                fontWeight: '600',
                                opacity: shorteningLeadId === lead.id ? 0.6 : 1,
                              }}
                            >
                              {shorteningLeadId === lead.id ? '⟳' : '↻'}
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleShortenURL(lead.id)}
                            disabled={shorteningLeadId === lead.id}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: '#0ea5e9',
                              color: '#020617',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: shorteningLeadId === lead.id ? 'wait' : 'pointer',
                              fontSize: '11px',
                              fontWeight: '600',
                              width: '140px',
                              opacity: shorteningLeadId === lead.id ? 0.6 : 1,
                            }}
                          >
                            {shorteningLeadId === lead.id ? 'Shortening...' : 'Shorten'}
                          </button>
                        )}
                      </div>
                    ) : (
                      <span style={{ color: '#64748b' }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                      {lead.status !== 'built' && (
                        <button
                          onClick={() => markBuilt(lead.id)}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: '#14532d',
                            color: '#86efac',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: '600',
                          }}
                        >
                          Built
                        </button>
                      )}
                      {lead.status === 'built' && (
                        <button
                          onClick={() =>
                            window.open(
                              `https://wa.me/${lead.phone || lead.whatsapp}?text=Your%20demo:%20${encodeURIComponent(lead.shortUrl || lead.demoUrl)}`,
                              '_blank'
                            )
                          }
                          style={{
                            padding: '4px 8px',
                            backgroundColor: '#1e3a8a',
                            color: '#93c5fd',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: '600',
                          }}
                        >
                          WhatsApp
                        </button>
                      )}
                      <button
                        onClick={() => deleteLead(lead.id)}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#450a0a',
                          color: '#fca5a5',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          fontWeight: '600',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* NOTES SECTION */}
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#64748b' }}>
        <p>💡 Tip: Click status chips at the top to filter by status | Select leads and bulk assign or mark dead</p>
      </div>
    </div>
  );
};

export default LeadManager;
