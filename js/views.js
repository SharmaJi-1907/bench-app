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

/* ---- catalog layout mode (list | grid) -------------------------------
   Persisted with the same flat dbSet/dbGet key pattern as 'theme' and
   'onboarded'. store.js's boot() doesn't know about it, so the value is
   pulled in lazily on the first render and re-rendered once it lands. */
let CATVIEW='list',catviewLoaded=false;
function loadCatView(){
  if(catviewLoaded)return;catviewLoaded=true;
  dbGet('catview').then(v=>{if((v==='grid'||v==='list')&&v!==CATVIEW){CATVIEW=v;render()}});
}
async function setCatView(v){
  if(v!=='grid'&&v!=='list')return;
  if(CATVIEW===v)return;
  CATVIEW=v;catviewLoaded=true;render();await dbSet('catview',v);
}
/* outline (inactive) + filled (active) variant per option — same
   two-variant pattern as NAV/drawNav(), per DESIGN-SYSTEM §Iconography */
const CATVIEWS=[
 ['list','List view',
  '<path d="M4 6h16M4 12h16M4 18h16"/>',
  '<rect x="4" y="4.5" width="16" height="3" rx="1.5"/><rect x="4" y="10.5" width="16" height="3" rx="1.5"/><rect x="4" y="16.5" width="16" height="3" rx="1.5"/>'],
 ['grid','Grid view',
  '<rect x="4" y="4" width="7" height="7" rx="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.6"/>',
  '<rect x="3.5" y="3.5" width="8" height="8" rx="2"/><rect x="12.5" y="3.5" width="8" height="8" rx="2"/><rect x="3.5" y="12.5" width="8" height="8" rx="2"/><rect x="12.5" y="12.5" width="8" height="8" rx="2"/>']];
function catToggle(){
  return `<div class="vtogbar"><div class="vtog" role="group" aria-label="Catalog layout">`
    +CATVIEWS.map(a=>{const on=CATVIEW===a[0];
      return `<button type="button" data-cv="${a[0]}" class="${on?'on':''}" aria-label="${a[1]}" aria-pressed="${on?'true':'false'}"><svg viewBox="0 0 24 24" class="${on?'filled':''}">${on?a[3]:a[2]}</svg></button>`}).join('')
    +`</div></div>`;
}
function gcell(it){
  const s=st(it.i);
  return `<div class="gcell"><button class="tap" data-id="${it.i}">${thumb(it)}
    <div class="ginfo"><div class="gnm">${esc(it.n)}</div>
    <div class="gln">${s==='have'?'<span class="tag t-have">have</span>':''}<span>${esc(it.d||CATS[it.c])}</span></div></div></button></div>`;
}

/* ---- empty states ----------------------------------------------------
   DESIGN-SYSTEM §Components — empty state: every empty state in the app is
   icon badge + one line saying *why* it is empty + one clear action.
   emptyState() is the only way to build one, so the shape cannot drift.

   Two situations that must never share copy (BUILD-TASKS Task 7):
   - "nothing added yet"  -> explain how to fill it, action goes somewhere
                             the user can add something.
   - "filtered to zero"   -> say the filter is what is hiding things, and
                             the action clears that filter. */
const EICO={
 search:'<circle cx="11" cy="11" r="7"/><path d="M20.4 20.4l-4.1-4.1"/>'};
function eico(k){return `<svg class="eico" viewBox="0 0 24 24">${EICO[k]}</svg>`}
function emptyState(o){
  return `<div class="empty${o.mini?' mini':''}"><div class="thumb ebadge">${o.icon}</div>
    <h3>${o.title}</h3><p>${o.msg}</p>
    <button class="btn${o.sec?' sec':''}" id="${o.id}">${o.act}</button></div>`;
}
/* is anything actually filtering the list right now? */
function filtOn(){return !!(S.f.q.trim()||S.f.cat)}
/* human description of the active filter, for the "filtered to zero" copy */
function filtDesc(){
  const q=S.f.q.trim(),c=S.f.cat?CATS[S.f.cat]:'';
  if(q&&c)return `“${esc(q)}” in ${esc(c)}`;
  if(q)return `“${esc(q)}”`;
  return `the ${esc(c)} category`;
}
/* the action label names exactly what will be cleared */
function clearLabel(){
  const q=S.f.q.trim(),c=S.f.cat;
  return q&&c?'Clear search and filter':q?'Clear search':'Show all categories';
}

function thumb(it){
  const p=S.photos[it.i];
  return `<div class="thumb" data-cam="${it.i}">${p?`<img src="${p}" alt="">`:art(it)}
    <div class="cam"><svg viewBox="0 0 24 24"><path d="M4 8h3l2-2h6l2 2h3v11H4z"/><circle cx="12" cy="13" r="3.2"/></svg></div></div>`;
}
function row(it,mode,swipe){
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
  /* Quick-action trigger (Task 4). A dedicated affordance rather than a
     long-press: long-press starts with a pointerdown on .row, which is
     exactly what bindSwipe() is listening to, so the two gestures would be
     racing on the same element — and a hidden gesture is the same
     discoverability/accessibility gap DESIGN-SYSTEM §Swipe row flags. This
     button is skipped by bindSwipe's pointerdown (same guard as the camera
     badge), so a drag that starts on it never becomes a swipe and a swipe
     that starts on the row never becomes a quick-sheet open.
     In stock mode it wraps the ×qty readout that was already sitting here,
     so the row gains an affordance, not a whole extra control. */
  const right=`<button class="qedit" type="button" data-quick="${it.i}" aria-label="Adjust ${esc(it.n)}">`
    +(mode==='stock'?`<span class="pr">×${q}</span>`:'')
    +`<svg class="qic" viewBox="0 0 24 24"><path d="M8 9.5L12 5.5l4 4M8 14.5l4 4 4-4"/></svg></button>`;
  const content=`<div class="row"><button class="tap" data-id="${it.i}">${thumb(it)}
    <div class="info"><div class="nm">${esc(it.n)}</div><div class="ln">${line}</div></div></button>${right}</div>`;
  if(!swipe)return content;
  return `<div class="swipe-wrap"><div class="swipe-action ${swipe.cls}" data-swact="${it.i}" data-swkind="${swipe.kind}">${swipe.label}</div>${content}</div>`;
}
function bind(){
  document.querySelectorAll('.tap[data-id]').forEach(b=>b.onclick=e=>{
    if(e.target.closest('[data-cam]'))return;open(b.dataset.id)});
  document.querySelectorAll('[data-cam]').forEach(t=>t.onclick=e=>{e.stopPropagation();pick(t.dataset.cam)});
  document.querySelectorAll('[data-quick]').forEach(b=>b.onclick=e=>{e.stopPropagation();openQuick(b.dataset.quick)});
  document.querySelectorAll('[data-proj]').forEach(b=>b.onclick=()=>openProject(b.dataset.proj));
  bindSwipe();
}
function closeOtherSwipes(except){
  document.querySelectorAll('.swipe-wrap.open').forEach(w=>{if(w!==except){
    w.classList.remove('open');const r=w.querySelector('.row');if(r)r.style.transform=''}});
}
function bindSwipe(){
  const REVEAL=88;
  document.querySelectorAll('.swipe-wrap').forEach(wrap=>{
    const rowEl=wrap.querySelector('.row');
    let startX=0,curX=0,dragging=false,moved=false;
    rowEl.addEventListener('pointerdown',e=>{
      /* the camera badge and the quick-action trigger are their own targets:
         a press that starts on either must not arm a swipe */
      if(e.target.closest('[data-cam]')||e.target.closest('[data-quick]'))return;
      startX=e.clientX;dragging=true;moved=false;wrap.classList.add('dragging');
      closeOtherSwipes(wrap);
    });
    rowEl.addEventListener('pointermove',e=>{
      if(!dragging)return;
      curX=e.clientX-startX;
      if(Math.abs(curX)>6)moved=true;
      const base=wrap.classList.contains('open')?-REVEAL:0;
      const x=Math.max(-REVEAL,Math.min(0,base+curX));
      rowEl.style.transform=`translateX(${x}px)`;
    });
    const end=()=>{
      if(!dragging)return;dragging=false;wrap.classList.remove('dragging');
      const base=wrap.classList.contains('open')?-REVEAL:0;
      const shouldOpen=(base+curX)<-REVEAL/2;
      rowEl.style.transform=shouldOpen?`translateX(-${REVEAL}px)`:'';
      wrap.classList.toggle('open',shouldOpen);
      curX=0;
    };
    rowEl.addEventListener('pointerup',end);
    rowEl.addEventListener('pointercancel',end);
    /* Capture phase, not bubble. The trailing click a drag produces lands on
       .tap (or, now, on the quick-action trigger) — both children of .row — so
       a bubble-phase listener here ran *after* their own onclick had already
       fired and opened a sheet; stopPropagation() was closing a door the event
       had walked through. Capturing on .row intercepts it before it reaches
       either child. Bound to .row and not .swipe-wrap on purpose: .swipe-action
       is a sibling of .row, so the revealed button keeps receiving its own
       first tap. */
    rowEl.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
  });
  document.querySelectorAll('[data-swact]').forEach(b=>b.onclick=async()=>{
    const id=b.dataset.swact,kind=b.dataset.swkind;
    if(kind==='unstock')S.u[id]=Object.assign({},U(id),{st:''});
    else if(kind==='bought')S.u[id]=Object.assign({},U(id),{st:'have'});
    haptic();await save();toast(kind==='bought'?'Marked as bought':'Removed from stock');render()});
}

/* ---- quick-action bottom sheet (Task 4) --------------------------------
   DESIGN-SYSTEM §Components: same slide-up mechanic as #sheet, but short and
   light — it overlays the list rather than replacing the screen, and carries
   only the two fields worth changing without leaving the list: status and
   quantity. Both are written through setItemStatus/setItemQty in detail.js,
   the exact same S.u + save() path the full detail sheet uses.

   Closing is centralised in closeQuick(), which reports whether it actually
   closed something. Escape and the Android back button in main.js both lean
   on that return value to decide whether they still have work to do — a
   second sheet that back-handling does not know about would exit the app. */
let quickFor=null;
function openQuick(id){
  const it=byId(id);if(!it)return;
  const u=U(id),s=u.st||'';
  closeOtherSwipes();
  quickFor=id;
  $('#qpanel').innerHTML=`<div class="qgrab"></div>
    <div class="qhead"><div class="qnm">${esc(it.n)}</div>
      <div class="qsub">${esc(it.d||CATS[it.c])}</div></div>
    <label class="f">Status</label>
    <div class="seg" id="qsg">
      <button type="button" data-v="have" class="${s==='have'?'on':''}">I have it</button>
      <button type="button" data-v="need" class="${s==='need'?'on':''}">Need to buy</button>
      <button type="button" data-v="" class="${s===''?'on':''}">Skip</button>
    </div>
    <label class="f">Quantity</label>
    <div class="stepper"><button type="button" id="qqm" aria-label="One fewer">−</button>
      <input class="f" id="qqi" type="number" inputmode="numeric" min="0" value="${qty(id)}">
      <button type="button" id="qqp" aria-label="One more">+</button></div>`;
  $('#qsheet').classList.add('open');
  $('#qsheet').setAttribute('aria-hidden','false');

  const qi=$('#qqi');
  /* Status toggles the pressed segment in place instead of re-rendering the
     panel: a re-render would blow away a quantity the user is mid-way through
     typing. The stepper is re-synced by hand afterwards because a first-ever
     status write seeds qty from the catalog default. */
  $('#qsg').querySelectorAll('button').forEach(b=>b.onclick=async()=>{
    $('#qsg').querySelectorAll('button').forEach(x=>x.classList.remove('on'));
    b.classList.add('on');
    await setItemStatus(id,b.dataset.v);
    qi.value=qty(id);
    refreshUnder()});
  const qupd=async()=>{qi.value=await setItemQty(id,qi.value);refreshUnder()};
  qi.onchange=qupd;
  $('#qqm').onclick=()=>{qi.value=Math.max(0,(+qi.value||0)-1);qupd()};
  $('#qqp').onclick=()=>{qi.value=(+qi.value||0)+1;qupd()};
}
/* The list under the (semi-transparent) scrim is refreshed on every change so
   it is already correct when the sheet slides away. render() scrolls to top,
   which would yank the list out from under an open sheet, so the offset is
   put back. */
function refreshUnder(){const y=window.scrollY;render();window.scrollTo(0,y)}
function closeQuick(){
  const el=$('#qsheet');
  if(!el||!el.classList.contains('open'))return false;
  el.classList.remove('open');el.setAttribute('aria-hidden','true');
  quickFor=null;return true;
}
/* outside tap. The scrim is a sibling of .qpanel, so a tap inside the panel
   never reaches it. Guarded because views.js is a plain script in shared
   global scope — a host page without the markup must not throw on load. */
{const qs=$('#qscrim');if(qs)qs.onclick=closeQuick;}

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
    +`<button class="btn sec wide" id="goProj">See all projects</button>`
    :emptyState({mini:1,sec:1,icon:sym('board'),title:'No projects yet',
      msg:'A project holds the parts list for something you are building, so the app can tell you what is missing.',
      act:'Create a project',id:'goProj'})}
  <h2>Items I have</h2>
  ${owned.length?owned.slice(0,4).map(x=>row(x,'stock')).join('')
    +`<button class="btn sec wide" id="goStock">See all in stock</button>`
    :emptyState({mini:1,sec:1,icon:sym('ic'),title:'Nothing marked as owned yet',
      msg:'Open any component and tap “I have it” — everything you own collects here.',
      act:'Browse all items',id:'goAll'})}
  ${(s.untested||s.bad)?`<h2>Check these</h2>
    ${s.untested?`<div class="row" style="padding:14px"><span style="font-size:var(--fs-body)"><b>${s.untested}</b> item${s.untested===1?'':'s'} not tested yet</span></div>`:''}
    ${s.bad?`<div class="row" style="padding:14px"><span style="font-size:var(--fs-body);color:var(--red)"><b>${s.bad}</b> damaged or need repair</span></div>`:''}`:''}
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
      <div style="display:flex;justify-content:space-between;font-size:var(--fs-body)"><b>${CATS[r.k]}</b><span style="color:var(--ink2)">${r.v} item${r.v===1?'':'s'}</span></div>
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
  return `<div class="searchwrap">
    <svg class="sicon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
    <input class="search" id="q" placeholder="Search components" value="${esc(S.f.q)}">
    ${S.f.q?'<button class="sclear" id="qclear">✕</button>':''}
  </div>
  <div class="chips"><button class="chip ${!S.f.cat?'on':''}" data-v="">All</button>
  ${Object.keys(CATS).map(k=>`<button class="chip ${S.f.cat===k?'on':''}" data-v="${k}">${CATS[k]}</button>`).join('')}</div>`;
}
function filt(l){const q=S.f.q.trim().toLowerCase();
  return l.filter(it=>(!S.f.cat||it.c===S.f.cat)&&(!q||(it.n+' '+it.d+' '+it.w+' '+CATS[it.c]).toLowerCase().indexOf(q)>=0))}
function vAll(){
  const l=filt(all());
  const head=bar()+catToggle();
  if(!l.length)return head+(filtOn()
    ? emptyState({icon:eico('search'),title:'No matches',
        msg:`Nothing in the catalogue matches ${filtDesc()}. The list is filtered, not empty — try a shorter word or a wider category.`,
        act:clearLabel(),id:'clearFilt'})
    : emptyState({icon:sym('ic'),title:'No components yet',
        msg:'There is nothing in the catalogue to browse. Add your first component and it shows up here.',
        act:'Add a component',id:'emptyAdd'}));
  const g={};l.forEach(x=>{(g[x.c]=g[x.c]||[]).push(x)});
  const grid=CATVIEW==='grid';
  return head+Object.keys(CATS).filter(k=>g[k]).map(k=>
    `<div class="ghead"><span class="a">${CATS[k]}</span><span class="b">${g[k].length} items</span></div>`
    +(grid?`<div class="grid">${g[k].map(x=>gcell(x)).join('')}</div>`
          :g[k].map(x=>row(x)).join(''))).join('');
}
function vStock(){
  const owned=all().filter(x=>st(x.i)==='have');
  if(!owned.length)return emptyState({icon:sym('ic'),title:'Your stock is empty',
    msg:'Nothing is marked as owned yet. Open any component and tap <b>I have it</b>, then set the quantity, condition and which project it is in.',
    act:'Browse all items',id:'goAll'});
  const l=filt(owned);
  /* filtered to zero — a different state from "stock is empty" above: the
     items exist, the filter is hiding them, so the action clears it. No
     zero hero number here, it would contradict the message. */
  if(!l.length)return bar()+emptyState({icon:eico('search'),title:'No stock matches',
    msg:`You have ${owned.length} item${owned.length===1?'':'s'} in stock, but none of them match ${filtDesc()}.`,
    act:clearLabel(),id:'clearFilt'});
  return `<div class="total" style="padding:16px"><div class="lbl">Items in stock</div>
    <div class="amt">${l.length}</div></div><div style="height:12px"></div>`
    +bar()+l.map(x=>row(x,'stock',{label:'Remove',cls:'red',kind:'unstock'})).join('');
}
function vBuy(){
  const l=all().filter(x=>st(x.i)==='need');
  if(!l.length)return emptyState({icon:sym('tool'),title:'Buy list is empty',
    msg:'Nothing is marked as <b>Need to buy</b> yet. Mark what you are missing and it collects here as a shopping list.',
    act:'Browse all items',id:'goAll'});
  const g={};l.forEach(x=>{(g[x.c]=g[x.c]||[]).push(x)});
  return `<div class="total"><div class="lbl">Items to buy</div><div class="amt">${l.length}</div></div>`
  +Object.keys(CATS).filter(k=>g[k]).map(k=>
    `<div class="ghead"><span class="a">${CATS[k]}</span><span class="b">${g[k].length} item${g[k].length===1?'':'s'}</span></div>`
    +g[k].map(x=>row(x,null,{label:'Bought',cls:'grn',kind:'bought'})).join('')).join('')
  +`<div class="btnrow"><button class="btn sec" id="cp">Copy list</button><button class="btn grn" id="ab">All bought</button></div>`;
}

function vProj(){
  if(!S.projects.length)return emptyState({icon:sym('board'),title:'No projects yet',
    msg:'A project is anything you are building — a robot, a lab experiment, a home automation box. Add the parts it needs and the app tells you what is missing.',
    act:'Create my first project',id:'newProj'});
  const totalMiss=S.projects.reduce((s,p)=>s+projMissing(p).length,0);
  return `<div class="total"><div class="lbl">Missing parts across all projects</div>
    <div class="amt">${totalMiss}</div>
    <div class="sub">${S.projects.length} project${S.projects.length===1?'':'s'}</div></div>
    <h2>All projects</h2>
    ${S.projects.map((p,i)=>projRow(p,i)).join('')}
    <button class="btn wide" id="newProj" style="margin-top:6px">+ New project</button>`;
}
function render(){
  loadCatView();
  drawNav();
  $('#main').innerHTML={home:vHome,stock:vStock,buy:vBuy,proj:vProj,all:vAll}[S.view]();
  window.scrollTo(0,0);bind();
  const q=$('#q');if(q)q.oninput=e=>{const p=e.target.selectionStart;S.f.q=e.target.value;render();
    const n=$('#q');if(n){n.focus();n.setSelectionRange(p,p)}};
  const qc=$('#qclear');if(qc)qc.onclick=()=>{S.f.q='';render()};
  document.querySelectorAll('.chip[data-v]').forEach(c=>c.onclick=()=>{S.f.cat=S.f.cat===c.dataset.v?'':c.dataset.v;render()});
  document.querySelectorAll('.vtog button[data-cv]').forEach(b=>b.onclick=()=>setCatView(b.dataset.cv));
  document.querySelectorAll('[data-proj]').forEach(b=>b.onclick=()=>openProject(b.dataset.proj));
  /* filtered-empty action: clears search + category so the list comes back */
  const cf=$('#clearFilt');if(cf)cf.onclick=()=>{S.f.q='';S.f.cat='';render()};
  const ea=$('#emptyAdd');if(ea)ea.onclick=()=>openAdd();
  const ga=$('#goAll');if(ga)ga.onclick=()=>{S.view='all';render()};
  const gs=$('#goStock');if(gs)gs.onclick=()=>{S.view='stock';render()};
  const gp=$('#goProj');if(gp)gp.onclick=()=>{if(!S.projects.length)newProject();else{S.view='proj';render()}};
  const np=$('#newProj');if(np)np.onclick=newProject;
  const cp=$('#cp');if(cp)cp.onclick=copyList;
  const ab=$('#ab');if(ab)ab.onclick=async()=>{
    all().filter(x=>st(x.i)==='need').forEach(x=>{S.u[x.i]=Object.assign({},U(x.i),{st:'have'})});
    haptic();await save();toast('Moved to my stock');render()};
}

