function openProject(pid){
  const p=S.projects.find(x=>x.id===pid);if(!p)return;
  const parts=p.parts||[],miss=projMissing(p);
  const missCost=miss.reduce((s,x)=>s+price(x.id)*(x.q||1),0);
  $('#sheet').innerHTML=`<div class="sheet-top"><button class="x" id="cl">✕</button><div class="t">${esc(p.name)}</div></div>
  <div class="sheet-in">
    <div class="total" style="margin-top:14px"><div class="lbl">Still need to buy</div>
      <div class="amt">${money(missCost)}</div>
      <div class="sub">${parts.length-miss.length} of ${parts.length} parts ready · project cost ${money(projCost(p))}</div></div>

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
      :`<div class="row" style="padding:16px;color:var(--ink2);font-size:14px">No parts added yet.</div>`}

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
  const bm=$('#buyMiss');if(bm)bm.onclick=async()=>{
    miss.forEach(x=>{S.u[x.id]=Object.assign({},U(x.id),{st:'need',qty:Math.max(qty(x.id),x.q||1)})});
    await save();toast('Added to buy list');openProject(pid)};
  $('#delProj').onclick=async()=>{if(!confirm('Delete this project?'))return;
    S.projects=S.projects.filter(x=>x.id!==pid);await save();close();toast('Project deleted')};
}
let pickQ='';
function openPartPicker(pid){
  const p=S.projects.find(x=>x.id===pid);
  const q=pickQ.trim().toLowerCase();
  const inProj=new Set((p.parts||[]).map(x=>x.id));
  const list=all().filter(it=>!q||(it.n+' '+it.d+' '+CATS[it.c]).toLowerCase().indexOf(q)>=0).slice(0,60);
  $('#sheet').innerHTML=`<div class="sheet-top"><button class="x" id="cl">✕</button><div class="t">Add parts to ${esc(p.name)}</div></div>
  <div class="sheet-in"><div style="height:12px"></div>
    <input class="search" id="pq" placeholder="Search a component" value="${esc(pickQ)}">
    ${list.map(it=>`<div class="row"><button class="tap" data-add="${it.i}">${thumb(it)}
      <div class="info"><div class="nm">${esc(it.n)}</div>
      <div class="ln">${st(it.i)==='have'?'<span class="tag t-have">in stock</span>':''}<span>${esc(it.d||CATS[it.c])}</span></div></div></button>
      <div class="pr" style="color:${inProj.has(it.i)?'var(--green)':'var(--blue)'};font-size:20px">${inProj.has(it.i)?'✓':'+'}</div></div>`).join('')}
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

function open(id){
  const it=byId(id);if(!it)return;
  const u=U(id),ph=S.photos[id],s=u.st||'';
  $('#sheet').innerHTML=`
  <div class="sheet-top"><button class="x" id="cl">✕</button><div class="t">${esc(it.n)}</div></div>
  <div class="sheet-in">
    <div class="hero"><div class="pic">${ph?`<img src="${ph}">`:`<div class="artbox">${art(it)}<div class="cap">${esc(it.n)}</div></div><div class="symtag">${sym(it.s)}<span>schematic</span></div>`}</div>
      <div class="acts">
        <button id="ph1">${ph?'Change photo':'Add photo'}</button>
        <button id="ph2">Find online</button>
        ${ph?'<button class="dgr" id="ph3">Remove</button>':''}
      </div></div>

    <label class="f">Status</label>
    <div class="seg" id="sg">
      <button data-v="have" class="${s==='have'?'on':''}">I have it</button>
      <button data-v="need" class="${s==='need'?'on':''}">Need to buy</button>
      <button data-v="" class="${s===''?'on':''}">Skip</button>
    </div>

    <div class="two">
      <div><label class="f">Price I pay</label>
        <div class="pfx"><span>₹</span><input class="f" id="pp" type="number" inputmode="decimal" value="${price(id)}"></div></div>
      <div><label class="f">Quantity</label>
        <div class="stepper"><button id="qm">−</button><input class="f" id="qq" type="number" inputmode="numeric" value="${qty(id)}"><button id="qp">+</button></div></div>
    </div>
    <div style="text-align:right;margin-top:8px;font-size:14px;color:var(--ink2)">Total: <b style="color:var(--ink)">${money(price(id)*qty(id))}</b></div>

    <div id="own" style="display:${s==='have'?'block':'none'}">
      <label class="f">Condition</label>
      <div class="seg ${(u.cond&&u.cond!=='working')?'r':'g'}" id="sc">
        ${['working','damaged','repair'].map(c=>`<button data-v="${c}" class="${(u.cond||'working')===c?'on':''}">${c==='repair'?'repair':c}</button>`).join('')}
      </div>
      <label class="f">Tested</label>
      <div class="seg g" id="stst"><button data-v="1" class="${u.tested?'on':''}">Tested OK</button><button data-v="0" class="${!u.tested?'on':''}">Not tested</button></div>
      <div class="two">
        <div><label class="f">Kept in</label><input class="f" id="loc" value="${esc(u.loc||'')}" placeholder="Box A"></div>
        <div><label class="f">Used in</label><input class="f" id="pj" value="${esc(u.project||'')}" placeholder="free"></div>
      </div>
    </div>

    ${pinout(it)}

    <label class="f">About this part</label>
    <div class="list">
      <div class="kv"><span class="k">Why you need it</span><span class="v">${esc(it.w)}</span></div>
      <div class="kv"><span class="k">Spec</span><span class="v">${esc(it.d||'—')}</span></div>
      <div class="kv"><span class="k">Type</span><span class="v">${CATS[it.c]}</span></div>
      <div class="kv"><span class="k">Level</span><span class="v">${LVL[it.l]}</span></div>
      <div class="kv"><span class="k">Market price</span><span class="v">${money(it.p)}</span></div>
      <div class="kv"><span class="k">Suggested qty</span><span class="v">${it.q}</span></div>
    </div>

    <label class="f">My notes</label>
    <textarea class="f" id="nt" placeholder="where I bought it, quirks, datasheet notes">${esc(u.notes||'')}</textarea>

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
  $('#sg').querySelectorAll('button').forEach(b=>b.onclick=async()=>{
    const o=Object.assign({},U(id),{st:b.dataset.v});
    if(!b.dataset.v)delete o.st;
    if(o.qty===undefined)o.qty=it.q;
    S.u[id]=o;await save();open(id)});
  const sc=$('#sc');if(sc)sc.querySelectorAll('button').forEach(b=>b.onclick=async()=>{S.u[id]=Object.assign({},U(id),{cond:b.dataset.v});await save();open(id)});
  const stg=$('#stst');if(stg)stg.querySelectorAll('button').forEach(b=>b.onclick=async()=>{S.u[id]=Object.assign({},U(id),{tested:b.dataset.v==='1'});await save();open(id)});
  const pp=$('#pp'),qq=$('#qq');
  const upd=async()=>{S.u[id]=Object.assign({},U(id),{price:Math.max(0,+pp.value||0),qty:Math.max(0,parseInt(qq.value)||0)});await save();open(id)};
  pp.onchange=upd;qq.onchange=upd;
  $('#qm').onclick=()=>{qq.value=Math.max(0,(+qq.value||0)-1);upd()};
  $('#qp').onclick=()=>{qq.value=(+qq.value||0)+1;upd()};
  [['loc','loc'],['pj','project'],['nt','notes']].forEach(a=>{const e=$('#'+a[0]);
    if(e)e.onchange=async()=>{const o={};o[a[1]]=e.value;S.u[id]=Object.assign({},U(id),o);await save()}});
  const d=$('#del');if(d)d.onclick=async()=>{if(!confirm('Delete this item?'))return;
    S.custom=S.custom.filter(x=>x.i!==id);delete S.u[id];await delPhoto(id);await save();close();toast('Deleted')};
}
function close(){$('#sheet').classList.remove('open');document.body.style.overflow='';render()}

function openAdd(){
  $('#sheet').innerHTML=`<div class="sheet-top"><button class="x" id="cl">✕</button><div class="t">Add a component</div></div>
  <div class="sheet-in">
    <label class="f">Name</label><input class="f" id="an" placeholder="e.g. LM339N">
    <div class="two">
      <div><label class="f">Type</label><select class="f" id="ac">${Object.keys(CATS).map(k=>`<option value="${k}">${CATS[k]}</option>`).join('')}</select></div>
      <div><label class="f">Level</label><select class="f" id="al">${Object.keys(LVL).map(k=>`<option value="${k}">${LVL[k]}</option>`).join('')}</select></div>
    </div>
    <div class="two">
      <div><label class="f">Price</label><div class="pfx"><span>₹</span><input class="f" id="ap" type="number" inputmode="decimal" value="0"></div></div>
      <div><label class="f">Quantity</label><input class="f" id="aq" type="number" inputmode="numeric" value="1"></div>
    </div>
    <label class="f">Picture symbol</label>
    <select class="f" id="as">${Object.keys(SYM).map(k=>`<option value="${k}">${k}</option>`).join('')}</select>
    <label class="f">Spec</label><input class="f" id="ad" placeholder="package, ratings">
    <label class="f">What it is for</label><textarea class="f" id="aw"></textarea>
    <label class="f">Add as</label>
    <div class="seg" id="ast"><button data-v="have" class="on">I have it</button><button data-v="need">Need to buy</button></div>
    <div style="height:18px"></div><button class="btn wide" id="sv">Save component</button><div style="height:30px"></div>
  </div>`;
  $('#sheet').classList.add('open');document.body.style.overflow='hidden';
  $('#cl').onclick=close;let start='have';
  $('#ast').querySelectorAll('button').forEach(b=>b.onclick=()=>{start=b.dataset.v;
    $('#ast').querySelectorAll('button').forEach(x=>x.classList.remove('on'));b.classList.add('on')});
  $('#sv').onclick=async()=>{
    const n=$('#an').value.trim();if(!n){toast('Give it a name first');return}
    const id='u_'+Date.now(),q=+$('#aq').value||1,p=+$('#ap').value||0;
    S.custom.push(I(id,n,$('#ac').value,$('#al').value,$('#as').value,p,q,$('#aw').value.trim(),$('#ad').value.trim(),''));
    S.u[id]={st:start,qty:q,price:p,cond:'working',tested:false};
    await save();close();toast('Added');open(id)};
}

function openMore(){
  $('#sheet').innerHTML=`<div class="sheet-top"><button class="x" id="cl">✕</button><div class="t">More</div></div>
  <div class="sheet-in">
    <label class="f">Appearance</label>
    <div class="seg">
      <button data-theme-opt="light" class="${S.theme==='light'?'on':''}">Light</button>
      <button data-theme-opt="dark" class="${S.theme==='dark'?'on':''}">Dark</button>
      <button data-theme-opt="system" class="${S.theme==='system'?'on':''}">Auto</button>
    </div>
    <label class="f">Photos</label>
    <button class="btn sec wide" id="bulk">Add many photos at once</button>
    <p style="font-size:13px;color:var(--ink2);line-height:1.55;margin-top:8px">
      Pick several image files together. Each file is matched to a component by its file name —
      name a file <b>LM358.jpg</b> or <b>NE555 timer.png</b> and it lands on the right part.</p>
    <input type="file" id="bulkf" accept="image/*" multiple hidden>
    <label class="f">Backup</label>
    <div class="list"><div class="kv"><span class="k">Photos saved</span><span class="v">${Object.keys(S.photos).length}</span></div>
      <div class="kv"><span class="k">My own items</span><span class="v">${S.custom.length}</span></div>
      <div class="kv"><span class="k">Items tracked</span><span class="v">${Object.keys(S.u).length}</span></div>
      <div class="kv"><span class="k">Storage</span><span class="v">${DB.ok?'Saved on device':'Preview only'}</span></div></div>
    <div class="btnrow"><button class="btn" id="ex1">Export backup</button><button class="btn sec" id="im1">Import</button></div>
    <input type="file" id="imf" accept="application/json" hidden>
    <p style="font-size:13px;color:var(--ink2);line-height:1.55">Export keeps your photos and all your data in one file. Do this often — clearing app data will erase everything.</p>
    <label class="f">Reset</label>
    <button class="btn red wide" id="rs">Erase all my data</button><div style="height:30px"></div></div>`;
  $('#sheet').classList.add('open');document.body.style.overflow='hidden';
  $('#cl').onclick=close;
  document.querySelectorAll('[data-theme-opt]').forEach(b=>b.onclick=async()=>{await setTheme(b.dataset.themeOpt);openMore()});
  $('#bulk').onclick=()=>$('#bulkf').click();
  $('#bulkf').onchange=bulkPhotos;
  $('#ex1').onclick=doExport;
  $('#im1').onclick=()=>$('#imf').click();
  $('#imf').onchange=doImport;
  $('#rs').onclick=async()=>{if(!confirm('Erase everything? This cannot be undone.'))return;
    for(const k in S.photos)await dbDel('p:'+k);
    S.u={};S.custom=[];S.photos={};await dbSet('pix',[]);await save();close();toast('All data erased')};
}
