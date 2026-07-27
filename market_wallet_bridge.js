(function(){
'use strict';

let student='',wallet=null,lastSignature='',timer=0;

function clean(value){return String(value||'').trim()}
function currentStudent(){
 const level=String(window.MV_LEVEL_ID||'');
 const candidates=[
  level&&sessionStorage.getItem('mv_current_student_'+level),
  sessionStorage.getItem('mv_current_student'),
  localStorage.getItem('mv_current_student'),
  localStorage.getItem('mv_last_student'),
  localStorage.getItem('mv_last_alumno')
 ];
 const input=document.getElementById('playerName');
 if(input)candidates.unshift(input.value);
 return clean(candidates.find(clean))
}
function levelId(){
 const value=String(window.MV_LEVEL_ID||'').match(/\d+/);
 if(value)return value[0];
 const title=String(document.title||'').match(/nivel\s*(\d+)/i);
 return title?title[1]:'0'
}
function completedIds(){
 try{
  if(typeof completed!=='undefined'&&completed&&typeof completed.forEach==='function'){
   const ids=[];completed.forEach(value=>ids.push(String(value)));return ids
  }
 }catch(e){}
 return[]
}
async function start(){
 if(!window.MV_WALLET)return;
 const name=currentStudent();if(!name)return;
 if(student!==name){
  student=name;
  wallet=MV_WALLET.normalize(await MV_WALLET.loadRemote(student)||MV_WALLET.blank())
 }
 const ids=completedIds().map(id=>'mercado-n'+levelId()+'-'+id).sort();
 const signature=student+'|'+ids.join('|');
 if(signature===lastSignature)return;
 lastSignature=signature;
 let changed=false;
 ids.forEach(id=>{
  if(!wallet.rewardedMissions.includes(id)){wallet.rewardedMissions.push(id);changed=true}
 });
 if(!changed)return;
 wallet.correctAnswers=Math.max(wallet.correctAnswers,wallet.rewardedMissions.length);
 wallet.totalEarned=Math.max(wallet.totalEarned,Math.floor(wallet.correctAnswers/5));
 wallet.euros=Math.max(0,wallet.totalEarned-wallet.totalPaid);
 wallet=await MV_WALLET.saveRemote(student,wallet)
}
function schedule(){clearTimeout(timer);timer=setTimeout(start,250)}
document.addEventListener('click',schedule,true);
document.addEventListener('change',schedule,true);
setInterval(start,1500);
setTimeout(start,500)
})();
