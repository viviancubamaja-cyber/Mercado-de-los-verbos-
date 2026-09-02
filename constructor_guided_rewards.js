(function(){
'use strict';

const LOCAL_PREFIX='mvConstructorYoSoloWalletV1_';
let student='',wallet=null,syncTimer=0;

function slug(value){
 return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'')||'alumno'
}
function localKey(){return LOCAL_PREFIX+slug(student)}
function blank(){
 return window.MV_WALLET?MV_WALLET.blank():{correctAnswers:0,euros:0,totalEarned:0,totalPaid:0,rewardedMissions:[],payments:[]}
}
function normalize(value){return window.MV_WALLET?MV_WALLET.normalize(value):value||blank()}
function loadLocal(){
 try{return normalize(JSON.parse(localStorage.getItem(localKey())||'null'))}catch(e){return blank()}
}
function saveLocal(){if(student&&wallet)localStorage.setItem(localKey(),JSON.stringify(wallet))}
function render(){
 document.querySelectorAll('.guided-wallet').forEach(function(node){
  node.textContent='💰 '+wallet.euros+' € · ⭐ '+(wallet.correctAnswers%5)+'/5'
 })
}
async function sync(){
 if(!student||!wallet||!window.MV_WALLET)return;
 const remote=await MV_WALLET.loadRemote(student);
 wallet=MV_WALLET.merge(wallet,remote||MV_WALLET.blank());
 saveLocal();render();
 wallet=await MV_WALLET.saveRemote(student,wallet);
 saveLocal();render()
}
function queueSync(){
 if(!window.MV_WALLET)return;
 clearTimeout(syncTimer);
 syncTimer=setTimeout(sync,250)
}
function hash(text){
 let value=2166136261;
 for(let i=0;i<text.length;i++){value^=text.charCodeAt(i);value=Math.imul(value,16777619)}
 return(value>>>0).toString(36)
}
function missionId(level,zone,answer){
 const source=[level,zone,String(answer||'').trim().toLowerCase().replace(/\s+/g,' ')].join('|');
 return'guided-'+level+'-'+hash(source)
}
async function start(name){
 student=String(name||'').trim();wallet=loadLocal();render();await sync();return wallet
}
function reward(level,zone,answer){
 if(!student||!wallet)return{counted:false,wonEuro:false};
 const id=missionId(level,zone,answer);
 if(wallet.rewardedMissions.includes(id))return{counted:false,wonEuro:false};
 wallet.rewardedMissions.push(id);wallet.correctAnswers++;
 const wonEuro=wallet.correctAnswers%5===0;
 if(wonEuro){wallet.totalEarned=(wallet.totalEarned||0)+1;wallet.euros++}
 saveLocal();render();queueSync();
 return{counted:true,wonEuro}
}
function balance(){return wallet||blank()}

window.MV_GUIDED_REWARDS={start,reward,sync,render,balance,missionId};
})();

/* Nivel 3: YO SOLO permanece retirado de la interfaz mientras se prueba
   primero su recuperación independiente en el Nivel 2. */
(function(){
'use strict';

window.addEventListener('DOMContentLoaded',function(){
 const path=location.pathname||'';
 const n2=/constructor_frases_nivel2\.html$/i.test(path);
 const n3=/constructor_frases_nivel3\.html$/i.test(path);
 if(!n3)return;

 const level=n2?2:3;
 const progressKey=n2?'mvConstructorProgressN2':'mvConstructorProgressN3';
 const soloDoneKey=n2?'mvConstructorN2_solo':'mvConstructorN3_solo';
 const requiredKeys=n2?['mvConstructorN2_past','mvConstructorN2_be']:['mvConstructorN3_perfect','mvConstructorN3_be'];

 const soloCard=document.querySelector('.zone.solo');
 if(soloCard)soloCard.remove();

 const intro=document.querySelector('#start.hero p');
 if(intro){
   intro.textContent=n2
     ?'Construye 72 frases con el recorrido del Mercado del Pasado: primero con los Solitarios y después con el Rey BE.'
     :'Construye 72 frases siguiendo el recorrido de la Reina HAVE y del regreso del Rey BE.';
 }

 localStorage.removeItem(soloDoneKey);
 try{
   const saved=JSON.parse(localStorage.getItem(progressKey)||'null');
   if(saved&&saved.zone==='solo')localStorage.removeItem(progressKey);
 }catch(e){localStorage.removeItem(progressKey);}

 if(typeof window.openZone==='function'){
   const originalOpenZone=window.openZone;
   window.openZone=function(z){
     if(z==='solo')return;
     return originalOpenZone.apply(this,arguments);
   };
 }

 function adjustFinish(){
   const finish=document.getElementById('finish');
   if(!finish||finish.classList.contains('hidden'))return;
   const allDone=requiredKeys.every(function(key){
     return localStorage.getItem(key)==='completed';
   });
   if(!allDone)return;
   const final=document.getElementById('final');
   if(!final)return;
   final.querySelectorAll('p').forEach(function(p){
     if(new RegExp('Nivel '+level+' completado').test(p.textContent||''))p.remove();
   });
   const message=document.createElement('p');
   message.className='score';
   message.textContent='🎉 ¡Nivel '+level+' completado: 72 frases!';
   final.appendChild(message);
 }

 if(typeof window.nextQuestion==='function'){
   const originalNextQuestion=window.nextQuestion;
   window.nextQuestion=function(){
     const result=originalNextQuestion.apply(this,arguments);
     adjustFinish();
     return result;
   };
 }
});
})();
