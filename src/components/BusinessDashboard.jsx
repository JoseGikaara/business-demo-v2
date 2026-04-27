import { useState } from 'react'

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

  const tabs = [
    { id:'overview', label:'Overview', icon:'📊' },
    { id:'customers', label:'Customers', icon:'👥' },
    { id:'loyalty', label:'Loyalty', icon:'⭐' },
    { id:'membership', label:'Membership', icon:'💎' },
    { id:'referrals', label:'Referrals', icon:'🎁' },
    { id:'broadcast', label:'Broadcast', icon:'📢' },
    { id:'website', label:'Website', icon:'🌐' },
    { id:'upgrade', label:'Upgrade', icon:'🚀' },
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
    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'16px', marginBottom:'24px'}}>
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
      <div style={{background:'#0f172a', border:'1px solid #1e293b', borderRadius:'12px', overflow:'hidden'}}>
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
        <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px'}}>
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
      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginBottom:'24px'}}>
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
      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'24px'}}>
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
      <div style={{background:'#0f172a', border:'1px solid #1e293b', borderRadius:'12px', padding:'24px', marginBottom:'24px'}}>
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
      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px', marginBottom:'32px'}}>
        {[
          { name:'Starter', price:'KES 15,000', period:'one-time payment', badge:null, features:['Website','WhatsApp button','Booking form','Google Maps embed','Gallery','FAQ section','Mobile responsive','1 year hosting'] },
          { name:'Growth', price:'KES 20,000', period:'one-time payment', badge:'Most Popular', features:['Everything in Starter','Customer CRM','Loyalty points system','Broadcast messaging','Referral tracking','Customer profiles','Monthly report'] },
          { name:'Pro', price:'KES 25,000', period:'one-time payment', badge:'Best Value', features:['Everything in Growth','Membership system','Priority support','Custom domain included','Staff accounts','Advanced analytics','Free updates for 1 year'] },
        ].map(plan => (
          <div key={plan.name} style={{background:'#0f172a', border:'1px solid #1e293b', borderRadius:'16px', padding:'28px', display:'flex', flexDirection:'column'}}>
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
      default: return renderOverview()
    }
  }

  return (
    <div style={{fontFamily:'Outfit, sans-serif', background:'#020617', minHeight:'100vh', color:'#fff'}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{height:'64px', background:'#0f172a', borderBottom:'1px solid #1e293b', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', position:'sticky', top:0, zIndex:100}}>
        <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{display:'none', background:'none', border:'none', color:'#fff', fontSize:'24px', cursor:'pointer'}} id="hamburger">
            ☰
          </button>
          <span style={{color:'#fff', fontSize:'20px', fontWeight:'600'}}>{business?.name || 'Business Dashboard'}</span>
        </div>
        {onBack && (
          <button onClick={onBack} style={{padding:'8px 16px', background:'#1e293b', border:'none', borderRadius:'8px', color:'#fff', cursor:'pointer', fontSize:'14px'}}>
            ← Back to Site
          </button>
        )}
      </div>
      <div style={{display:'flex', minHeight:'calc(100vh - 64px)'}}>
        <div style={{width:'220px', background:'#0f172a', borderRight:'1px solid #1e293b', padding:'16px 0', flexShrink:0}} className="sidebar">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              width:'100%', padding:'12px 20px', background:activeTab===tab.id?'linear-gradient(135deg, #0ea5e9, #06b6d4)':'transparent', border:'none', borderRadius:'8px', color:activeTab===tab.id?'#fff':'#94a3b8', cursor:'pointer', fontSize:'14px', fontWeight:'500', textAlign:'left', display:'flex', alignItems:'center', gap:'10px', marginBottom:'4px'
            }}>
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
        <div style={{flex:1, padding:'24px', overflowY:'auto'}}>
          {renderContent()}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .sidebar { display: none !important; }
          #hamburger { display: block !important; }
        }
      `}</style>
    </div>
  )
}