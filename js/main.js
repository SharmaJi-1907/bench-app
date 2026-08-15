$('#fab').onclick=openAdd;
$('#moreBtn').onclick=openMore;
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#sheet').classList.contains('open'))close()});
if(window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins.App){
  Capacitor.Plugins.App.addListener('backButton',()=>{
    if($('#sheet').classList.contains('open'))close();
    else if(S.view!=='home'){S.view='home';render()}
    else Capacitor.Plugins.App.exitApp();
  });
}
boot();
