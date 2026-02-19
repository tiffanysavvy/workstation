import { useState, useRef, useEffect } from "react";
import {
  Check, Send, ChevronRight, AlertCircle, Calculator, ChevronDown, ChevronUp,
  Plus, Trash2, LayoutGrid, Users, TrendingUp, Inbox, Calendar,
  Scale, Clock, FileText, Mail, MessageSquare, Bell, Landmark,
  Target, ClipboardList, User, Layers, Scissors, RefreshCw,
  PhoneCall, FolderOpen, Edit2, AlertTriangle,
  ArrowRight, BadgeDollarSign
} from "lucide-react";

var tk = {
  bg:'#FDFCFB',surface:'#F8F5F1',ecru:'#EDE4D3',border:'#E8E0D4',
  black:'#1A1A1A',text:'#2A2A2A',muted:'#9B8F7E',
  warm:'#7A6F5E',maroon:'#7B2D2D',green:'#2A4A3A',teal:'#2A4A4A',
  gold:'#A07820',sidebar:'#F3EFE9',nav:'#1C1A18',
};

var AGENTS = {
  tax:    {label:'Tax',    color:'#5B4A8A',bg:'#F0EDF8'},
  invest: {label:'Invest', color:'#1A5C8A',bg:'#E8F2FA'},
  ops:    {label:'Ops',    color:'#2A5A3A',bg:'#E8F5EE'},
  client: {label:'Client', color:'#8A3A1A',bg:'#FAF0E8'},
};

function AgentIcon({role, size=10}) {
  var icons = {tax: Calculator, invest: TrendingUp, ops: Layers, client: Users};
  var I = icons[role] || Users;
  return <I size={size} strokeWidth={1.8}/>;
}

function AgentTag({role}) {
  var a = AGENTS[role];
  if (!a) return null;
  return (
    <span style={{display:'inline-flex',alignItems:'center',gap:3,fontSize:9,fontWeight:700,color:a.color,background:a.bg,padding:'2px 6px',borderRadius:20,border:'1px solid '+a.color+'25'}}>
      <AgentIcon role={role} size={9}/> {a.label}
    </span>
  );
}

var ITEM_ICONS = {
  tax: Scissors, rmd: Calendar, rebal: Scale, chen: Calendar,
  martinez: PhoneCall, taxdocs: FolderOpen, checkin: Bell,
  msg1: Mail, msg2: MessageSquare, ira: Landmark,
};

function ItemIcon({id, size=14, color}) {
  var I = ITEM_ICONS[id] || FileText;
  return <I size={size} strokeWidth={1.6} color={color || tk.warm}/>;
}

function Tag({text, color}) {
  color = color || tk.muted;
  return <span style={{fontSize:10,fontWeight:600,color,background:color+'18',padding:'2px 7px',borderRadius:20,whiteSpace:'nowrap'}}>{text}</span>;
}

function RiskFlag({text}) {
  return (
    <div style={{display:'flex',gap:8,padding:'9px 12px',background:'#FFF9F0',border:'1px solid #EDD8A0',borderRadius:8}}>
      <AlertTriangle size={12} strokeWidth={1.5} color={tk.gold} style={{marginTop:1,flexShrink:0}}/>
      <div style={{fontSize:11,color:'#7A5A10',lineHeight:1.6}}>{text}</div>
    </div>
  );
}

function DoneState({title, sub, onNext}) {
  useEffect(function() { var t = setTimeout(onNext, 1200); return function() { clearTimeout(t); }; }, []);
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',flex:1,textAlign:'center',padding:40}}>
      <div style={{width:48,height:48,borderRadius:'50%',background:'#E8F5EE',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:14}}>
        <Check size={22} strokeWidth={2} color={tk.green}/>
      </div>
      <div style={{fontSize:15,fontWeight:500,color:tk.text,marginBottom:3}}>{title}</div>
      <div style={{fontSize:11,color:tk.muted,marginBottom:16}}>{sub}</div>
      <div style={{fontSize:11,color:tk.muted}}>Loading next item…</div>
    </div>
  );
}

function StepBar({steps, current}) {
  return (
    <div style={{display:'flex',alignItems:'center',marginBottom:14}}>
      {steps.map(function(s, i) {
        var done = i < current, active = i === current;
        return (
          <div key={i} style={{display:'flex',alignItems:'center',flex:i<steps.length-1?1:'none'}}>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
              <div style={{width:22,height:22,borderRadius:'50%',background:done?tk.green:active?tk.black:tk.border,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                {done ? <Check size={10} strokeWidth={2.5} color="white"/> : <span style={{fontSize:9,fontWeight:700,color:active?'white':tk.muted}}>{i+1}</span>}
              </div>
              <span style={{fontSize:9,fontWeight:active?700:500,color:active?tk.text:tk.muted,whiteSpace:'nowrap'}}>{s}</span>
            </div>
            {i < steps.length-1 && <div style={{flex:1,height:1.5,background:done?tk.green:tk.border,margin:'0 6px',marginBottom:14}}/>}
          </div>
        );
      })}
    </div>
  );
}

function MiniBar({label, current, target, max, color}) {
  var cw = (current/max)*100, tw = (target/max)*100;
  return (
    <div style={{marginBottom:10}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
        <span style={{fontSize:11,color:tk.text}}>{label}</span>
        <span style={{fontSize:11,color:Math.abs(current-target)>3?tk.maroon:tk.muted}}>{current}% <span style={{color:tk.muted}}>/ {target}% target</span></span>
      </div>
      <div style={{position:'relative',height:8,background:tk.ecru,borderRadius:4}}>
        <div style={{position:'absolute',left:0,top:0,height:'100%',width:cw+'%',background:color,borderRadius:4}}/>
        <div style={{position:'absolute',top:-3,left:tw+'%',width:2,height:14,background:tk.black,borderRadius:1,transform:'translateX(-50%)'}}/>
      </div>
    </div>
  );
}

function ChatBar({isHome, context=null, onSend=null, onSkip=null}) {
  var homeCtx = {
    systemContext:"You are Spark, an AI assistant in a wealth advisor workstation for Heather. Today is Wednesday, February 18. She has 10 items in her queue. Be concise under 80 words.",
    suggestions:["What should I tackle first?","Any deadline risks today?","Prep me for James Chen's meeting"],
  };
  var ctx = isHome ? homeCtx : context;
  var [msgs, setMsgs] = useState([]);
  var [input, setInput] = useState('');
  var [loading, setLoading] = useState(false);
  var bottomRef = useRef(null);
  useEffect(function() { if (bottomRef.current) bottomRef.current.scrollIntoView({behavior:'smooth'}); }, [msgs]);

  function send(text) {
    if (!text.trim() || loading) return;
    var next = msgs.concat([{role:'user',text}]);
    setMsgs(next); setInput(''); setLoading(true);
    fetch("https://api.anthropic.com/v1/messages", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        model:"claude-sonnet-4-20250514", max_tokens:1000,
        system:"You are Spark, an AI assistant helping wealth advisor Heather. Be concise under 80 words.\n\nContext:\n"+ctx.systemContext,
        messages:next.map(function(m){return {role:m.role==='ai'?'assistant':'user',content:m.text};})
      })
    }).then(r=>r.json()).then(data=>{
      var reply = data.content && data.content.find(b=>b.type==='text');
      setMsgs(p=>p.concat([{role:'ai',text:reply?reply.text:"Let me know how to proceed."}]));
      setLoading(false);
    }).catch(()=>{
      setMsgs(p=>p.concat([{role:'ai',text:"Error — please try again."}]));
      setLoading(false);
    });
  }

  var showSug = msgs.length === 0;
  return (
    <div style={{display:'flex',flexDirection:'column',borderTop:'1px solid '+tk.border,background:tk.bg,flexShrink:0}}>
      <style>{'@keyframes dot{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}'}</style>
      {msgs.length > 0 && (
        <div style={{maxHeight:180,overflowY:'auto',padding:'10px 16px',display:'flex',flexDirection:'column',gap:7,borderBottom:'1px solid '+tk.border}}>
          {msgs.map(function(m,i){
            return (
              <div key={i} style={{display:'flex',gap:7,flexDirection:m.role==='ai'?'row':'row-reverse',alignItems:'flex-start'}}>
                {m.role==='ai' && <div style={{width:18,height:18,borderRadius:5,background:'linear-gradient(135deg,#5B4A8A,#1A5C8A)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:2}}><TrendingUp size={8} color="white" strokeWidth={2}/></div>}
                <div style={{maxWidth:'76%',padding:'7px 10px',fontSize:12,lineHeight:1.65,whiteSpace:'pre-wrap',borderRadius:m.role==='ai'?'4px 10px 10px 10px':'10px 4px 10px 10px',background:m.role==='ai'?tk.surface:tk.black,border:m.role==='ai'?'1px solid '+tk.border:'none',color:m.role==='ai'?tk.text:'white'}}>{m.text}</div>
              </div>
            );
          })}
          {loading && (
            <div style={{display:'flex',gap:7,alignItems:'flex-start'}}>
              <div style={{width:18,height:18,borderRadius:5,background:'linear-gradient(135deg,#5B4A8A,#1A5C8A)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><TrendingUp size={8} color="white" strokeWidth={2}/></div>
              <div style={{padding:'7px 10px',background:tk.surface,border:'1px solid '+tk.border,borderRadius:'4px 10px 10px 10px',display:'flex',gap:4,alignItems:'center'}}>
                {[0,1,2].map(i=><div key={i} style={{width:4,height:4,borderRadius:'50%',background:tk.muted,animation:'dot 1.2s ease-in-out '+(i*0.2)+'s infinite'}}/>)}
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>
      )}
      <div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 14px'}}>
        <div style={{flex:1,display:'flex',alignItems:'center',gap:6,minWidth:0}}>
          {showSug ? (
            <div style={{display:'flex',gap:5,overflow:'hidden',flex:1}}>
              {(ctx.suggestions||[]).slice(0,3).map(function(s,i){
                return <button key={i} onClick={()=>send(s)} style={{fontSize:11,color:tk.warm,background:tk.ecru,border:'1px solid '+tk.border,borderRadius:20,padding:'5px 10px',cursor:'pointer',whiteSpace:'nowrap',flexShrink:0}}>{s}</button>;
              })}
            </div>
          ) : (
            <div style={{display:'flex',gap:6,flex:1}}>
              <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send(input);}}} placeholder="Ask Spark anything…" style={{flex:1,fontSize:12,color:tk.text,background:tk.surface,border:'1px solid '+tk.border,borderRadius:8,padding:'7px 11px',outline:'none',fontFamily:'inherit',minWidth:0}}/>
              <button onClick={()=>send(input)} disabled={!input.trim()||loading} style={{padding:'7px 10px',background:input.trim()?tk.black:'transparent',border:'1px solid '+(input.trim()?tk.black:tk.border),borderRadius:8,cursor:input.trim()?'pointer':'default',display:'flex',alignItems:'center',flexShrink:0}}>
                <Send size={12} color={input.trim()?'white':tk.muted}/>
              </button>
            </div>
          )}
        </div>
        {!isHome && (
          <div style={{display:'flex',gap:6,alignItems:'center'}}>
            <div style={{width:1,height:28,background:tk.border,flexShrink:0}}/>
            <button onClick={onSend} style={{padding:'7px 14px',background:tk.green,color:'white',border:'none',borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:5,flexShrink:0,whiteSpace:'nowrap'}}>
              <Send size={11}/> {ctx.sendLabel}
            </button>
            <button onClick={onSkip} style={{padding:'7px 10px',background:'transparent',border:'1px solid '+tk.border,borderRadius:8,fontSize:11,color:tk.muted,cursor:'pointer',flexShrink:0}}>Skip</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Inline editing helpers ─────────────────────────────────────────
function InlineEdit({value, onChange, multiline=false, placeholder='', style: ext=null}) {
  var [editing, setEditing] = useState(false);
  var ref = useRef(null);
  useEffect(()=>{ if (editing && ref.current) { ref.current.focus(); if (!multiline) ref.current.select(); }}, [editing]);
  var base = Object.assign({fontSize:12,color:tk.text,lineHeight:1.7,background:'transparent',border:'none',outline:'none',fontFamily:'inherit',width:'100%',padding:0,margin:0,resize:'none',display:'block',boxSizing:'border-box'}, ext||{});
  if (!editing) return (
    <div onClick={()=>setEditing(true)} style={{cursor:'text',display:'flex',alignItems:'flex-start',gap:4,minHeight:18}}>
      <span style={Object.assign({flex:1},base,{color:value?base.color:tk.muted})}>{value||placeholder||'Click to edit'}</span>
      <Edit2 size={9} color={tk.border} style={{flexShrink:0,marginTop:3}}/>
    </div>
  );
  if (multiline) return <textarea ref={ref} value={value} onChange={e=>onChange(e.target.value)} onBlur={()=>setEditing(false)} placeholder={placeholder} style={Object.assign({},base,{minHeight:48})}/>;
  return <input ref={ref} value={value} onChange={e=>onChange(e.target.value)} onBlur={()=>setEditing(false)} placeholder={placeholder} style={base}/>;
}

function SectionHead({icon: Icon, label, onAdd=null}) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:8}}>
      <Icon size={12} strokeWidth={1.8} color={tk.warm}/>
      <span style={{fontSize:10,fontWeight:700,color:tk.warm,textTransform:'uppercase',letterSpacing:1}}>{label}</span>
      {onAdd && (
        <button onClick={onAdd} style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:3,fontSize:10,color:tk.muted,background:'transparent',border:'none',cursor:'pointer',padding:'2px 6px',borderRadius:6}}>
          <Plus size={10}/> Add
        </button>
      )}
    </div>
  );
}

// ── Planning Tab ───────────────────────────────────────────────────
function GoalBar({goal}) {
  var colors = {'on-track':tk.green, caution:tk.gold, 'needs-plan':tk.maroon};
  var labels = {'on-track':'On track', caution:'Caution', 'needs-plan':'Needs plan'};
  var c = colors[goal.status] || tk.muted;
  return (
    <div style={{padding:'10px 12px',background:tk.surface,border:'1px solid '+tk.border,borderRadius:9,marginBottom:6}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:5}}>
        <div style={{display:'flex',alignItems:'center',gap:7}}>
          <span style={{fontSize:12,fontWeight:600,color:tk.text}}>{goal.label}</span>
          <Tag text={labels[goal.status]} color={c}/>
        </div>
        <span style={{fontSize:10,color:tk.muted}}>Target {goal.target}</span>
      </div>
      <div style={{height:6,background:tk.ecru,borderRadius:3,overflow:'hidden',marginBottom:5}}>
        <div style={{height:'100%',width:goal.progress+'%',background:c,borderRadius:3}}/>
      </div>
      <div style={{fontSize:10,color:tk.muted}}>{goal.note}</div>
    </div>
  );
}

function PlanningTab({planning}) {
  var nw = planning.netWorth;
  var totalAssets = nw.breakdown.reduce((s,i)=>s+i.v,0);
  var totalLiabilities = nw.liabilities.reduce((s,i)=>s+i.v,0);
  var net = totalAssets - totalLiabilities;
  var cf = planning.cashFlow;
  var roth = planning.rothOpportunity;
  return (
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      {/* Balance sheet */}
      <div>
        <div style={{fontSize:10,fontWeight:600,color:tk.muted,textTransform:'uppercase',letterSpacing:0.8,marginBottom:8}}>Balance sheet snapshot</div>
        <div style={{background:tk.ecru,borderRadius:10,padding:'12px 14px',display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:8}}>
          <div><div style={{fontSize:9,color:tk.warm,textTransform:'uppercase',letterSpacing:0.5,marginBottom:2}}>Total assets</div><div style={{fontSize:17,fontWeight:300,color:tk.text}}>${(totalAssets/1000000).toFixed(2)}M</div></div>
          <div><div style={{fontSize:9,color:tk.warm,textTransform:'uppercase',letterSpacing:0.5,marginBottom:2}}>Liabilities</div><div style={{fontSize:17,fontWeight:300,color:tk.maroon}}>${(totalLiabilities/1000).toFixed(0)}K</div></div>
          <div><div style={{fontSize:9,color:tk.warm,textTransform:'uppercase',letterSpacing:0.5,marginBottom:2}}>Net worth</div><div style={{fontSize:17,fontWeight:300,color:tk.green}}>${(net/1000000).toFixed(2)}M</div></div>
        </div>
        <div style={{background:tk.surface,border:'1px solid '+tk.border,borderRadius:9,overflow:'hidden'}}>
          {nw.breakdown.map((item,i)=>(
            <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'8px 12px',borderBottom:i<nw.breakdown.length-1?'1px solid '+tk.border:'none',alignItems:'center'}}>
              <span style={{fontSize:11,color:tk.text}}>{item.l}</span>
              <span style={{fontSize:11,fontWeight:500,color:tk.text}}>${item.v.toLocaleString()}</span>
            </div>
          ))}
          {nw.liabilities.map((item,i)=>(
            <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'8px 12px',alignItems:'center',background:'#FFF8F8',borderTop:'1px solid '+tk.border}}>
              <span style={{fontSize:11,color:tk.maroon}}>{item.l} (liability)</span>
              <span style={{fontSize:11,fontWeight:500,color:tk.maroon}}>-${item.v.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Goals */}
      <div>
        <div style={{fontSize:10,fontWeight:600,color:tk.muted,textTransform:'uppercase',letterSpacing:0.8,marginBottom:8}}>Goal tracking</div>
        {planning.goals.map((g,i)=><GoalBar key={i} goal={g}/>)}
      </div>

      {/* Cash flow */}
      <div>
        <div style={{fontSize:10,fontWeight:600,color:tk.muted,textTransform:'uppercase',letterSpacing:0.8,marginBottom:8}}>Cash flow & savings</div>
        <div style={{background:tk.surface,border:'1px solid '+tk.border,borderRadius:9,padding:'12px 14px'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:8}}>
            <div><div style={{fontSize:9,color:tk.warm,textTransform:'uppercase',letterSpacing:0.5,marginBottom:2}}>Gross income</div><div style={{fontSize:15,fontWeight:300,color:tk.text}}>${cf.income.toLocaleString()}</div></div>
            <div><div style={{fontSize:9,color:tk.warm,textTransform:'uppercase',letterSpacing:0.5,marginBottom:2}}>Savings rate</div><div style={{fontSize:15,fontWeight:300,color:cf.savingsRate<15?tk.gold:tk.green}}>{cf.savingsRate}%</div></div>
            <div><div style={{fontSize:9,color:tk.warm,textTransform:'uppercase',letterSpacing:0.5,marginBottom:2}}>Monthly surplus</div><div style={{fontSize:15,fontWeight:300,color:tk.text}}>${cf.monthlyNet.toLocaleString()}</div></div>
          </div>
          <div style={{fontSize:10,color:tk.muted,lineHeight:1.6}}>{cf.note}</div>
        </div>
      </div>

      {/* Roth opportunity */}
      <div style={{padding:'10px 12px',background:roth.eligible?'#EEF6EE':'#F5F5F0',border:'1px solid '+(roth.eligible?'#B0D8B0':tk.border),borderRadius:9}}>
        <div style={{fontSize:11,fontWeight:600,color:roth.eligible?tk.green:tk.warm,marginBottom:4}}>
          {roth.eligible ? '✓ Roth contribution eligible' : 'Backdoor Roth opportunity'}
        </div>
        <div style={{fontSize:11,color:tk.muted,lineHeight:1.6}}>{roth.note}</div>
      </div>

      {/* Planning gaps */}
      <div>
        <div style={{fontSize:10,fontWeight:600,color:tk.muted,textTransform:'uppercase',letterSpacing:0.8,marginBottom:8}}>Planning gaps</div>
        {planning.gaps.map((g,i)=>(
          <div key={i} style={{display:'flex',gap:9,padding:'9px 12px',background:g.severity==='high'?'#FFF9F0':'#FFFDF5',border:'1px solid '+(g.severity==='high'?'#EDD8A0':'#E0DAB0'),borderRadius:9,marginBottom:6}}>
            <AlertCircle size={12} strokeWidth={1.5} color={g.severity==='high'?tk.maroon:tk.gold} style={{marginTop:1,flexShrink:0}}/>
            <div>
              <div style={{fontSize:11,fontWeight:600,color:g.severity==='high'?tk.maroon:tk.gold,marginBottom:2}}>{g.type}</div>
              <div style={{fontSize:11,color:tk.muted,lineHeight:1.6}}>{g.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Prep Tab ───────────────────────────────────────────────────────
function PrepTab({household: initHH, agenda, setAgenda, statusColors, statusLabels}) {
  var [hh, setHh] = useState(initHH);
  var [expanded, setExpanded] = useState(null);
  var updMember = (i,f,v) => setHh(h=>Object.assign({},h,{members:h.members.map((m,j)=>j===i?Object.assign({},m,{[f]:v}):m)}));
  var updSince  = (i,v) => setHh(h=>Object.assign({},h,{since_last:h.since_last.map((s,j)=>j===i?Object.assign({},s,{text:v}):s)}));
  var addSince  = () => setHh(h=>Object.assign({},h,{since_last:h.since_last.concat([{dot:tk.muted,text:''}])}));
  var rmSince   = (i) => setHh(h=>Object.assign({},h,{since_last:h.since_last.filter((_,j)=>j!==i)}));

  var updQ      = (i,v) => setHh(h=>Object.assign({},h,{client_questions:h.client_questions.map((q,j)=>j===i?Object.assign({},q,{text:v}):q)}));
  var updAgenda = (i,f,v) => setAgenda(agenda.map((item,j)=>j===i?Object.assign({},item,{[f]:v}):item));
  var statusDots = {ready:tk.green, caution:tk.gold, open:tk.muted};

  var div = '1px solid '+tk.border+'80';

  return (
    <div style={{paddingBottom:8}}>
      {hh && hh.client_questions && hh.client_questions.length > 0 && (
        <div style={{marginBottom:16}}>
          <SectionHead icon={MessageSquare} label="Questions from client"/>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {hh.client_questions.map((q,i)=>(
              <div key={i} style={{padding:'10px 12px',background:'#FFFBF0',border:'1px solid #EDD8A0',borderRadius:9}}>
                <div style={{fontSize:10,color:'#A07820',fontWeight:600,marginBottom:5}}>{q.date} — {q.from||'Client'}</div>
                <InlineEdit value={q.text} onChange={v=>updQ(i,v)} multiline style={{fontSize:12,color:'#5A3A00'}}/>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{marginBottom:16}}>
        <SectionHead icon={User} label="Household"/>
        <div style={{background:tk.bg,border:'1px solid '+tk.border,borderRadius:10,overflow:'hidden'}}>
          {hh && hh.members.map((m,i)=>(
            <div key={i} style={{padding:'10px 14px',borderBottom:div}}>
              <div style={{display:'flex',alignItems:'flex-start',gap:10}}>
                <div style={{width:28,height:28,borderRadius:'50%',background:i===0?tk.warm:tk.ecru,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700,color:i===0?'white':tk.warm,flexShrink:0,marginTop:1}}>
                  {m.name.split(' ').map(n=>n[0]).join('')}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:600,color:tk.text,marginBottom:3}}>{m.name}</div>
                  <InlineEdit value={m.detail} onChange={v=>updMember(i,'detail',v)} placeholder="Add details…" style={{fontSize:11,color:tk.muted}}/>
                </div>
              </div>
            </div>
          ))}
          <div style={{padding:'10px 14px',borderBottom:div}}>
            <div style={{fontSize:10,fontWeight:600,color:tk.muted,textTransform:'uppercase',letterSpacing:0.8,marginBottom:5}}>Life stage</div>
            <InlineEdit value={hh?hh.life_stage:''} onChange={v=>setHh(h=>Object.assign({},h,{life_stage:v}))} multiline placeholder="Describe life stage…"/>
          </div>
          <div style={{padding:'10px 14px'}}>
            <div style={{fontSize:10,fontWeight:600,color:tk.muted,textTransform:'uppercase',letterSpacing:0.8,marginBottom:5}}>Comms preferences</div>
            <InlineEdit value={hh?hh.comms:''} onChange={v=>setHh(h=>Object.assign({},h,{comms:v}))} multiline placeholder="Add comms preferences…" style={{color:tk.muted}}/>
          </div>
        </div>
      </div>
      <div style={{marginBottom:16}}>
        <SectionHead icon={Clock} label="Since you last met" onAdd={addSince}/>
        <div style={{display:'flex',flexDirection:'column',gap:4}}>
          {hh && hh.since_last.map((s,i)=>{
            var dotColors=[tk.maroon,tk.gold,tk.green,tk.teal,tk.muted];
            return (
              <div key={i} style={{background:tk.bg,border:'1px solid '+tk.border,borderRadius:8,padding:'9px 12px',display:'flex',gap:10,alignItems:'flex-start'}}>
                <div style={{width:7,height:7,borderRadius:'50%',background:s.dot||dotColors[i%dotColors.length],flexShrink:0,marginTop:5}}/>
                <div style={{flex:1,minWidth:0}}><InlineEdit value={s.text} onChange={v=>updSince(i,v)} multiline placeholder="Add update…"/></div>
                <button onClick={()=>rmSince(i)} style={{background:'transparent',border:'none',cursor:'pointer',padding:2,color:tk.muted,opacity:0.4,flexShrink:0}}><Trash2 size={10}/></button>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <SectionHead icon={ClipboardList} label="Agenda"/>
        <div style={{display:'flex',flexDirection:'column',gap:4}}>
          {agenda.map((item,i)=>{
            var isExp = expanded===i;
            return (
              <div key={i} style={{background:tk.bg,border:'1px solid '+tk.border,borderRadius:9,overflow:'hidden'}}>
                <div onClick={()=>setExpanded(isExp?null:i)} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',cursor:'pointer',background:isExp?tk.ecru:tk.bg}}>
                  <div style={{width:18,height:18,borderRadius:'50%',background:statusDots[item.status]+'18',border:'1.5px solid '+statusDots[item.status],display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <div style={{width:6,height:6,borderRadius:'50%',background:statusDots[item.status]}}/>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:500,color:tk.text}}>{item.t}</div>
                    <div style={{fontSize:10,color:tk.muted}}>{item.d}</div>
                  </div>
                  <Tag text={statusLabels[item.status]} color={statusDots[item.status]}/>
                  {isExp ? <ChevronUp size={11} color={tk.muted}/> : <ChevronDown size={11} color={tk.muted}/>}
                </div>
                {isExp && (
                  <div style={{padding:'12px 14px',borderTop:'1px solid '+tk.border,background:tk.surface}}>
                    <div style={{fontSize:10,fontWeight:600,color:tk.muted,textTransform:'uppercase',letterSpacing:0.7,marginBottom:5}}>Advisor tip</div>
                    <textarea value={item.tip} onChange={e=>updAgenda(i,'tip',e.target.value)} style={{width:'100%',fontSize:12,color:tk.text,lineHeight:1.7,background:tk.bg,border:'1px solid '+tk.border,borderRadius:7,padding:'8px 10px',outline:'none',fontFamily:'inherit',resize:'none',minHeight:52,boxSizing:'border-box',marginBottom:10}}/>
                    <div style={{fontSize:10,fontWeight:600,color:tk.muted,textTransform:'uppercase',letterSpacing:0.7,marginBottom:6}}>Status</div>
                    <div style={{display:'flex',gap:5}}>
                      {['ready','caution','open'].map(s=>{
                        var act = item.status===s;
                        return (
                          <button key={s} onClick={e=>{e.stopPropagation();updAgenda(i,'status',s);}} style={{fontSize:10,fontWeight:600,padding:'4px 12px',borderRadius:20,border:'1.5px solid '+statusDots[s],background:act?statusDots[s]:'transparent',color:act?'white':statusDots[s],cursor:'pointer'}}>
                            {statusLabels[s]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Other panels ───────────────────────────────────────────────────
function TaxHarvestPanel({onDone, onSkip}) {
  var positions=[
    {ticker:'AAPL',name:'Apple Inc.',loss:-4034,repl:'MSFT',type:'LT',basisAge:'14 mo',riskNote:'High overlap with MSFT — acceptable'},
    {ticker:'BNDX',name:'Vanguard Intl Bd',loss:-1675,repl:'IAGG',type:'LT',basisAge:'22 mo',riskNote:'Near-identical exposure'},
    {ticker:'VWO',name:'Vanguard EM',loss:-1305,repl:'IEMG',type:'LT',basisAge:'18 mo',riskNote:'Same EM index, diff provider'},
    {ticker:'NVDA',name:'Nvidia Corp.',loss:-2784,repl:'AMD',type:'ST',basisAge:'8 mo',riskNote:'ST loss — taxed at 32% rate'},
  ];
  var [step,setStep]=useState(0);
  var [sel,setSel]=useState({AAPL:true,BNDX:true,VWO:true,NVDA:true});
  var [sent,setSent]=useState(false);
  var active=positions.filter(p=>sel[p.ticker]);
  var ltLoss=active.filter(p=>p.type==='LT').reduce((s,p)=>s+p.loss,0);
  var stLoss=active.filter(p=>p.type==='ST').reduce((s,p)=>s+p.loss,0);
  var totalLoss=ltLoss+stLoss;
  var totalSavings=Math.round(Math.abs(ltLoss)*0.238)+Math.round(Math.abs(stLoss)*0.32);
  if(sent)return <DoneState title="Harvest proposal sent to James Chen" sub={active.length+' positions harvested · awaiting e-sign'} onNext={onDone}/>;
  return (
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      <StepBar steps={['Review losses','Select & adjust','Confirm proposal']} current={step}/>
      {step===0&&(<div style={{display:'flex',flexDirection:'column',gap:12}}>
        <div style={{background:'#1A2E1A',borderRadius:10,padding:'11px 14px',display:'flex',gap:10}}>
          <Calculator size={13} color="#7EC8A0" style={{marginTop:1,flexShrink:0}}/>
          <div style={{fontSize:12,color:'#7EC8A0',lineHeight:1.7}}>Chen household · bracket: <strong>32% ST / 23.8% LT</strong> · Window closes March 31</div>
        </div>
        {positions.map(p=>{var pct=Math.abs(p.loss)/9798*100;return(
          <div key={p.ticker} style={{padding:'10px 12px',background:tk.surface,border:'1px solid '+tk.border,borderRadius:10}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
              <div style={{display:'flex',alignItems:'center',gap:7}}><span style={{fontSize:12,fontWeight:700,color:tk.text}}>{p.ticker}</span><Tag text={p.type} color={p.type==='ST'?tk.gold:tk.teal}/><span style={{fontSize:10,color:tk.muted}}>held {p.basisAge}</span></div>
              <span style={{fontSize:13,fontWeight:600,color:tk.maroon}}>{p.loss.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0})}</span>
            </div>
            <div style={{height:6,background:tk.ecru,borderRadius:3,overflow:'hidden'}}><div style={{height:'100%',width:pct+'%',background:p.type==='ST'?'#C4882A':'#7B2D2D',borderRadius:3}}/></div>
            <div style={{fontSize:10,color:tk.muted,marginTop:4}}>Replace with {p.repl} · {p.riskNote}</div>
          </div>
        );})}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
          {[{l:'Total harvestable',v:'$9,798',c:tk.maroon},{l:'LT savings (23.8%)',v:'~$'+Math.round(Math.abs(positions.filter(p=>p.type==='LT').reduce((s,p)=>s+p.loss,0))*0.238).toLocaleString(),c:tk.teal},{l:'ST savings (32%)',v:'~$'+Math.round(Math.abs(positions.filter(p=>p.type==='ST').reduce((s,p)=>s+p.loss,0))*0.32).toLocaleString(),c:tk.gold}].map((s,i)=>(
            <div key={i} style={{background:tk.ecru,borderRadius:9,padding:'10px 12px'}}><div style={{fontSize:9,color:tk.warm,textTransform:'uppercase',letterSpacing:0.5,marginBottom:3}}>{s.l}</div><div style={{fontSize:17,fontWeight:300,color:s.c}}>{s.v}</div></div>
          ))}
        </div>
        <button onClick={()=>setStep(1)} style={{padding:'10px',background:tk.black,color:'white',border:'none',borderRadius:9,fontSize:12,fontWeight:600,cursor:'pointer'}}>Select positions to harvest →</button>
      </div>)}
      {step===1&&(<div style={{display:'flex',flexDirection:'column',gap:10}}>
        {positions.map(pos=>{var on=sel[pos.ticker];var savings=Math.round(Math.abs(pos.loss)*(pos.type==='ST'?0.32:0.238));return(
          <div key={pos.ticker} onClick={()=>setSel(p=>{var n=Object.assign({},p);n[pos.ticker]=!p[pos.ticker];return n;})}
            style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:on?tk.surface:'transparent',border:'1px solid '+(on?'#C4B89A':tk.border),borderRadius:10,cursor:'pointer',opacity:on?1:.45}}>
            <div style={{width:15,height:15,borderRadius:4,border:'1.5px solid '+(on?tk.green:tk.border),background:on?tk.green:'transparent',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>{on&&<Check size={8} strokeWidth={2.5} color="white"/>}</div>
            <div style={{flex:1}}><div style={{display:'flex',alignItems:'center',gap:6}}><span style={{fontSize:12,fontWeight:600,color:tk.text}}>{pos.ticker}</span><span style={{fontSize:11,color:tk.muted}}>{pos.name}</span><Tag text={pos.type} color={pos.type==='ST'?tk.gold:tk.teal}/></div><div style={{fontSize:10,color:tk.muted,marginTop:2}}>to {pos.repl} · <span style={{color:tk.green}}>wash-sale clear</span></div></div>
            <div style={{textAlign:'right'}}><div style={{fontSize:12,fontWeight:500,color:tk.maroon}}>{pos.loss.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0})}</div><div style={{fontSize:10,color:tk.green}}>saves ~${savings.toLocaleString()}</div></div>
          </div>
        );})}
        <div style={{padding:'12px',background:tk.ecru,borderRadius:10,display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
          <div><div style={{fontSize:9,color:tk.warm,textTransform:'uppercase',letterSpacing:0.5,marginBottom:2}}>Selected loss</div><div style={{fontSize:17,fontWeight:300,color:tk.maroon}}>${Math.abs(totalLoss).toLocaleString()}</div></div>
          <div><div style={{fontSize:9,color:tk.warm,textTransform:'uppercase',letterSpacing:0.5,marginBottom:2}}>Est. tax savings</div><div style={{fontSize:17,fontWeight:300,color:tk.green}}>~${totalSavings.toLocaleString()}</div></div>
          <div><div style={{fontSize:9,color:tk.warm,textTransform:'uppercase',letterSpacing:0.5,marginBottom:2}}>Positions</div><div style={{fontSize:17,fontWeight:300,color:tk.text}}>{active.length} of 4</div></div>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>setStep(0)} style={{padding:'9px 16px',background:'transparent',color:tk.muted,border:'1px solid '+tk.border,borderRadius:9,fontSize:12,cursor:'pointer'}}>Back</button>
          <button onClick={()=>setStep(2)} disabled={!active.length} style={{flex:1,padding:'9px',background:active.length?tk.black:'#ccc',color:'white',border:'none',borderRadius:9,fontSize:12,fontWeight:600,cursor:active.length?'pointer':'default'}}>Review proposal →</button>
        </div>
      </div>)}
      {step===2&&(<div style={{display:'flex',flexDirection:'column',gap:10}}>
        <div style={{background:tk.surface,border:'1px solid '+tk.border,borderRadius:10,overflow:'hidden'}}>
          <div style={{padding:'10px 14px',borderBottom:'1px solid '+tk.border,background:tk.ecru}}><div style={{fontSize:12,fontWeight:600,color:tk.text}}>To: James Chen · Tax-Loss Harvest Proposal</div><div style={{fontSize:10,color:tk.muted,marginTop:1}}>Requires e-sign before execution · March 31 deadline</div></div>
          {active.map((p,i)=>(
            <div key={p.ticker} style={{display:'flex',alignItems:'center',padding:'9px 14px',borderBottom:i<active.length-1?'1px solid '+tk.border:'none',gap:10}}>
              <div style={{flex:1}}><span style={{fontSize:12,fontWeight:600,color:tk.text}}>{p.ticker} to {p.repl}</span>{' '}<Tag text={p.type+' loss'} color={p.type==='ST'?tk.gold:tk.teal}/></div>
              <div style={{textAlign:'right'}}><div style={{fontSize:11,color:tk.maroon}}>{p.loss.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0})}</div><div style={{fontSize:10,color:tk.green}}>saves ~${Math.round(Math.abs(p.loss)*(p.type==='ST'?0.32:0.238)).toLocaleString()}</div></div>
            </div>
          ))}
          <div style={{padding:'10px 14px',background:'#F0FFF4',display:'flex',justifyContent:'space-between',alignItems:'center'}}><span style={{fontSize:12,fontWeight:600,color:tk.text}}>Total est. tax savings</span><span style={{fontSize:16,fontWeight:300,color:tk.green}}>~${totalSavings.toLocaleString()}</span></div>
        </div>
        <RiskFlag text="E-sign required before any trades execute. Wash-sale window is 30 days — replacements pre-screened."/>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>setStep(1)} style={{padding:'9px 16px',background:'transparent',color:tk.muted,border:'1px solid '+tk.border,borderRadius:9,fontSize:12,cursor:'pointer'}}>Edit</button>
          <button onClick={()=>setSent(true)} style={{flex:1,padding:'9px',background:tk.green,color:'white',border:'none',borderRadius:9,fontSize:12,fontWeight:600,cursor:'pointer'}}>Send proposal to James</button>
        </div>
      </div>)}
    </div>
  );
}

function RebalancingPanel({onDone, onSkip}) {
  var allTrades=[
    {id:0,label:'US Equity (VTI)',action:'Sell',amount:74200,current:68.1,target:45,reason:'Tech rally +23pt overweight',taxCost:8200},
    {id:1,label:'Intl Equity (VXUS)',action:'Buy',amount:36800,current:9.4,target:15,reason:'Underweight vs. IPS target',taxCost:0},
    {id:2,label:'Fixed Income (BND)',action:'Buy',amount:43600,current:18.2,target:25,reason:'Lagged equity rally',taxCost:0},
    {id:3,label:'Cash',action:'Buy',amount:6200,current:4.3,target:15,reason:'Deploy excess cash',taxCost:0},
  ];
  var [sel,setSel]=useState({0:true,1:true,2:true,3:true});
  var [showTax,setShowTax]=useState(false);
  var [step,setStep]=useState(0);
  var [sent,setSent]=useState(false);
  var active=allTrades.filter(t=>sel[t.id]);
  var netTax=active.reduce((s,t)=>s+t.taxCost,0);
  if(sent)return <DoneState title="Rebalancing proposal sent" sub="Tom & Sarah Williams · trades execute on e-sign" onNext={onDone}/>;
  return (
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      <StepBar steps={['View drift','Select trades','Confirm']} current={step}/>
      {step===0&&(<div style={{display:'flex',flexDirection:'column',gap:10}}>
        <div style={{background:tk.ecru,borderRadius:10,padding:'12px 14px',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
          {[{l:'Portfolio drift',v:'8.1%',c:tk.maroon},{l:'Trigger threshold',v:'5%',c:tk.muted},{l:'AUM',v:'$3.2M',c:tk.text},{l:'Days overdue',v:'47',c:tk.maroon}].map((s,i)=>(
            <div key={i}><div style={{fontSize:9,color:tk.warm,textTransform:'uppercase',letterSpacing:0.5,marginBottom:2}}>{s.l}</div><div style={{fontSize:16,fontWeight:300,color:s.c}}>{s.v}</div></div>
          ))}
        </div>
        {allTrades.map(t=><MiniBar key={t.id} label={t.label} current={t.current} target={t.target} max={80} color={t.action==='Sell'?'#C4703A':'#2A4A3A'}/>)}
        <button onClick={()=>setStep(1)} style={{padding:'10px',background:tk.black,color:'white',border:'none',borderRadius:9,fontSize:12,fontWeight:600,cursor:'pointer'}}>Build trade list →</button>
      </div>)}
      {step===1&&(<div style={{display:'flex',flexDirection:'column',gap:10}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{fontSize:10,fontWeight:600,color:tk.muted,textTransform:'uppercase',letterSpacing:0.8}}>Toggle trades to include</div>
          <button onClick={()=>setShowTax(p=>!p)} style={{fontSize:10,color:tk.teal,background:'transparent',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:3}}>
            {showTax?<ChevronUp size={10}/>:<ChevronDown size={10}/>} {showTax?'Hide':'Show'} tax detail
          </button>
        </div>
        {allTrades.map(t=>{var on=sel[t.id];return(
          <div key={t.id} onClick={()=>setSel(p=>{var n=Object.assign({},p);n[t.id]=!p[t.id];return n;})}
            style={{display:'flex',flexDirection:'column',padding:'10px 12px',background:on?tk.surface:'transparent',border:'1px solid '+(on?'#C4B89A':tk.border),borderRadius:10,cursor:'pointer',opacity:on?1:.45}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:15,height:15,borderRadius:4,border:'1.5px solid '+(on?tk.green:tk.border),background:on?tk.green:'transparent',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>{on&&<Check size={8} strokeWidth={2.5} color="white"/>}</div>
              <div style={{flex:1}}><div style={{display:'flex',alignItems:'center',gap:6}}><span style={{fontSize:12,fontWeight:700,color:t.action==='Sell'?tk.maroon:tk.green}}>{t.action}</span><span style={{fontSize:12,color:tk.text}}>{t.label}</span><Tag text={t.current+'% to '+t.target+'%'} color={t.action==='Sell'?tk.maroon:tk.gold}/></div><div style={{fontSize:10,color:tk.muted,marginTop:1}}>{t.reason}</div></div>
              <span style={{fontSize:12,fontWeight:500,color:tk.text}}>${t.amount.toLocaleString()}</span>
            </div>
            {showTax&&t.taxCost>0&&(<div style={{marginTop:7,padding:'6px 10px',background:'#FFF9F0',borderRadius:7,fontSize:11,color:'#7A5A10',marginLeft:25}}>Realizes ~${t.taxCost.toLocaleString()} taxable gain — long-term rate applies</div>)}
          </div>
        );})}
        <div style={{padding:'10px 12px',background:tk.ecru,borderRadius:9,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{fontSize:11,color:tk.text}}>{active.length} trades · ${active.reduce((s,t)=>s+t.amount,0).toLocaleString()} total</span>
          {netTax>0&&<span style={{fontSize:11,color:tk.gold}}>Est. tax cost: ${netTax.toLocaleString()}</span>}
        </div>
        <RiskFlag text="Selling VTI realizes ~$8,200 taxable gain (LT rate). Pre-reviewed for compliance."/>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>setStep(0)} style={{padding:'9px 16px',background:'transparent',color:tk.muted,border:'1px solid '+tk.border,borderRadius:9,fontSize:12,cursor:'pointer'}}>Back</button>
          <button onClick={()=>setStep(2)} disabled={!active.length} style={{flex:1,padding:'9px',background:active.length?tk.black:'#ccc',color:'white',border:'none',borderRadius:9,fontSize:12,fontWeight:600,cursor:active.length?'pointer':'default'}}>Review →</button>
        </div>
      </div>)}
      {step===2&&(<div style={{display:'flex',flexDirection:'column',gap:10}}>
        <div style={{background:tk.surface,border:'1px solid '+tk.border,borderRadius:10,overflow:'hidden'}}>
          <div style={{padding:'10px 14px',background:tk.ecru,borderBottom:'1px solid '+tk.border}}><div style={{fontSize:12,fontWeight:600,color:tk.text}}>To: Tom & Sarah Williams · Rebalancing Proposal</div><div style={{fontSize:10,color:tk.muted,marginTop:1}}>$3.2M portfolio · 8.1% drift corrected · e-sign to execute</div></div>
          {active.map((t,i)=>(
            <div key={t.id} style={{display:'flex',alignItems:'center',padding:'9px 14px',borderBottom:i<active.length-1?'1px solid '+tk.border:'none',gap:10}}>
              <span style={{fontSize:12,fontWeight:700,color:t.action==='Sell'?tk.maroon:tk.green,width:28}}>{t.action}</span>
              <span style={{flex:1,fontSize:12,color:tk.text}}>{t.label}</span>
              <Tag text={t.current+'% to '+t.target+'%'} color={tk.muted}/>
              <span style={{fontSize:12,fontWeight:500}}>${t.amount.toLocaleString()}</span>
            </div>
          ))}
          <div style={{padding:'10px 14px',background:tk.ecru,display:'flex',justifyContent:'space-between'}}><span style={{fontSize:11,color:tk.text}}>Net tax impact</span><span style={{fontSize:12,color:tk.gold}}>~${netTax.toLocaleString()} gain (LT rate)</span></div>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>setStep(1)} style={{padding:'9px 16px',background:'transparent',color:tk.muted,border:'1px solid '+tk.border,borderRadius:9,fontSize:12,cursor:'pointer'}}>Edit</button>
          <button onClick={()=>setSent(true)} style={{flex:1,padding:'9px',background:tk.green,color:'white',border:'none',borderRadius:9,fontSize:12,fontWeight:600,cursor:'pointer'}}>Send to Williams</button>
        </div>
      </div>)}
    </div>
  );
}

function RMDPanel({onDone, onSkip=null}) {
  var [step,setStep]=useState(0);
  var [qcd,setQcd]=useState(10000);
  var [method,setMethod]=useState('monthly');
  var [alloc,setAlloc]=useState({ira1:60,ira2:40});
  var [submitted,setSubmitted]=useState(false);
  var total=47200,taxable=total-qcd;
  var est1=Math.round(total*(alloc.ira1/100)),est2=total-est1;
  if(submitted)return <DoneState title="RMD distribution submitted" sub="Robert Johnson · April 1 deadline met" onNext={onDone}/>;
  return (
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      <StepBar steps={['RMD breakdown','Source accounts','Confirm']} current={step}/>
      {step===0&&(<div style={{display:'flex',flexDirection:'column',gap:10}}>
        <div style={{background:'#1A2E1A',borderRadius:10,padding:'11px 14px',display:'flex',gap:10}}>
          <Calculator size={13} color="#7EC8A0" style={{marginTop:1,flexShrink:0}}/>
          <div style={{fontSize:12,color:'#7EC8A0',lineHeight:1.7}}>$1,184,000 / 25.1 (IRS factor, age 74) = <strong>$47,200 due April 1</strong> · 25% penalty if missed</div>
        </div>
        <div style={{display:'flex',gap:6}}>
          {[0,5000,10000,20000].map(amt=>(
            <button key={amt} onClick={()=>setQcd(amt)} style={{flex:1,padding:'8px 0',background:qcd===amt?tk.black:tk.surface,color:qcd===amt?'white':tk.text,border:'1px solid '+(qcd===amt?tk.black:tk.border),borderRadius:8,fontSize:11,fontWeight:500,cursor:'pointer'}}>{amt===0?'None':'$'+amt.toLocaleString()}</button>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
          {[{l:'Total RMD',v:'$47,200',c:tk.text},{l:'QCD (tax-free)',v:'$'+qcd.toLocaleString(),c:tk.green},{l:'Taxable income',v:'$'+taxable.toLocaleString(),c:taxable>40000?tk.maroon:tk.gold}].map((s,i)=>(
            <div key={i} style={{background:tk.ecru,borderRadius:9,padding:'10px 12px'}}><div style={{fontSize:9,color:tk.warm,textTransform:'uppercase',letterSpacing:0.5,marginBottom:3}}>{s.l}</div><div style={{fontSize:18,fontWeight:300,color:s.c}}>{s.v}</div></div>
          ))}
        </div>
        {taxable>40000&&<RiskFlag text={'$'+taxable.toLocaleString()+' taxable may push Robert into a higher Medicare IRMAA bracket. Consider increasing QCD.'}/>}
        <div style={{display:'flex',gap:8}}>
          {[['monthly','Monthly','$3,933/mo — spreads tax impact'],['lump','Lump sum','Full $47,200 now']].map(function(arr){var val=arr[0],label=arr[1],sub=arr[2];return(
            <div key={val} onClick={()=>setMethod(val)} style={{flex:1,padding:'11px 12px',border:'1.5px solid '+(method===val?tk.black:tk.border),borderRadius:10,cursor:'pointer',background:method===val?tk.surface:'transparent'}}>
              <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:2}}>
                <div style={{width:11,height:11,borderRadius:'50%',border:'1.5px solid '+(method===val?tk.black:tk.border),background:method===val?tk.black:'transparent',display:'flex',alignItems:'center',justifyContent:'center'}}>{method===val&&<div style={{width:4,height:4,borderRadius:'50%',background:'white'}}/>}</div>
                <span style={{fontSize:12,fontWeight:600,color:tk.text}}>{label}</span>
              </div>
              <div style={{fontSize:10,color:tk.muted,paddingLeft:18}}>{sub}</div>
            </div>
          );})}
        </div>
        <button onClick={()=>setStep(1)} style={{padding:'10px',background:tk.black,color:'white',border:'none',borderRadius:9,fontSize:12,fontWeight:600,cursor:'pointer'}}>Choose source accounts →</button>
      </div>)}
      {step===1&&(<div style={{display:'flex',flexDirection:'column',gap:10}}>
        {[{key:'ira1',name:'Traditional IRA — Fidelity',balance:824000},{key:'ira2',name:'Rollover IRA — Schwab',balance:360000}].map(acct=>(
          <div key={acct.key} style={{padding:'12px',background:tk.surface,border:'1px solid '+tk.border,borderRadius:10}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
              <div><div style={{fontSize:12,fontWeight:600,color:tk.text}}>{acct.name}</div><div style={{fontSize:10,color:tk.muted}}>Balance: ${acct.balance.toLocaleString()}</div></div>
              <div style={{textAlign:'right'}}><div style={{fontSize:11,fontWeight:600,color:tk.text}}>{alloc[acct.key]}%</div><div style={{fontSize:10,color:tk.muted}}>${Math.round(47200*(alloc[acct.key]/100)).toLocaleString()}</div></div>
            </div>
            <input type="range" min={0} max={100} value={alloc[acct.key]} onChange={e=>{var v=parseInt(e.target.value);setAlloc(acct.key==='ira1'?{ira1:v,ira2:100-v}:{ira1:100-v,ira2:v});}} style={{width:'100%',accentColor:tk.black}}/>
            <div style={{height:6,background:tk.ecru,borderRadius:3,overflow:'hidden',marginTop:4}}><div style={{height:'100%',width:alloc[acct.key]+'%',background:tk.green,borderRadius:3}}/></div>
          </div>
        ))}
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>setStep(0)} style={{padding:'9px 16px',background:'transparent',color:tk.muted,border:'1px solid '+tk.border,borderRadius:9,fontSize:12,cursor:'pointer'}}>Back</button>
          <button onClick={()=>setStep(2)} style={{flex:1,padding:'9px',background:tk.black,color:'white',border:'none',borderRadius:9,fontSize:12,fontWeight:600,cursor:'pointer'}}>Review →</button>
        </div>
      </div>)}
      {step===2&&(<div style={{display:'flex',flexDirection:'column',gap:10}}>
        <div style={{background:tk.surface,border:'1px solid '+tk.border,borderRadius:10,overflow:'hidden'}}>
          <div style={{padding:'10px 14px',background:tk.ecru,borderBottom:'1px solid '+tk.border}}><div style={{fontSize:12,fontWeight:600,color:tk.text}}>RMD Distribution — Robert Johnson</div><div style={{fontSize:10,color:tk.muted}}>Age 74 · April 1 deadline · {method==='monthly'?'Monthly payments':'Lump sum'}</div></div>
          {[{label:'Traditional IRA (Fidelity)',amount:est1},{label:'Rollover IRA (Schwab)',amount:est2}].map((r,i)=>(
            <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'9px 14px',borderBottom:'1px solid '+tk.border}}><span style={{fontSize:12,color:tk.text}}>{r.label}</span><span style={{fontSize:12,fontWeight:500}}>${r.amount.toLocaleString()}</span></div>
          ))}
          <div style={{display:'flex',justifyContent:'space-between',padding:'9px 14px',borderBottom:'1px solid '+tk.border}}><span style={{fontSize:12,color:tk.green}}>QCD to donor-advised fund</span><span style={{fontSize:12,color:tk.green}}>-${qcd.toLocaleString()}</span></div>
          <div style={{display:'flex',justifyContent:'space-between',padding:'10px 14px',background:'#F0FFF4'}}><span style={{fontSize:12,fontWeight:600,color:tk.text}}>Taxable distribution</span><span style={{fontSize:15,fontWeight:300,color:taxable>40000?tk.maroon:tk.green}}>${taxable.toLocaleString()}</span></div>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>setStep(1)} style={{padding:'9px 16px',background:'transparent',color:tk.muted,border:'1px solid '+tk.border,borderRadius:9,fontSize:12,cursor:'pointer'}}>Edit</button>
          <button onClick={()=>setSubmitted(true)} style={{flex:1,padding:'9px',background:tk.green,color:'white',border:'none',borderRadius:9,fontSize:12,fontWeight:600,cursor:'pointer'}}>Submit distribution</button>
        </div>
      </div>)}
    </div>
  );
}

// ── Meeting data with planning info ───────────────────────────────
var MEETING_DATA = {
  chen:{
    phase:'post',
    client:{name:'James Chen',sub:'James & Linda Chen · $2.4M AUM',initials:'JC'},
    stats:[{l:'AUM',v:'$2.4M',c:'#1A1A1A'},{l:'YTD return',v:'+12.8%',c:'#2A4A3A'},{l:'vs benchmark',v:'+2.3%',c:'#2A4A3A'},{l:'Last meeting',v:'Dec 3',c:'#9B8F7E'}],
    planning:{
      netWorth:{
        breakdown:[{l:'Investment portfolio',v:2400000},{l:'Primary residence (Palo Alto)',v:1850000},{l:'RSU vesting (2yr)',v:420000},{l:'Cash & equivalents',v:150000}],
        liabilities:[{l:'Mortgage balance',v:680000},{l:'Home equity line',v:120000}]
      },
      goals:[
        {label:'Retirement',target:2033,status:'on-track',progress:72,note:'On pace for $180K/yr income at age 60'},
        {label:'Marin home purchase',target:2027,status:'needs-plan',progress:38,note:'$3.5M budget · $520K liquidity gap — eMoney model needed'},
        {label:'College (2 kids)',target:2028,status:'caution',progress:55,note:'529s at $186K · $240K needed by 2028'},
      ],
      cashFlow:{income:485000,savingsRate:28,monthlyNet:8800,note:'RSU income varies — 2024 vest adds ~$180K. Watch cash drag post-vest.'},
      rothOpportunity:{eligible:false,note:'Income $485K exceeds Roth limit. Backdoor Roth viable — $7K/yr each. Not yet implemented.'},
      gaps:[
        {type:'Estate documents',detail:'Trust docs last updated 2019 — predates second child. Update needed.',severity:'high'},
        {type:'Life insurance',detail:'$2M term policy expires 2029. May underinsure after Marin purchase.',severity:'medium'},
        {type:'RSU concentration',detail:'42% tech exposure. RSU diversification plan approved — executing this quarter.',severity:'medium'},
      ]
    },
    household:{
      members:[{name:'James Chen',role:'Primary',detail:'52 · SVP Engineering, Salesforce · RSU-heavy comp'},{name:'Linda Chen',role:'Spouse',detail:'49 · Pediatrician, private practice · separate 401k'}],
      life_stage:'Peak earners, pre-retirement planning. Two kids in college (2026, 2028 graduation). Home sale in Palo Alto likely 2026.',
      comms:'James prefers email + async. Linda rarely on calls but reviews everything. Always copy both on proposals.',
      since_last:[
        {dot:tk.maroon,text:'AAPL down 14% since Dec — James aware, anxious. He emailed Jan 8 asking if he should sell.'},
        {dot:tk.gold,text:'Salesforce RSU vest: ~$180K in Feb. Not yet discussed — good agenda item.'},
        {dot:tk.green,text:'Portfolio up 12.8% YTD despite tech drag. Outperforming benchmark by 2.3%.'},
        {dot:tk.teal,text:'Linda started contributing to a SEP-IRA in January for her practice. Coordinate with household plan.'},
        {dot:tk.muted,text:'Sent Q4 report Dec 20. Opened but no reply from James until Jan 8 email re: AAPL.'},
      ],
      goals:[
        {label:'Home purchase · Marin',timeline:'2027',note:'~$3.5M target. Need liquidity model — eMoney not yet run.'},
        {label:'College funding',timeline:'Ongoing',note:'Two kids. 2026 and 2028 graduation. 529s funded but check sufficiency.'},
        {label:'Retirement · age 60',timeline:'8 years',note:'$8M target. On track but tech concentration is a risk.'},
        {label:'RSU diversification',timeline:'Ongoing',note:'42% tech exposure. Plan to reduce to 30% this quarter.'},
      ],
      client_questions:[
        {from:'James Chen',date:'Jan 8',text:'Given the AAPL drop, should I be selling now or waiting? Feeling nervous about my tech exposure overall.'},
        {from:'James Chen',date:'Jan 22',text:'Does the home purchase in 2027 change how aggressive we should be with the portfolio right now?'},
      ]
    },
    agenda:[
      {n:1,t:'Portfolio performance',d:'10 min',status:'ready',tip:'Acknowledge Q3 volatility is resolved before anything else. He was anxious.'},
      {n:2,t:'Tech allocation',d:'20 min',status:'caution',tip:'Frame as risk management, not performance criticism. He built a career in tech.'},
      {n:3,t:'Tax-loss harvesting',d:'15 min',status:'ready',tip:'Lead with dollar savings ($19,600 est.) not the mechanics.'},
      {n:4,t:'2026 planning + Q&A',d:'15 min',status:'open',tip:'Ask about the Marin home purchase — he mentioned 2027 timeline.'},
    ],
    slides:[
      {n:1,title:'Welcome & Agenda',thumb:'📋',preview:"Overview of today's 4 topics"},
      {n:2,title:'Q4 Performance',thumb:'📈',preview:'+12.8% YTD · $2.4M AUM · beats benchmark'},
      {n:3,title:'Portfolio Allocation',thumb:'⚖️',preview:'Tech 42% vs 30% target — rebalancing plan'},
      {n:4,title:'Tax-Loss Opportunity',thumb:'🧮',preview:'$82K harvestable · ~$19,600 est. savings'},
      {n:5,title:'2026 Outlook',thumb:'🔭',preview:'Home purchase liquidity model · macro view'},
      {n:6,title:'Next Steps',thumb:'✅',preview:'Action items and timeline'},
    ],
    tasks:[
      {id:0,text:'Send rebalancing trade list',owner:'Heather',due:'Today',done:false},
      {id:1,text:'Send tax-loss harvesting proposal (e-sign)',owner:'Heather',due:'Today',done:false},
      {id:2,text:'Run eMoney liquidity scenario for 2027 home purchase',owner:'Heather',due:'This week',done:false},
      {id:3,text:'Schedule Q2 review',owner:'Heather',due:'This week',done:false},
      {id:4,text:'Review and sign rebalancing proposal',owner:'James',due:'This week',done:false},
      {id:5,text:'Review and sign tax-loss harvesting proposal',owner:'James',due:'By Mar 31',done:false},
    ],
    transcript:[
      {t:'00:00',s:'H',text:"Hi James! Great to connect. Q4 was a strong quarter — you're up 12.8% YTD, beating your benchmark by 2.3%."},
      {t:'01:14',s:'J',text:"That's great to hear. I was honestly nervous after all the volatility in Q3."},
      {t:'02:01',s:'H',text:"Completely understandable. Your portfolio held up really well. I do think it's time to trim back tech a bit."},
      {t:'03:45',s:'J',text:"Yeah, I've got a lot of RSUs concentrated there."},
      {t:'04:12',s:'H',text:"Exactly — you're at 42% vs a 30% target. I'll have a trade list for you this week."},
      {t:'06:33',s:'J',text:"What about taxes on the sale?"},
      {t:'07:15',s:'H',text:"Good segue — I have a tax-loss harvesting opportunity. About $82K harvestable, which could save you around $19,600."},
      {t:'09:02',s:'J',text:"Wow, yeah. Let's do it."},
      {t:'10:18',s:'H',text:"I'll send a proposal to e-sign today. Now, about the home purchase you mentioned..."},
      {t:'11:45',s:'J',text:"Still on the table — probably 2027. We're looking at Marin."},
      {t:'12:30',s:'H',text:"I'll pull a liquidity scenario from eMoney and include it in the follow-up."},
      {t:'14:00',s:'J',text:"Really helpful as always, Heather. Thank you!"},
    ],
    summary:{
      headline:'Strong quarter, tech trim approved, $82K harvest greenlit.',
      bullets:['Portfolio up 12.8% YTD, beats benchmark by 2.3%','James approved trimming tech from 42% to 30% — trade list this week','Tax-loss harvesting approved: $82K across AAPL, BNDX, VWO, NVDA','Home purchase in Marin (2027) — eMoney liquidity model requested'],
    },
    followup:{
      subject:"Summary & Next Steps from Today's Review",
      body:"Hi James,\n\nGreat conversation today. Here's a quick recap.\n\nPerformance: Up 12.8% YTD, beating benchmark by 2.3%.\nRebalancing: Trimming tech RSUs to 30% target. Trade list incoming.\nTax Harvest: $82K opportunity approved. Proposal today.\nHome Purchase: Liquidity model (2027) coming soon.\n\nYour next steps:\n- Review and sign rebalancing proposal\n- Review and sign tax-loss harvesting proposal\n\nMy next steps:\n- Send rebalancing trade list\n- Send tax-loss harvesting proposal\n- Run eMoney liquidity scenario for Marin home\n- Schedule Q2 check-in\n\nBest,\nHeather",
    },
  },
  martinez:{
    phase:'pre',
    client:{name:'Carlos Martinez',sub:'Carlos Martinez · $1.1M AUM',initials:'CM'},
    stats:[{l:'AUM',v:'$1.1M',c:'#1A1A1A'},{l:'YTD return',v:'+9.4%',c:'#2A4A3A'},{l:'vs benchmark',v:'+1.2%',c:'#2A4A3A'},{l:'Last meeting',v:'Oct 14',c:'#9B8F7E'}],
    planning:{
      netWorth:{
        breakdown:[{l:'Investment portfolio',v:1100000},{l:'Primary residence (est.)',v:580000},{l:'Cash & checking',v:42000}],
        liabilities:[{l:'Mortgage balance',v:395000},{l:'Auto loan (Nov 2024)',v:28000}]
      },
      goals:[
        {label:'Retirement',target:2041,status:'on-track',progress:61,note:'On pace for $95K/yr income at age 62'},
        {label:'Emergency fund',target:2025,status:'caution',progress:40,note:'$17K on hand · target is $42K (6 months). Car loan is compressing surplus.'},
        {label:'College · 2033',target:2033,status:'caution',progress:28,note:'529 underfunded. Contribute $200/mo more to stay on track.'},
      ],
      cashFlow:{income:195000,savingsRate:14,monthlyNet:2200,note:'New car loan ($485/mo) added Nov 2024 — savings rate down from 18%. Sofia freelance income could add $15K+ this year.'},
      rothOpportunity:{eligible:true,note:'Income $195K qualifies for direct Roth contribution ($7K/yr). Not contributing currently — low-effort opportunity.'},
      gaps:[
        {type:'Disability insurance',detail:'No individual DI policy. Employer group only — 60% income, taxable. High risk for sole earner.',severity:'high'},
        {type:'Will & beneficiaries',detail:'Will is 4 years old. IRA beneficiary not updated after 2021 divorce. Urgent.',severity:'high'},
        {type:'Emergency fund',detail:'Below 6-month target. Car loan has delayed progress — flag but handle sensitively.',severity:'medium'},
      ]
    },
    household:{
      members:[{name:'Carlos Martinez',role:'Primary',detail:'44 · Regional Sales Manager, Oracle · W-2 income'},{name:'Sofia Martinez',role:'Spouse',detail:'41 · Freelance designer (new) · SEP-IRA opportunity ~$15K eligible'}],
      life_stage:'Mid-career wealth builder. One child, age 9. First-gen wealth — cautious, values concrete explanations.',
      comms:'Prefers phone over email. Keep calls under 30 min. Send a short action list after every call. Avoid jargon.',
      since_last:[
        {dot:tk.green,text:'Portfolio up 9.4% YTD — strongest year since becoming a client.'},
        {dot:tk.gold,text:'Bought a new car in November. $485/mo loan. May affect savings capacity.'},
        {dot:tk.teal,text:'Sofia started freelance income Jan — could open a SEP-IRA opportunity (~$15K eligible).'},
        {dot:tk.muted,text:'No inbound contact since October. Opened Q4 report email, no reply.'},
        {dot:tk.maroon,text:'Cash sitting at 11% of portfolio — above target. Discuss deployment.'},
      ],
      goals:[
        {label:'Emergency fund',timeline:'Complete',note:'6 months funded. No action needed.'},
        {label:'College savings · 2033',timeline:'9 years',note:'529 underfunded. Contribute $200/mo more to stay on track.'},
        {label:'Retirement · age 62',timeline:'18 years',note:'$2.5M target. On track if savings rate holds.'},
        {label:'Home upgrade',timeline:'3-5 years',note:'Mentioned wanting a bigger home. No formal plan yet.'},
      ],
      client_questions:[{from:'Carlos Martinez',date:'Feb 10',text:'Quick question before our call — I saw something about tax loss harvesting online. Is that something that applies to me?'}]
    },
    agenda:[
      {n:1,t:'Portfolio performance',d:'10 min',status:'ready',tip:'Lead with the headline number. Concrete: "$1.1M is now $1.2M."'},
      {n:2,t:'Tax-loss harvesting',d:'10 min',status:'ready',tip:'Say "saves you ~$2,050 in taxes" not "harvests a loss."'},
      {n:3,t:'Cash flow check',d:'5 min',status:'caution',tip:'Acknowledge the loan before any savings-increase suggestions.'},
      {n:4,t:'Q&A',d:'5 min',status:'open',tip:'Keep it short. He prefers action items over long discussion.'},
    ],
    slides:[
      {n:1,title:'Welcome & Agenda',thumb:'📋',preview:"Overview of today's topics"},
      {n:2,title:'Portfolio Snapshot',thumb:'📊',preview:'$1.1M · +9.4% YTD · vs benchmark +1.2%'},
      {n:3,title:'Tax-Loss Opportunity',thumb:'💸',preview:'$8,200 harvestable · ~$2,050 savings'},
      {n:4,title:'Next Steps',thumb:'✅',preview:'Action items and timeline'},
    ],
    tasks:[
      {id:0,text:'Send tax-loss harvesting proposal',owner:'Heather',due:'Today',done:false},
      {id:1,text:'Review cash flow impact of car loan with savings rate',owner:'Heather',due:'This week',done:false},
    ],
    transcript:null,
    summary:null,
    followup:{
      subject:'Reminder: Follow-up Call Today at 4:00 PM',
      body:"Hi Carlos,\n\nJust a quick note ahead of our call today at 4:00 PM.\n\nWe'll cover:\n- Your Q4 portfolio performance (+9.4% YTD)\n- A tax-loss harvesting opportunity (~$2,050 in savings)\n- A quick cash flow check-in\n\nLooking forward to connecting!\n\nBest,\nHeather",
    },
  },
};

function MeetingPanel({clientKey, onDone, onSkip}) {
  var data = MEETING_DATA[clientKey];
  var isPost = data.phase === 'post';
  var TABS = isPost
    ? ['Prep','Planning','Summary','Slides','Transcript','Tasks','Notes','Follow-up']
    : ['Prep','Planning','Slides','Tasks','Follow-up'];
  var [tab,setTab] = useState('Prep');
  var [agenda,setAgenda] = useState(data.agenda);
  var [tasks,setTasks] = useState(data.tasks);
  var [notes,setNotes] = useState('');
  var [followupBody,setFollowupBody] = useState(data.followup.body);
  var [sent,setSent] = useState(false);
  var statusColors = {ready:tk.green,caution:tk.gold,open:tk.muted};
  var statusLabels = {ready:'Ready',caution:'Handle carefully',open:'Open'};
  if(sent) return <DoneState title={'Sent to '+data.client.name} sub={data.followup.subject} onNext={onDone}/>;
  return (
    <div>
      <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:tk.ecru,borderRadius:10,marginBottom:10}}>
        <div style={{width:34,height:34,borderRadius:'50%',background:tk.warm,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'white',flexShrink:0}}>{data.client.initials}</div>
        <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:tk.text}}>{data.client.name}</div><div style={{fontSize:10,color:tk.muted}}>{data.client.sub}</div></div>
        <Tag text={isPost?'Post-meeting':'Pre-meeting'} color={isPost?tk.teal:tk.green}/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6,marginBottom:10}}>
        {data.stats.map((s,i)=>(
          <div key={i} style={{background:tk.surface,border:'1px solid '+tk.border,borderRadius:8,padding:'7px 10px'}}><div style={{fontSize:9,color:tk.warm,textTransform:'uppercase',letterSpacing:0.5,marginBottom:2}}>{s.l}</div><div style={{fontSize:14,fontWeight:300,color:s.c}}>{s.v}</div></div>
        ))}
      </div>
      <div style={{display:'flex',gap:2,marginBottom:12,borderBottom:'1px solid '+tk.border,overflowX:'auto'}}>
        {TABS.map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:'6px 12px',fontSize:11,fontWeight:tab===t?600:400,color:tab===t?tk.text:tk.muted,background:'transparent',border:'none',borderBottom:'2px solid '+(tab===t?tk.black:'transparent'),cursor:'pointer',whiteSpace:'nowrap'}}>{t}</button>)}
      </div>
      {tab==='Prep' && <PrepTab household={data.household} agenda={agenda} setAgenda={setAgenda} statusColors={statusColors} statusLabels={statusLabels}/>}
      {tab==='Planning' && <PlanningTab planning={data.planning}/>}
      {tab==='Summary' && data.summary && (
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          <div style={{padding:'12px 14px',background:'#1A2E1A',borderRadius:10}}><div style={{fontSize:11,fontWeight:600,color:'#7EC8A0',marginBottom:4}}>AI meeting summary</div><div style={{fontSize:13,color:'#C8EAD8',lineHeight:1.7}}>{data.summary.headline}</div></div>
          <div style={{background:tk.surface,borderRadius:10,border:'1px solid '+tk.border,overflow:'hidden'}}>
            {data.summary.bullets.map((b,i)=>(
              <div key={i} style={{display:'flex',alignItems:'flex-start',gap:9,padding:'9px 12px',borderBottom:i<data.summary.bullets.length-1?'1px solid '+tk.border:'none'}}><Check size={12} strokeWidth={2.5} color={tk.green} style={{marginTop:2,flexShrink:0}}/><span style={{fontSize:12,color:tk.text,lineHeight:1.6}}>{b}</span></div>
            ))}
          </div>
        </div>
      )}
      {tab==='Slides' && (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          {data.slides.map((s,i)=>(
            <div key={i} style={{background:tk.surface,border:'1px solid '+tk.border,borderRadius:10,padding:'10px 12px',cursor:'pointer'}} onMouseEnter={e=>e.currentTarget.style.borderColor='#C4B89A'} onMouseLeave={e=>e.currentTarget.style.borderColor=tk.border}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:5}}><div style={{width:26,height:26,borderRadius:6,background:tk.ecru,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,flexShrink:0}}>{s.thumb}</div><span style={{fontSize:9,color:tk.muted,fontWeight:600}}>{'0'+String(s.n)}</span></div>
              <div style={{fontSize:12,fontWeight:600,color:tk.text,marginBottom:2}}>{s.title}</div>
              <div style={{fontSize:10,color:tk.muted,lineHeight:1.5}}>{s.preview}</div>
            </div>
          ))}
        </div>
      )}
      {tab==='Transcript' && data.transcript && (
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          {data.transcript.map((line,i)=>(
            <div key={i} style={{display:'flex',gap:10,padding:'8px 10px',borderRadius:8,background:line.s==='J'?tk.surface:'transparent',border:'1px solid '+(line.s==='J'?tk.border:'transparent')}}>
              <div style={{flexShrink:0,textAlign:'right',minWidth:32}}><div style={{fontSize:9,color:tk.muted}}>{line.t}</div><div style={{fontSize:9,fontWeight:700,color:line.s==='H'?tk.green:tk.teal,marginTop:1}}>{line.s==='H'?'You':'James'}</div></div>
              <div style={{fontSize:12,color:tk.text,lineHeight:1.65}}>{line.text}</div>
            </div>
          ))}
        </div>
      )}
      {tab==='Tasks' && (
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {['Heather','James'].map(owner=>{
            var ot=tasks.filter(t=>t.owner===owner);
            if(!ot.length)return null;
            return (
              <div key={owner}>
                <div style={{fontSize:10,fontWeight:600,color:tk.muted,textTransform:'uppercase',letterSpacing:0.8,marginBottom:6}}>{owner==='Heather'?'Your tasks':'Client tasks'}</div>
                {ot.map(t=>(
                  <div key={t.id} onClick={()=>setTasks(p=>p.map(x=>x.id===t.id?Object.assign({},x,{done:!x.done}):x))}
                    style={{display:'flex',alignItems:'center',gap:10,padding:'9px 12px',background:tk.surface,border:'1px solid '+tk.border,borderRadius:9,marginBottom:5,cursor:'pointer',opacity:t.done?0.5:1}}>
                    <div style={{width:15,height:15,borderRadius:4,border:'1.5px solid '+(t.done?tk.green:tk.border),background:t.done?tk.green:'transparent',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>{t.done&&<Check size={8} strokeWidth={2.5} color="white"/>}</div>
                    <div style={{flex:1,fontSize:12,color:tk.text,textDecoration:t.done?'line-through':'none'}}>{t.text}</div>
                    <Tag text={t.due} color={t.due==='Today'?tk.maroon:tk.gold}/>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
      {tab==='Notes' && (
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Take notes during or after the meeting..." style={{fontSize:12,color:tk.text,lineHeight:1.8,background:tk.surface,border:'1px solid '+tk.border,borderRadius:9,padding:'10px 12px',outline:'none',resize:'none',fontFamily:'inherit',minHeight:180}}/>
          <div style={{fontSize:10,color:tk.muted}}>Notes are private to you and will not be sent to the client.</div>
        </div>
      )}
      {tab==='Follow-up' && (
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          <div style={{padding:'8px 12px',background:tk.ecru,borderRadius:8,fontSize:11,color:tk.warm}}><strong>To:</strong> {data.client.name} &nbsp;·&nbsp; <strong>Subject:</strong> {data.followup.subject}</div>
          <textarea value={followupBody} onChange={e=>setFollowupBody(e.target.value)} style={{fontSize:12,color:tk.text,lineHeight:1.8,background:tk.surface,border:'1px solid '+tk.border,borderRadius:9,padding:'9px 11px',outline:'none',resize:'none',fontFamily:'inherit',minHeight:220}}/>
          <button onClick={()=>setSent(true)} style={{padding:'10px',background:tk.green,color:'white',border:'none',borderRadius:9,fontSize:12,fontWeight:600,cursor:'pointer'}}>Send to {data.client.name}</button>
        </div>
      )}
    </div>
  );
}

function TaxDocsPanel({onDone, onSkip=null}) {
  var docs=[{name:'W-2 (Employer)',status:'received',source:'Uploaded by Lisa'},{name:'1099-INT (Chase)',status:'received',source:'Bank upload'},{name:'1099-B (Brokerage)',status:'received',source:'Savvy auto-pull'},{name:'1099-DIV (Vanguard)',status:'pending',source:'Expected by Feb 15'},{name:'K-1 (LP Investment)',status:'pending',source:'LP — may need extension'},{name:'HSA Contribution Stmt',status:'missing',source:'Lisa must request from HR'},{name:'Mortgage 1098',status:'received',source:'Lender upload'}];
  var sc={received:tk.green,pending:tk.gold,missing:tk.maroon};
  var sl={received:'Received',pending:'Pending',missing:'Missing'};
  var [note,setNote]=useState("Hi Lisa,\n\nAlmost ready for your March 15 CPA deadline — just need your HSA contribution statement from HR. The K-1 may arrive late, so I'll flag a possible extension to your CPA.\n\nBest,\nHeather");
  var [sent,setSent]=useState(false);
  if(sent)return <DoneState title="Package sent to CPA · Lisa notified" sub="5 docs attached · 1 missing flagged" onNext={onDone}/>;
  return (
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      <div style={{background:tk.ecru,borderRadius:10,padding:'11px 14px',display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
        {[{l:'Received',v:'4/7',c:tk.green},{l:'Pending',v:'2',c:tk.gold},{l:'Missing',v:'1',c:tk.maroon}].map((s,i)=>(
          <div key={i}><div style={{fontSize:9,color:tk.warm,textTransform:'uppercase',letterSpacing:0.5,marginBottom:2}}>{s.l}</div><div style={{fontSize:18,fontWeight:300,color:s.c}}>{s.v}</div></div>
        ))}
      </div>
      <div style={{background:tk.surface,borderRadius:10,overflow:'hidden',border:'1px solid '+tk.border}}>
        {docs.map((d,i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',padding:'9px 12px',borderBottom:i<docs.length-1?'1px solid '+tk.border:'none',background:d.status==='missing'?'#FFF9F0':'transparent'}}>
            <div style={{width:15,height:15,borderRadius:'50%',background:sc[d.status]+'20',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginRight:10}}>
              {d.status==='received'?<Check size={8} strokeWidth={2.5} color={sc[d.status]}/>:<div style={{width:5,height:5,borderRadius:'50%',background:sc[d.status]}}/>}
            </div>
            <div style={{flex:1}}><div style={{fontSize:12,color:tk.text,fontWeight:500}}>{d.name}</div><div style={{fontSize:10,color:tk.muted}}>{d.source}</div></div>
            <Tag text={sl[d.status]} color={sc[d.status]}/>
          </div>
        ))}
      </div>
      <RiskFlag text="HSA statement missing — Lisa to request from HR. K-1 may come late; notify CPA for potential extension."/>
      <textarea value={note} onChange={e=>setNote(e.target.value)} style={{fontSize:12,color:tk.text,lineHeight:1.8,background:tk.surface,border:'1px solid '+tk.border,borderRadius:9,padding:'9px 11px',outline:'none',resize:'none',fontFamily:'inherit',minHeight:90}}/>
    </div>
  );
}

function CheckInPanel({onDone, onSkip=null}) {
  var [note,setNote]=useState("Hi Maria,\n\nHope you're doing well! Just wanted to check in — your portfolio is up 14.2% YTD, which puts you well ahead of most benchmarks.\n\nWould love to catch up. Free for a quick call next week?\n\nBest,\nHeather");
  var [sent,setSent]=useState(false);
  if(sent)return <DoneState title="Check-in sent to Maria Rodriguez" sub="85-day silence broken" onNext={onDone}/>;
  return (
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      <div style={{background:tk.ecru,borderRadius:10,padding:'11px 14px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        {[{l:'Last contact',v:'85 days ago',c:tk.maroon},{l:'YTD return',v:'+14.2%',c:tk.green},{l:'AUM',v:'$900K',c:tk.text},{l:'Status',v:'Best performer',c:tk.teal}].map((s,i)=>(
          <div key={i}><div style={{fontSize:9,color:tk.warm,textTransform:'uppercase',letterSpacing:0.5,marginBottom:2}}>{s.l}</div><div style={{fontSize:15,fontWeight:300,color:s.c}}>{s.v}</div></div>
        ))}
      </div>
      <textarea value={note} onChange={e=>setNote(e.target.value)} style={{fontSize:12,color:tk.text,lineHeight:1.8,background:tk.surface,border:'1px solid '+tk.border,borderRadius:9,padding:'9px 11px',outline:'none',resize:'none',fontFamily:'inherit',minHeight:110}}/>
    </div>
  );
}

function IRAPanel({onDone, onSkip=null}) {
  var clients=[{name:'Tom & Sarah Williams',email:'tom.williams@email.com',eligible:'$7,000',rothElig:true},{name:'Lisa Thompson',email:'lisa.thompson@email.com',eligible:'$7,000',rothElig:false},{name:'Mark Davis',email:'mark.davis@email.com',eligible:'$8,000',rothElig:true}];
  var [sel,setSel]=useState({0:true,1:true,2:true});
  var [type,setType]=useState({0:'trad',1:'trad',2:'roth'});
  var [sent,setSent]=useState(false);
  if(sent)return <DoneState title="IRA reminders sent" sub="3 households notified · April 15 deadline" onNext={onDone}/>;
  return (
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      <div style={{background:tk.ecru,borderRadius:10,padding:'11px 14px'}}><div style={{fontSize:12,color:tk.warm,lineHeight:1.7}}>April 15 is the 2025 IRA contribution deadline. These 3 households have not contributed yet.</div></div>
      {clients.map((c,i)=>{var on=sel[i];return(
        <div key={i} style={{padding:'10px 12px',background:on?tk.surface:'transparent',border:'1px solid '+(on?'#C4B89A':tk.border),borderRadius:10,opacity:on?1:.45}}>
          <div style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer'}} onClick={()=>setSel(p=>{var n=Object.assign({},p);n[i]=!p[i];return n;})}>
            <div style={{width:15,height:15,borderRadius:4,border:'1.5px solid '+(on?tk.green:tk.border),background:on?tk.green:'transparent',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>{on&&<Check size={8} strokeWidth={2.5} color="white"/>}</div>
            <div style={{flex:1}}><div style={{fontSize:12,fontWeight:500,color:tk.text}}>{c.name}</div><div style={{fontSize:10,color:tk.muted}}>{c.email}</div></div>
            <Tag text={'Eligible: '+c.eligible} color={tk.teal}/>
          </div>
          {on&&(
            <div style={{display:'flex',gap:6,marginTop:8,marginLeft:25}}>
              {[['trad','Traditional',true],['roth','Roth',c.rothElig]].map(function(arr){var v=arr[0],label=arr[1],elig=arr[2];return(
                <button key={String(v)} onClick={e=>{e.stopPropagation();if(elig)setType(p=>{var n=Object.assign({},p);n[i]=v;return n;});}} style={{flex:1,padding:'5px 0',fontSize:10,fontWeight:500,background:type[i]===v?tk.black:'transparent',color:type[i]===v?'white':elig?tk.text:tk.muted,border:'1px solid '+(type[i]===v?tk.black:tk.border),borderRadius:6,cursor:elig?'pointer':'default',opacity:elig?1:.5}}>{label}{!elig?' (ineligible)':''}</button>
              );})}
            </div>
          )}
        </div>
      );})}
    </div>
  );
}

function ReplyPanel({item, onDone, onSkip=null}) {
  var [draft,setDraft]=useState(item.draft);
  var [sent,setSent]=useState(false);
  if(sent)return <DoneState title={'Reply sent to '+item.from} sub={item.subject} onNext={onDone}/>;
  return (
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      <div style={{background:tk.ecru,borderRadius:10,padding:'11px 14px'}}>
        <div style={{fontSize:10,fontWeight:600,color:tk.warm,textTransform:'uppercase',letterSpacing:0.8,marginBottom:4}}>From {item.from}</div>
        <div style={{fontSize:12,color:tk.warm,lineHeight:1.7,fontStyle:'italic'}}>"{item.message}"</div>
      </div>
      <textarea value={draft} onChange={e=>setDraft(e.target.value)} style={{fontSize:12,color:tk.text,lineHeight:1.8,background:tk.surface,border:'1px solid '+tk.border,borderRadius:9,padding:'9px 11px',outline:'none',resize:'none',fontFamily:'inherit',minHeight:120}}/>
    </div>
  );
}

var ALL_ITEMS = [
  {id:'tax',group:'urgent',label:'Tax-loss harvesting',client:'James Chen',sub:'$82K · closes March 31',badge:'Urgent',badgeColor:tk.maroon,agentRole:'tax',
    panel:(d,s)=><TaxHarvestPanel onDone={d} onSkip={s}/>,
    chat:{sendLabel:'Send harvest proposal',systemContext:'Tax-loss harvesting for James Chen. 4 positions: AAPL (-$4,034), BNDX (-$1,675), VWO (-$1,305), NVDA (-$2,784). Bracket: 32% ST / 23.8% LT. March 31 deadline.',suggestions:["What's the wash-sale risk?","Drop NVDA (short-term)?","What if he doesn't respond in time?"]}},
  {id:'rmd',group:'urgent',label:'RMD not set up',client:'Robert Johnson',sub:'$47,200 · April 1 deadline',badge:'Urgent',badgeColor:tk.maroon,agentRole:'tax',
    panel:(d,s)=><RMDPanel onDone={d} onSkip={s}/>,
    chat:{sendLabel:'Submit distribution',systemContext:'RMD for Robert Johnson, age 74. IRA $1,184,000. Required: $47,200 by April 1. QCD option. Two accounts: Fidelity $824K and Schwab $360K.',suggestions:["Monthly vs lump sum?","IRMAA bracket risk?","What if we miss April 1?"]}},
  {id:'rebal',group:'urgent',label:'Portfolio rebalancing',client:'Tom & Sarah Williams',sub:'8.1% drift · 47 days overdue',badge:'Overdue',badgeColor:tk.maroon,agentRole:'invest',
    panel:(d,s)=><RebalancingPanel onDone={d} onSkip={s}/>,
    chat:{sendLabel:'Send proposal to Williams',systemContext:'Rebalancing for Tom & Sarah Williams. AUM $3.2M. 8.1% drift. Sell VTI $74,200, Buy VXUS $36,800, Buy BND $43,600, Deploy cash $6,200.',suggestions:["Why is drift this high?","Can we reduce the tax hit?","Should we defer any trades?"]}},
  {id:'chen',group:'today',label:'Quarterly review prep',client:'James Chen',sub:'11:00 AM today · Zoom',badge:'Today',badgeColor:tk.green,agentRole:'client',
    panel:(d,s)=><MeetingPanel clientKey="chen" onDone={d} onSkip={s}/>,
    chat:{sendLabel:'Send reminder to James',systemContext:'Meeting prep for James Chen. 11:00 AM Zoom. Portfolio +12.8% YTD. James numbers-driven, anxious about Q3 volatility.',suggestions:["How should I open the meeting?","Best way to raise rebalancing?","Redraft the reminder"]}},
  {id:'martinez',group:'today',label:'Follow-up call prep',client:'Carlos Martinez',sub:'4:00 PM today · Phone',badge:'Today',badgeColor:tk.gold,agentRole:'client',
    panel:(d,s)=><MeetingPanel clientKey="martinez" onDone={d} onSkip={s}/>,
    chat:{sendLabel:'Send reminder to Carlos',systemContext:'Meeting prep for Carlos Martinez. 4:00 PM phone. Portfolio +9.4% YTD. New car loan $485/mo.',suggestions:["How to frame the tax harvesting?","Handle the cash flow convo?","Redraft the reminder"]}},
  {id:'taxdocs',group:'this-week',label:'Tax document prep',client:'Lisa Thompson',sub:'5 of 7 docs · March 15 deadline',badge:'This week',badgeColor:tk.gold,agentRole:'ops',
    panel:(d,s)=><TaxDocsPanel onDone={d} onSkip={s}/>,
    chat:{sendLabel:'Send to CPA & notify Lisa',systemContext:'Tax docs for Lisa Thompson. Received: W-2, 1099-INT, 1099-B, Mortgage 1098. Pending: 1099-DIV. Missing: HSA stmt. K-1 may be late.',suggestions:["Send without the HSA doc?","How urgent is the K-1?","Redraft the note to Lisa"]}},
  {id:'checkin',group:'this-week',label:'Client check-in overdue',client:'Maria Rodriguez',sub:'85 days no contact · up 14.2%',badge:'Overdue',badgeColor:tk.maroon,agentRole:'client',
    panel:(d,s)=><CheckInPanel onDone={d} onSkip={s}/>,
    chat:{sendLabel:'Send check-in to Maria',systemContext:'Client check-in for Maria Rodriguez. 85 days no contact. AUM $900K, YTD +14.2%.',suggestions:["Make it more casual","Should I mention the exact return?","Add a meeting invite"]}},
  {id:'msg1',group:'inbox',label:'Re: Quarterly Review',client:'James Chen',sub:'Question about rebalancing',badge:'Email',badgeColor:'#3B6EA8',agentRole:'client',
    panel:(d,s)=><ReplyPanel item={{from:'James Chen',subject:'Re: Quarterly Review',message:"Thanks Heather! Should I expect any tax implications beyond what we discussed?",draft:"Hi James,\n\nNo additional tax events beyond what we've already planned — I'll flag anything material before we execute.\n\nBest,\nHeather"}} onDone={d} onSkip={s}/>,
    chat:{sendLabel:'Reply to James',systemContext:'James asked about tax implications of rebalancing.',suggestions:["Should I mention the $8K?","Make it more detailed","Add a call offer"]}},
  {id:'msg2',group:'inbox',label:'Portfolio question',client:'Maria Rodriguez',    sub:'Numbers look amazing - Call?',badge:'Text',badgeColor:tk.teal,agentRole:'client',
    panel:(d,s)=><ReplyPanel item={{from:'Maria Rodriguez',subject:'Text message',message:"Numbers look amazing - can we do a call next week?",draft:"Hi Maria! So glad to hear it — strong year. Tuesday works great, I'll send a calendar invite."}} onDone={d} onSkip={s}/>,
    chat:{sendLabel:'Reply to Maria',systemContext:'Maria texted excited about portfolio (+14.2% YTD), wants a call.',suggestions:["Change to Wednesday","Add a portfolio highlight","Make it even shorter"]}},
  {id:'ira',group:'this-week',label:'IRA contribution reminders',client:'Williams · Thompson · Davis',sub:'3 households · April 15',badge:'This week',badgeColor:tk.gold,agentRole:'client',
    panel:(d,s)=><IRAPanel onDone={d} onSkip={s}/>,
    chat:{sendLabel:'Send reminders',systemContext:'IRA reminders for Williams ($7K), Thompson ($7K), Davis ($8K). April 15 deadline.',suggestions:["Roth vs Traditional?","Who needs most follow-up?","Draft the reminder email"]}},
];

var GROUP_LABELS = {urgent:'Urgent',today:'Today',inbox:'Inbox','this-week':'This week'};
var GROUP_ORDER = ['urgent','today','inbox','this-week'];
var NAV_ITEMS = [
  {id:'workstation',label:'Workstation',Icon:LayoutGrid},
  {id:'clients',label:'Clients',Icon:Users},
  {id:'portfolio',label:'Portfolio',Icon:TrendingUp},
  {id:'inbox',label:'Inbox',Icon:Inbox},
  {id:'planning',label:'Planning',Icon:Calendar},
];

function FadeSlideIn({keyProp, children}) {
  var [s,setS]=useState({opacity:0,transform:'translateY(6px)',transition:''});
  useEffect(()=>{var t=requestAnimationFrame(()=>setS({opacity:1,transform:'translateY(0)',transition:'opacity 200ms ease, transform 200ms ease'}));return()=>cancelAnimationFrame(t);},[keyProp]);
  return <div style={s}>{children}</div>;
}

function SlideInLeft({show, children}) {
  var [mounted,setMounted]=useState(false);
  useEffect(()=>{
    if(show){var t=setTimeout(()=>setMounted(true),10);return()=>clearTimeout(t);}
    else setMounted(false);
  },[show]);
  return (
    <div style={{width:show?220:0,flexShrink:0,overflow:'hidden',transition:'width 220ms cubic-bezier(0.4,0,0.2,1)'}}>
      <div style={{width:220,height:'100%',background:tk.sidebar,borderRight:'1px solid '+tk.border,display:'flex',flexDirection:'column',overflow:'hidden',opacity:mounted?1:0,transition:'opacity 180ms ease 60ms'}}>
        {children}
      </div>
    </div>
  );
}

export default function App() {
  var [activeId,setActiveId]=useState(null);
  var [pendingId,setPendingId]=useState(null);
  var [done,setDone]=useState(new Set());
  var [skipped,setSkipped]=useState(new Set());
  var [navActive,setNavActive]=useState('workstation');
  var visible=ALL_ITEMS.filter(i=>!done.has(i.id));
  var active=activeId?visible.find(i=>i.id===activeId):null;

  function markDone(id){
    setDone(p=>{
      var next=new Set(p); next.add(id);
      var remaining=ALL_ITEMS.filter(i=>!next.has(i.id));
      var idx=ALL_ITEMS.findIndex(i=>i.id===id);
      var nx=ALL_ITEMS.slice(idx+1).find(i=>!next.has(i.id))||remaining[0];
      setActiveId(nx?nx.id:null);
      return next;
    });
  }
  function markSkip(id){
    setSkipped(p=>{var n=new Set(p);n.add(id);return n;});
    var idx=ALL_ITEMS.findIndex(i=>i.id===id);
    var nx=ALL_ITEMS.slice(idx+1).find(i=>!done.has(i.id)&&i.id!==id)||ALL_ITEMS.find(i=>!done.has(i.id)&&i.id!==id);
    setActiveId(nx?nx.id:null);
  }
  function handleItemClick(id){setPendingId(id);setTimeout(()=>{setActiveId(id);setPendingId(null);},120);}

  var grouped=GROUP_ORDER.reduce((acc,g)=>{var gi=visible.filter(i=>i.group===g);if(gi.length)acc[g]=gi;return acc;},{});
  var totalDone=done.size, total=ALL_ITEMS.length, progress=(totalDone/total)*100;

  return (
    <div style={{height:'100vh',display:'flex',fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif',background:tk.surface,overflow:'hidden'}}>
      <style>{'@keyframes dot{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}'}</style>

      {/* Icon nav */}
      <div style={{width:48,flexShrink:0,background:tk.sidebar,borderRight:'1px solid '+tk.border,display:'flex',flexDirection:'column',alignItems:'center',paddingTop:12,paddingBottom:12,gap:1,zIndex:10}}>
        <div style={{width:28,height:28,borderRadius:6,background:tk.ecru,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:14,flexShrink:0}}>
          <Layers size={13} color={tk.warm} strokeWidth={1.8}/>
        </div>
        {NAV_ITEMS.map(n=>(
          <button key={n.id} onClick={()=>setNavActive(n.id)} title={n.label}
            style={{width:36,height:36,borderRadius:8,background:navActive===n.id?'rgba(237,228,211,0.15)':'transparent',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',flexShrink:0,color:navActive===n.id?tk.ecru:'#8A7E6E'}}>
            <n.Icon size={15} strokeWidth={1.8}/>
            {n.id==='workstation'&&visible.length>0&&<div style={{position:'absolute',top:5,right:5,width:6,height:6,borderRadius:'50%',background:'#B85C5C',border:'1.5px solid '+tk.nav}}/>}
          </button>
        ))}
        <div style={{flex:1}}/>
        <div style={{width:28,height:28,borderRadius:'50%',background:tk.ecru,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700,color:tk.warm,flexShrink:0}}>HL</div>
      </div>

      {/* Slide-in queue sidebar */}
      <SlideInLeft show={!!active}>
        <div style={{padding:'14px 12px 10px',flexShrink:0}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
            <div><div style={{fontSize:12,fontWeight:700,color:tk.text}}>Workstation</div><div style={{fontSize:10,color:tk.muted}}>Heather L. · Feb 18</div></div>
            <div style={{fontSize:11,fontWeight:600,color:tk.text}}>{totalDone}/{total}</div>
          </div>
          <div style={{height:3,background:tk.border,borderRadius:10,overflow:'hidden'}}><div style={{width:progress+'%',height:'100%',background:tk.green,borderRadius:10,transition:'width 0.4s ease'}}/></div>
          <div style={{fontSize:10,color:tk.muted,marginTop:4}}>{total-totalDone} remaining</div>
        </div>
        <div style={{flex:1,overflowY:'auto',padding:'0 8px 16px'}}>
          {Object.keys(grouped).map(grp=>{
            var gi=grouped[grp];
            return (
              <div key={grp} style={{marginBottom:12}}>
                <div style={{fontSize:9,fontWeight:700,color:tk.muted,textTransform:'uppercase',letterSpacing:1.1,padding:'0 5px',marginBottom:4}}>{GROUP_LABELS[grp]}</div>
                {gi.map(item=>{
                  var isA=item.id===activeId, isS=skipped.has(item.id);
                  return (
                    <div key={item.id} onClick={()=>setActiveId(item.id)}
                      style={{display:'flex',alignItems:'center',gap:7,padding:'7px 8px',borderRadius:9,marginBottom:1,background:isA?tk.bg:'transparent',border:'1px solid '+(isA?tk.border:'transparent'),cursor:'pointer',opacity:isS?.5:1}}>
                      <div style={{width:24,height:24,borderRadius:6,background:isA?tk.ecru:tk.border+'80',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                        <ItemIcon id={item.id} size={12} color={isA?tk.warm:tk.muted}/>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:11,fontWeight:isA?600:500,color:isA?tk.text:tk.warm,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{item.label}</div>
                        <div style={{fontSize:10,color:tk.muted,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{item.client}</div>
                      </div>
                      {isA&&<ChevronRight size={10} strokeWidth={2} color={tk.muted} style={{flexShrink:0}}/>}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </SlideInLeft>

      {/* Main content */}
      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',minWidth:0}}>
        {active ? (
          <FadeSlideIn keyProp={active.id}>
            <div style={{height:'100vh',display:'flex',flexDirection:'column'}}>
              <div style={{background:tk.bg,borderBottom:'1px solid '+tk.border,padding:'12px 20px',flexShrink:0}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <div style={{width:32,height:32,borderRadius:8,background:tk.ecru,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <ItemIcon id={active.id} size={15} color={tk.warm}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',alignItems:'center',gap:7,flexWrap:'wrap'}}>
                      <span style={{fontSize:13,fontWeight:600,color:tk.text}}>{active.label}</span>
                      <Tag text={active.badge} color={active.badgeColor}/>
                      <AgentTag role={active.agentRole}/>
                    </div>
                    <div style={{fontSize:11,color:tk.muted,marginTop:1}}>{active.client} · {active.sub}</div>
                  </div>
                  <button onClick={()=>setActiveId(null)}
                    style={{width:28,height:28,borderRadius:'50%',background:tk.surface,border:'1px solid '+tk.border,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,color:tk.muted}}
                    onMouseEnter={e=>e.currentTarget.style.background=tk.ecru}
                    onMouseLeave={e=>e.currentTarget.style.background=tk.surface}>
                    <Plus size={13} style={{transform:'rotate(45deg)'}}/>
                  </button>
                </div>
              </div>
              <div style={{flex:1,overflowY:'auto',padding:'18px 20px'}}>
                {active.panel(()=>markDone(active.id),()=>markSkip(active.id))}
              </div>
              <ChatBar isHome={false} key={active.id} context={active.chat} onSend={()=>markDone(active.id)} onSkip={()=>markSkip(active.id)}/>
            </div>
          </FadeSlideIn>
        ) : visible.length > 0 ? (
          /* ── Homepage ── */
          <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
            <div style={{flex:1,overflowY:'auto',padding:'28px 32px 16px',maxWidth:760,width:'100%',margin:'0 auto',boxSizing:'border-box'}}>
              <div style={{marginBottom:20}}>
                <div style={{fontSize:20,fontWeight:300,color:tk.text,marginBottom:2}}>Good morning, Heather.</div>
                <div style={{fontSize:12,color:tk.muted}}>Wednesday, February 18 · {visible.length} items need your attention</div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8,marginBottom:24}}>
                {[
                  {l:'AUM',v:'$142.4M',delta:'+2.1%',deltaLabel:'vs last month',pos:true,green:false},
                  {l:'ARR',v:'$1.28M',delta:'+$14K',deltaLabel:'vs last month',pos:true,green:false},
                  {l:'Cash flow',v:'+$3.2M',delta:'Net inflows',deltaLabel:'last 30 days',pos:true,green:true},
                  {l:'Clients',v:'87',delta:'3 prospects',deltaLabel:'in pipeline',pos:null,green:false},
                ].map((s,i)=>(
                  <div key={i} style={{background:tk.bg,border:'1px solid '+tk.border,borderRadius:12,padding:'13px 14px'}}>
                    <div style={{fontSize:9,color:tk.warm,textTransform:'uppercase',letterSpacing:0.9,marginBottom:6}}>{s.l}</div>
                    <div style={{fontSize:22,fontWeight:200,color:s.green?tk.green:tk.text,marginBottom:4,letterSpacing:-0.5}}>{s.v}</div>
                    <div style={{display:'flex',alignItems:'center',gap:4}}><span style={{fontSize:10,fontWeight:600,color:s.pos===true?tk.green:s.pos===false?tk.maroon:tk.teal}}>{s.delta}</span><span style={{fontSize:10,color:tk.muted}}>{s.deltaLabel}</span></div>
                  </div>
                ))}
              </div>
              {Object.keys(grouped).map(grp=>{
                var gi=grouped[grp];
                return (
                  <div key={grp} style={{marginBottom:20}}>
                    <div style={{fontSize:10,fontWeight:700,color:tk.muted,textTransform:'uppercase',letterSpacing:1,marginBottom:8}}>{GROUP_LABELS[grp]}</div>
                    <div style={{display:'flex',flexDirection:'column',gap:3}}>
                      {gi.map(item=>{
                        var isPending=item.id===pendingId;
                        return (
                          <div key={item.id} onClick={()=>handleItemClick(item.id)}
                            style={{display:'flex',alignItems:'center',gap:12,padding:'11px 14px',background:isPending?tk.ecru:tk.bg,border:'1px solid '+(isPending?'#C4B89A':tk.border),borderRadius:10,cursor:'pointer',transition:'background 120ms ease, border-color 120ms ease'}}
                            onMouseEnter={e=>{if(!isPending){e.currentTarget.style.borderColor='#C4B89A';e.currentTarget.style.background=tk.ecru+'80';}}}
                            onMouseLeave={e=>{if(!isPending){e.currentTarget.style.borderColor=tk.border;e.currentTarget.style.background=tk.bg;}}}>
                            <div style={{width:32,height:32,borderRadius:8,background:isPending?tk.ecru:tk.surface,border:'1px solid '+(isPending?'#C4B89A':tk.border),display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                              <ItemIcon id={item.id} size={15} color={tk.warm}/>
                            </div>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:1}}>
                                <span style={{fontSize:12,fontWeight:500,color:tk.text}}>{item.label}</span>
                                <Tag text={item.badge} color={item.badgeColor}/>
                                <AgentTag role={item.agentRole}/>
                              </div>
                              <div style={{fontSize:11,color:tk.muted,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.client} · {item.sub}</div>
                            </div>
                            <ChevronRight size={13} color={tk.muted} style={{flexShrink:0}}/>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <ChatBar isHome={true}/>
          </div>
        ) : (
          <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:12}}>
            <div style={{width:56,height:56,borderRadius:'50%',background:'#E8F5EE',display:'flex',alignItems:'center',justifyContent:'center'}}><Check size={26} strokeWidth={1.8} color={tk.green}/></div>
            <div style={{fontSize:18,fontWeight:500,color:tk.text}}>All done for today</div>
            <div style={{fontSize:13,color:tk.muted}}>{totalDone} items completed</div>
          </div>
        )}
      </div>
    </div>
  );
}