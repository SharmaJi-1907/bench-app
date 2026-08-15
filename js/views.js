const NAV=[
 ['home','Home',
  '<path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z"/>',
  '<path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z"/>'],
 ['stock','Stock',
  '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M3 11h18M8 7V4h8v3"/>',
  '<rect x="3" y="7" width="18" height="13" rx="2"/><rect x="8" y="4" width="8" height="3" rx="1" fill="var(--card)"/>'],
 ['buy','To Buy',
  '<path d="M6 6h15l-2 9H8L6 6z"/><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M6 6L5 3H2"/>',
  '<path d="M6 6h15l-2 9H8z"/><circle cx="9" cy="20" r="1.6" fill="var(--card)"/><circle cx="18" cy="20" r="1.6" fill="var(--card)"/>'],
 ['proj','Projects',
  '<path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>',
  '<path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>'],
 ['all','All',
  '<path d="M4 6h16M4 12h16M4 18h16"/>',
  '<rect x="4" y="4.5" width="16" height="3" rx="1.5"/><rect x="4" y="10.5" width="16" height="3" rx="1.5"/><rect x="4" y="16.5" width="16" height="3" rx="1.5"/>']];
function drawNav(){
  $('#nav').innerHTML=NAV.map(a=>{const on=S.view===a[0];
    return `<button data-v="${a[0]}" class="${on?'on':''}"><svg viewBox="0 0 24 24" class="${on?'filled':''}">${on?a[3]:a[2]}</svg>${a[1]}</button>`}).join('');
  $('#nav').querySelectorAll('button').forEach(b=>b.onclick=()=>{S.view=b.dataset.v;S.f.q='';render()});
}

function thumb(it){
  const p=S.photos[it.i];
  return `<div class="thumb" data-cam="${it.i}">${p?`<img src="${p}" alt="">`:art(it)}
    <div class="cam"><svg viewBox="0 0 24 24"><path d="M4 8h3l2-2h6l2 2h3v11H4z"/><circle cx="12" cy="13" r="3.2"/></svg></div></div>`;
}
function row(it,mode){
  const u=U(it.i),s=st(it.i);let line='';
  if(mode==='stock'){
    const c=u.cond||'working';
    line=(c!=='working'?`<span class="tag t-bad">${c==='repair'?'needs repair':c}</span>`:`<span class="tag t-have">working</span>`)
      +(u.tested?'':'<span class="tag t-warn">not tested</span>')
      +(u.project?`<span>${esc(u.project)}</span>`:'')
      +(u.loc?`<span>· ${esc(u.loc)}</span>`:'');
  }else{
    line=`<span class="tag t-gray">${LVL[it.l]}</span>`
      +(it.t.indexOf('📘')>=0?'<span class="tag t-need">lab</span>':'')
      +(s==='have'?'<span class="tag t-have">have</span>':'')
      +`<span>${esc(it.d||CATS[it.c])}</span>`;
  }
  const q=qty(it.i);
  const right=mode==='stock'?`<div class="pr">×${q}</div>`:'';
  return `<div class="row"><button class="tap" data-id="${it.i}">${thumb(it)}
    <div class="info"><div class="nm">${esc(it.n)}</div><div class="ln">${line}</div></div></button>${right}</div>`;
}
function bind(){
  document.querySelectorAll('.tap[data-id]').forEach(b=>b.onclick=e=>{
    if(e.target.closest('[data-cam]'))return;open(b.dataset.id)});
  document.querySelectorAll('[data-cam]').forEach(t=>t.onclick=e=>{e.stopPropagation();pick(t.dataset.cam)});
  document.querySelectorAll('[data-proj]').forEach(b=>b.onclick=()=>openProject(b.dataset.proj));
}

let camFor=null;
function pick(id){camFor=id;$('#globalCam').click()}
$('#globalCam').onchange=e=>{
  const f=e.target.files&&e.target.files[0];e.target.value='';if(!f||!camFor)return;
  const id=camFor,rd=new FileReader();
  rd.onload=()=>{const im=new Image();
    im.onload=async()=>{let w=im.width,h=im.height;const m=900;
      if(w>m||h>m){const r=Math.min(m/w,m/h);w=Math.round(w*r);h=Math.round(h*r)}
      const c=document.createElement('canvas');c.width=w;c.height=h;
      c.getContext('2d').drawImage(im,0,0,w,h);
      await setPhoto(id,c.toDataURL('image/jpeg',.78));toast('Photo added');
      if($('#sheet').classList.contains('open'))open(id);else render()};
    im.onerror=()=>toast('Could not read that image');im.src=rd.result};
  rd.readAsDataURL(f);
};

function vHome(){
  const s=sums();
  const owned=all().filter(x=>st(x.i)==='have');
  return `<div class="tiles">
    <div class="tile"><b>${s.have}</b><span>I have</span></div>
    <div class="tile"><b>${s.buyN}</b><span>need to buy</span></div>
    <div class="tile"><b style="color:${s.bad?'var(--red)':'inherit'}">${s.bad}</b><span>damaged</span></div>
  </div>
  <h2>My projects</h2>
  ${S.projects.length?S.projects.slice(0,4).map((p,i)=>projRow(p,i)).join('')
    :`<div class="row" style="padding:16px;color:var(--ink2);font-size:14px">No projects yet. Make one to plan the parts you need.</div>`}
  <button class="btn sec wide" id="goProj">${S.projects.length?'See all projects':'Create a project'}</button>
  <h2>Items I have</h2>
  ${owned.length?owned.slice(0,4).map(x=>row(x,'stock')).join('')
    :`<div class="row" style="padding:16px;color:var(--ink2);font-size:14px">Nothing marked as owned yet.</div>`}
  ${owned.length?`<button class="btn sec wide" id="goStock">See all in stock</button>`:''}
  ${(s.untested||s.bad)?`<h2>Check these</h2>
    ${s.untested?`<div class="row" style="padding:14px"><span style="font-size:14.5px"><b>${s.untested}</b> item${s.untested===1?'':'s'} not tested yet</span></div>`:''}
    ${s.bad?`<div class="row" style="padding:14px"><span style="font-size:14.5px;color:var(--red)"><b>${s.bad}</b> damaged or need repair</span></div>`:''}`:''}
  ${stockByCategory()}`;
}
function stockByCategory(){
  const totals={};
  all().forEach(x=>{if(st(x.i)==='have')totals[x.c]=(totals[x.c]||0)+1});
  const rows=Object.keys(totals).map(k=>({k,v:totals[k]})).sort((a,b)=>b.v-a.v);
  if(!rows.length)return '';
  const max=rows[0].v;
  return `<h2>Stock by category</h2>
    ${rows.map(r=>`<div class="row" style="display:block;padding:14px">
      <div style="display:flex;justify-content:space-between;font-size:14px"><b>${CATS[r.k]}</b><span style="color:var(--ink2)">${r.v} item${r.v===1?'':'s'}</span></div>
      <div class="bar"><i style="width:${Math.round(r.v/max*100)}%"></i></div></div>`).join('')}`;
}
const PSTAT={idea:['Idea','t-gray'],building:['Building','t-warn'],done:['Finished','t-have'],paused:['Paused','t-gray']};
function projMissing(p){return (p.parts||[]).filter(x=>st(x.id)!=='have')}
function projRow(p,i){
  const n=(p.parts||[]).length,miss=projMissing(p).length;
  const s=PSTAT[p.status||'idea'];
  return `<div class="row"><button class="tap" data-proj="${p.id}">
    <div class="thumb">${sym('board')}</div>
    <div class="info"><div class="nm">${esc(p.name)}</div>
    <div class="ln"><span class="tag ${s[1]}">${s[0]}</span>
      <span>${n} part${n===1?'':'s'}</span>
      ${miss?`<span class="tag t-need">${miss} missing</span>`:(n?'<span class="tag t-have">all parts ready</span>':'')}</div></div></button></div>`;
}
function bar(){
  return `<input class="search" id="q" placeholder="Search components" value="${esc(S.f.q)}">
  <div class="chips"><button class="chip ${!S.f.cat?'on':''}" data-v="">All</button>
  ${Object.keys(CATS).map(k=>`<button class="chip ${S.f.cat===k?'on':''}" data-v="${k}">${CATS[k]}</button>`).join('')}</div>`;
}
function filt(l){const q=S.f.q.trim().toLowerCase();
  return l.filter(it=>(!S.f.cat||it.c===S.f.cat)&&(!q||(it.n+' '+it.d+' '+it.w+' '+CATS[it.c]).toLowerCase().indexOf(q)>=0))}
function vAll(){
  const l=filt(all());
  if(!l.length)return bar()+`<div class="empty"><h3>Nothing found</h3><p>Try another word or clear the filter.</p></div>`;
  const g={};l.forEach(x=>{(g[x.c]=g[x.c]||[]).push(x)});
  return bar()+Object.keys(CATS).filter(k=>g[k]).map(k=>
    `<div class="ghead"><span class="a">${CATS[k]}</span><span class="b">${g[k].length} items</span></div>`
    +g[k].map(x=>row(x)).join('')).join('');
}
function vStock(){
  const owned=all().filter(x=>st(x.i)==='have');
  if(!owned.length)return `<div class="empty"><div class="thumb" style="width:64px;height:64px;margin:0 auto 14px">${sym('board')}</div><h3>Your stock is empty</h3>
    <p>Open any component and tap <b>I have it</b>. Then set the quantity, condition and which project it is in.</p>
    <button class="btn" id="goAll">Browse all items</button></div>`;
  const l=filt(owned);
  return `<div class="total" style="padding:16px"><div class="lbl">Items in stock</div>
    <div class="amt" style="font-size:28px">${l.length}</div></div><div style="height:12px"></div>`
    +bar()+(l.length?l.map(x=>row(x,'stock')).join(''):`<div class="empty"><p>No stock matches this filter.</p></div>`);
}
function vBuy(){
  const l=all().filter(x=>st(x.i)==='need');
  if(!l.length)return `<div class="empty"><div class="thumb" style="width:64px;height:64px;margin:0 auto 14px">${sym('tool')}</div><h3>Buy list is empty</h3>
    <p>Mark items as <b>Need to buy</b> and they collect here.</p>
    <button class="btn" id="goAll">Browse all items</button></div>`;
  const g={};l.forEach(x=>{(g[x.c]=g[x.c]||[]).push(x)});
  return `<div class="total"><div class="lbl">Items to buy</div><div class="amt">${l.length}</div></div>`
  +Object.keys(CATS).filter(k=>g[k]).map(k=>
    `<div class="ghead"><span class="a">${CATS[k]}</span><span class="b">${g[k].length} item${g[k].length===1?'':'s'}</span></div>`+g[k].map(x=>row(x)).join('')).join('')
  +`<div class="btnrow"><button class="btn sec" id="cp">Copy list</button><button class="btn grn" id="ab">All bought</button></div>`;
}

function vProj(){
  if(!S.projects.length)return `<div class="empty"><div class="thumb" style="width:64px;height:64px;margin:0 auto 14px">${sym('board')}</div><h3>No projects yet</h3>
    <p>A project is anything you are building — a robot, a lab experiment, a home automation box.
    Add the parts it needs and the app tells you what is missing.</p>
    <button class="btn" id="newProj">Create my first project</button></div>`;
  const totalMiss=S.projects.reduce((s,p)=>s+projMissing(p).length,0);
  return `<div class="total"><div class="lbl">Missing parts across all projects</div>
    <div class="amt">${totalMiss}</div>
    <div class="sub">${S.projects.length} project${S.projects.length===1?'':'s'}</div></div>
    <h2>All projects</h2>
    ${S.projects.map((p,i)=>projRow(p,i)).join('')}
    <button class="btn wide" id="newProj" style="margin-top:6px">+ New project</button>`;
}
function render(){
  drawNav();
  $('#main').innerHTML={home:vHome,stock:vStock,buy:vBuy,proj:vProj,all:vAll}[S.view]();
  window.scrollTo(0,0);bind();
  const q=$('#q');if(q)q.oninput=e=>{const p=e.target.selectionStart;S.f.q=e.target.value;render();
    const n=$('#q');if(n){n.focus();n.setSelectionRange(p,p)}};
  document.querySelectorAll('.chip[data-v]').forEach(c=>c.onclick=()=>{S.f.cat=S.f.cat===c.dataset.v?'':c.dataset.v;render()});
  document.querySelectorAll('[data-proj]').forEach(b=>b.onclick=()=>openProject(b.dataset.proj));
  const ga=$('#goAll');if(ga)ga.onclick=()=>{S.view='all';render()};
  const gs=$('#goStock');if(gs)gs.onclick=()=>{S.view='stock';render()};
  const gp=$('#goProj');if(gp)gp.onclick=()=>{if(!S.projects.length)newProject();else{S.view='proj';render()}};
  const np=$('#newProj');if(np)np.onclick=newProject;
  const cp=$('#cp');if(cp)cp.onclick=copyList;
  const ab=$('#ab');if(ab)ab.onclick=async()=>{
    all().filter(x=>st(x.i)==='need').forEach(x=>{S.u[x.i]=Object.assign({},U(x.i),{st:'have'})});
    await save();toast('Moved to my stock');render()};
}

