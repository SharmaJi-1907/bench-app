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
const qty=id=>{const u=U(id);return u.qty!==undefined?u.qty:1};
/* price()/money() removed in v3 - cost tracking was dropped in v2 and both
   helpers had no remaining call sites. The catalog's `p` field is left in
   place (harmless unused data; stripping it would touch ~250 rows). */
const esc=s=>String(s==null?'':s).replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
const save=async()=>{await dbSet('u',S.u);await dbSet('custom',S.custom);await dbSet('proj',S.projects)};

function applyTheme(t){document.documentElement.dataset.theme=t==='system'?'':t}
async function setTheme(t){S.theme=t;applyTheme(t);await dbSet('theme',t)}
function haptic(){try{if(window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins.Haptics)
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
  const [theme,u,custom,projects,ix,onboarded]=await Promise.all(
    [dbGet('theme'),dbGet('u'),dbGet('custom'),dbGet('proj'),dbGet('pix'),dbGet('onboarded')]);
  S.theme=theme||'system';applyTheme(S.theme);
  S.u=u||{};S.custom=custom||[];S.projects=projects||[];
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
    if(s==='have'){have++;const u=U(it.i);
      if(u.cond==='damaged'||u.cond==='repair')bad++;
      if(!u.tested)untested++}
  }
  return{buyN,have,bad,untested};
}

