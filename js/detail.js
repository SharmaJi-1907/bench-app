function openProject(pid){
  const p=S.projects.find(x=>x.id===pid);if(!p)return;
  const parts=p.parts||[],miss=projMissing(p);
  $('#sheet').innerHTML=`<div class="sheet-top"><button class="x" id="cl">✕</button><div class="t">${esc(p.name)}</div></div>
  <div class="sheet-in">
    <div class="total" style="margin-top:14px"><div class="lbl">Parts ready</div>
      <div class="amt">${parts.length-miss.length} of ${parts.length}</div>
      <div class="sub">${miss.length} still needed</div></div>

    <label class="f">Project name</label>
    <input class="f" id="pn" value="${esc(p.name)}">
    <label class="f">Stage</label>
    <div class="seg" id="ps">${Object.keys(PSTAT).map(k=>`<button data-v="${k}" class="${(p.status||'idea')===k?'on':''}">${PSTAT[k][0]}</button>`).join('')}</div>
    <label class="f">Notes</label>
    <textarea class="f" id="pnote" placeholder="what it does, wiring notes, next step">${esc(p.notes||'')}</textarea>

    <label class="f">Parts in this project</label>
    ${parts.length?parts.map(x=>{const it=byId(x.id);if(!it)return '';const has=st(x.id)==='have';
      return `<div class="row"><button class="tap" data-id="${x.id}">${thumb(it)}
        <div class="info"><div class="nm">${esc(it.n)}</div>
        <div class="ln">${has?'<span class="tag t-have">I have it</span>':'<span class="tag t-need">missing</span>'}
        <span>${x.q||1} pcs</span></div></div></button>
        <button class="pr" style="background:none;border:0;color:var(--red);font-size:20px;cursor:pointer;padding:0 6px" data-rm="${x.id}">×</button></div>`}).join('')
      :emptyState({icon:sym('board'),mini:1,sec:1,id:'addPart2',
        title:'No parts yet',
        msg:'Add the components this project needs and Bench will track which ones you already own.',
        act:'Add a part'})}

    <div class="btnrow"><button class="btn" id="addPart">+ Add parts</button>
    ${miss.length?`<button class="btn sec" id="buyMiss">Add missing to buy list</button>`:''}</div>
    <div style="height:16px"></div>
    <button class="btn red wide" id="delProj">Delete project</button>
    <div style="height:30px"></div></div>`;
  $('#sheet').classList.add('open');document.body.style.overflow='hidden';
  $('#cl').onclick=close;bind();
  $('#pn').onchange=async e=>{p.name=e.target.value.trim()||'Untitled';await save();openProject(pid)};
  $('#pnote').onchange=async e=>{p.notes=e.target.value;await save()};
  $('#ps').querySelectorAll('button').forEach(b=>b.onclick=async()=>{p.status=b.dataset.v;await save();openProject(pid)});
  document.querySelectorAll('[data-rm]').forEach(b=>b.onclick=async e=>{e.stopPropagation();
    p.parts=(p.parts||[]).filter(x=>x.id!==b.dataset.rm);await save();openProject(pid)});
  $('#addPart').onclick=()=>openPartPicker(pid);
  /* the empty-state CTA is only rendered when the project has no parts */
  const ap2=$('#addPart2');if(ap2)ap2.onclick=()=>openPartPicker(pid);
  const bm=$('#buyMiss');if(bm)bm.onclick=async()=>{
    miss.forEach(x=>{S.u[x.id]=Object.assign({},U(x.id),{st:'need',qty:Math.max(qty(x.id),x.q||1)})});
    await save();toast('Added to buy list');openProject(pid)};
  $('#delProj').onclick=async()=>{if(!confirm('Delete this project?'))return;
    haptic();S.projects=S.projects.filter(x=>x.id!==pid);await save();close();toast('Project deleted')};
}
let pickQ='';
function openPartPicker(pid){
  const p=S.projects.find(x=>x.id===pid);
  const q=pickQ.trim().toLowerCase();
  const inProj=new Set((p.parts||[]).map(x=>x.id));
  /* No cap: the whole catalogue is reachable here. Rendering every row is
     already proven safe — vAll() does exactly this on every render — and the
     old .slice(0,60) hid 193 of the 253 components with no way to page to them.
     Grouped by category with the same CATS-ordered .ghead headings the All tab
     uses, so the two screens read the same. Search filters first, then the
     grouping applies to whatever survives. Parts already in the project keep
     their green tick in place; they are not sorted to the top. */
  const list=all().filter(it=>!q||(it.n+' '+it.d+' '+CATS[it.c]).toLowerCase().indexOf(q)>=0);
  const g={};list.forEach(x=>{(g[x.c]=g[x.c]||[]).push(x)});
  const prow=it=>`<div class="row"><button class="tap" data-add="${it.i}">${thumb(it)}
      <div class="info"><div class="nm">${esc(it.n)}</div>
      <div class="ln">${st(it.i)==='have'?'<span class="tag t-have">in stock</span>':''}<span>${esc(it.d||CATS[it.c])}</span></div></div></button>
      <div class="pr" style="color:${inProj.has(it.i)?'var(--green)':'var(--blue)'};font-size:20px">${inProj.has(it.i)?'✓':'+'}</div></div>`;
  const body=list.length
    ? Object.keys(CATS).filter(k=>g[k]).map(k=>
        `<div class="ghead"><span class="a">${CATS[k]}</span><span class="b">${g[k].length} item${g[k].length===1?'':'s'}</span></div>`
        +g[k].map(prow).join('')).join('')
    : `<div class="ghead"><span class="a">No matches</span></div>
       <p style="margin:0 0 8px;color:var(--ink3)">Nothing in the catalogue matches “${esc(pickQ.trim())}”. Try a shorter word.</p>`;
  $('#sheet').innerHTML=`<div class="sheet-top"><button class="x" id="cl">✕</button><div class="t">Add parts to ${esc(p.name)}</div></div>
  <div class="sheet-in"><div style="height:12px"></div>
    <input class="search" id="pq" placeholder="Search a component" value="${esc(pickQ)}">
    ${body}
    <div style="height:30px"></div></div>`;
  $('#sheet').classList.add('open');document.body.style.overflow='hidden';
  $('#cl').onclick=()=>{pickQ='';openProject(pid)};
  const pq=$('#pq');pq.oninput=e=>{const c=e.target.selectionStart;pickQ=e.target.value;openPartPicker(pid);
    const n=$('#pq');if(n){n.focus();n.setSelectionRange(c,c)}};
  document.querySelectorAll('[data-add]').forEach(b=>b.onclick=async()=>{
    const id=b.dataset.add;p.parts=p.parts||[];
    if(p.parts.some(x=>x.id===id)){p.parts=p.parts.filter(x=>x.id!==id);toast('Removed')}
    else{p.parts.push({id:id,q:byId(id).q||1});toast('Added')}
    await save();openPartPicker(pid)});
}
async function newProject(){
  const name=prompt('Project name');if(!name)return;
  S.projects.unshift({id:'pj_'+Date.now(),name:name.trim(),status:'idea',parts:[],notes:''});
  await save();S.view='proj';render();openProject(S.projects[0].id);
}
function pinout(it){
  const key=Object.keys(PINS).filter(k=>it.n.toUpperCase().indexOf(k.toUpperCase())>=0)[0];
  if(!key)return '';
  const L=PINS[key],n=L.length;
  if(n===3)return `<div class="pinbox"><div class="h">Pinout — ${key} (front view)</div>
    <svg viewBox="0 0 300 105"><rect x="105" y="10" width="90" height="42" rx="4" fill="#F1F3F6" stroke="#C3C9D2"/>
    ${L.map((l,i)=>{const x=125+i*25;return `<line x1="${x}" y1="52" x2="${x}" y2="76" stroke="#6B7280" stroke-width="3"/><text x="${x}" y="94" fill="#1A1D23" font-size="11" font-family="system-ui" text-anchor="middle">${l}</text>`}).join('')}</svg></div>`;
  const per=n/2,H=30+per*22;
  let s=`<svg viewBox="0 0 300 ${H+14}"><rect x="100" y="14" width="100" height="${per*22}" rx="4" fill="#F1F3F6" stroke="#C3C9D2"/><path d="M139 14a11 11 0 0022 0" fill="none" stroke="#C3C9D2"/>`;
  for(let i=0;i<per;i++){const y=28+i*22,j=n-1-i;
    s+=`<line x1="80" y1="${y}" x2="100" y2="${y}" stroke="#6B7280" stroke-width="2.4"/>
      <text x="75" y="${y+4}" fill="#1A1D23" font-size="10.5" font-family="system-ui" text-anchor="end">${L[i]}</text>
      <text x="106" y="${y+4}" fill="#9AA1AC" font-size="9" font-family="system-ui">${i+1}</text>
      <line x1="200" y1="${y}" x2="220" y2="${y}" stroke="#6B7280" stroke-width="2.4"/>
      <text x="225" y="${y+4}" fill="#1A1D23" font-size="10.5" font-family="system-ui">${L[j]}</text>
      <text x="194" y="${y+4}" fill="#9AA1AC" font-size="9" font-family="system-ui" text-anchor="end">${j+1}</text>`}
  return `<div class="pinbox"><div class="h">Pinout — ${key} (top view, notch up)</div>${s}</svg></div>`;
}

// Hand-drawn hero, used as the last fallback and as the recovery target when a
// bundled stock photo fails to load (stale manifest / missing file).
function heroArt(it){
  return `<div class="artbox">${art(it)}<div class="cap">${esc(it.n)}</div></div><div class="symtag">${sym(it.s)}<span>schematic</span></div>`;
}
// Set by open() so the inline onerror below can swap art in without re-rendering
// the whole sheet (which would lose in-progress edits).
let heroArtHTML='';
function heroFail(img){
  const pic=img.parentNode;if(pic)pic.innerHTML=heroArtHTML;
}

// Progressive disclosure (DESIGN-SYSTEM.md §Components) — which item's
// "More details" section is currently expanded, or null. This has to live at
// module scope, not inside open(): open() re-renders the whole sheet after most
// edits (status, qty, condition, photo), so a local would reset on every save.
// Keying it to an id also makes the reset-on-a-different-item case automatic —
// open('b') can never inherit 'a' expanded state.
let moreOpenFor=null;

// The secondary block: everything that is reference material rather than the
// thing you came to the sheet to change. open() decides (via hasMore) whether to
// put it behind the expand or render it inline — an expand that opens to nothing
// is worse than no expand, and the notes field must stay reachable either way.
// pinout() is '' for most parts, so it alone can't justify the control.
function moreDetails(it,u,pin){
  return `<label class="f">About this part</label>
    <div class="list">
      <div class="kv"><span class="k">Why you need it</span><span class="v">${esc(it.w)}</span></div>
      <div class="kv"><span class="k">Spec</span><span class="v">${esc(it.d||'—')}</span></div>
      <div class="kv"><span class="k">Type</span><span class="v">${CATS[it.c]}</span></div>
      <div class="kv"><span class="k">Level</span><span class="v">${LVL[it.l]}</span></div>
      <div class="kv"><span class="k">Suggested qty</span><span class="v">${it.q}</span></div>
    </div>
    ${pin}
    <label class="f">My notes</label>
    <textarea class="f" id="nt" placeholder="where I bought it, quirks, datasheet notes">${esc(u.notes||'')}</textarea>`;
}

/* ---- the one write path for status + quantity -------------------------
   TRD/BUILD-TASKS Task 4: the quick-action sheet changes exactly the two
   fields the detail sheet does, and must not fork the write. Both entry
   points call these; neither touches S.u itself.

   setItemStatus keeps the two behaviours the detail sheet had baked into
   its handler and which the quick sheet has to inherit verbatim:
   - "Skip" ('') *removes* the key rather than storing an empty string, so
     st()/filters see an untracked item, not a tracked one with no status.
   - a first-ever status write seeds qty from the catalog's suggested
     quantity, so an item never lands in stock reading "×undefined".
   The haptic lives here too (DESIGN-SYSTEM §Haptics: light impact on a
   confirmed data change) — one place, so it can never fire twice or be
   forgotten by a caller, and never fires for merely opening a sheet. */
async function setItemStatus(id,v){
  const it=byId(id);if(!it)return;
  const o=Object.assign({},U(id),{st:v});
  if(!v)delete o.st;
  if(o.qty===undefined)o.qty=it.q;
  /* Issue 4: the record leaves here in the new shape whatever it arrived in —
     normConds() reads a legacy scalar `cond` as "all of them", and the scalar is
     dropped so the two can never disagree. */
  o.conds=fitConds(normConds(o),qtyU(o));delete o.cond;
  haptic();S.u[id]=o;await save();
}
/* Floor at 0 is enforced here rather than at each ±/input, so no caller can
   write a negative quantity even by typing one straight into the field.
   qty is the total, so changing it has to move the per-condition counts with it:
   units gained are working, units lost come off working first (fitConds). */
async function setItemQty(id,n){
  const v=Math.max(0,parseInt(n,10)||0);
  const u=U(id);
  S.u[id]=Object.assign({},u,{qty:v,conds:fitConds(normConds(u),v)});
  haptic();await save();
  return v;
}
/* ---- condition counts (Issue 4) ---------------------------------------
   The model the UI presents: working is the pool an owned part sits in, and
   damaged / needs-repair are units *marked out of* that pool.

   +working / -working change how many you own (qty follows).
   +damaged  takes a unit out of the pool (working, else the other marked
             bucket); only when there is genuinely nothing left to take does it
             add a unit, so "mark one of my 2 as damaged" is one tap and never
             silently inflates the total.
   -damaged  puts that unit back in the pool — the exact inverse, so the control
             is safe to experiment with.
   qty is recomputed from the counts every time, which keeps the invariant
   working+damaged+repair === qty true by construction rather than by promise. */
async function setItemCond(id,key,d){
  if(CONDS.indexOf(key)<0||!d)return;
  const u=U(id),c=normConds(u);
  if(d>0){
    if(key==='working')c.working++;
    else{
      /* CONDS is working-first, so the pool is preferred automatically */
      const from=CONDS.filter(k=>k!==key&&c[k]>0)[0];
      if(from)c[from]--;
      c[key]++;
    }
  }else{
    if(!c[key])return;
    c[key]--;
    if(key!=='working')c.working++;
  }
  const q=c.working+c.damaged+c.repair;
  S.u[id]=Object.assign({},u,{qty:q,conds:c});
  haptic();await save();
}

function open(id){
  const it=byId(id);if(!it)return;
  const u=U(id),ph=S.photos[id],s=u.st||'';
  const pin=pinout(it);
  /* Issue 4: the condition block is counts, so it needs the numbers, which of
     them are actually in play, and one line saying how the two relate. The
     common case ("I have 3, all fine") still needs no interaction at all —
     setting the quantity puts every unit in working by itself. */
  const cc=conds(id),cmix=condMix(id),cq=qty(id);
  const condHint=!cq?'Nothing in stock — set a quantity above first.'
    :cmix.length>1?`Adds up to the ×${cq} above: ${esc(cmix.map(k=>cc[k]+' '+CONDN[k]).join(', '))}.`
    :cmix[0]==='working'?`All ×${cq} count as working. Mark one damaged or needing repair and it comes out of that — the total stays the same.`
    :`All ×${cq} are ${CONDN[cmix[0]]}.`;
  // "Meaningful" = a pin diagram, real descriptive text, or a note the user
  // already wrote. Type/Level/Suggested qty alone (always present, derived from
  // the catalog row) don't earn a collapsed section of their own.
  const hasMore=!!pin||!!(it.w||it.d)||!!(u.notes&&u.notes.trim());
  const expanded=hasMore&&moreOpenFor===id;
  if(!hasMore&&moreOpenFor===id)moreOpenFor=null;
  // precedence: user camera photo > bundled stock photo > hand-drawn art
  const stock=(!ph&&typeof stockPhoto==='function')?stockPhoto(id):null;
  heroArtHTML=heroArt(it);
  const heroPic=ph?`<img src="${ph}" alt="">`
    :stock?`<img src="${stock}" alt="${esc(it.n)}" onerror="heroFail(this)">`
    :heroArtHTML;
  $('#sheet').innerHTML=`
  <div class="sheet-top"><button class="x" id="cl">✕</button><div class="t">${esc(it.n)}</div></div>
  <div class="sheet-in">
    <div class="hero"><div class="pic">${heroPic}</div>
      <div class="acts">
        <button id="ph1">${ph?'Change photo':'Add photo'}</button>
        <button id="ph2">Find online</button>
        ${ph?'<button class="dgr" id="ph3">Remove</button>':''}
      </div></div>

    <button class="favrow${u.fav?' on':''}" id="favt" aria-pressed="${u.fav?'true':'false'}">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.6 9.7l5.8-.8z"/></svg>
      <span class="favrow-t">${u.fav?'Pinned to Home':'Pin to Home'}</span>
      <span class="favrow-s">${u.fav?'Showing in Ready to grab':'Keep this one a tap away'}</span>
    </button>

    <label class="f">Status</label>
    <div class="seg" id="sg">
      <button data-v="have" class="${s==='have'?'on':''}">I have it</button>
      <button data-v="need" class="${s==='need'?'on':''}">Need to buy</button>
      <button data-v="" class="${s===''?'on':''}">Skip</button>
    </div>

    <label class="f">Quantity</label>
    <div class="stepper"><button id="qm">−</button><input class="f" id="qq" type="number" inputmode="numeric" value="${qty(id)}"><button id="qp">+</button></div>

    <div id="own" style="display:${s==='have'?'block':'none'}">
      <label class="f">Condition</label>
      <div class="conds${cmix.length>1?' mixed':''}" id="sc">
        ${CONDS.map(k=>`<div class="condrow${cc[k]?'':' zero'}" data-cond="${k}">
          <span class="cdot ${k}"></span>
          <span class="cnm">${CONDN[k]}</span>
          <span class="cn">${cc[k]}</span>
          <button type="button" class="cstep" data-cond-d="-1" data-cond="${k}" aria-label="One fewer ${CONDN[k]}"${cc[k]?'':' disabled'}>−</button>
          <button type="button" class="cstep" data-cond-d="1" data-cond="${k}" aria-label="One more ${CONDN[k]}">+</button>
        </div>`).join('')}
      </div>
      <p class="hint">${condHint}</p>
      <label class="f">Tested</label>
      <div class="seg g" id="stst"><button data-v="1" class="${u.tested?'on':''}">Tested OK</button><button data-v="0" class="${!u.tested?'on':''}">Not tested</button></div>
      <div class="two">
        <div><label class="f">Kept in</label><input class="f" id="loc" value="${esc(u.loc||'')}" placeholder="Box A"></div>
        <div><label class="f">Used in</label><input class="f" id="pj" value="${esc(u.project||'')}" placeholder="free"></div>
      </div>
    </div>

    ${hasMore?`<button class="btn sec wide" id="mdt" aria-expanded="${expanded?'true':'false'}" aria-controls="md"
      style="margin-top:var(--sp-5);justify-content:space-between;padding-left:14px;padding-right:14px">
      <span id="mdl">${expanded?'Hide details':'More details'}</span>
      <span id="mdc" style="color:var(--ink2);font-size:var(--fs-label)">${expanded?'▴':'▾'}</span></button>
    <div id="md" style="display:${expanded?'block':'none'}">${moreDetails(it,u,pin)}</div>`
    :moreDetails(it,u,pin)}

    <label class="f">Buy from</label>
    <div class="btnrow">
      <a class="btn sec" target="_blank" rel="noopener" href="https://www.electronicscomp.com/index.php?route=product/search&search=${encodeURIComponent(it.n)}">ElectronicsComp</a>
      <a class="btn sec" target="_blank" rel="noopener" href="https://robu.in/?s=${encodeURIComponent(it.n)}">Robu</a>
    </div>
    <div class="btnrow">
      <a class="btn sec" target="_blank" rel="noopener" href="https://www.amazon.in/s?k=${encodeURIComponent(it.n)}">Amazon</a>
      <a class="btn sec" target="_blank" rel="noopener" href="https://www.google.com/search?q=${encodeURIComponent(it.n+' datasheet')}">Datasheet</a>
    </div>
    ${id.indexOf('u_')===0?'<div style="height:16px"></div><button class="btn red wide" id="del">Delete this item</button>':''}
    <div style="height:30px"></div>
  </div>`;
  $('#sheet').classList.add('open');document.body.style.overflow='hidden';

  $('#cl').onclick=close;
  $('#ph1').onclick=()=>pick(id);
  $('#ph2').onclick=()=>window.open('https://www.google.com/search?tbm=isch&q='+encodeURIComponent(it.n+' electronic component'),'_blank');
  const p3=$('#ph3');if(p3)p3.onclick=async()=>{await delPhoto(id);toast('Photo removed');open(id)};
  /* Pin/unpin drives the Home "Ready to grab" grid. Writes through the same
     S.u + save() path as every other per-item field. */
  $('#favt').onclick=async()=>{
    S.u[id]=Object.assign({},U(id),{fav:!U(id).fav});
    haptic();await save();open(id);
  };
  $('#sg').querySelectorAll('button').forEach(b=>b.onclick=async()=>{
    await setItemStatus(id,b.dataset.v);open(id)});
  const sc=$('#sc');if(sc)sc.querySelectorAll('button[data-cond-d]').forEach(b=>b.onclick=async()=>{
    await setItemCond(id,b.dataset.cond,+b.dataset.condD);open(id)});
  const stg=$('#stst');if(stg)stg.querySelectorAll('button').forEach(b=>b.onclick=async()=>{S.u[id]=Object.assign({},U(id),{tested:b.dataset.v==='1'});await save();open(id)});
  const qq=$('#qq');
  const upd=async()=>{await setItemQty(id,qq.value);open(id)};
  qq.onchange=upd;
  $('#qm').onclick=()=>{qq.value=Math.max(0,(+qq.value||0)-1);upd()};
  $('#qp').onclick=()=>{qq.value=(+qq.value||0)+1;upd()};
  // Toggles in place — no re-render, so a field being edited inside the section
  // never loses focus, and the block below re-binds #nt either way.
  const mdt=$('#mdt');if(mdt)mdt.onclick=()=>{
    const box=$('#md'),on=box.style.display==='none';
    box.style.display=on?'block':'none';
    mdt.setAttribute('aria-expanded',on?'true':'false');
    $('#mdl').textContent=on?'Hide details':'More details';
    $('#mdc').textContent=on?'▴':'▾';
    moreOpenFor=on?id:null};
  [['loc','loc'],['pj','project'],['nt','notes']].forEach(a=>{const e=$('#'+a[0]);
    if(e)e.onchange=async()=>{const o={};o[a[1]]=e.value;S.u[id]=Object.assign({},U(id),o);await save()}});
  const d=$('#del');if(d)d.onclick=async()=>{if(!confirm('Delete this item?'))return;
    haptic();S.custom=S.custom.filter(x=>x.i!==id);delete S.u[id];await delPhoto(id);await save();close();toast('Deleted')};
}
function close(){$('#sheet').classList.remove('open');document.body.style.overflow='';render()}

/* ---- component creation ----------------------------------------------
   TRD §2: there is exactly ONE way component data gets created. Quick-add and
   the full Add form are two different sets of *inputs* to the same writes —
   neither builds an I(...) row or touches S.custom / S.u itself.

   Ids stay 'u_'+Date.now(), which repeats when two items are created inside
   the same millisecond (a double-tapped save, or two quick-adds in a row on a
   fast device). A repeated id would silently overwrite the previous item's
   S.u entry and give two catalog rows the same key, so the timestamp is
   probed against everything that exists and only disambiguated when it is
   actually taken — a lone add still gets the plain, readable 'u_<ts>'. */
function newItemId(){
  const base='u_'+Date.now();let id=base,n=1;
  while(byId(id)||S.u[id])id=base+'-'+(n++);
  return id;
}
/* Every field quick-add doesn't ask for gets a well-formed default here, so a
   quick-added part groups, filters, renders art and reads correctly in every
   view exactly like a fully-filled one. 'mech' (Wires & Parts) is the neutral
   catch-all bucket and 'ic' the neutral symbol; both are editable afterwards
   from the item's own detail sheet. */
async function addComponent(o){
  const id=newItemId(),q=Math.max(1,parseInt(o.qty,10)||1);
  S.custom.push(I(id,String(o.name).trim(),o.cat||'mech',o.lvl||'B',o.sym||'ic',0,q,
    String(o.why||'').trim(),String(o.spec||'').trim(),''));
  S.u[id]={st:o.st==='need'?'need':'have',qty:q,conds:{working:q,damaged:0,repair:0},tested:false};
  haptic();/* DESIGN-SYSTEM §Haptics — once, exactly at "it worked" */
  await save();
  return id;
}
/* Guards the two failure modes the spec calls out, in one place so both entry
   points inherit them: a blank/whitespace name never creates a ghost item, and
   a second submit landing before the first `await save()` resolves is dropped
   rather than creating a duplicate. Returns the new id, or null if nothing was
   created. */
let addBusy=false;
async function submitAdd(o,btn){
  const name=String(o.name||'').trim();
  if(!name){toast('Give it a name first');return null}
  if(addBusy)return null;
  addBusy=true;if(btn)btn.disabled=true;
  try{return await addComponent(Object.assign({},o,{name:name}))}
  finally{addBusy=false;if(btn)btn.disabled=false}
}

/* What the user has typed, kept across a quick <-> all-fields flip so nothing
   is lost by switching. A fresh open resets it: openAdd is wired straight to
   the FAB (`$('#fab').onclick=openAdd`), so it is called with a click Event —
   only the internal mode-switch calls pass the string 'quick'/'full'. */
let addDraft=null;
function openAdd(mode){
  const keep=(mode==='quick'||mode==='full');
  /* Issue 5: which side the form starts on is a setting now. Only a *fresh*
     open reads it — a quick <-> all-fields flip keeps whatever the user has
     already picked for this run of adds. */
  const d=addDraft=(keep&&addDraft)?addDraft:{name:'',qty:1,st:SET.addas};
  const full=(mode==='full'),qv=Math.max(1,parseInt(d.qty,10)||1);
  /* keyLabel: SYM's values are SVG path data, so that select shows its keys */
  const opts=(m,sel,keyLabel)=>Object.keys(m).map(k=>`<option value="${k}"${sel===k?' selected':''}>${keyLabel?k:m[k]}</option>`).join('');
  $('#sheet').innerHTML=`<div class="sheet-top"><button class="x" id="cl">✕</button><div class="t">Add a component</div></div>
  <div class="sheet-in">
    <div class="seg" id="amode" style="margin-top:var(--sp-4)">
      <button data-m="quick" class="${full?'':'on'}">Quick</button>
      <button data-m="full" class="${full?'on':''}">All fields</button>
    </div>
    <label class="f">Name</label><input class="f" id="an" placeholder="e.g. LM339N" value="${esc(d.name||'')}">
    ${full?`<div class="two">
      <div><label class="f">Type</label><select class="f" id="ac">${opts(CATS,d.cat)}</select></div>
      <div><label class="f">Level</label><select class="f" id="al">${opts(LVL,d.lvl)}</select></div>
    </div>`:''}
    <label class="f">Quantity</label>
    ${full?`<input class="f" id="aq" type="number" inputmode="numeric" value="${qv}">`
      :`<div class="stepper"><button type="button" id="qm">−</button><input class="f" id="aq" type="number" inputmode="numeric" value="${qv}"><button type="button" id="qp">+</button></div>`}
    ${full?`<label class="f">Picture symbol</label>
    <select class="f" id="as">${opts(SYM,d.sym,1)}</select>
    <label class="f">Spec</label><input class="f" id="ad" placeholder="package, ratings" value="${esc(d.spec||'')}">
    <label class="f">What it is for</label><textarea class="f" id="aw">${esc(d.why||'')}</textarea>`:''}
    <label class="f">Add as</label>
    <div class="seg" id="ast"><button data-v="have" class="${d.st==='need'?'':'on'}">I have it</button><button data-v="need" class="${d.st==='need'?'on':''}">Need to buy</button></div>
    ${full?'':`<p style="font-size:var(--fs-caption);color:var(--ink2);line-height:1.55;margin:var(--sp-3) 0 0">Type, symbol and spec get sensible defaults you can change on the part later — or switch to <b>All fields</b> to set them now.</p>`}
    <div style="height:18px"></div><button class="btn wide" id="sv">${full?'Save component':'Add component'}</button><div style="height:30px"></div>
  </div>`;
  $('#sheet').classList.add('open');document.body.style.overflow='hidden';
  $('#cl').onclick=()=>{addDraft=null;close()};
  /* read whatever fields this mode actually rendered back into the draft */
  const g=i=>{const e=$('#'+i);return e?e.value:undefined};
  const snap=()=>{d.name=g('an')||'';d.qty=g('aq');
    if(g('ac')!==undefined){d.cat=g('ac');d.lvl=g('al');d.sym=g('as');d.spec=g('ad');d.why=g('aw')}
    return d};
  $('#amode').querySelectorAll('button').forEach(b=>b.onclick=()=>{snap();openAdd(b.dataset.m)});
  $('#ast').querySelectorAll('button').forEach(b=>b.onclick=()=>{d.st=b.dataset.v;
    $('#ast').querySelectorAll('button').forEach(x=>x.classList.remove('on'));b.classList.add('on')});
  const aq=$('#aq'),qm=$('#qm'),qp=$('#qp');
  if(qm)qm.onclick=()=>{aq.value=Math.max(1,(+aq.value||1)-1)};
  if(qp)qp.onclick=()=>{aq.value=Math.max(1,(+aq.value||1)+1)};
  const sv=$('#sv');
  sv.onclick=async()=>{
    const o=snap(),st0=o.st,q0=o.qty;
    const id=await submitAdd(o,sv);
    if(!id)return;
    toast('Added');
    if(full){addDraft=null;close();open(id);return}
    /* Quick-add re-opens itself with a blank name, keeping the chosen quantity
       and have/need: logging several parts in a row is the case it exists for,
       and closing the sheet after each one would hand the taps straight back.
       The list underneath is re-rendered so the new item is already there. */
    addDraft={name:'',qty:q0,st:st0};render();openAdd('quick');
    const an=$('#an');if(an)an.focus();
  };
}

function showIntro(){
  $('#sheet').innerHTML=`<div class="sheet-top"><button class="x" id="cl">✕</button><div class="t">Welcome to Bench</div></div>
  <div class="sheet-in">
    <p style="color:var(--ink2);line-height:1.6;font-size:var(--fs-body);margin-top:16px">Bench tracks the electronic parts you own, the ones you still need, and the projects you're building with them — all saved on this device, nothing sent anywhere.</p>
    <div class="list" style="margin-top:16px">
      <div class="kv"><span class="k">All</span><span class="v">Browse parts, mark have or need</span></div>
      <div class="kv"><span class="k">Stock</span><span class="v">What you already own</span></div>
      <div class="kv"><span class="k">To Buy</span><span class="v">What you still need</span></div>
      <div class="kv"><span class="k">Projects</span><span class="v">Track parts for what you're building</span></div>
    </div>
    <div style="height:20px"></div>
    <button class="btn wide" id="cl2">Get started</button>
    <div style="height:30px"></div></div>`;
  $('#sheet').classList.add('open');document.body.style.overflow='hidden';
  $('#cl').onclick=close;$('#cl2').onclick=close;
}

/* ---- Settings (Issue 5) ------------------------------------------------
   Was "More": four bare labels in a flat run, which read as a maintenance
   drawer. Now grouped into named sections, each control followed by one line
   saying what it does, ordered most-used first with the destructive action
   alone at the bottom under its own heading.

   Deliberately only three new controls (docs/update.md decision 6). Text size,
   show/hide Home sections and confirm-deletes were considered and dropped.

   Still called openMore() because io.js re-opens this sheet by that name after
   a bulk photo import, and io.js is not ours to touch. */
function openMore(){
  const seg=(id,opts,cur)=>`<div class="seg" id="${id}">`
    +opts.map(o=>`<button type="button" data-v="${o[0]}" class="${String(cur)===String(o[0])?'on':''}">${o[1]}</button>`).join('')
    +`</div>`;
  $('#sheet').innerHTML=`<div class="sheet-top"><button class="x" id="cl">✕</button><div class="t">Settings</div></div>
  <div class="sheet-in">
    <div class="sethd">Appearance</div>
    <label class="f">Theme</label>
    <div class="seg">
      <button data-theme-opt="light" class="${S.theme==='light'?'on':''}">Light</button>
      <button data-theme-opt="dark" class="${S.theme==='dark'?'on':''}">Dark</button>
      <button data-theme-opt="system" class="${S.theme==='system'?'on':''}">Auto</button>
    </div>
    <p class="hint">Auto follows whatever your phone is set to, and switches with it.</p>

    <div class="sethd">Home screen</div>
    <label class="f">Pinned parts</label>
    ${seg('setpin',[[4,'4'],[6,'6'],[8,'8']],SET.pinned)}
    <p class="hint">How many starred parts fill the “Ready to grab” grid on Home. The grid is two across, so every option ends on a full row.</p>

    <div class="sethd">Adding a part</div>
    <label class="f">Add as</label>
    ${seg('setadd',[['have','I have it'],['need','Need to buy']],SET.addas)}
    <p class="hint">Which side the Add form starts on. Pick <b>Need to buy</b> if you mostly build a shopping list.</p>

    <div class="sethd">Feedback</div>
    <label class="f">Vibration</label>
    ${seg('setvib',[[1,'On'],[0,'Off']],SET.vibrate?1:0)}
    <p class="hint">A short buzz when something is saved — a status change, a new part, a swipe action. Never on plain navigation.</p>

    <div class="sethd">Photos</div>
    <button class="btn sec wide" id="bulk">Add many photos at once</button>
    <p class="hint">Pick several image files together. Each file is matched to a component by its file name —
      name a file <b>LM358.jpg</b> or <b>NE555 timer.png</b> and it lands on the right part.</p>
    <input type="file" id="bulkf" accept="image/*" multiple hidden>

    <div class="sethd">My data</div>
    <div class="list"><div class="kv"><span class="k">Photos saved</span><span class="v">${Object.keys(S.photos).length}</span></div>
      <div class="kv"><span class="k">My own items</span><span class="v">${S.custom.length}</span></div>
      <div class="kv"><span class="k">Items tracked</span><span class="v">${Object.keys(S.u).length}</span></div>
      <div class="kv"><span class="k">Storage</span><span class="v">${DB.ok?'Saved on device':'Preview only'}</span></div></div>
    <div class="btnrow"><button class="btn" id="ex1">Export backup</button><button class="btn sec" id="im1">Import</button></div>
    <input type="file" id="imf" accept="application/json" hidden>
    <p class="hint">Export keeps your photos and all your data in one file. Do this often — clearing app data will erase everything.</p>

    <div class="danger">
      <div class="sethd dgr">Danger zone</div>
      <p class="hint">Removes every part you have marked, every project and every photo on this device. There is no undo, and no copy anywhere else. Export a backup first if you are unsure.</p>
      <button class="btn red wide" id="rs">Erase all my data</button>
    </div>
    <div style="height:30px"></div></div>`;
  $('#sheet').classList.add('open');document.body.style.overflow='hidden';
  $('#cl').onclick=close;
  document.querySelectorAll('[data-theme-opt]').forEach(b=>b.onclick=async()=>{await setTheme(b.dataset.themeOpt);openMore()});
  /* Each new control writes through setSetting() — one flat key, one place that
     normalises the value — then redraws the sheet so the pressed segment and its
     hint line always agree with what was stored. */
  const wire=(sel,key,map)=>{const e=$(sel);if(!e)return;
    e.querySelectorAll('button').forEach(b=>b.onclick=async()=>{
      await setSetting(key,map?map(b.dataset.v):b.dataset.v);openMore()})};
  wire('#setpin','pinned',v=>+v);
  wire('#setadd','addas');
  wire('#setvib','vibrate',v=>v==='1');
  $('#bulk').onclick=()=>$('#bulkf').click();
  $('#bulkf').onchange=bulkPhotos;
  $('#ex1').onclick=doExport;
  $('#im1').onclick=()=>$('#imf').click();
  $('#imf').onchange=doImport;
  $('#rs').onclick=async()=>{if(!confirm('Erase everything? This cannot be undone.'))return;
    for(const k in S.photos)await dbDel('p:'+k);
    S.u={};S.custom=[];S.photos={};await dbSet('pix',[]);await save();close();toast('All data erased')};
}
