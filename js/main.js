$('#fab').onclick=openAdd;
$('#moreBtn').onclick=openMore;
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#sheet').classList.contains('open'))close()});
boot();
