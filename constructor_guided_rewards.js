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
