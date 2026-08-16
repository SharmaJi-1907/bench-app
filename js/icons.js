const SYM={
 res:'<path d="M2 16h8l3-8 5 16 5-16 5 16 3-8h8"/>',
 pot:'<path d="M2 22h8l3-8 5 16 5-16 5 16 3-8h8"/><path d="M24 2v8"/><path d="M20 10h8l-4 4z" fill="currentColor"/>',
 capc:'<path d="M2 16h16M30 16h16"/><path d="M18 4v24M30 4v24"/>',
 cape:'<path d="M2 16h16M30 16h16"/><path d="M18 4v24"/><path d="M30 6c-4 3-4 17 0 20"/><path d="M8 8h6M11 5v6"/>',
 ind:'<path d="M2 20h6"/><path d="M8 20a5 5 0 0110 0M18 20a5 5 0 0110 0M28 20a5 5 0 0110 0"/><path d="M38 20h8"/>',
 diode:'<path d="M2 16h14M32 16h14"/><path d="M16 6v20l16-10z"/><path d="M32 6v20"/>',
 zener:'<path d="M2 16h14M32 16h14"/><path d="M16 6v20l16-10z"/><path d="M32 6v20M32 6h-5M32 26h5"/>',
 led:'<path d="M2 16h14M32 16h14"/><path d="M16 6v20l16-10z"/><path d="M32 6v20"/><path d="M34 8l6-5M38 12l6-5"/>',
 bjt:'<circle cx="26" cy="16" r="13"/><path d="M6 16h9M15 8v16M15 12l10-6M15 20l10 6"/>',
 fet:'<circle cx="26" cy="16" r="13"/><path d="M6 16h9M15 8v16M19 9v14M19 12h9M19 20h9M28 6v20"/>',
 dip8:'<rect x="9" y="5" width="30" height="22" rx="2"/><path d="M13 5V2M19 5V2M25 5V2M31 5V2M13 27v3M19 27v3M25 27v3M31 27v3"/><circle cx="14" cy="10" r="1.6"/>',
 dip14:'<rect x="5" y="5" width="38" height="22" rx="2"/><path d="M9 5V2M15 5V2M21 5V2M27 5V2M33 5V2M39 5V2M9 27v3M15 27v3M21 27v3M27 27v3M33 27v3M39 27v3"/><circle cx="10" cy="10" r="1.6"/>',
 opamp:'<path d="M14 3v26l22-13z"/><path d="M2 10h12M2 22h12M36 16h10"/><path d="M17 11h4M17 20h4M19 18v4"/>',
 to220:'<rect x="14" y="4" width="20" height="14" rx="1"/><circle cx="24" cy="8" r="2"/><path d="M14 18h20v4H14z"/><path d="M19 22v8M24 22v8M29 22v8"/>',
 board:'<rect x="4" y="4" width="40" height="24" rx="3"/><rect x="16" y="11" width="16" height="10" rx="1"/><path d="M8 8h4M8 12h4M8 16h4M8 20h4M8 24h4M36 8h4M36 12h4M36 16h4M36 20h4M36 24h4"/>',
 mcu:'<rect x="10" y="6" width="28" height="20" rx="2"/><rect x="17" y="12" width="14" height="8" rx="1"/><path d="M10 10H4M10 16H4M10 22H4M38 10h6M38 16h6M38 22h6"/>',
 sensor:'<rect x="8" y="8" width="20" height="16" rx="2"/><circle cx="18" cy="16" r="4"/><path d="M28 16h6M34 10c5 4 5 8 0 12M39 6c7 6 7 14 0 20"/>',
 module:'<rect x="5" y="6" width="38" height="20" rx="2"/><path d="M11 6v20M11 11h26M11 16h26M11 21h26"/>',
 relay:'<rect x="6" y="7" width="22" height="18" rx="2"/><path d="M10 12h14M10 20h14"/><path d="M28 12h6l8-5M28 20h14"/>',
 motor:'<circle cx="20" cy="16" r="12"/><path d="M14 20l6-12 6 12"/><path d="M17 16h6"/><path d="M32 13h10M32 19h10"/>',
 disp:'<rect x="6" y="5" width="36" height="22" rx="2"/><path d="M13 11h8M13 16h14M13 21h10"/>',
 seg:'<path d="M16 6h14M14 8v8M32 8v8M16 18h14M14 20v8M32 20v8M16 30h14"/>',
 xtal:'<path d="M2 16h10M36 16h10"/><path d="M12 8v16M36 8v16"/><rect x="17" y="7" width="14" height="18" rx="1"/>',
 batt:'<path d="M2 16h8M38 16h8"/><path d="M10 8v16M18 11v10M26 8v16M34 11v10"/>',
 sw:'<circle cx="10" cy="20" r="2"/><circle cx="38" cy="20" r="2"/><path d="M2 20h6M40 20h6"/><path d="M11 19l24-11"/>',
 buzz:'<circle cx="20" cy="16" r="11"/><circle cx="20" cy="16" r="3"/><path d="M34 10c4 4 4 8 0 12M39 6c7 6 7 14 0 20"/>',
 xfmr:'<path d="M14 4v24M34 4v24"/><path d="M14 8a5 5 0 000 8M14 16a5 5 0 000 8"/><path d="M34 8a5 5 0 010 8M34 16a5 5 0 010 8"/><path d="M22 4v24M26 4v24"/>',
 bread:'<rect x="4" y="4" width="40" height="24" rx="2"/><path d="M4 14h40M4 18h40"/><path d="M10 6v6M16 6v6M22 6v6M28 6v6M34 6v6M10 20v6M16 20v6M22 20v6M28 20v6M34 20v6"/>',
 wire:'<path d="M2 22c8 0 8-12 16-12s8 12 16 12 8-12 12-12"/><circle cx="4" cy="22" r="2"/><circle cx="44" cy="10" r="2"/>',
 conn:'<rect x="6" y="9" width="30" height="14" rx="2"/><path d="M36 12h8M36 20h8"/><path d="M12 9v14M18 9v14M24 9v14M30 9v14"/>',
 tool:'<path d="M30 4a8 8 0 00-9 12L6 31l4 4 15-15a8 8 0 0011-11l-6 6-5-1-1-5z"/>',
 meter:'<rect x="7" y="4" width="34" height="24" rx="3"/><rect x="12" y="9" width="24" height="8" rx="1"/><circle cx="18" cy="23" r="2"/><circle cx="30" cy="23" r="2"/>',
 iron:'<path d="M4 28l10-10"/><path d="M14 18l16-14 8 8-14 16z"/><path d="M20 12l8 8"/>',
 scope:'<rect x="4" y="5" width="40" height="22" rx="3"/><path d="M9 18c4 0 4-7 8-7s4 12 8 12 4-9 7-9 3 4 6 4"/>',
 psu:'<rect x="4" y="6" width="40" height="20" rx="3"/><path d="M11 12h12v8H11z"/><circle cx="32" cy="16" r="4"/>',
 ic:'<rect x="9" y="5" width="30" height="22" rx="2"/><path d="M15 5V2M23 5V2M31 5V2M15 27v3M23 27v3M31 27v3"/><circle cx="14" cy="10" r="1.6"/>'};
/* many package keys (dip16, modbuck, …) have no schematic symbol of their own —
   fall back to the nearest family symbol rather than the generic IC block */
const _symKey=k=>SYM[k]?k:(/^mod/.test(k)?'module':(/^dip/.test(k)?'dip14':'ic'));
const sym=(k,c)=>'<svg class="'+(c===''?'':'sym')+'" viewBox="0 0 48 32">'+SYM[_symKey(k)]+'</svg>';

/* ================= default component pictures =================
   Draws a realistic package picture for every part, from its own
   symbol key + name. No network, no stored bytes. Used wherever
   the user has not added their own photo. */
const AC={blk:'#282C31',blk2:'#3C424A',ink:'#0E1114',pin:'#BAC1C9',pin2:'#8D949D',
 sil:'#C7CDD4',sil2:'#9AA2AB',gold:'#D2AC3E',grn:'#1E6B45',grn2:'#2A8557',
 blu:'#1F4E9C',blu2:'#2E6FB8',tea:'#00979D',red:'#D2402F',wht:'#EEF0F3',
 ylw:'#E8B31E',beige:'#D8C3A0',cop:'#B87333',glass:'#0F1418',pad:'#E4E7EB'};

const _r=(x,y,w,h,f,rx,op)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx||0}" fill="${f}"${op!=null?` fill-opacity="${op}"`:''}/>`;
const _c=(x,y,r,f,op)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"${op!=null?` fill-opacity="${op}"`:''}/>`;
const _e=(x,y,rx,ry,f,op)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}"${op!=null?` fill-opacity="${op}"`:''}/>`;
const _p=(d,f,s,w)=>`<path d="${d}"${f?` fill="${f}"`:' fill="none"'}${s?` stroke="${s}" stroke-width="${w||2}" stroke-linecap="round"`:''}/>`;
const _tx=(s,x,y,sz,f,a)=>s?`<text x="${x}" y="${y}" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="${sz}" font-weight="700" fill="${f}" text-anchor="${a||'middle'}" letter-spacing=".4">${esc(s)}</text>`:'';
const _legs=(xs,y1,y2,w,c)=>xs.map(x=>_r(x-(w||4.4)/2,y1,w||4.4,y2-y1,c||AC.pin,1)).join('');
const _gloss=(x,y,w,h)=>_r(x,y,w,h,'#FFFFFF',3,.07);
const _fit=(t,w,max)=>Math.max(8,Math.min(max||20,w/(Math.max(1,t.length)*.66)));
/* a run of identical pads / fins / pins */
const _row=(x,y,n,step,w,h,c)=>[...Array(n)].map((_,i)=>_r(x+i*step,y,w,h,c||AC.gold,1)).join('');
const _col=(x,y,n,step,w,h,c)=>[...Array(n)].map((_,i)=>_r(x,y+i*step,w,h,c||AC.gold,1)).join('');

/* pick a printable part marking out of the name: "NE555 timer" -> NE555 */
function _mark(n){
  const bad=/^(\d+(\.\d+)?)(v|w|a|ma|mm|k|m|f|uf|nf|pf|awg|mhz|khz|hz|x|pcs)?$/i;
  for(const raw of String(n).split(/[\s,\/]+/)){
    const w=raw.replace(/[()]/g,'');
    if(w.length<2||w.length>11)continue;
    if(!/\d/.test(w))continue;
    if(bad.test(w))continue;
    return w.toUpperCase();
  }
  return '';
}
/* the marking actually printed on a chip / module: "7400 quad NAND" -> 7400,
   "74HC595 shift register" -> 74HC595, "L293D motor driver IC" -> L293D.
   _mark() alone throws away bare-number part codes like 7400, which is why
   ten 74-series chips used to render with no marking at all. */
function _partNo(n){
  const t=String(n).replace(/[()+]/g,'').split(/[\s,\/]+/).filter(w=>w.length>2&&w.length<12);
  for(const w of t)if(/^(74[A-Z]{0,4}\d{2,4}[A-Z]?|CD4\d{3}[A-Z]?|[A-Z]{2,4}\d{2,5}[A-Z]{0,3})$/i.test(w))return w.toUpperCase();
  for(const w of t)if(/\d/.test(w)&&/[A-Za-z]/.test(w))return w.toUpperCase();
  for(const w of t)if(/^\d{4,5}$/.test(w))return w;
  return _mark(n);
}
/* real chips print long codes on two lines — so do we, it doubles the
   legible size of an 8-character marking at thumbnail scale */
function _lab2(t){
  if(t.length<7)return [t];
  const m=t.match(/^([A-Za-z]{2,})(\d.*)$/);
  if(m&&m[2].length>1)return [m[1].toUpperCase(),m[2].toUpperCase()];
  const h=Math.ceil(t.length/2);
  return [t.slice(0,h),t.slice(h)];
}
/* module boards: prefer the part code, else a hand-picked short name */
const _MODLAB=[[/level shift|level convert/i,'LEVEL'],[/sd card/i,'SD CARD'],[/st-?link/i,'ST-LINK'],
 [/breadboard power/i,'POWER'],[/\bBMS\b/i,'BMS'],[/433\s?-?MHz/i,'433MHZ'],[/A4988/i,'A4988'],
 [/load cell/i,'HX711']];
function _modLab(n){
  for(const p of _MODLAB)if(p[0].test(n))return p[1];
  return _partNo(n)||String(n).split(/[\s\/]+/)[0].toUpperCase().slice(0,9);
}
function _boardLab(n){
  const P=['ESP32-CAM','ESP32-S3','ESP32-C3','ESP32-C6','ESP8266','ESP32','Tang Nano','Zero 2','Pico 2','Pico',
   'Blue Pill','Black Pill','Nucleo','STM32','Teensy','Uno','Nano','Mega','EPM240','nRF52840','CH32V003',
   'AT89S52','ATtiny85','ATmega328P','Raspberry','Arduino'];
  for(const k of P){if(new RegExp(k.replace(/[-]/g,'\\-'),'i').test(n))return k.toUpperCase();}
  return (_mark(n)||String(n).split(' ')[0]).toUpperCase().slice(0,9);
}
function _pins(it){
  const hay=(it.d||'')+' '+it.n;
  let m=hay.match(/(?:DIP|SOIC|SOP|PDIP)[\s-]?(\d{1,2})/i)||hay.match(/(\d{1,2})[\s-]?pin/i);
  if(m)return Math.max(4,Math.min(40,+m[1]));
  const k=Object.keys(PINS).filter(k=>it.n.toUpperCase().indexOf(k.toUpperCase())>=0)[0];
  if(k&&PINS[k].length>3)return PINS[k].length;
  return it.s==='dip8'||it.s==='opamp'?8:14;
}
function _ohms(n){
  const m=String(n).match(/(\d+(?:\.\d+)?)\s*(k|m)?\s*(?:ohm|Ω|R\b)/i);
  if(!m)return null;
  let v=parseFloat(m[1]);
  if(/k/i.test(m[2]||''))v*=1e3; if(/m/i.test(m[2]||''))v*=1e6;
  return v;
}
const _BAND=['#17191C','#6B3A16','#C0392B','#DE7B1E','#E3C31C','#2E8B45','#2A5FB8','#7B4FA8','#8C9196','#F2F4F6'];
function _bands(v){
  if(v==null||v<=0)return [_BAND[1],_BAND[0],_BAND[3],AC.gold];
  const e=Math.floor(Math.log10(v));
  let mant=Math.round(v/Math.pow(10,e-1));
  if(mant>99){mant=Math.round(mant/10)}
  const d1=Math.floor(mant/10),d2=mant%10,mul=Math.max(0,Math.min(9,e-1));
  return [_BAND[d1],_BAND[d2],_BAND[mul],AC.gold];
}
function _ledCol(n){
  const s=n.toLowerCase();
  if(/\bir\b|infrared|tsop/.test(s))return ['#3C2A57','#5A4080'];
  if(/rgb/.test(s))return ['#C8CDD4','#E4E8EC'];
  if(/ws2812|neopixel/.test(s))return ['#E9ECEF','#FFFFFF'];
  if(/laser/.test(s))return ['#C0392B','#E4574A'];
  if(/green/.test(s))return ['#2FA85A','#57D183'];
  if(/blue/.test(s))return ['#2E6FB8','#5C9BE0'];
  if(/white/.test(s))return ['#DFE3E8','#FFFFFF'];
  if(/yellow/.test(s))return ['#E0B31C','#F3D45A'];
  return ['#CE3A2C','#EE6A5A'];
}

/* ---- packages ---- */
const PKG={};

/* one DIP drawing, sized by real pin count. Body length and the number of
   legs down each side are the genuine visual difference between a DIP-8 and
   a DIP-40; the 0.6" wide-body parts (DIP-40) also get a taller body. */
function _dipArt(it,pins,wide){
  const per=Math.max(2,Math.round(pins/2));
  const bw=Math.min(178,76+per*7),bh=wide?72:54;
  const x=(200-bw)/2,y=(140-bh)/2,cy=y+bh/2,step=(bw-14)/per;
  let p='';
  for(let i=0;i<per;i++){const px=x+7+step*(i+.5);
    p+=_r(px-2.6,y-14,5.2,15,AC.pin,1)+_r(px-2.6,y+bh-1,5.2,15,AC.pin,1);}
  const one=_partNo(it.n),two=_lab2(one);
  const f1=_fit(one,bw-22,28),f2=two.length>1?_fit('x'.repeat(two.reduce((a,s)=>Math.max(a,s.length),0)),bw-22,24):0;
  const ln=f2>f1?two:[one],f=f2>f1?f2:f1;
  const tx=ln.length>1
   ?_tx(ln[0],100,cy-3,f,AC.wht)+_tx(ln[1],100,cy+f*.92,f,AC.wht)
   :_tx(ln[0],100,cy+f*.36,f,AC.wht);
  return p+_r(x,y,bw,bh,AC.blk,4)+_gloss(x+5,y+4,bw-10,10)
   +_p(`M ${x} ${cy-10} A 10 10 0 0 0 ${x} ${cy+10} Z`,AC.ink)
   +_c(x+15,y+bh-12,3,AC.ink)+tx;
}
PKG.dip=(it)=>_dipArt(it,_pins(it),_pins(it)>=32);
PKG.dip14=(it)=>_dipArt(it,14);
PKG.dip16=(it)=>_dipArt(it,16);
PKG.dip18=(it)=>_dipArt(it,18);
PKG.dip20=(it)=>_dipArt(it,20);
PKG.dip24=(it)=>_dipArt(it,24);
PKG.dip28=(it)=>_dipArt(it,28);
PKG.dip40=(it)=>_dipArt(it,40,1);
PKG.to92=(it)=>{
  const lab=_mark(it.n);
  return _legs([82,100,118],96,130)
   +_p('M 68 98 L 68 64 A 32 27 0 0 1 132 64 L 132 98 Z',AC.blk)
   +_r(70,44,18,54,'#FFFFFF',8,.06)
   +_tx(lab,100,80,_fit(lab,54,16),'#D8DCE1');
};
PKG.to220=(it)=>{
  const lab=_mark(it.n);
  return _legs([80,100,120],92,132)
   +_r(66,20,68,32,AC.sil,3)+_c(100,33,6.5,AC.pad)+_r(66,20,68,8,'#FFFFFF',3,.35)
   +_r(66,48,68,46,AC.blk,3)+_gloss(70,52,60,9)
   +_tx(lab,100,76,_fit(lab,58,17),'#DDE1E6');
};
PKG.res=(it)=>{
  const v=_ohms(it.n),b=_bands(v);
  if(v!=null&&v<1)return _legs([70,130],92,130,5)+_r(56,42,88,52,'#EDEFF1',4)+_tx('R'+v,100,74,13,'#4A5058');
  return _r(10,66,180,5,AC.pin,2)
   +_r(56,50,88,38,AC.beige,18)+_gloss(62,54,76,10)
   +b.map((c,i)=>_r([66,80,94,124][i],50,i===3?6:8,38,c,1)).join('');
};
PKG.pot=()=>_legs([80,100,120],104,132)
 +_r(94,14,12,24,AC.sil2,3)
 +_c(100,68,38,'#2D6FA8')+_c(100,68,30,'#3E85C0')+_c(100,68,9,AC.sil)
 +_r(62,96,76,12,AC.blk,2);
PKG.capc=(it)=>{
  const lab=_mark(it.n);
  return _legs([86,114],86,132)
   +_e(100,56,36,34,'#2C63A8')+_e(100,52,30,26,'#3C79C2')
   +_tx(lab||'104',100,60,12,'#E8EDF4');
};
PKG.cape=(it)=>{
  const lab=_mark(it.n);
  return _legs([88,112],108,134)
   +_r(62,26,76,84,'#122748',10)+_r(62,26,20,84,'#93A2B8',0)
   +[46,62,78,94].map(y=>_r(68,y,8,3,'#4A5568',1)).join('')
   +_e(100,28,38,10,'#1C355C')+_p('M 72 28 H 128',null,'#33507E',2)
   +_tx(lab,112,74,11,'#CFE0F5');
};
PKG.ind=(it)=>{
  if(/bead|ferrite/i.test(it.n))return _r(10,66,180,5,AC.pin,2)+_r(66,46,68,44,'#3A4048',8)+_gloss(70,50,60,10);
  return _c(100,70,44,'#2E3238')+_c(100,70,20,'#F1F3F6')
   +[0,1,2,3,4,5,6,7].map(i=>{const a=i*Math.PI/4,x=100+Math.cos(a)*32,y=70+Math.sin(a)*32;
     return _r(x-5,y-11,10,22,AC.cop,4);}).join('');
};
PKG.xtal=(it)=>{
  const lab=(it.n.match(/([\d.]+\s?[MK]?Hz)/i)||[])[1]||_mark(it.n);
  return _legs([84,116],92,132)
   +_r(60,42,80,50,AC.sil,24)+_r(60,42,80,16,'#FFFFFF',24,.45)+_r(64,46,72,42,AC.sil2,22,.35)
   +_tx(lab?lab.replace(/\s/g,''):'',100,74,_fit(lab||'',62,15),'#3B4148');
};
PKG.diode=(it)=>{
  const lab=_mark(it.n);
  return _r(10,66,180,5,AC.pin,2)
   +_r(62,50,76,38,'#1C1F24',5)+_gloss(66,54,68,9)
   +_r(122,50,8,38,AC.sil,1)
   +_tx(lab,96,74,_fit(lab,52,14),'#D6DAE0');
};
PKG.zener=PKG.diode;
PKG.led=(it)=>{
  const [c1,c2]=_ledCol(it.n);
  if(/ws2812|strip/i.test(it.n))return _r(14,52,172,40,'#16181B',5)
    +[0,1,2].map(i=>_r(38+i*52,60,26,24,'#F2F4F7',3)+_c(51+i*52,72,7,'#DDE1E6')).join('')
    +[0,1,2].map(i=>_r(38+i*52,84,26,3,AC.gold,1)).join('');
  return _legs([88,132],96,124)+_legs([112,132],96,136)
   +_p('M 76 98 L 76 62 A 24 24 0 0 1 124 62 L 124 98 Z',c1)
   +_p('M 82 92 L 82 62 A 18 18 0 0 1 100 44 L 100 92 Z',c2,null,0)
   +_r(70,92,60,10,c1,3)+_r(70,92,60,10,'#000000',3,.18)
   +_c(92,64,6,'#FFFFFF',.45);
};
PKG.bjt=(it)=>/to-?220|tip|power/i.test((it.d||'')+it.n)?PKG.to220(it):PKG.to92(it);
PKG.fet=(it)=>/2N7000|BF245|J201|to-?92/i.test((it.d||'')+it.n)?PKG.to92(it):PKG.to220(it);

PKG.board=(it)=>{
  const s=it.n.toLowerCase();
  if(/perfboard|zero pcb|vero/.test(s)){
    let h='';for(let r=0;r<7;r++)for(let c=0;c<15;c++)h+=_c(26+c*11,32+r*12,2.6,'#0C3D26');
    return _r(14,20,172,96,'#1B6B44',4)+h;
  }
  if(/enclosure|box/.test(s))return _r(20,28,160,86,'#3A4046',8)+_r(20,28,160,14,'#4A5158',8)
   +[0,1].map(i=>_c(38+i*124,102,5,'#2A2F34')).join('')+_r(70,60,60,26,'#2A2F34',3);
  const dark=/esp|teensy|tang|fpga|cpld|nucleo/.test(s);
  const col=/arduino|uno|nano|mega/.test(s)?AC.tea:(/raspberry|pico/.test(s)?'#8C1F45':(dark?'#1A1D22':AC.grn));
  const lab=_boardLab(it.n);
  return _r(14,26,172,92,col,6)+_gloss(20,30,160,10)
   +_r(24,28,152,7,AC.blk,2)+[...Array(11)].map((_,i)=>_r(28+i*13,29,7,5,AC.gold,1)).join('')
   +_r(24,109,152,7,AC.blk,2)+[...Array(11)].map((_,i)=>_r(28+i*13,110,7,5,AC.gold,1)).join('')
   +_r(76,52,62,40,AC.blk,3)+_c(84,60,2.6,'#4A5058')
   +_r(16,48,26,26,AC.sil,3)
   +_c(158,52,5,'#2FA85A')+_c(158,68,5,'#D2402F')
   +_tx(lab,100,104,_fit(lab,120,15),'#F2F5F8');
};
PKG.mcu=(it)=>{
  const lab=_boardLab(it.n);
  const pico=/pico/i.test(it.n);
  return _r(30,18,140,104,pico?'#8C1F45':'#1A1D22',6)+_gloss(36,22,128,10)
   +_r(32,20,10,100,AC.blk2,2)+[...Array(9)].map((_,i)=>_r(33,26+i*11,8,7,AC.gold,1)).join('')
   +_r(158,20,10,100,AC.blk2,2)+[...Array(9)].map((_,i)=>_r(159,26+i*11,8,7,AC.gold,1)).join('')
   +_r(62,30,76,44,AC.sil,3)+_r(62,30,76,10,'#FFFFFF',3,.3)
   +_r(84,80,32,16,AC.sil2,2)
   +_tx(lab,100,110,_fit(lab,96,15),'#EDF0F3');
};
PKG.module=(it)=>{
  const lab=_mark(it.n)||it.n.split(' ')[0].toUpperCase();
  return _r(28,32,144,74,AC.blu,5)+_gloss(34,36,132,9)
   +_r(34,96,132,8,AC.blk,2)+[...Array(9)].map((_,i)=>_r(38+i*15,97,8,6,AC.gold,1)).join('')
   +_r(70,44,60,34,AC.blk,3)+_c(77,51,2.4,'#4A5058')
   +_c(44,50,5,AC.sil2)+_c(44,70,5,AC.sil2)
   +_tx(lab,100,90,_fit(lab,120,18),'#DCE6F5');
};

/* ---- module boards ----
   The old single `module` drawing covered 37 very different boards. These
   split it by what the real board looks like: outline, where the header
   sits, and the one big part that identifies it on sight (inductor, coin
   cell, card slot, heatsink, antenna, metal can, screw terminals…). */
const _bd=(c,x,y,w,h)=>{x=x==null?18:x;y=y==null?18:y;w=w==null?164:w;h=h==null?100:h;
  return _r(x,y,w,h,c,6)+_gloss(x+6,y+4,w-12,10);};
const _mlab=(it,x,y,w,max)=>{const l=_modLab(it.n);
  return _tx(l,x==null?100:x,y==null?112:y,_fit(l,w==null?150:w,max||26),AC.wht);};

/* buck / boost regulator board — big shielded inductor + electrolytic + trimpot */
PKG.modbuck=(it)=>_bd(AC.blu)
 +_r(30,30,48,44,AC.blk,6)+_r(34,34,40,10,'#FFFFFF',3,.1)
 +_c(112,52,22,AC.sil)+_c(112,52,15,AC.sil2)+_p('M 94 44 A 22 22 0 0 1 130 44',null,AC.pin2,3)
 +_r(142,30,32,30,AC.blu2,3)+_p('M 149 45 H 167',null,AC.wht,4)
 +_r(24,78,20,14,AC.gold,2)+_r(156,78,20,14,AC.gold,2)
 +_mlab(it);
/* Li-ion charger board — micro-USB shell on one edge, charge / done LEDs */
PKG.modchg=(it)=>_bd(AC.blu)
 +_p('M 12 46 L 22 36 H 58 V 78 H 22 L 12 68 Z',AC.sil)+_r(24,46,30,22,AC.pin2,2)
 +_r(74,32,56,36,AC.blk,3)+_c(81,39,2.6,'#4A5058')
 +_c(150,40,8,AC.red)+_c(150,66,8,AC.grn2)
 +_r(74,78,20,12,AC.gold,2)+_r(106,78,20,12,AC.gold,2)
 +_mlab(it);
/* battery protection board — narrow strip, row of MOSFETs, big B+/B- pads */
PKG.modbms=(it)=>_bd(AC.blk2,18,36,164,68)
 +_row(46,46,3,38,30,26,AC.sil2)+_row(46,46,3,38,30,7,AC.pin)
 +_r(24,46,16,26,AC.gold,2)+_r(160,46,16,26,AC.gold,2)
 +_mlab(it,100,97,130,26);
/* breadboard power module — barrel jack, USB, two long rails, jumpers */
PKG.modpsu=(it)=>_bd(AC.blu)
 +_r(18,24,164,10,AC.blk,2)+_row(24,25,11,14,8,8)
 +_r(18,76,164,10,AC.blk,2)+_row(24,77,11,14,8,8)
 +_c(42,58,16,AC.blk)+_c(42,58,7,AC.pin2)
 +_r(74,44,36,26,AC.sil,2)+_r(80,50,24,14,AC.pin2,1)
 +_r(126,44,24,26,AC.blu2,3)+_r(156,44,24,26,AC.blu2,3)
 +_mlab(it,100,110,150,26);
/* small I2C / SPI breakout — header along the top, one chip, two mount holes */
PKG.modbrk=(it)=>_bd(AC.blu,30,18,140,100)
 +_r(36,20,128,10,AC.blk,2)+_row(40,21,8,15,9,8)
 +_r(60,42,80,42,AC.blk,3)+_c(67,49,2.8,'#4A5058')
 +_r(38,44,12,9,AC.sil2,1)+_r(38,60,12,9,AC.sil2,1)
 +_c(154,36,4.5,AC.blk2)
 +_mlab(it,100,112,132,26);
/* IMU breakout — squarer board, header on the long edge, crystal, mount holes */
PKG.modimu=(it)=>_bd(AC.blu2,44,18,112,100)
 +_r(50,20,100,10,AC.blk,2)+_row(54,21,6,16,9,8)
 +_c(54,42,6,AC.blk2)+_c(146,42,6,AC.blk2)
 +_r(78,50,44,34,AC.blk,3)+_c(84,56,2.4,'#4A5058')
 +_r(58,62,14,10,AC.sil,2)
 +_mlab(it,100,112,102,22);
/* logic level shifter — pads out of both long edges, a row of tiny FETs */
PKG.modlvl=(it)=>_bd(AC.grn,34,32,132,74)
 +_r(40,34,120,10,AC.blk,2)+_row(44,35,4,29,18,8)
 +_r(40,94,120,10,AC.blk,2)+_row(44,95,4,29,18,8)
 +_row(50,52,4,28,18,20,AC.blk)
 +_mlab(it,100,89,110,24);
/* RTC board — the coin cell is the whole silhouette */
PKG.modrtc=(it)=>_bd(AC.blu)
 +_r(24,22,110,10,AC.blk,2)+_row(28,23,6,17,10,8)
 +_c(140,58,32,AC.sil)+_c(140,58,24,AC.pin2)+_tx('3V',140,64,17,'#3B4148')
 +_r(38,42,54,32,AC.blk,3)+_c(45,49,2.4,'#4A5058')
 +_mlab(it,100,112,150,26);
/* SD / microSD board — the card slot fills it */
PKG.modsd=(it)=>_bd(AC.blu)
 +_r(34,24,132,52,AC.sil,3)+_r(42,30,116,40,AC.pin2,2)+_p('M 42 30 H 58 L 42 46 Z',AC.blu)
 +_r(34,82,132,10,AC.blk,2)+_row(38,83,8,16,9,8)
 +_mlab(it,100,112,150,26);
/* USB dongle / programmer — USB-A shell hanging off one end */
PKG.modusb=(it)=>_r(12,44,52,42,AC.sil,3)+_r(18,50,40,30,AC.pin2,2)
 +_bd(AC.blu,62,26,120,84)
 +_r(86,40,60,34,AC.blk,3)+_c(93,47,2.4,'#4A5058')
 +_r(150,30,28,10,AC.blk,2)+_row(153,31,3,9,7,8)
 +_mlab(it,122,100,108,24);
/* big motor driver board — finned heatsink over screw terminal blocks */
PKG.moddrv=(it)=>_bd(AC.blu,16,20,168,98)
 +_row(48,24,6,17,11,42,AC.sil2)+_r(42,64,116,8,AC.pin2,2)
 +_r(18,78,46,30,AC.grn,3)+_c(30,93,7,AC.sil)+_c(52,93,7,AC.sil)
 +_r(136,78,46,30,AC.grn,3)+_c(148,93,7,AC.sil)+_c(170,93,7,AC.sil)
 +_mlab(it,100,101,68,24);
/* stepper driver stick — square heatsink pad, current trimpot, pads both sides */
PKG.modstep=(it)=>_bd(AC.grn,52,20,96,98)
 +_r(54,22,10,94,AC.blk,2)+_col(55,26,8,11,8,7)
 +_r(136,22,10,94,AC.blk,2)+_col(137,26,8,11,8,7)
 +_r(76,32,48,40,AC.sil,3)+_r(76,32,48,10,'#FFFFFF',3,.3)
 +_r(84,78,32,18,AC.blu2,2)+_p('M 92 87 H 108',null,AC.wht,3)
 +_mlab(it,100,112,68,22);
/* SPI radio module — meandering PCB antenna down one side */
PKG.modrf=(it)=>_bd(AC.blu,20,22,160,94)
 +_p('M 122 34 H 170 V 46 H 122 V 58 H 170 V 70 H 122 V 82 H 170',null,AC.gold,5)
 +_r(46,42,58,36,AC.blk,3)+_c(53,49,2.6,'#4A5058')
 +_r(24,30,12,10,AC.sil,1)+_r(24,80,12,10,AC.sil,1)
 +_r(42,86,50,10,AC.blk,2)+_row(45,87,4,12,8,8)
 +_mlab(it,100,110,150,24);
/* 433MHz ASK pair — small board with a wire whip antenna */
PKG.modrf433=(it)=>_bd(AC.grn,40,38,118,80)
 +_p('M 150 40 C 172 28 182 44 168 52 C 154 60 168 72 184 60',null,AC.cop,4)
 +_r(54,48,46,30,AC.blk,3)+_r(108,48,28,18,AC.sil,2)
 +_r(54,86,60,10,AC.blk,2)+_row(57,87,4,15,9,8)
 +_mlab(it,100,113,112,24);
/* shielded radio board (BT / GSM) — metal can plus castellated edge pads */
PKG.modbt=(it)=>_bd(AC.blu,32,22,136,96)
 +_col(34,28,6,10,8,7)+_col(158,28,6,10,8,7)
 +_r(52,30,96,52,AC.sil,3)+_r(52,30,96,12,'#FFFFFF',3,.3)+_r(60,48,80,26,AC.sil2,2,.55)
 +_c(56,92,5,AC.red)
 +_mlab(it,100,110,124,24);
/* GPS module — board plus its ceramic patch antenna on a short cable */
PKG.modgps=(it)=>_bd(AC.blu,10,52,112,64)
 +_r(16,56,100,10,AC.blk,2)+_row(20,57,5,20,12,8)
 +_r(34,74,64,18,AC.blk,3)
 +_p('M 120 72 C 144 72 134 42 156 42',null,AC.blk2,4)
 +_r(126,12,64,50,AC.wht,4)+_r(132,18,52,38,AC.pin,3)+_c(158,37,5,AC.blk2)
 +_mlab(it,66,110,104,24);
/* Ethernet module — RJ45 jack is unmistakable */
PKG.modeth=(it)=>_bd(AC.blu,16,20,168,98)
 +_r(24,26,84,62,AC.sil,4)+_r(32,34,68,40,AC.pin2,2)+_r(52,26,28,12,AC.sil,2)
 +_c(36,80,4.5,AC.grn2)+_c(96,80,4.5,AC.ylw)
 +_r(118,34,48,40,AC.blk,3)+_c(125,41,2.4,'#4A5058')
 +_r(170,32,10,56,AC.blk,2)+_col(171,36,5,10,8,7)
 +_mlab(it,100,110,140,24);
/* RFID reader — big rectangular spiral antenna trace */
PKG.modrfid=(it)=>_bd(AC.grn,16,18,168,100)
 +[0,1,2].map(i=>_p(`M ${30+i*7} ${30+i*7} H ${136-i*7} V ${88-i*7} H ${30+i*7} Z`,null,AC.cop,3)).join('')
 +_r(146,30,32,44,AC.blk,3)
 +_r(146,80,32,10,AC.blk,2)+_row(147,81,3,10,8,8)
 +_mlab(it,86,110,110,24);
/* microphone board — electret can with its mesh */
PKG.modmic=(it)=>_bd(AC.blu,34,22,132,96)
 +_c(70,54,26,AC.sil)+_c(70,54,19,AC.blk2)+_row(60,52,3,9,5,5,AC.pin2)
 +_r(108,36,46,32,AC.blk,3)+_c(115,43,2.4,'#4A5058')
 +_r(108,78,46,10,AC.blk,2)+_row(111,79,3,15,9,8)
 +_mlab(it,100,110,124,24);
/* optical sensor board — sensor window ringed by illumination LEDs */
PKG.modopt=(it)=>_bd(AC.blu,36,20,128,98)
 +_r(66,34,68,50,AC.blk,3)+_r(78,44,44,30,AC.wht,2)+_c(100,59,9,AC.blk2)
 +_c(50,34,7,AC.wht)+_c(150,34,7,AC.wht)+_c(50,80,7,AC.wht)+_c(150,80,7,AC.wht)
 +_mlab(it,100,110,120,24);
/* IR thermometer board — TO-39 metal can with a lens window */
PKG.modir=(it)=>_bd(AC.blu,40,22,120,96)
 +_c(100,54,30,AC.sil)+_c(100,54,23,AC.pin2)+_c(100,54,11,AC.glass)
 +_r(72,48,56,6,AC.sil2,2,.6)
 +_r(46,26,22,10,AC.blk,2)+_row(47,27,2,11,9,8)
 +_mlab(it,100,110,110,24);
/* load cell + amplifier — the aluminium beam is the giveaway */
PKG.modload=(it)=>_r(10,30,124,44,AC.pin2,5)+_r(10,30,124,13,'#FFFFFF',5,.4)
 +_c(34,52,11,AC.ink)+_c(110,52,11,AC.ink)
 +_r(58,42,28,20,AC.blk,3)+_p('M 62 52 H 82',null,AC.pin,3)
 +_bd(AC.grn,102,76,82,44)
 +_r(112,84,62,20,AC.blk,3)
 +_mlab(it,143,114,74,22);
/* hall current sensor — heavy screw terminals feeding the sense chip */
PKG.modcur=(it)=>_bd(AC.blu,20,24,160,94)
 +_r(24,32,56,44,AC.grn,3)+_c(38,54,10,AC.sil)+_c(66,54,10,AC.sil)
 +_r(96,34,60,36,AC.blk,3)+_c(103,41,2.6,'#4A5058')
 +_r(96,78,60,10,AC.blk,2)+_row(99,79,4,15,9,8)
 +_mlab(it,100,110,150,24);
/* RS-485 / CAN transceiver board — through-hole chip plus a screw terminal */
PKG.modbus=(it)=>_bd(AC.grn,24,22,152,96)
 +_r(30,80,52,28,AC.blu,3)+_c(43,94,7,AC.sil)+_c(69,94,7,AC.sil)
 +_r(62,34,66,32,AC.blk,3)+_row(70,28,4,17,7,7,AC.pin)+_row(70,66,4,17,7,7,AC.pin)
 +_r(138,38,26,20,AC.sil,3)
 +_r(140,74,28,10,AC.blk,2)+_row(141,75,3,9,7,8)
 +_mlab(it,100,112,140,24);
PKG.sensor=(it)=>{
  const s=it.n.toLowerCase();
  if(/hc-sr04|ultrasonic/.test(s))return _r(24,34,152,70,AC.blu,5)
    +_c(66,66,26,AC.sil)+_c(66,66,20,'#8E969F')+_c(134,66,26,AC.sil)+_c(134,66,20,'#8E969F')
    +_r(76,96,48,8,AC.blk,2)+[...Array(4)].map((_,i)=>_r(80+i*12,97,7,6,AC.gold,1)).join('');
  if(/dht|am2302/.test(s)){
    let g='';for(let r=0;r<5;r++)for(let c=0;c<5;c++)g+=_c(72+c*14,42+r*13,3.4,'#0E2E5C');
    return _r(60,28,84,80,/dht22|am2302/.test(s)?'#E8EAED':'#2E6FB8',4)+g+_legs([76,92,108,124],108,132);
  }
  if(/pir|hc-sr501/.test(s))return _r(40,40,120,64,AC.blu,4)
    +_c(100,70,40,'#EDEFF2')+[0,1,2,3,4,5].map(i=>{const a=i*Math.PI/3;
      return _c(100+Math.cos(a)*20,70+Math.sin(a)*20,10,'#D6DBE1');}).join('')+_c(100,70,11,'#DEE2E7');
  if(/mq-|gas/.test(s))return _r(26,54,148,50,AC.blu,4)
    +_c(76,54,30,AC.sil2)+_c(76,54,23,'#B4BBC3')+[0,1,2,3].map(i=>_r(56+i*11,32,5,44,'#8A9199',2)).join('')
    +_r(120,66,44,26,AC.blk,3);
  if(/lm35|ds18b20|a3144|hall/.test(s))return PKG.to92(it);
  if(/ldr/.test(s))return _legs([88,112],92,132)
    +_c(100,60,32,'#E8E3D2')+_p('M 74 48 q 26 14 52 0 M 74 62 q 26 14 52 0 M 74 76 q 26 -14 52 0',null,'#B08A3A',5);
  return PKG.module(it);
};
PKG.relay=()=>_legs([64,84,104,124,144],100,132)
 +_r(52,26,96,76,'#1E4FA0',4)+_gloss(58,30,84,10)
 +_r(60,44,80,26,'#EEF1F5',2)+_tx('RELAY',100,62,13,'#1E2A3C')
 +_r(60,78,80,8,'#16407F',2);
PKG.motor=(it)=>{
  if(/servo/i.test(it.n))return _r(46,36,86,72,/mg99|metal/i.test(it.n)?'#1B1E23':'#2E6FB8',4)
   +_r(46,44,86,10,'#FFFFFF',2,.12)+_c(112,52,16,'#D8DCE1')+_c(112,52,6,'#8D949D')
   +_r(104,20,60,8,'#E8EAED',3)+_c(160,24,4,'#C7CDD4')
   +[0,1,2].map(i=>_r(24,54+i*14,24,6,[AC.red,'#B4262A','#E8B31E'][i]||AC.red,3)).join('')
   +_r(36,54,12,34,'#2A2E33',2);
  if(/stepper|28byj/i.test(it.n))return _c(88,70,42,AC.sil)+_c(88,70,30,'#AEB5BD')+_c(88,70,10,'#7B838C')
   +_r(126,60,40,20,AC.blu,3)+_r(78,20,20,10,'#3A4046',2);
  return _r(44,40,104,60,AC.sil,28)+_r(44,40,104,16,'#FFFFFF',28,.4)
   +_r(148,64,26,12,'#8D949D',3)+_r(30,50,16,40,'#3A4046',3)
   +_legs([56,76],100,120,5,'#C0392B');
};
PKG.seg=()=>{
  const seg=(x,y,w,h)=>_r(x,y,w,h,'#E0483A',3);
  return _r(52,18,96,110,'#17191C',5)
   +seg(76,30,44,9)+seg(70,36,9,32)+seg(120,36,9,32)+seg(76,70,44,9)
   +seg(70,76,9,32)+seg(120,76,9,32)+seg(76,110,44,9)+_c(134,116,4.5,'#E0483A')
   +_legs([64,84,104,124],128,138,4,AC.pin);
};
PKG.disp=(it)=>{
  const s=it.n.toLowerCase();
  if(/oled|tft|e-paper|epaper/.test(s))return _r(30,24,140,92,/oled/.test(s)?'#1B4E9C':AC.grn,4)
   +_r(40,34,120,60,/e-?paper/.test(s)?'#EDEFF2':AC.glass,2)
   +(/e-?paper/.test(s)?_p('M 54 54 H 146 M 54 68 H 126 M 54 82 H 138',null,'#3A4046',4)
     :_p('M 54 54 H 146 M 54 68 H 120',null,/tft/.test(s)?'#4AC0E0':'#7FE3FF',4))
   +[...Array(6)].map((_,i)=>_r(58+i*14,104,8,7,AC.gold,1)).join('');
  if(/matrix/.test(s)){let g='';for(let r=0;r<8;r++)for(let c=0;c<8;c++)g+=_c(48+c*15,28+r*13,4.6,'#B02A20');
    return _r(32,14,136,112,'#17191C',5)+g;}
  return _r(20,26,160,88,AC.grn,4)+_r(30,38,140,50,'#4FA83A',2)
   +_p('M 44 56 H 156 M 44 74 H 130',null,'#123C0E',5)
   +[...Array(8)].map((_,i)=>_r(38+i*17,98,9,8,AC.gold,1)).join('');
};
PKG.sw=(it)=>{
  const s=it.n.toLowerCase();
  if(/keypad/.test(s)){let g='';for(let r=0;r<4;r++)for(let c=0;c<4;c++)g+=_r(40+c*30,26+r*22,24,17,'#2A2E33',3);
    return _r(28,16,144,104,'#E8EAED',4)+g;}
  if(/dip switch/.test(s))return _r(34,44,132,52,'#C0392B',3)
   +[...Array(8)].map((_,i)=>_r(42+i*16,50,10,18,'#EDEFF2',2)).join('')+_r(34,86,132,10,'#8E2A22',2);
  if(/encoder/.test(s))return _r(58,58,84,50,AC.blu,3)+_c(100,52,26,AC.sil)+_c(100,52,18,'#AEB5BD')
   +_r(96,16,8,22,AC.sil2,2)+_legs([74,100,126],108,132);
  return _r(58,44,84,58,'#1C1F24',5)+_c(100,72,15,'#E8EAED')+_c(100,72,11,'#C7CDD4')
   +_legs([66,134],102,128,5)+_legs([66,134],18,44,5);
};
PKG.buzz=()=>_legs([88,112],104,134)
 +_c(100,62,40,'#1C1F24')+_c(100,62,34,'#26292E')+_c(100,30,5,'#0A0C0E')
 +_tx('+',80,50,16,'#C7CDD4');
PKG.batt=(it)=>{
  if(/18650/i.test(it.n))return _r(24,48,152,50,'#1F5E3E',8)+_r(24,48,152,14,'#FFFFFF',8,.14)
   +_r(168,60,12,26,AC.sil,3)+_r(20,58,10,30,AC.sil2,3)+_tx('18650',100,80,15,'#D6E6DC');
  return _r(30,34,140,74,'#2A2E33',6)+_r(40,44,120,54,'#3A4046',4)
   +_c(70,71,20,AC.sil2)+_c(130,71,20,AC.sil2)+_r(30,34,140,10,'#FFFFFF',6,.1);
};
PKG.xfmr=()=>_r(34,24,132,92,'#4A5058',3)
 +[0,1,2,3].map(i=>_r(38+i*32,24,10,92,'#5C636B',1)).join('')
 +_r(62,44,76,52,'#1C1F24',3)+_gloss(66,48,68,10)
 +_legs([76,100,124],116,134,5,AC.cop);
PKG.bread=()=>{
  let h='';for(let r=0;r<8;r++)for(let c=0;c<17;c++){const y=24+r*11+(r>3?12:0);h+=_c(26+c*9.4,y,2.3,'#B9BEC6');}
  return _r(14,14,172,112,'#EDEFF2',5)+h+_r(14,66,172,10,'#DCE0E5',0)
   +_p('M 20 20 H 180 M 20 122 H 180',null,'#C0392B',2.5);
};
PKG.wire=()=>[0,1,2].map(i=>_p(`M 18 ${44+i*26} C 70 ${18+i*26} 130 ${72+i*26} 182 ${44+i*26}`,null,[AC.red,'#2E6FB8','#E8B31E'][i],7)).join('')
 +[0,1,2].map(i=>_r(12,36+i*26,14,16,'#2A2E33',3)+_r(174,36+i*26,14,16,'#2A2E33',3)).join('');
PKG.conn=(it)=>{
  if(/socket/i.test(it.n))return _r(40,46,120,48,'#1C1F24',3)+_r(52,54,96,32,'#0E1114',2)
   +[...Array(8)].map((_,i)=>_r(46+i*14,38,7,10,AC.sil,1)+_r(46+i*14,92,7,10,AC.sil,1)).join('');
  if(/terminal|jst|barrel/i.test(it.n))return _r(46,52,108,52,'#1F6B45',3)
   +[0,1,2].map(i=>_c(74+i*26,70,11,'#C7CDD4')).join('')+_r(46,96,108,10,'#14512F',2);
  if(/standoff|screw|spacer/i.test(it.n))return [0,1,2].map(i=>_r(52+i*36,38,16,64,AC.gold,3)).join('')
   +[0,1,2].map(i=>_c(60+i*36,34,10,AC.gold)).join('');
  return _r(30,58,140,26,'#1C1F24',2)+[...Array(10)].map((_,i)=>_r(36+i*14,24,7,60,AC.gold,1)).join('');
};
PKG.meter=()=>_r(38,12,124,116,'#E8B31E',10)+_r(46,20,108,10,'#FFFFFF',6,.35)
 +_r(50,26,100,36,'#1C1F24',4)+_r(56,32,88,24,'#5FA37A',2)+_tx('8.8.8',100,50,15,'#16301F')
 +_c(100,92,26,'#2A2E33')+_p('M 100 92 L 100 72',null,AC.sil,4)
 +[0,1].map(i=>_c(64+i*72,116,6,'#3A4046')).join('');
PKG.iron=()=>_p('M 22 122 L 60 84',null,AC.sil2,6)
 +_p('M 58 86 L 116 28 L 150 62 L 92 120 Z',AC.blk)+_gloss(66,44,60,12)
 +_p('M 116 28 L 150 62',null,'#B87333',10)+_r(146,58,22,22,AC.sil,4);
PKG.psu=(it)=>/adapter|smps|charger/i.test((it&&it.n)||'')?
 _r(30,22,96,74,'#2A2E33',8)+_gloss(36,26,84,10)+_r(46,10,18,14,AC.sil,2)+_r(92,10,18,14,AC.sil,2)
 +_p('M 126 62 C 152 62 152 104 172 104',null,'#2A2E33',7)+_r(168,96,18,16,AC.sil2,3)
 +_tx('12V',78,64,15,'#C7CDD4')
 :_r(18,26,164,88,'#3A4046',6)+_r(18,26,164,12,'#FFFFFF',6,.1)
 +_r(30,42,84,40,'#1C1F24',3)+_tx('30.0',56,64,15,'#E0483A')+_tx('1.50',96,64,15,'#4AC0E0')
 +[0,1].map(i=>_c(136+i*30,60,13,'#2A2E33')+_p(`M ${136+i*30} 60 L ${136+i*30} 50`,null,AC.sil,3)).join('')
 +_c(140,96,7,'#C0392B')+_c(166,96,7,'#1C1F24');
PKG.scope=()=>_r(16,20,168,100,'#2A2E33',6)
 +_r(26,30,104,72,AC.glass,3)+_p('M 34 66 C 50 66 50 42 62 42 S 74 90 86 90 S 98 46 110 46 122 66 126 66',null,'#4AE08A',3)
 +[0,1,2,3].map(i=>_c(150+(i%2)*20,44+Math.floor(i/2)*24,8,'#3F464E')).join('')
 +_r(140,86,38,22,'#1C1F24',3);
PKG.tool=(it)=>{
  const s=it.n.toLowerCase();
  if(/tweezer/.test(s))return _p('M 60 22 L 96 108 M 140 22 L 104 108',null,AC.sil,7)+_p('M 96 108 L 104 108',null,AC.sil2,7);
  if(/flux|paste|alcohol|isopropyl/.test(s))return _r(66,34,68,92,'#3A4046',8)+_r(78,14,44,22,'#C0392B',4)
   +_r(74,58,52,40,'#EDEFF2',3)+_tx('FLUX',100,84,13,'#2A2E33');
  if(/screwdriver/.test(s))return _p('M 100 18 L 100 78',null,AC.sil,9)+_r(84,78,32,46,'#C0392B',6)+_p('M 100 12 L 100 24',null,AC.sil2,12);
  if(/heat sink|thermal/.test(s))return [...Array(7)].map((_,i)=>_r(36+i*20,26,12,72,AC.sil,2)).join('')+_r(30,96,140,16,AC.sil2,3);
  return _p('M 42 118 L 92 68 M 158 118 L 108 68',null,'#C0392B',12)
   +_p('M 92 68 L 60 30 M 108 68 L 140 30',null,AC.sil2,10)+_c(100,72,7,'#3A4046');
};
PKG.opamp=PKG.dip;
PKG.dip8=PKG.dip;
PKG.ic=PKG.dip;

/* resolver: symbol key first, then a few name overrides */
function pkgOf(it){
  const s=it.s||'ic',n=(it.n||'').toLowerCase();
  if(/^(dip8|dip14|ic|opamp)$/.test(s)&&/module|board/.test(n))return PKG.module;
  if(s==='to220'&&/tl431/.test(n))return PKG.to92;
  if(s==='res'&&/thermistor|ntc|fuse|ptc/.test(n))return PKG.diode;
  if(s==='board'&&/esp32-cam/.test(n))return PKG.mcu;
  return PKG[s]||PKG.ic;
}
function art(it){
  let body='';
  try{body=pkgOf(it)(it)}catch(e){body=PKG.ic(it)}
  return `<svg class="art" viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
}


const PINS={
 'NE555':['GND','TRIG','OUT','RESET','CTRL','THRES','DISCH','VCC'],
 'LM741':['OFFSET','IN −','IN +','V−','OFFSET','OUT','V+','NC'],
 'LM358':['OUT A','IN A−','IN A+','GND','IN B+','IN B−','OUT B','VCC'],
 'LM393':['OUT A','IN A−','IN A+','GND','IN B+','IN B−','OUT B','VCC'],
 'LM386':['GAIN','IN −','IN +','GND','OUT','VS','BYPASS','GAIN'],
 'TL072':['OUT A','IN A−','IN A+','V−','IN B+','IN B−','OUT B','V+'],
 'LM324':['OUT A','IN A−','IN A+','VCC','IN B+','IN B−','OUT B','OUT C','IN C−','IN C+','GND','IN D+','IN D−','OUT D'],
 'LM339':['OUT B','OUT A','VCC','IN A−','IN A+','IN B−','IN B+','GND','IN C+','IN C−','IN D+','IN D−','OUT D','OUT C'],
 '7400':['1A','1B','1Y','2A','2B','2Y','GND','3Y','3A','3B','4Y','4A','4B','VCC'],
 '7402':['1Y','1A','1B','2Y','2A','2B','GND','3A','3B','3Y','4A','4B','4Y','VCC'],
 '7404':['1A','1Y','2A','2Y','3A','3Y','GND','4Y','4A','5Y','5A','6Y','6A','VCC'],
 '7408':['1A','1B','1Y','2A','2B','2Y','GND','3Y','3A','3B','4Y','4A','4B','VCC'],
 '7432':['1A','1B','1Y','2A','2B','2Y','GND','3Y','3A','3B','4Y','4A','4B','VCC'],
 '7486':['1A','1B','1Y','2A','2B','2Y','GND','3Y','3A','3B','4Y','4A','4B','VCC'],
 '74HC14':['1A','1Y','2A','2Y','3A','3Y','GND','4Y','4A','5Y','5A','6Y','6A','VCC'],
 '74HC595':['Q1','Q2','Q3','Q4','Q5','Q6','Q7','GND','Q7S','MR','SHCP','STCP','OE','DS','Q0','VCC'],
 'CD4017':['Q5','Q1','Q0','Q2','Q6','Q7','Q3','GND','Q8','Q4','Q9','CO','CLK EN','CLK','RESET','VDD'],
 'CD4093':['1A','1B','1Y','2A','2B','2Y','GND','3Y','3A','3B','4Y','4A','4B','VDD'],
 'ULN2803':['IN1','IN2','IN3','IN4','IN5','IN6','IN7','IN8','GND','COM','OUT8','OUT7','OUT6','OUT5','OUT4','OUT3','OUT2','OUT1'],
 'PC817':['ANODE','CATHODE','EMITTER','COLLECTOR'],
 'LM317':['ADJ','VOUT','VIN'],'7805':['IN','GND','OUT'],'TL431':['REF','ANODE','CATHODE'],
 'ATmega328P':['RESET','RXD','TXD','D2','D3','D4','VCC','GND','XTAL1','XTAL2','D5','D6','D7','D8','D9','D10','D11','D12','D13','AVCC','AREF','GND','A0','A1','A2','A3','A4','A5']};

