function normName(s){return s.toLowerCase().replace(/\.[a-z0-9]+$/,'').replace(/[^a-z0-9]/g,'')}
function shrink(file){return new Promise(res=>{
  const rd=new FileReader();
  rd.onload=()=>{const im=new Image();
    im.onload=()=>{let w=im.width,hh=im.height;const m=900;
      if(w>m||hh>m){const r=Math.min(m/w,m/hh);w=Math.round(w*r);hh=Math.round(hh*r)}
      const c=document.createElement('canvas');c.width=w;c.height=hh;
      c.getContext('2d').drawImage(im,0,0,w,hh);res(c.toDataURL('image/jpeg',.78))};
    im.onerror=()=>res(null);im.src=rd.result};
  rd.onerror=()=>res(null);rd.readAsDataURL(file)})}
async function bulkPhotos(e){
  const files=Array.from(e.target.files||[]);e.target.value='';
  if(!files.length)return;
  toast('Matching '+files.length+' photos…');
  const idx=all().map(it=>({i:it.i,k:normName(it.n)}));
  let hit=0,missNames=[];
  for(const f of files){
    const k=normName(f.name);
    let m=idx.find(x=>x.k===k)||idx.find(x=>x.k.indexOf(k)>=0&&k.length>3)||idx.find(x=>k.indexOf(x.k)>=0&&x.k.length>3);
    if(!m){missNames.push(f.name);continue}
    const d=await shrink(f);
    if(d){await setPhoto(m.i,d);hit++}
  }
  toast(hit+' photo'+(hit===1?'':'s')+' added'+(missNames.length?' · '+missNames.length+' unmatched':''));
  if(missNames.length)alert('These file names did not match any component:\n\n'+missNames.slice(0,15).join('\n')+(missNames.length>15?'\n…':'')+'\n\nRename them to the exact component name and try again, or add those photos one by one.');
  openMore();
}
async function doExport(){
  const d={v:2,at:new Date().toISOString(),u:S.u,custom:S.custom,photos:S.photos};
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([JSON.stringify(d)],{type:'application/json'}));
  a.download='my-components-'+new Date().toISOString().slice(0,10)+'.json';a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),3000);toast('Backup saved');
}
function doImport(e){
  const f=e.target.files&&e.target.files[0];e.target.value='';if(!f)return;
  const r=new FileReader();
  r.onload=async()=>{try{const d=JSON.parse(r.result);if(!d.u&&!d.user)throw 0;
    S.u=d.u||d.user||{};S.custom=d.custom||[];S.photos=d.photos||{};
    await save();for(const k in S.photos)await dbSet('p:'+k,S.photos[k]);
    await dbSet('pix',Object.keys(S.photos));close();toast('Backup restored')}
    catch(err){toast('That file is not a backup')}};
  r.readAsText(f);
}
function copyList(){
  const l=all().filter(x=>st(x.i)==='need');
  const t='MY SHOPPING LIST\n\n'+l.map(x=>`${x.n} — ${qty(x.i)} pcs`).join('\n');
  if(navigator.clipboard&&navigator.clipboard.writeText)
    navigator.clipboard.writeText(t).then(()=>toast('Copied')).catch(()=>fb(t));
  else fb(t);
}
function fb(t){const a=document.createElement('textarea');a.value=t;a.style.position='fixed';a.style.opacity=0;
  document.body.appendChild(a);a.select();try{document.execCommand('copy');toast('Copied')}catch(e){toast('Copy not available')}
  document.body.removeChild(a)}
