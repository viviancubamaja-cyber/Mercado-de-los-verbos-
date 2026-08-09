(function(){
  'use strict';
  const ACCOUNT_KEY='mercadoVerbosLocalAccountV1';
  const LEVEL=String(window.MV_LEVEL_ID||'').replace(/\D/g,'');
  const inputSelector='#playerName,#studentName,#mvExamNameInput,#nameInput,#studentInput,#nombreAlumno,#playerNameInput,input[placeholder*="escribe tu nombre" i]';

  function clean(value){return String(value||'').trim().replace(/\s+/g,' ');}
  function accountName(){
    try{return clean(JSON.parse(localStorage.getItem(ACCOUNT_KEY)||'null')?.studentName);}
    catch(error){return '';}
  }
  function legacyName(){
    const keys=['mv_current_student','mv_last_student','mv_last_alumno','currentStudentName','lastStudentName'];
    if(LEVEL)keys.unshift('mv_current_student_'+LEVEL,'mv_current_student_n'+LEVEL,'mv_current_student_nivel'+LEVEL,'mv_current_student_nivel_'+LEVEL);
    for(const key of keys){
      try{const value=clean(sessionStorage.getItem(key)||localStorage.getItem(key));if(value)return value;}catch(error){}
    }
    return '';
  }
  function get(){return accountName()||legacyName();}
  function remember(value){
    const name=accountName()||clean(value)||legacyName();
    if(!name)return '';
    const sessionKeys=['mv_current_student'];
    if(LEVEL)sessionKeys.push('mv_current_student_'+LEVEL,'mv_current_student_n'+LEVEL,'mv_current_student_nivel'+LEVEL,'mv_current_student_nivel_'+LEVEL);
    try{sessionKeys.forEach(key=>sessionStorage.setItem(key,name));}catch(error){}
    try{
      localStorage.setItem('mv_current_student',name);
      localStorage.setItem('mv_last_student',name);
      localStorage.setItem('mv_last_alumno',name);
    }catch(error){}
    return name;
  }
  function rewriteRequest(element,name){
    if(!element||/^(SCRIPT|STYLE|INPUT|TEXTAREA)$/.test(element.tagName)||element.children.length)return;
    const text=clean(element.textContent);
    if(/(?:escribe|introduce|ingresa).{0,40}(?:tu )?nombre/i.test(text))element.textContent=name?'Alumno: '+name:'';
  }
  function hydrate(root=document){
    const name=remember(get());
    if(!name)return '';
    const inputs=[];
    if(root.matches?.(inputSelector))inputs.push(root);
    root.querySelectorAll?.(inputSelector).forEach(input=>inputs.push(input));
    inputs.forEach(input=>{
      input.value=name;
      input.hidden=true;
      input.tabIndex=-1;
      input.setAttribute('aria-hidden','true');
    });
    if(root.nodeType===1)rewriteRequest(root,name);
    root.querySelectorAll?.('.mv-exam-name-sub,#mvFix20StartMsgL1,[data-name-prompt]').forEach(element=>rewriteRequest(element,name));
    return name;
  }

  window.MV_STUDENT_IDENTITY={get:()=>remember(get()),remember,hydrate,accountName};
  window.mvGetStudentName=()=>remember(get());
  window.mvSetStudentName=value=>remember(value);

  const style=document.createElement('style');
  style.textContent=inputSelector+'{display:none!important}';
  document.head.appendChild(style);
  hydrate();
  document.addEventListener('DOMContentLoaded',()=>hydrate(),{once:true});
  document.addEventListener('click',()=>hydrate(),true);
  document.addEventListener('submit',()=>hydrate(),true);
  new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{if(node.nodeType===1)hydrate(node);}))).observe(document.documentElement,{childList:true,subtree:true});
})();
