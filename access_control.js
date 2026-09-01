(function(){
  'use strict';

  const SUPABASE_URL='https://zpdcfbunxwhzqlrxrpaj.supabase.co';
  const SUPABASE_KEY='sb_publishable_G_B_l1OHXH4n7wjj7M6lZA_el-AgLP0';
  const SESSION_KEY='mv_secure_access_v1';

  function clean(value){return String(value||'').trim();}
  function readSession(){
    try{
      const value=JSON.parse(localStorage.getItem(SESSION_KEY)||'null');
      if(!value||!clean(value.token)||!clean(value.role))return null;
      return value;
    }catch(error){return null;}
  }
  function saveSession(value){
    localStorage.setItem(SESSION_KEY,JSON.stringify(value));
    return value;
  }
  function clearSession(){localStorage.removeItem(SESSION_KEY);}
  async function rpc(name,body){
    const response=await fetch(SUPABASE_URL+'/rest/v1/rpc/'+name,{
      method:'POST',
      headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+SUPABASE_KEY,'Content-Type':'application/json'},
      body:JSON.stringify(body||{})
    });
    let payload=null;
    try{payload=await response.json();}catch(error){}
    if(!response.ok){
      const message=payload&&(payload.message||payload.error_description||payload.hint);
      throw new Error(message||'No se pudo comprobar el acceso.');
    }
    return Array.isArray(payload)?payload[0]:payload;
  }
  function normalizeResult(result){
    if(!result||result.ok===false)throw new Error((result&&result.message)||'Acceso no válido.');
    return {
      token:clean(result.session_token||result.token),
      accountId:clean(result.account_id),
      role:clean(result.role).toLowerCase(),
      displayName:clean(result.display_name),
      username:clean(result.username)
    };
  }
  async function activate(data){
    const result=normalizeResult(await rpc('mv_activate_access',{
      p_code:clean(data.code),p_display_name:clean(data.displayName),
      p_username:clean(data.username).toLowerCase(),p_password:String(data.password||'')
    }));
    return saveSession(result);
  }
  async function login(username,password){
    const result=normalizeResult(await rpc('mv_login_access',{
      p_username:clean(username).toLowerCase(),p_password:String(password||'')
    }));
    return saveSession(result);
  }
  async function issuePasswordReset(username,minutes){
    const current=readSession();
    if(!current)throw new Error('Debes entrar con una cuenta autorizada.');
    const result=await rpc('mv_issue_password_reset_code',{
      p_session_token:current.token,p_username:clean(username).toLowerCase(),p_minutes:Number(minutes)||30
    });
    if(!result||result.ok===false)throw new Error((result&&result.message)||'No se pudo generar el código.');
    return result;
  }
  async function resetPassword(username,code,newPassword){
    const result=await rpc('mv_reset_password',{
      p_username:clean(username).toLowerCase(),p_code:clean(code),p_new_password:String(newPassword||'')
    });
    if(!result||result.ok===false)throw new Error((result&&result.message)||'No se pudo cambiar la contraseña.');
    clearSession();
    return result;
  }
  async function validate(){
    const current=readSession();
    if(!current)return null;
    try{
      const result=normalizeResult(await rpc('mv_validate_access',{p_session_token:current.token}));
      return saveSession(Object.assign({},current,result));
    }catch(error){clearSession();return null;}
  }
  function hasRole(roles){
    const session=readSession();
    return !!session&&[].concat(roles||[]).map(String).includes(session.role);
  }

  window.MV_ACCESS={activate,login,issuePasswordReset,resetPassword,validate,session:readSession,logout:clearSession,hasRole,rpc};
})();

/* Gran Mezcla: mantiene un orden aleatorio estable durante una partida y
   genera un orden nuevo al empezar de cero, reiniciar o volver a jugar. */
(function(){
  'use strict';
  if(!/constructor_frases_mezcla\.html$/i.test(location.pathname||''))return;

  window.addEventListener('DOMContentLoaded',function(){
    try{
      if(typeof missions==='undefined'||!Array.isArray(missions)||missions.length<2)return;

      const base=missions.slice();
      const ORDER_KEY='mvConstructorMezclaOrderV2';
      const PROGRESS_KEY='mvConstructorProgressMezcla';

      function identity(){return base.map(function(_,i){return i;});}
      function valid(order){
        return Array.isArray(order)&&order.length===base.length&&
          order.every(function(v){return Number.isInteger(v)&&v>=0&&v<base.length;})&&
          new Set(order).size===base.length;
      }
      function readOrder(){
        try{
          const order=JSON.parse(localStorage.getItem(ORDER_KEY)||'null');
          return valid(order)?order:null;
        }catch(e){return null;}
      }
      function readProgress(){
        try{return JSON.parse(localStorage.getItem(PROGRESS_KEY)||'null');}
        catch(e){return null;}
      }
      function randomOrder(previous){
        let order,tries=0;
        do{
          order=identity();
          for(let i=order.length-1;i>0;i--){
            const j=Math.floor(Math.random()*(i+1));
            [order[i],order[j]]=[order[j],order[i]];
          }
          tries++;
        }while(tries<12&&(
          order.every(function(v,i){return v===i;})||
          (valid(previous)&&order.every(function(v,i){return v===previous[i];}))
        ));
        return order;
      }
      function apply(order){
        if(!valid(order))return;
        order.forEach(function(sourceIndex,targetIndex){
          missions[targetIndex]=base[sourceIndex];
        });
        localStorage.setItem(ORDER_KEY,JSON.stringify(order));
      }
      function fresh(){
        const previous=readOrder();
        const order=randomOrder(previous);
        apply(order);
        return order;
      }

      const progress=readProgress();
      const saved=readOrder();
      if(saved)apply(saved);
      else if(progress&&Number.isInteger(progress.index)&&progress.index>0)apply(identity());
      else fresh();

      if(typeof window.startGame==='function'){
        const originalStart=window.startGame;
        window.startGame=function(){
          const input=document.getElementById('studentName');
          const name=input?String(input.value||'').trim():'';
          const p=readProgress();
          const resuming=!!(p&&p.student===name&&Number.isInteger(p.index)&&p.index>=0&&p.index<base.length);
          if(!resuming)fresh();
          return originalStart.apply(this,arguments);
        };
      }
      if(typeof window.restart==='function'){
        const originalRestart=window.restart;
        window.restart=function(){
          fresh();
          return originalRestart.apply(this,arguments);
        };
      }
      if(typeof window.playAgain==='function'){
        const originalPlayAgain=window.playAgain;
        window.playAgain=function(){
          fresh();
          return originalPlayAgain.apply(this,arguments);
        };
      }
    }catch(error){
      console.warn('Gran Mezcla: no se pudo aplicar el orden aleatorio.',error);
    }
  });
})();
