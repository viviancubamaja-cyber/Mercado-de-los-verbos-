(function(){
  'use strict';
  // Limpieza de controles técnicos: la función permanece, los carteles de desarrollo no.
  const cleanupStyle=document.createElement('style');
  cleanupStyle.id='mv-production-cleanup';
  cleanupStyle.textContent='#mv45DRealBox,#mv45E2Tools,#mv45E2Help,#mv45EFinalShortcut,#mv45EKeyboardHelp{display:none!important}';
  (document.head||document.documentElement).appendChild(cleanupStyle);
  document.documentElement.style.visibility='hidden';
  function returnToAccess(){ location.replace(new URL('./app.html',location.href).href); }
  (async function(){
    try{
      if(!window.MV_ACCESS){returnToAccess();return;}
      const session=await window.MV_ACCESS.validate();
      if(!session){returnToAccess();return;}
      window.MV_CURRENT_ACCESS=session;
      if(['student','individual'].includes(session.role)&&session.displayName){
        localStorage.setItem('mv_current_student',session.displayName);
        localStorage.setItem('mv_last_student',session.displayName);
        localStorage.setItem('mv_last_alumno',session.displayName);
        sessionStorage.setItem('mv_current_student',session.displayName);
      }
      if(['creator','teacher','school'].includes(session.role)&&session.displayName)localStorage.setItem('mv_teacher_full_name_v1',session.displayName);
      document.documentElement.style.visibility='';
    }catch(error){returnToAccess();}
  })();
})();
