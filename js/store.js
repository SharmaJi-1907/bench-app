const DB={db:null,mem:{},ok:false};
function dbOpen(){return new Promise(r=>{try{if(!indexedDB)return r(false);
 const q=indexedDB.open('bench2',1);
 q.onupgradeneeded=e=>{const d=e.target.result;if(!d.objectStoreNames.contains('kv'))d.createObjectStore('kv')};
 q.onsuccess=e=>{DB.db=e.target.result;DB.ok=true;r(true)};q.onerror=()=>r(false);
 setTimeout(()=>r(DB.ok),1200)}catch(e){r(false)}})}
function dbGet(k){return new Promise(r=>{if(!DB.ok)return r(DB.mem[k]??null);
 try{const t=DB.db.transaction('kv','readonly').objectStore('kv').get(k);t.onsuccess=()=>r(t.result??null);t.onerror=()=>r(null)}catch(e){r(null)}})}
function dbSet(k,v){DB.mem[k]=v;return new Promise(r=>{if(!DB.ok)return r(1);
 try{const t=DB.db.transaction('kv','readwrite').objectStore('kv').put(v,k);t.onsuccess=()=>r(1);t.onerror=()=>r(0)}catch(e){r(0)}})}
function dbDel(k){delete DB.mem[k];return new Promise(r=>{if(!DB.ok)return r();
 try{const t=DB.db.transaction('kv','readwrite').objectStore('kv').delete(k);t.onsuccess=()=>r();t.onerror=()=>r()}catch(e){r()}})}

let S={u:{},custom:[],photos:{},projects:[],view:'home',f:{cat:'',q:''},theme:'system'};
const $=s=>document.querySelector(s);
const all=()=>CATALOG.concat(S.custom);
const byId=id=>all().find(x=>x.i===id);
const U=id=>S.u[id]||{};
const st=id=>U(id).st||'';
/* An item with no record at all still reads as "1 of them" everywhere, which is
   the behaviour every caller has always had; qtyU() is the same rule applied to
   a raw record so the condition helpers below cannot disagree with qty(). */
const qtyU=u=>(u&&u.qty!==undefined)?Math.max(0,parseInt(u.qty,10)||0):1;
const qty=id=>qtyU(U(id));

/* ---- Issue 4: per-condition unit counts --------------------------------
   A record used to carry ONE condition for the whole quantity:

     S.u[id] = {st:'have', qty:2, cond:'working', …}   // old

   so "I own two, one works and one is damaged" could not be written down, and
   sums() counted a part with five damaged units as a single damaged item. The
   condition is now a count per bucket, with qty still the single total:

     S.u[id] = {st:'have', qty:2, conds:{working:1,damaged:1,repair:0}, …}

   Invariant, enforced by fitConds(): working+damaged+repair === qty. Every read
   goes through conds()/normConds(), which also understands the old scalar shape,
   so a backup imported from an older build renders correctly before it has been
   migrated. */
const CONDS=['working','damaged','repair'];
const CONDN={working:'working',damaged:'damaged',repair:'needs repair'};
/* Make the three counts add up to q. A surplus of units is "fine until told
   otherwise", so it lands in working; a shortfall is trimmed working → repair →
   damaged, because damage is the fact you least want silently dropped. */
function fitConds(c,q){
  c=c||{};
  const o={working:Math.max(0,parseInt(c.working,10)||0),
           damaged:Math.max(0,parseInt(c.damaged,10)||0),
           repair:Math.max(0,parseInt(c.repair,10)||0)};
  let d=q-(o.working+o.damaged+o.repair);
  if(d>0){o.working+=d;return o}
  for(const k of ['working','repair','damaged']){
    if(d>=0)break;
    const t=Math.min(o[k],-d);o[k]-=t;d+=t;
  }
  return o;
}
/* Tolerant read of any record: new shape, old scalar `cond`, or neither. */
function normConds(u){
  u=u||{};const q=qtyU(u);
  if(u.conds&&typeof u.conds==='object')return fitConds(u.conds,q);
  const k=CONDS.indexOf(u.cond)>=0?u.cond:'working';
  const o={working:0,damaged:0,repair:0};o[k]=q;return o;
}
const conds=id=>normConds(U(id));
/* Which conditions are actually present, in CONDS order. */
const condMix=id=>{const c=conds(id);return CONDS.filter(k=>c[k]>0)};

/* MANDATORY migration (docs/update.md §Issue 4). Real records on the phone are
   in the old shape; without this, opening the new build would read every stored
   condition as "working" and the user's damaged/repair marks would be gone.

   Converts in place and returns how many records changed:
   - old scalar `cond` → the whole qty in that bucket, then `cond` is deleted so
     there is exactly one source of truth,
   - an existing `conds` whose counts drifted from qty is re-fitted,
   - records that are neither owned nor carry any condition are left alone, so a
     buy-list entry does not grow fields it has no use for.

   Idempotent: a second pass finds no `cond`, and fitConds() of already-correct
   counts is the identity, so nothing changes and it returns 0. Lossless: qty,
   st, tested, loc, project, notes and fav are never touched, and the total
   number of units is preserved by construction. */
function migrateUnits(map){
  let n=0;
  for(const id in map){
    const r=map[id];
    if(!r||typeof r!=='object')continue;
    const legacy=('cond' in r);
    if(!legacy&&!r.conds&&r.st!=='have')continue;
    const c=normConds(r),cur=r.conds;
    if(legacy)delete r.cond;
    if(!cur||cur.working!==c.working||cur.damaged!==c.damaged||cur.repair!==c.repair){r.conds=c;n++}
    else if(legacy)n++;
  }
  return n;
}
/* price()/money() removed in v3 - cost tracking was dropped in v2 and both
   helpers had no remaining call sites. The catalog's `p` field is left in
   place (harmless unused data; stripping it would touch ~250 rows). */
const esc=s=>String(s==null?'':s).replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
/* Normalising here rather than only in boot() means data that arrives after
   boot — an imported backup (io.js writes S.u straight from the file, then
   save()s) — is converted before it is ever persisted. Cheap: one pass over the
   tracked items, which is tens of keys, not the 253-row catalogue. */
const save=async()=>{migrateUnits(S.u);await dbSet('u',S.u);await dbSet('custom',S.custom);await dbSet('proj',S.projects)};

function applyTheme(t){document.documentElement.dataset.theme=t==='system'?'':t}
async function setTheme(t){S.theme=t;applyTheme(t);await dbSet('theme',t)}

/* ---- Issue 5: settings ------------------------------------------------
   Flat dbGet/dbSet keys, the same pattern 'theme', 'onboarded' and 'catview'
   already use — no nested settings blob to migrate later. Defaults here are
   what the app did before the setting existed, so an install that has never
   opened Settings behaves exactly as it used to. */
const SET={vibrate:true,addas:'have',pinned:4};
const PINCOUNTS=[4,6,8];
function normSet(k,v){
  if(k==='vibrate')return v===null||v===undefined?true:!!v;
  if(k==='addas')return v==='need'?'need':'have';
  if(k==='pinned')return PINCOUNTS.indexOf(+v)>=0?+v:4;
  return v;
}
async function setSetting(k,v){
  v=normSet(k,v);if(SET[k]===v)return v;
  SET[k]=v;await dbSet(k,k==='vibrate'?(v?1:0):v);return v;
}
/* DESIGN-SYSTEM §Haptics — data changes only, never navigation, and now only
   when the user has left vibration on. Gated in the one place every caller goes
   through, so no call site can forget the setting. */
function haptic(){
  if(!SET.vibrate)return;
  try{if(window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins.Haptics)
  Capacitor.Plugins.Haptics.impact({style:'Light'})}catch(e){}}
/* Hold the cold-start brand animation on screen for a beat even when boot()
   finishes instantly, so it reads as an intro rather than a flicker - then
   fade it and take it out of the layer stack entirely. */
const INTRO_MIN_MS=900;
const introStart=Date.now();
function dismissIntro(){
  const el=$('#intro');if(!el||el.classList.contains('gone'))return;
  const wait=Math.max(0,INTRO_MIN_MS-(Date.now()-introStart));
  setTimeout(()=>{
    el.classList.add('gone');
    setTimeout(()=>el.classList.add('hidden'),420);
  },wait);
}
async function boot(){
  await dbOpen();
  const [theme,u,custom,projects,ix,onboarded,vibrate,addas,pinned]=await Promise.all(
    [dbGet('theme'),dbGet('u'),dbGet('custom'),dbGet('proj'),dbGet('pix'),dbGet('onboarded'),
     dbGet('vibrate'),dbGet('addas'),dbGet('pinned')]);
  S.theme=theme||'system';applyTheme(S.theme);
  SET.vibrate=normSet('vibrate',vibrate);
  SET.addas=normSet('addas',addas);
  SET.pinned=normSet('pinned',pinned);
  S.u=u||{};S.custom=custom||[];S.projects=projects||[];
  /* Issue 4 migration — runs before the first render, so nothing is ever drawn
     from the old shape, and the converted records are written straight back. */
  if(migrateUnits(S.u))await dbSet('u',S.u);
  render();
  if(window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins.SplashScreen)
    Capacitor.Plugins.SplashScreen.hide();
  dismissIntro();
  if(!onboarded){await dbSet('onboarded',1);showIntro()}
  for(const id of (ix||[])){const p=await dbGet('p:'+id);if(p)S.photos[id]=p}
  render();
}
async function setPhoto(id,d){S.photos[id]=d;await dbSet('p:'+id,d);await dbSet('pix',Object.keys(S.photos))}
async function delPhoto(id){delete S.photos[id];await dbDel('p:'+id);await dbSet('pix',Object.keys(S.photos))}
let tt;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),1700)}

function sums(){
  let buyN=0,have=0,bad=0,untested=0;
  for(const it of all()){
    const s=st(it.i);
    if(s==='need')buyN++;
    /* `bad` counts damaged/repair UNITS, not items. Before per-condition counts
       a part with five damaged units contributed 1 here, so Home under-reported
       exactly the thing it was there to warn about. `untested` stays a count of
       items — tested is still one flag for the whole part. */
    if(s==='have'){have++;const u=U(it.i),c=normConds(u);
      bad+=c.damaged+c.repair;
      if(!u.tested)untested++}
  }
  return{buyN,have,bad,untested};
}

