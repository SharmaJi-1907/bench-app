$('#fab').onclick=openAdd;

/* Dismissal order for both Escape and Android back: innermost surface first.
   The quick-action sheet (Task 4) sits on top of everything, so it gets the
   first refusal; closeQuick() returns false when it was not open, which hands
   the event straight down to the pre-existing #sheet / view / exit ladder. */
document.addEventListener('keydown',e=>{
  if(e.key!=='Escape')return;
  if(closeQuick())return;
  if($('#sheet').classList.contains('open'))close();
});
if(window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins.App){
  Capacitor.Plugins.App.addListener('backButton',()=>{
    if(closeQuick())return;
    if($('#sheet').classList.contains('open'))close();
    else if(S.view!=='home'){S.view='home';render()}
    else Capacitor.Plugins.App.exitApp();
  });
}
boot();
