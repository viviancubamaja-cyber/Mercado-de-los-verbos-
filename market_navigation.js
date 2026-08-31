(function(){
  'use strict';
  if(window.__mvSharedRouteMenu)return;
  window.__mvSharedRouteMenu=true;

  function level(){
    var match=location.pathname.match(/nivel([123])_/i);
    return match?Number(match[1]):Number(window.MV_LEVEL_ID&&String(window.MV_LEVEL_ID).match(/([123])/)?.[1])||1;
  }
  function save(){
    try{if(typeof window.saveGameState==='function')window.saveGameState(false)}catch(e){}
    try{if(typeof window.saveGame==='function')window.saveGame()}catch(e){}
    try{if(typeof window.l1ForceInternalSave==='function')window.l1ForceInternalSave()}catch(e){}
  }
  function go(url){save();try{var u=new URL(url,location.href);if(u.hostname==='mercado-del-futuro.viviancubamaja.chatgpt.site'){var student=(localStorage.getItem('mv_current_student')||'').trim();if(student)u.searchParams.set('student',student);u.searchParams.set('return',new URL('index.html',location.href).href);url=u.href}}catch(e){}location.href=url;return false}
  function openExam(){
    close();
    var n=level();
    try{if(n===1&&typeof window.openFinalExam==='function')return window.openFinalExam()}catch(e){}
    try{if(typeof window.mv44StartGeneralExam==='function')return window.mv44StartGeneralExam()}catch(e){}
    try{var fn=window['openLevel'+n+'FinalTest'];if(typeof fn==='function')return fn()}catch(e){}
    alert('El test final todavía no está preparado en esta pantalla.');
    return false;
  }
  function close(){var overlay=document.getElementById('mvRouteMenuOverlay');if(overlay)overlay.classList.remove('mv-route-open')}
  function open(){var overlay=document.getElementById('mvRouteMenuOverlay');if(overlay)overlay.classList.add('mv-route-open')}
  function link(label,url,extra){return '<a class="mv-route-link '+(extra||'')+'" href="'+url+'">'+label+'</a>'}
  function installStandFinalButton(n){
    if(document.getElementById('mvStandFinalTest'))return;
    var stands=document.getElementById(n===1?'standsList':'standButtons');
    if(!stands)return;
    var button=document.createElement('button');
    button.id='mvStandFinalTest';
    button.className='mv-stand-final-test';
    button.type='button';
    button.innerHTML='<span aria-hidden="true">📕</span> TEST FINAL NIVEL '+n;
    button.onclick=function(e){e.preventDefault();return openExam()};
    stands.insertAdjacentElement('afterend',button);
  }
  function install(){
    if(document.getElementById('mvRouteMenuOverlay'))return;
    var n=level();
    var overlay=document.createElement('section');
    overlay.id='mvRouteMenuOverlay';
    overlay.setAttribute('aria-label','Menú de recorridos');
    overlay.innerHTML='<div class="mv-route-card"><div class="mv-route-head"><h2>🧭 Menú de recorridos</h2><button class="mv-route-close" type="button">Cerrar</button></div>'+
      '<div class="mv-route-section-title">Mercado de los Verbos</div><div class="mv-route-grid">'+
      link('🧩 Nivel 1','nivel1_libro1_test1.html',n===1?'mv-route-current':'')+
      link('⏳ Nivel 2','nivel2_libro2_test2.html',n===2?'mv-route-current':'')+
      link('👸 Nivel 3','nivel3_libro3_test3.html',n===3?'mv-route-current':'')+'</div>'+
      '<div class="mv-route-section-title">Practica y construye</div><div class="mv-route-grid">'+
      link('🏆 Constructor de Frases','constructor_frases.html')+
      link('🧍 Yo Solo','constructor_frases_yo_solo_8_tiempos.html')+
      link('🎲 Gran Mezcla','constructor_frases_mezcla.html')+'</div>'+
      '<div class="mv-route-section-title">Siguiente recorrido</div><div class="mv-route-grid">'+
      link('🧭 Mercado del Futuro','https://mercado-del-futuro.viviancubamaja.chatgpt.site','mv-route-future')+
      link('🦸 Mercado de los Modales · CAN y sus compañeros','https://mercado-del-futuro.viviancubamaja.chatgpt.site/?area=modales','mv-route-future')+
      '<div class="mv-route-soon">🔮 Condicionales · Pasiva · Causativa<br>Próximamente</div></div>'+
      '<div class="mv-route-section-title">Evaluación</div><button class="mv-route-action" id="mvRouteFinalExam" type="button">📕 Test final · Nivel '+n+'</button></div>';
    document.body.appendChild(overlay);
    overlay.querySelector('.mv-route-close').onclick=close;
    overlay.onclick=function(e){if(e.target===overlay)close()};
    overlay.querySelectorAll('a').forEach(function(a){a.onclick=function(e){e.preventDefault();return go(a.href)}});
    document.getElementById('mvRouteFinalExam').onclick=function(e){e.preventDefault();return openExam()};
    var button=document.getElementById('mvMenuNivelesBtn');
    if(!button){button=document.createElement('button');button.id='mvMenuNivelesBtn';button.type='button';button.textContent='🧭 Menú de recorridos';document.body.appendChild(button)}
    button.onclick=function(e){if(e)e.preventDefault();var exit=document.getElementById('exitScreen');if(exit&&(exit.classList.contains('show')||exit.classList.contains('active'))){return go('index.html')}open();return false};
    installStandFinalButton(n);
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&overlay.classList.contains('mv-route-open')){e.preventDefault();close()}},true);
  }
  // Regla única de salida para los tres niveles.
  // El botón amarillo abandona el nivel; el verde conserva su comportamiento interno.
  document.addEventListener('click',function(event){
    var target=event.target&&event.target.closest?event.target.closest('#exitQuit,#exitScreen .exit-visible-quit,#exitScreen .exit-quit-hotspot'):null;
    if(!target)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    save();
    location.href=new URL('app.html',location.href).href;
  },true);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
