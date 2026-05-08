import { useEffect, useState } from 'react'
import { getDeploymentUrl, loadDeploymentByBusinessName } from '../lib/demoSites'

const GIKS_WA = '254116239739'

const FAKE_CUSTOMERS = [
  { id:1, name:'Amina Wanjiru', phone:'+254712001001', visits:24, spent:48000, points:480, tier:'Gold', lastVisit:'2 days ago', service:'Hair Styling', referred:3 },
  { id:2, name:'Brian Mwangi', phone:'+254723002002', visits:18, spent:36000, points:360, tier:'Silver', lastVisit:'1 week ago', service:'Facial Treatment', referred:1 },
  { id:3, name:'Grace Kamau', phone:'+254734003003', visits:31, spent:62000, points:620, tier:'Gold', lastVisit:'Yesterday', service:'Manicure & Pedicure', referred:5 },
  { id:4, name:'David Ochieng', phone:'+254745004004', visits:7, spent:14000, points:140, tier:'Bronze', lastVisit:'3 weeks ago', service:'Massage Therapy', referred:0 },
  { id:5, name:'Fatuma Hassan', phone:'+254756005005', visits:42, spent:84000, points:840, tier:'Platinum', lastVisit:'Today', service:'Hair Styling', referred:8 },
  { id:6, name:'James Kariuki', phone:'+254767006006', visits:3, spent:6000, points:60, tier:'Bronze', lastVisit:'45 days ago', service:'Facial Treatment', referred:0 },
  { id:7, name:'Mary Njoki', phone:'+254778007007', visits:15, spent:30000, points:300, tier:'Silver', lastVisit:'10 days ago', service:'Bridal Package', referred:2 },
  { id:8, name:'Peter Mutua', phone:'+254789008008', visits:9, spent:18000, points:180, tier:'Bronze', lastVisit:'5 days ago', service:'Massage Therapy', referred:1 },
]

const FAKE_MEMBERS = [
  { name:'Fatuma Hassan', tier:'Platinum', since:'Sep 2023', monthly:5000, status:'active' },
  { name:'Grace Kamau', tier:'Gold', since:'Jan 2024', monthly:3000, status:'active' },
  { name:'Amina Wanjiru', tier:'Gold', since:'Mar 2024', monthly:3000, status:'active' },
  { name:'Brian Mwangi', tier:'Silver', since:'Jun 2024', monthly:2000, status:'active' },
  { name:'Mary Njoki', tier:'Silver', since:'Jul 2024', monthly:2000, status:'active' },
]

const FAKE_REFERRALS = [
  { referrer:'Fatuma Hassan', referred:'Joyce Akinyi', reward:'KES 500 off', status:'redeemed', date:'3 days ago' },
  { referrer:'Grace Kamau', referred:'Susan Wambui', reward:'KES 500 off', status:'pending', date:'1 week ago' },
  { referrer:'Amina Wanjiru', referred:'Cynthia Otieno', reward:'KES 500 off', status:'redeemed', date:'2 weeks ago' },
]

const FAKE_BROADCASTS = [
  { msg:"Hi {name}! Your points balance is {points} pts. Redeem at your next visit!", sent:142, opened:128, segment:'All Customers', date:'2 days ago' },
  { msg:"We miss you {name}! Here is 15% off your next visit this week only", sent:23, opened:19, segment:'Inactive 30+ days', date:'5 days ago' },
  { msg:"Happy Birthday {name}! Enjoy a FREE treatment on us this month!", sent:8, opened:8, segment:'Birthday this month', date:'1 week ago' },
]

const MONTHS = ['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun']
const REVENUE = [38000,42000,39000,51000,48000,62000,58000,67000,71000,69000,84000,92000]

const TIER_COLOR = { Bronze:'#cd7f32', Silver:'#94a3b8', Gold:'#fbbf24', Platinum:'#a78bfa' }

export default function BusinessDashboard({ business, onBack, onEditSite, isClientView = false }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [customerSearch, setCustomerSearch] = useState('')
  const [broadcastMessage, setBroadcastMessage] = useState('')
  const [selectedSegment, setSelectedSegment] = useState('All Customers')
  const [toast, setToast] = useState(false)
  const [copied, setCopied] = useState(false)
  const [deploymentInfo, setDeploymentInfo] = useState(null)

  useEffect(() => {
    let active = true
    if (!business?.name) return

    const loadDeployment = async () => {
      const { data, error } = await loadDeploymentByBusinessName(business.name)
      if (!active) return
      if (!error && data) {
        setDeploymentInfo(data)
      }
    }

    loadDeployment()
    return () => { active = false }
  }, [business?.name])

  const tabs = [
    { id:'overview', label:'Overview', icon:'📊' },
    { id:'customers', label:'Customers', icon:'👥' },
    { id:'loyalty', label:'Loyalty', icon:'⭐' },
    { id:'membership', label:'Membership', icon:'💎' },
    { id:'referrals', label:'Referrals', icon:'🎁' },
    { id:'broadcast', label:'Broadcast', icon:'📢' },
    { id:'website', label:'Website', icon:'🌐' },
    { id:'upgrade', label:'Upgrade', icon:'🚀' },
    { id:'gmb', label:'GMB', icon:'📍' },
    { id:'social', label:'Social', icon:'📱' },
  ]

  const filteredCustomers = FAKE_CUSTOMERS.filter(c => 
    c.name.toLowerCase().includes(customerSearch.toLowerCase())
  )

  const maxRevenue = Math.max(...REVENUE)
  const totalMembersRevenue = FAKE_MEMBERS.reduce((sum, m) => sum + m.monthly, 0)

  const showToast = () => {
    setToast(true)
    setTimeout(() => setToast(false), 2000)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const openWhatsApp = (phone, msg) => {
    window.open(`https://wa.me/${phone.replace(/\D/g,'')}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const renderStats = () => (
    <div className="db-stats-grid" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'16px', marginBottom:'24px'}}>
      {[
        { label:'Total Customers', value:'142', icon:'👥', color:'#0ea5e9' },
        { label:'Monthly Revenue', value:'KES 92,000', icon:'💰', color:'#22c55e' },
        { label:'Active Members', value:'5', icon:'⭐', color:'#a78bfa' },
        { label:'Referrals This Month', value:'14', icon:'🎁', color:'#f59e0b' },
      ].map((stat, i) => (
        <div key={i} style={{background:'#0f172a', border:'1px solid #1e293b', borderRadius:'12px', padding:'20px'}}>
          <div style={{fontSize:'28px', marginBottom:'8px'}}>{stat.icon}</div>
          <div style={{fontSize:'32px', fontWeight:'700', color:stat.color}}>{stat.value}</div>
          <div style={{color:'#94a3b8', fontSize:'14px'}}>{stat.label}</div>
        </div>
      ))}
    </div>
  )

  const renderChart = () => (
    <div style={{background:'#0f172a', border:'1px solid #1e293b', borderRadius:'12px', padding:'24px', marginBottom:'24px'}}>
      <h3 style={{color:'#fff', margin:'0 0 20px 0', fontSize:'18px'}}>Revenue (Last 12 Months)</h3>
      <div style={{display:'flex', alignItems:'flex-end', gap:'8px', height:'150px'}}>
        {REVENUE.map((val, i) => (
          <div key={i} style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'4px'}}>
            <div style={{
              width:'100%', 
              height:`${(val/maxRevenue)*100}px`, 
              background:'linear-gradient(180deg, #0ea5e9, #06b6d4)',
              borderRadius:'4px 4px 0 0',
              minHeight:'20px'
            }}/>
            <span style={{color:'#64748b', fontSize:'10px'}}>{MONTHS[i]}</span>
          </div>
        ))}
      </div>
    </div>
  )

  const renderActivity = () => (
    <div style={{background:'#0f172a', border:'1px solid #1e293b', borderRadius:'12px', padding:'24px'}}>
      <h3 style={{color:'#fff', margin:'0 0 16px 0', fontSize:'18px'}}>Recent Activity</h3>
      <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
        {FAKE_CUSTOMERS.slice(0,5).map((c, i) => (
          <div key={i} style={{display:'flex', alignItems:'center', gap:'12px', padding:'12px', background:'#020617', borderRadius:'8px'}}>
            <div style={{width:'40px', height:'40px', borderRadius:'50%', background:TIER_COLOR[c.tier], display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:'600', fontSize:'14px'}}>
              {c.name.split(' ').map(n=>n[0]).join('')}
            </div>
            <div style={{flex:1}}>
              <div style={{color:'#fff', fontWeight:'500'}}>{c.name}</div>
              <div style={{color:'#64748b', fontSize:'13px'}}>{c.service} • {c.lastVisit}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderOverview = () => (
    <div>
      {renderStats()}
      {renderChart()}
      {renderActivity()}
    </div>
  )

  const renderCustomers = () => (
    <div>
      <input
        type="text"
        placeholder="Search customers..."
        value={customerSearch}
        onChange={(e) => setCustomerSearch(e.target.value)}
        style={{width:'100%', padding:'12px 16px', background:'#0f172a', border:'1px solid #1e293b', borderRadius:'8px', color:'#fff', fontSize:'14px', marginBottom:'20px', boxSizing:'border-box'}}
      />
      <div className="db-table" style={{background:'#0f172a', border:'1px solid #1e293b', borderRadius:'12px', overflow:'hidden'}}>
        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <thead>
            <tr style={{background:'#020617'}}>
              {['Name','Tier','Visits','Spent','Points','Last Visit','Referred','WhatsApp'].map(h => (
                <th key={h} style={{padding:'14px 12px', textAlign:'left', color:'#94a3b8', fontSize:'12px', fontWeight:'600', textTransform:'uppercase'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(c => (
              <tr key={c.id} style={{borderTop:'1px solid #1e293b'}}>
                <td style={{padding:'14px 12px', color:'#fff'}}>{c.name}</td>
                <td style={{padding:'14px 12px'}}>
                  <span style={{padding:'4px 10px', borderRadius:'12px', background:TIER_COLOR[c.tier], color:'#fff', fontSize:'12px', fontWeight:'500'}}>{c.tier}</span>
                </td>
                <td style={{padding:'14px 12px', color:'#cbd5e1'}}>{c.visits}</td>
                <td style={{padding:'14px 12px', color:'#cbd5e1'}}>KES {c.spent.toLocaleString()}</td>
                <td style={{padding:'14px 12px', color:'#cbd5e1'}}>{c.points}</td>
                <td style={{padding:'14px 12px', color:'#cbd5e1'}}>{c.lastVisit}</td>
                <td style={{padding:'14px 12px', color:'#cbd5e1'}}>{c.referred}</td>
                <td style={{padding:'14px 12px'}}>
                  <button onClick={() => openWhatsApp(c.phone, 'Hi! How can I help you?')} style={{background:'#25D366', border:'none', borderRadius:'6px', padding:'6px 12px', color:'#fff', cursor:'pointer', fontSize:'12px'}}>
                    💬
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderLoyalty = () => (
    <div>
      <div style={{background:'#0f172a', border:'1px solid #1e293b', borderRadius:'12px', padding:'24px', marginBottom:'24px'}}>
        <h3 style={{color:'#fff', margin:'0 0 12px 0'}}>How Loyalty Points Work</h3>
        <p style={{color:'#94a3b8', margin:0}}>Every KES 100 spent = 10 points. 500 points = KES 500 discount. Points are tracked automatically for every booking made through the website.</p>
      </div>
      <div style={{background:'#0f172a', border:'1px solid #1e293b', borderRadius:'12px', padding:'24px', marginBottom:'24px'}}>
        <h3 style={{color:'#fff', margin:'0 0 16px 0'}}>Tier Rules</h3>
        <div className="db-stats-grid" style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px'}}>
          {Object.entries({ Bronze:'0–199 pts', Silver:'200–399 pts', Gold:'400–699 pts', Platinum:'700+ pts' }).map(([tier, range]) => (
            <div key={tier} style={{background:'#020617', borderRadius:'8px', padding:'16px', textAlign:'center'}}>
              <div style={{width:'40px', height:'40px', borderRadius:'50%', background:TIER_COLOR[tier], margin:'0 auto 8px'}}/>
              <div style={{color:'#fff', fontWeight:'600', marginBottom:'4px'}}>{tier}</div>
              <div style={{color:'#64748b', fontSize:'13px'}}>{range}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
        {FAKE_CUSTOMERS.map(c => (
          <div key={c.id} style={{background:'#0f172a', border:'1px solid #1e293b', borderRadius:'12px', padding:'16px', display:'flex', alignItems:'center', gap:'16px'}}>
            <div style={{flex:1}}>
              <div style={{color:'#fff', fontWeight:'500', marginBottom:'8px'}}>{c.name}</div>
              <div style={{background:'#020617', borderRadius:'4px', height:'8px', overflow:'hidden'}}>
                <div style={{width:`${(c.points/1000)*100}%`, height:'100%', background:TIER_COLOR[c.tier], borderRadius:'4px'}}/>
              </div>
            </div>
            <span style={{color:'#fbbf24', fontWeight:'600'}}>{c.points} pts</span>
            <span style={{padding:'4px 10px', borderRadius:'12px', background:TIER_COLOR[c.tier], color:'#fff', fontSize:'12px'}}>{c.tier}</span>
            <button onClick={() => openWhatsApp(c.phone, `Hi ${c.name}, your loyalty points balance is ${c.points} pts! Keep visiting to earn more rewards.`)} style={{background:'#0ea5e9', border:'none', borderRadius:'6px', padding:'8px 14px', color:'#fff', cursor:'pointer', fontSize:'13px'}}>
              Send Points Update
            </button>
          </div>
        ))}
      </div>
    </div>
  )

  const renderMembership = () => (
    <div>
      <div style={{background:'#0f172a', border:'1px solid #1e293b', borderRadius:'12px', padding:'24px', marginBottom:'24px'}}>
        <h3 style={{color:'#fff', margin:'0 0 12px 0'}}>Membership = Recurring Revenue</h3>
        <p style={{color:'#94a3b8', margin:0}}>Customers pay monthly to get discounts and priority booking. You earn predictable income every month.</p>
      </div>
      <div style={{background:'linear-gradient(135deg, #0ea5e9, #06b6d4)', borderRadius:'12px', padding:'32px', marginBottom:'24px', textAlign:'center'}}>
        <div style={{fontSize:'48px', fontWeight:'700', color:'#fff'}}>KES {totalMembersRevenue.toLocaleString()}</div>
        <div style={{color:'rgba(255,255,255,0.8)', fontSize:'16px'}}>/ month recurring</div>
      </div>
      <div style={{background:'#0f172a', border:'1px solid #1e293b', borderRadius:'12px', padding:'24px', marginBottom:'24px'}}>
        <h3 style={{color:'#fff', margin:'0 0 16px 0'}}>Current Members</h3>
        <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
          {FAKE_MEMBERS.map((m, i) => (
            <div key={i} style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px', background:'#020617', borderRadius:'8px'}}>
              <div>
                <div style={{color:'#fff', fontWeight:'500'}}>{m.name}</div>
                <div style={{color:'#64748b', fontSize:'13px'}}>Since {m.since}</div>
              </div>
              <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                <span style={{padding:'4px 10px', borderRadius:'12px', background:TIER_COLOR[m.tier], color:'#fff', fontSize:'12px'}}>{m.tier}</span>
                <span style={{color:'#22c55e', fontWeight:'600'}}>KES {m.monthly.toLocaleString()}/mo</span>
                <span style={{padding:'4px 10px', borderRadius:'12px', background:'#22c55e20', color:'#22c55e', fontSize:'12px'}}>{m.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="db-three-col" style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginBottom:'24px'}}>
        {[
          { tier:'Silver', price:'KES 2,000/month', perks:['10% off all services', 'Priority booking'] },
          { tier:'Gold', price:'KES 3,000/month', perks:['20% off all services', 'Priority booking', 'Birthday gift'] },
          { tier:'Platinum', price:'KES 5,000/month', perks:['30% off', 'Priority', 'Birthday gift', 'Monthly free treatment'] },
        ].map(p => (
          <div key={p.tier} style={{background:'#0f172a', border:'1px solid #1e293b', borderRadius:'12px', padding:'24px'}}>
            <div style={{color:TIER_COLOR[p.tier], fontWeight:'700', fontSize:'20px', marginBottom:'8px'}}>{p.tier}</div>
            <div style={{color:'#fff', fontSize:'24px', fontWeight:'700', marginBottom:'16px'}}>{p.price}</div>
            {p.perks.map((perk, i) => (
              <div key={i} style={{color:'#94a3b8', fontSize:'14px', marginBottom:'8px'}}>✓ {perk}</div>
            ))}
          </div>
        ))}
      </div>
      <button onClick={() => openWhatsApp(GIKS_WA, "Hi! I want the membership system for my business")} style={{width:'100%', padding:'16px', background:'linear-gradient(135deg, #0ea5e9, #06b6d4)', border:'none', borderRadius:'12px', color:'#fff', fontSize:'16px', fontWeight:'600', cursor:'pointer'}}>
        Get This Feature
      </button>
    </div>
  )

  const renderReferrals = () => (
    <div>
      <div style={{background:'#0f172a', border:'1px solid #1e293b', borderRadius:'12px', padding:'24px', marginBottom:'24px'}}>
        <h3 style={{color:'#fff', margin:'0 0 12px 0'}}>Referrals = Free New Customers</h3>
        <p style={{color:'#94a3b8', margin:0}}>Your happy customers bring new ones. Every customer gets a unique referral code. When their friend books, both get a reward automatically.</p>
      </div>
      <div className="db-stats-grid" style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'24px'}}>
        {[
          { label:'Total Referrals', value:'14' },
          { label:'This Month', value:'5' },
          { label:'New from Referrals', value:'14' },
          { label:'Rewards Given', value:'KES 7,000' },
        ].map((s, i) => (
          <div key={i} style={{background:'#0f172a', border:'1px solid #1e293b', borderRadius:'12px', padding:'20px', textAlign:'center'}}>
            <div style={{color:'#fff', fontSize:'28px', fontWeight:'700'}}>{s.value}</div>
            <div style={{color:'#64748b', fontSize:'13px'}}>{s.label}</div>
          </div>
        ))}
      </div>
      <div className="db-table" style={{background:'#0f172a', border:'1px solid #1e293b', borderRadius:'12px', padding:'24px', marginBottom:'24px'}}>
        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <thead>
            <tr style={{background:'#020617'}}>
              {['Referrer','Referred Friend','Reward','Status','Date'].map(h => (
                <th key={h} style={{padding:'12px', textAlign:'left', color:'#94a3b8', fontSize:'12px', fontWeight:'600'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FAKE_REFERRALS.map((r, i) => (
              <tr key={i} style={{borderTop:'1px solid #1e293b'}}>
                <td style={{padding:'12px', color:'#fff'}}>{r.referrer}</td>
                <td style={{padding:'12px', color:'#cbd5e1'}}>{r.referred}</td>
                <td style={{padding:'12px', color:'#cbd5e1'}}>{r.reward}</td>
                <td style={{padding:'12px'}}>
                  <span style={{padding:'4px 10px', borderRadius:'12px', background:r.status==='redeemed'?'#22c55e20':'#f59e0b20', color:r.status==='redeemed'?'#22c55e':'#f59e0b', fontSize:'12px'}}>{r.status}</span>
                </td>
                <td style={{padding:'12px', color:'#64748b'}}>{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{background:'#0f172a', border:'1px solid #1e293b', borderRadius:'12px', padding:'24px', marginBottom:'24px'}}>
        <h3 style={{color:'#fff', margin:'0 0 16px 0'}}>How It Works</h3>
        {['Customer shares their code','Friend books using the code','Both get a discount automatically','You get a new customer for free'].map((step, i) => (
          <div key={i} style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'12px'}}>
            <div style={{width:'32px', height:'32px', borderRadius:'50%', background:'#0ea5e9', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'600', fontSize:'14px'}}>{i+1}</div>
            <span style={{color:'#94a3b8'}}>{step}</span>
          </div>
        ))}
      </div>
      <button onClick={() => openWhatsApp(GIKS_WA, "Hi! I want the referral system for my business")} style={{width:'100%', padding:'16px', background:'linear-gradient(135deg, #0ea5e9, #06b6d4)', border:'none', borderRadius:'12px', color:'#fff', fontSize:'16px', fontWeight:'600', cursor:'pointer'}}>
        Get This Feature
      </button>
    </div>
  )

  const renderBroadcast = () => (
    <div>
      <div style={{background:'#0f172a', border:'1px solid #1e293b', borderRadius:'12px', padding:'24px', marginBottom:'24px'}}>
        <h3 style={{color:'#fff', margin:'0 0 12px 0'}}>Broadcast Messages</h3>
        <p style={{color:'#94a3b8', margin:0}}>Send WhatsApp messages to your entire customer base, or targeted segments, in one click. Use {'{name}'} and {'{points}'} as placeholders.</p>
      </div>
      <div style={{display:'flex', gap:'8px', marginBottom:'16px', flexWrap:'wrap'}}>
        {['All Customers','Inactive 30+ days','Gold & Platinum','Birthday this month'].map(seg => (
          <button key={seg} onClick={() => setSelectedSegment(seg)} style={{padding:'10px 16px', borderRadius:'20px', border:'1px solid', background:selectedSegment===seg?'#0ea5e9':'transparent', borderColor:selectedSegment===seg?'#0ea5e9':'#1e293b', color:'#fff', cursor:'pointer', fontSize:'13px'}}>
            {seg}
          </button>
        ))}
      </div>
      <textarea
        value={broadcastMessage}
        onChange={(e) => setBroadcastMessage(e.target.value)}
        placeholder="Hi {name}, we have a special offer for you this week..."
        style={{width:'100%', height:'120px', padding:'16px', background:'#0f172a', border:'1px solid #1e293b', borderRadius:'12px', color:'#fff', fontSize:'14px', marginBottom:'16px', boxSizing:'border-box', resize:'none'}}
      />
      <button onClick={() => broadcastMessage && openWhatsApp(GIKS_WA, broadcastMessage)} disabled={!broadcastMessage} style={{padding:'14px 24px', background:broadcastMessage?'linear-gradient(135deg, #0ea5e9, #06b6d4)':'#1e293b', border:'none', borderRadius:'12px', color:'#fff', fontSize:'15px', fontWeight:'600', cursor:broadcastMessage?'pointer':'not-allowed', marginBottom:'24px'}}>
        Send via WhatsApp
      </button>
      <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
        {FAKE_BROADCASTS.map((b, i) => (
          <div key={i} style={{background:'#0f172a', border:'1px solid #1e293b', borderRadius:'12px', padding:'20px'}}>
            <div style={{color:'#fff', marginBottom:'8px', fontSize:'14px'}}>{b.msg}</div>
            <div style={{display:'flex', gap:'16px', color:'#64748b', fontSize:'13px'}}>
              <span>📤 {b.sent} sent</span>
              <span>👁 {b.opened} opened</span>
              <span>📁 {b.segment}</span>
              <span>📅 {b.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderWebsite = () => (
    <div>
      <h2 style={{color:'#fff', margin:'0 0 24px 0', fontSize:'24px'}}>Edit Your Website</h2>
      {deploymentInfo && (
        <div style={{ marginBottom: 20, padding: 20, borderRadius: 14, background: '#081826', border: '1px solid #1e293b', color: '#e2e8f0' }}>
          <div style={{ marginBottom: 10, fontWeight: 700 }}>Deployment status</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ color: '#94a3b8' }}>Subdomain:</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>{deploymentInfo.subdomain || 'n/a'}</span>
            <span style={{ color: '#94a3b8' }}>Status:</span>
            <span style={{ color: deploymentInfo.deployment_status === 'deployed' ? '#4ade80' : deploymentInfo.deployment_status === 'building' ? '#facc15' : deploymentInfo.deployment_status === 'failed' ? '#f87171' : '#c7d2fe' }}>{deploymentInfo.deployment_status || 'draft'}</span>
            {deploymentInfo.subdomain && <a href={getDeploymentUrl(deploymentInfo.subdomain)} target="_blank" style={{ color: '#60a5fa', textDecoration: 'underline' }}>View live site</a>}
          </div>
        </div>
      )}
      <div style={{background:'#0f172a', border:'1px solid #1e293b', borderRadius:'12px', padding:'24px', marginBottom:'24px'}}>
        {[
          { label:'Business Name', value:business?.name||'' },
          { label:'Tagline', value:business?.tagline||'' },
          { label:'Phone', value:business?.phone||'' },
          { label:'WhatsApp', value:business?.whatsapp||'' },
          { label:'Address', value:business?.address||'' },
          { label:'Hours', value:business?.hours||'' },
          { label:'About', value:business?.about||'' },
          { label:'Primary Color', value:business?.color||'' },
        ].map((field, i) => (
          <div key={i} style={{marginBottom:'16px'}}>
            <label style={{display:'block', color:'#94a3b8', fontSize:'13px', marginBottom:'6px'}}>{field.label}</label>
            <input type="text" defaultValue={field.value} style={{width:'100%', padding:'12px', background:'#020617', border:'1px solid #1e293b', borderRadius:'8px', color:'#fff', fontSize:'14px', boxSizing:'border-box'}} />
          </div>
        ))}
      </div>
      <div style={{display:'flex', gap:'12px', marginBottom:'16px'}}>
        {!isClientView && (
          <button onClick={showToast} style={{flex:1, padding:'14px', background:'linear-gradient(135deg, #0ea5e9, #06b6d4)', border:'none', borderRadius:'12px', color:'#fff', fontSize:'15px', fontWeight:'600', cursor:'pointer'}}>
            Save Changes
          </button>
        )}
        <button onClick={onEditSite} style={{flex:1, padding:'14px', background:'#0f172a', border:'1px solid #1e293b', borderRadius:'12px', color:'#fff', fontSize:'15px', fontWeight:'600', cursor:'pointer'}}>
          View Live Site
        </button>
        <button onClick={copyLink} style={{padding:'14px 20px', background:'#0f172a', border:'1px solid #1e293b', borderRadius:'12px', color:'#fff', fontSize:'15px', fontWeight:'600', cursor:'pointer'}}>
          {copied ? '✓ Copied!' : 'Share Demo Link'}
        </button>
      </div>
      {!isClientView && (
        <button onClick={onEditSite} style={{width:'100%', padding:'14px', background:'#0f172a', border:'1px solid #1e293b', borderRadius:'12px', color:'#fff', fontSize:'15px', fontWeight:'600', cursor:'pointer'}}>
          Open Website Editor
        </button>
      )}
      {toast && <div style={{position:'fixed', bottom:'24px', right:'24px', background:'#22c55e', color:'#fff', padding:'12px 24px', borderRadius:'8px', fontWeight:'500'}}>✓ Saved!</div>}
    </div>
  )

  const renderUpgrade = () => (
    <div>
      <div style={{textAlign:'center', marginBottom:'32px'}}>
        <h2 style={{color:'#fff', fontSize:'36px', margin:'0 0 12px 0'}}>Turn Your Website Into a Customer Machine</h2>
        <p style={{color:'#94a3b8', fontSize:'18px', maxWidth:'600px', margin:'0 auto'}}>Everything you just saw — loyalty points, memberships, referrals, broadcast messages — is available for your business today.</p>
      </div>
      <div className="db-three-col" style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px', marginBottom:'32px'}}>
        {[
          { name:'Starter', price:'KES 15,000', period:'one-time payment', badge:null, features:['Website','WhatsApp button','Booking form','Google Maps embed','Gallery','FAQ section','Mobile responsive','1 year hosting'] },
          { name:'Growth', price:'KES 20,000', period:'one-time payment', badge:'Most Popular', features:['Everything in Starter','Customer CRM','Loyalty points system','Broadcast messaging','Referral tracking','Customer profiles','Monthly report'] },
          { name:'Pro', price:'KES 25,000', period:'one-time payment', badge:'Best Value', features:['Everything in Growth','Membership system','Priority support','Custom domain included','Staff accounts','Advanced analytics','Free updates for 1 year'] },
        ].map(plan => (
          <div className="db-inner-pad" key={plan.name} style={{background:'#0f172a', border:'1px solid #1e293b', borderRadius:'16px', padding:'28px', display:'flex', flexDirection:'column'}}>
            {plan.badge && <div style={{background:plan.badge==='Most Popular'?'#22c55e':'#a78bfa', color:'#fff', padding:'4px 12px', borderRadius:'12px', fontSize:'12px', fontWeight:'600', alignSelf:'flex-start', marginBottom:'12px'}}>{plan.badge}</div>}
            <h3 style={{color:'#fff', fontSize:'24px', margin:'0 0 8px 0'}}>{plan.name}</h3>
            <div style={{marginBottom:'20px'}}>
              <span style={{color:'#fff', fontSize:'36px', fontWeight:'700'}}>{plan.price}</span>
              <div style={{color:'#64748b', fontSize:'14px', marginTop:'4px'}}>{plan.period}</div>
            </div>
            <div style={{flex:1, marginBottom:'20px'}}>
              {plan.features.map((f, i) => (
                <div key={i} style={{color:'#94a3b8', fontSize:'14px', marginBottom:'10px'}}>✓ {f}</div>
              ))}
            </div>
            <button onClick={() => window.open(`https://wa.me/254116239739?text=Hi! I want the ${plan.name} website package for my business`, '_blank')} style={{padding:'14px', background:'linear-gradient(135deg, #0ea5e9, #06b6d4)', border:'none', borderRadius:'10px', color:'#fff', fontSize:'15px', fontWeight:'600', cursor:'pointer'}}>
              Get Started
            </button>
          </div>
        ))}
      </div>
      <div style={{textAlign:'center', color:'#94a3b8', fontSize:'15px', marginBottom:'32px'}}>
        All plans include a 7-day guarantee — if you don't get inquiries, we fix it free.
      </div>
      <div style={{background:'#0f172a', border:'1px solid #1e293b', borderRadius:'12px', padding:'24px'}}>
        <div style={{fontStyle:'italic', color:'#94a3b8', fontSize:'16px', marginBottom:'16px'}}>"Since getting my website, I've gotten 5 new customers this month alone! The membership system is a game-changer."</div>
        <div style={{color:'#fff', fontWeight:'600'}}>— Sarah, Beauty Salon Owner</div>
      </div>
    </div>
  )


  const renderGMB = () => (
    <div>
      <div style={{background:'#0f172a', border:'1px solid #1e293b', borderRadius:'16px', padding:'28px', marginBottom:'20px'}}>
        <div style={{display:'flex', alignItems:'center', gap:'14px', marginBottom:'8px'}}>
          <div style={{fontSize:'32px'}}>📍</div>
          <div>
            <h2 style={{margin:0, fontSize:'20px', fontWeight:'700'}}>Google My Business Optimization</h2>
            <p style={{margin:'4px 0 0', color:'#64748b', fontSize:'14px'}}>Coming Soon — Get found first when customers search nearby</p>
          </div>
        </div>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:'16px', marginBottom:'20px'}}>
        {[
          { icon:'⭐', title:'Review Management', desc:'Respond to Google reviews, flag spam, and build your star rating automatically.' },
          { icon:'📸', title:'Photo Optimization', desc:'Upload high-quality photos of your business, services, and team to attract more clicks.' },
          { icon:'🗂️', title:'Business Info Sync', desc:'Keep your name, address, phone, and hours accurate across Google and maps.' },
          { icon:'📊', title:'Insights & Analytics', desc:'See how many people found you on Google Search and Maps each month.' },
          { icon:'📝', title:'Post Updates', desc:'Share offers, events, and news directly on your Google profile.' },
          { icon:'🔑', title:'Keyword Optimization', desc:'Add the right categories and keywords so you rank above competitors.' },
        ].map((item, i) => (
          <div key={i} style={{background:'#0f172a', border:'1px solid #1e293b', borderRadius:'12px', padding:'20px'}}>
            <div style={{fontSize:'28px', marginBottom:'10px'}}>{item.icon}</div>
            <div style={{fontWeight:'700', fontSize:'15px', marginBottom:'6px'}}>{item.title}</div>
            <div style={{color:'#64748b', fontSize:'13px', lineHeight:'1.6'}}>{item.desc}</div>
            <div style={{marginTop:'14px', display:'inline-block', background:'#1e293b', border:'1px solid #334155', borderRadius:'6px', padding:'6px 14px', fontSize:'12px', color:'#94a3b8'}}>Coming Soon</div>
          </div>
        ))}
      </div>
      <div style={{background:'linear-gradient(135deg, #0ea5e920, #06b6d420)', border:'1px solid #0ea5e940', borderRadius:'12px', padding:'20px', textAlign:'center'}}>
        <div style={{fontSize:'18px', fontWeight:'700', marginBottom:'6px'}}>Want this activated for your business?</div>
        <div style={{color:'#94a3b8', fontSize:'14px', marginBottom:'16px'}}>Our team handles your entire GMB profile so you rank higher and get more walk-ins.</div>
        <a href="https://wa.me/254700000000" target="_blank" rel="noreferrer" style={{background:'linear-gradient(135deg, #0ea5e9, #06b6d4)', border:'none', borderRadius:'8px', padding:'12px 28px', color:'#fff', fontWeight:'700', fontSize:'14px', cursor:'pointer', textDecoration:'none', display:'inline-block'}}>
          📞 Talk to Us on WhatsApp
        </a>
      </div>
    </div>
  )

  const renderSocial = () => (
    <div>
      <div style={{background:'#0f172a', border:'1px solid #1e293b', borderRadius:'16px', padding:'28px', marginBottom:'20px'}}>
        <div style={{display:'flex', alignItems:'center', gap:'14px', marginBottom:'8px'}}>
          <div style={{fontSize:'32px'}}>📱</div>
          <div>
            <h2 style={{margin:0, fontSize:'20px', fontWeight:'700'}}>Social Media Marketing</h2>
            <p style={{margin:'4px 0 0', color:'#64748b', fontSize:'14px'}}>Coming Soon — Grow your audience on Facebook and Instagram</p>
          </div>
        </div>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:'16px', marginBottom:'20px'}}>
        {[
          { icon:'🎨', title:'Content Creation', desc:'Professional posts, stories, and reels designed for your business niche every week.' },
          { icon:'📅', title:'Content Calendar', desc:'Planned and scheduled posts so your pages stay active without the stress.' },
          { icon:'💬', title:'Community Management', desc:'Respond to comments and DMs on your behalf to build customer relationships.' },
          { icon:'📈', title:'Paid Ads Management', desc:'Run targeted Facebook and Instagram ads to reach customers in your area.' },
          { icon:'🔍', title:'Competitor Analysis', desc:'See what top competitors post and what is working in your local market.' },
          { icon:'📊', title:'Monthly Reports', desc:'Clear reports showing follower growth, reach, engagement, and leads generated.' },
        ].map((item, i) => (
          <div key={i} style={{background:'#0f172a', border:'1px solid #1e293b', borderRadius:'12px', padding:'20px'}}>
            <div style={{fontSize:'28px', marginBottom:'10px'}}>{item.icon}</div>
            <div style={{fontWeight:'700', fontSize:'15px', marginBottom:'6px'}}>{item.title}</div>
            <div style={{color:'#64748b', fontSize:'13px', lineHeight:'1.6'}}>{item.desc}</div>
            <div style={{marginTop:'14px', display:'inline-block', background:'#1e293b', border:'1px solid #334155', borderRadius:'6px', padding:'6px 14px', fontSize:'12px', color:'#94a3b8'}}>Coming Soon</div>
          </div>
        ))}
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:'12px', marginBottom:'20px'}}>
        {[
          { platform:'Facebook', icon:'📘', color:'#1877f2', desc:'Page setup, posting, and ads' },
          { platform:'Instagram', icon:'📸', color:'#e1306c', desc:'Feed, stories, and reels' },
          { platform:'TikTok', icon:'🎵', color:'#010101', desc:'Short video content' },
          { platform:'WhatsApp', icon:'💬', color:'#25d366', desc:'Broadcast lists and status' },
        ].map((p, i) => (
          <div key={i} style={{background:'#0f172a', border:`1px solid ${p.color}40`, borderRadius:'10px', padding:'16px', display:'flex', alignItems:'center', gap:'12px'}}>
            <div style={{fontSize:'24px'}}>{p.icon}</div>
            <div>
              <div style={{fontWeight:'700', fontSize:'14px'}}>{p.platform}</div>
              <div style={{color:'#64748b', fontSize:'12px'}}>{p.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{background:'linear-gradient(135deg, #8b5cf620, #7c3aed20)', border:'1px solid #8b5cf640', borderRadius:'12px', padding:'20px', textAlign:'center'}}>
        <div style={{fontSize:'18px', fontWeight:'700', marginBottom:'6px'}}>Ready to grow your social media?</div>
        <div style={{color:'#94a3b8', fontSize:'14px', marginBottom:'16px'}}>We create content, run ads, and manage your pages so you can focus on your customers.</div>
        <a href="https://wa.me/254700000000" target="_blank" rel="noreferrer" style={{background:'linear-gradient(135deg, #8b5cf6, #7c3aed)', border:'none', borderRadius:'8px', padding:'12px 28px', color:'#fff', fontWeight:'700', fontSize:'14px', cursor:'pointer', textDecoration:'none', display:'inline-block'}}>
          📞 Talk to Us on WhatsApp
        </a>
      </div>
    </div>
  )

  const renderContent = () => {
    switch(activeTab) {
      case 'overview': return renderOverview()
      case 'customers': return renderCustomers()
      case 'loyalty': return renderLoyalty()
      case 'membership': return renderMembership()
      case 'referrals': return renderReferrals()
      case 'broadcast': return renderBroadcast()
      case 'website': return renderWebsite()
      case 'upgrade': return renderUpgrade()
      case 'gmb': return renderGMB()
      case 'social': return renderSocial()
      default: return renderOverview()
    }
  }

  return (
    <div style={{fontFamily:'Outfit, sans-serif', background:'#020617', minHeight:'100vh', color:'#fff'}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        .db-layout { display: flex; min-height: 100vh; }
        .db-sidebar { width: 220px; background: #0f172a; border-right: 1px solid #1e293b; position: fixed; top: 0; left: 0; bottom: 0; overflow-y: auto; z-index: 50; display: flex; flex-direction: column; }
        .db-content { margin-left: 220px; flex: 1; min-height: 100vh; padding-bottom: 32px; }
        .db-bottom-nav { display: none; }

        .db-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .db-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .db-three-col { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .db-table { width: 100%; overflow-x: auto; display: block; }
        .db-inner-pad { padding: 28px; }

        @media (max-width: 768px) {
          .db-sidebar { display: none !important; }
          .db-content { margin-left: 0 !important; padding-bottom: 100px !important; }
          .db-bottom-nav { display: flex !important; position: fixed; bottom: 0; left: 0; right: 0; z-index: 200; background: rgba(2,6,23,0.97); border-top: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(20px); padding: 6px 0 max(6px, env(safe-area-inset-bottom)); justify-content: space-around; align-items: center; }
          .db-header { padding: 0 16px !important; }
          .db-header h2 { font-size: 15px !important; }
          .db-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          .db-two-col { grid-template-columns: 1fr !important; }
          .db-three-col { grid-template-columns: 1fr !important; }
          .db-inner-pad { padding: 16px !important; }
          .db-hide-mobile { display: none !important; }
          .db-table { font-size: 13px !important; }
        }

        @media (max-width: 400px) {
          .db-stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <div className="db-header" style={{height:'64px', background:'#0f172a', borderBottom:'1px solid #1e293b', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', position:'sticky', top:0, zIndex:100}}>
        <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
          <span style={{color:'#fff', fontSize:'20px', fontWeight:'600'}}>{business?.name || 'Business Dashboard'}</span>
        </div>
        {onBack && (
          <button onClick={onBack} style={{padding:'8px 16px', background:'#1e293b', border:'none', borderRadius:'8px', color:'#fff', cursor:'pointer', fontSize:'14px'}}>
            ← Back to Site
          </button>
        )}
      </div>
      <div className="db-layout">
        <div className="db-sidebar">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              width:'100%', padding:'12px 20px', background:activeTab===tab.id?'linear-gradient(135deg, #0ea5e9, #06b6d4)':'transparent', border:'none', borderRadius:'8px', color:activeTab===tab.id?'#fff':'#94a3b8', cursor:'pointer', fontSize:'14px', fontWeight:'500', textAlign:'left', display:'flex', alignItems:'center', gap:'10px', marginBottom:'4px'
            }}>
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
        <div className="db-content" style={{flex:1, padding:'24px', overflowY:'auto'}}>
          {renderContent()}
        </div>
      </div>
      <div className="db-bottom-nav">
        {[
          { id:'overview', icon:'📊', label:'Home' },
          { id:'customers', icon:'👥', label:'Clients' },
          { id:'loyalty', icon:'⭐', label:'Loyalty' },
          { id:'membership', icon:'💳', label:'Members' },
          { id:'referrals', icon:'🔗', label:'Referrals' },
          { id:'broadcast', icon:'📢', label:'Broadcast' },
          { id:'upgrade', icon:'🚀', label:'Upgrade' },
        ].map(tab => (
          <div key={tab.id} onClick={() => setActiveTab(tab.id)} style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'2px', cursor:'pointer', padding:'4px 0', position:'relative'}}>
            {activeTab === tab.id && <div style={{position:'absolute', top:0, width:4, height:4, borderRadius:'50%', background:'#0ea5e9'}} />}
            <div style={{fontSize:20}}>{tab.icon}</div>
            <span style={{fontSize:9, textTransform:'uppercase', letterSpacing:'0.04em', color:activeTab === tab.id?'#0ea5e9':'rgba(255,255,255,0.4)', fontWeight:activeTab === tab.id?600:400}}>{tab.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}