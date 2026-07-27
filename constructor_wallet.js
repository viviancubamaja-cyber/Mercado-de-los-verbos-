(function(){
'use strict';

const URL='https://zpdcfbunxwhzqlrxrpaj.supabase.co';
const KEY='sb_publishable_G_B_l1OHXH4n7wjj7M6lZA_el-AgLP0';
const TABLE='sesiones';
const TYPE='constructor_monedero';

function unique(items){return[...new Set((Array.isArray(items)?items:[]).map(String).filter(Boolean))]}
function integer(value,fallback=0){const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.floor(n)):fallback}
function slug(value){
 return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ')
}
function blank(){
 return{correctAnswers:0,euros:0,totalEarned:0,totalPaid:0,rewardedMissions:[],payments:[],updatedAt:''}
}
function normalize(value){
 const source=value&&typeof value==='object'?value:{},rewardedMissions=unique(source.rewardedMissions);
 const correctAnswers=Math.max(integer(source.correctAnswers),rewardedMissions.length);
 const payments=Array.isArray(source.payments)?source.payments.filter(item=>item&&typeof item==='object').map(item=>({
  id:String(item.id||''),amount:integer(item.amount),paidAt:String(item.paidAt||''),teacher:String(item.teacher||'')
 })).filter(item=>item.amount>0):[];
 const paidFromHistory=payments.reduce((sum,item)=>sum+item.amount,0);
 const totalPaid=Math.max(integer(source.totalPaid),paidFromHistory);
 const legacyBalance=integer(source.euros);
 const totalEarned=Math.max(integer(source.totalEarned),Math.floor(correctAnswers/5),legacyBalance+totalPaid);
 return{
  correctAnswers,
  euros:Math.max(0,totalEarned-totalPaid),
  totalEarned,
  totalPaid,
  rewardedMissions,
  payments,
  updatedAt:String(source.updatedAt||'')
 }
}
function merge(left,right){
 const a=normalize(left),b=normalize(right),rewardedMissions=unique(a.rewardedMissions.concat(b.rewardedMissions));
 const paymentMap=new Map();
 a.payments.concat(b.payments).forEach(item=>{
  const key=item.id||[item.paidAt,item.amount,item.teacher].join('|');
  if(!paymentMap.has(key))paymentMap.set(key,item)
 });
 const payments=[...paymentMap.values()].sort((x,y)=>String(y.paidAt).localeCompare(String(x.paidAt)));
 const totalPaid=Math.max(a.totalPaid,b.totalPaid,payments.reduce((sum,item)=>sum+integer(item.amount),0));
 const correctAnswers=Math.max(a.correctAnswers,b.correctAnswers,rewardedMissions.length);
 const totalEarned=Math.max(a.totalEarned,b.totalEarned,Math.floor(correctAnswers/5));
 return normalize({correctAnswers,totalEarned,totalPaid,rewardedMissions,payments,updatedAt:new Date().toISOString()})
}
function headers(extra){return Object.assign({apikey:KEY,Authorization:'Bearer '+KEY},extra||{})}
function stateFromRow(row){
 if(!row)return null;
 try{
  const parsed=JSON.parse(String(row.motivo||'{}'));
  return normalize(Object.assign({},parsed,{
   correctAnswers:Math.max(integer(parsed.correctAnswers),integer(row.aciertos)),
   totalPaid:Math.max(integer(parsed.totalPaid),integer(row.pagos_realizados)),
   euros:parsed.euros===undefined?integer(row.nota):parsed.euros
  }))
 }catch(e){
  return normalize({correctAnswers:integer(row.aciertos),euros:integer(row.nota),totalPaid:integer(row.pagos_realizados)})
 }
}
async function request(path,options){
 return fetch(URL.replace(/\/+$/,'')+'/rest/v1/'+path,Object.assign({},options||{},{headers:headers(options&&options.headers)}))
}
async function loadRemote(student){
 const name=String(student||'').trim();if(!name)return null;
 try{
  const path=TABLE+'?select=alumno,aciertos,nota,pagos_realizados,motivo,created_at&alumno=ilike.'+
   encodeURIComponent(name)+'&tipo_actividad=eq.'+TYPE+'&order=created_at.desc&limit=1';
  const response=await request(path);
  if(!response.ok)return null;
  const rows=await response.json();
  return rows&&rows[0]?stateFromRow(rows[0]):null
 }catch(e){return null}
}
function rowFor(student,state){
 const wallet=normalize(state),now=new Date().toISOString();
 wallet.updatedAt=now;
 return{
  alumno:String(student||'').trim(),nivel:0,tipo_actividad:TYPE,numero_actividad:0,nota:wallet.euros,
  aciertos:wallet.correctAnswers,errores:0,total_preguntas:648,intento:1,fecha:now,
  motivo:JSON.stringify(wallet),verbos_completados_total:wallet.rewardedMissions.length,
  pagos_realizados:wallet.totalPaid,tiempo_segundo:0,nota_examen:0,sesiones:1
 }
}
async function saveRemote(student,state){
 const name=String(student||'').trim();if(!name)return normalize(state);
 try{
  const current=await loadRemote(name),wallet=merge(current||blank(),state),payload=rowFor(name,wallet);
  const filter=TABLE+'?alumno=ilike.'+encodeURIComponent(name)+'&tipo_actividad=eq.'+TYPE;
  const exists=Boolean(current);
  const response=await request(exists?filter:TABLE,{
   method:exists?'PATCH':'POST',
   headers:{'Content-Type':'application/json','Prefer':'return=minimal'},
   body:JSON.stringify(payload)
  });
  return response.ok?wallet:normalize(state)
 }catch(e){return normalize(state)}
}
async function loadAll(){
 const wallets={};
 try{
  const response=await request(TABLE+'?select=alumno,aciertos,nota,pagos_realizados,motivo,created_at&tipo_actividad=eq.'+TYPE+'&order=created_at.desc&limit=1000');
  if(!response.ok)return wallets;
  const rows=await response.json();
  rows.forEach(row=>{
   const key=slug(row.alumno);if(key&&!wallets[key])wallets[key]=stateFromRow(row)
  })
 }catch(e){}
 return wallets
}
  async function payStudent(student,teacher,requestedAmount){
    const current=normalize(await loadRemote(student));
    if(current.euros<=0)return current;
    const wanted=integer(requestedAmount);
    if(wanted<=0)return current;
    const amount=Math.min(wanted,current.euros),paidAt=new Date().toISOString();
    current.totalPaid+=amount;
    current.payments.unshift({
      id:'pay-'+Date.now()+'-'+Math.random().toString(36).slice(2,8),
      amount,paidAt,teacher:String(teacher||'').trim()
    });
    current.euros=Math.max(0,current.totalEarned-current.totalPaid);current.updatedAt=paidAt;
    return saveRemote(student,current)
  }

function plainObject(value){return value&&typeof value==='object'&&!Array.isArray(value)?value:{}}
function dataFromRow(row){
 if(!row)return null;
 try{
  const parsed=JSON.parse(String(row.motivo||'{}'));
  return plainObject(parsed.data||parsed)
 }catch(e){return null}
}
async function loadData(student,type){
 const name=String(student||'').trim(),kind=String(type||'').trim();
 if(!name||!kind)return null;
 try{
  const path=TABLE+'?select=alumno,motivo,created_at&alumno=ilike.'+
   encodeURIComponent(name)+'&tipo_actividad=eq.'+encodeURIComponent(kind)+'&order=created_at.desc&limit=1';
  const response=await request(path);
  if(!response.ok)return null;
  const rows=await response.json();
  return rows&&rows[0]?dataFromRow(rows[0]):null
 }catch(e){return null}
}
async function saveData(student,type,data){
 const name=String(student||'').trim(),kind=String(type||'').trim();
 if(!name||!kind)return plainObject(data);
 const value=Object.assign({},plainObject(data),{updatedAt:new Date().toISOString()});
 try{
  const existing=await loadData(name,kind);
  const now=new Date().toISOString();
  const payload={
   alumno:name,nivel:0,tipo_actividad:kind,numero_actividad:0,nota:0,aciertos:0,errores:0,
   total_preguntas:0,intento:1,fecha:now,motivo:JSON.stringify({version:1,data:value}),
   verbos_completados_total:0,pagos_realizados:0,tiempo_segundo:0,nota_examen:0,sesiones:1
  };
  const filter=TABLE+'?alumno=ilike.'+encodeURIComponent(name)+'&tipo_actividad=eq.'+encodeURIComponent(kind);
  const response=await request(existing?filter:TABLE,{
   method:existing?'PATCH':'POST',
   headers:{'Content-Type':'application/json','Prefer':'return=minimal'},
   body:JSON.stringify(payload)
  });
  return response.ok?value:plainObject(data)
 }catch(e){return plainObject(data)}
}
function stateScore(value){
 const data=plainObject(value);
 return integer(data.completedRound)*100000+integer(data.roundNumber)*10000+
  integer(data.index)*100+integer(data.correct)+integer(data.completedCount);
}
function newerState(localValue,remoteValue){
 const local=plainObject(localValue),remote=plainObject(remoteValue);
 if(!Object.keys(remote).length)return local;
 if(!Object.keys(local).length)return remote;
 const localTime=Date.parse(String(local.updatedAt||''))||0;
 const remoteTime=Date.parse(String(remote.updatedAt||''))||0;
 if(remoteTime!==localTime)return remoteTime>localTime?remote:local;
 return stateScore(remote)>=stateScore(local)?remote:local
}
function mergeNotebook(left,right){
 const result=[],seen=new Map();
 [left,right].forEach(list=>(Array.isArray(list)?list:[]).forEach(item=>{
  if(!item||typeof item!=='object')return;
  const word=String(item.word||'').trim(),key=slug(word);
  if(!key)return;
  const current=seen.get(key);
  const next=Object.assign({},current||{},item,{word});
  next.count=Math.max(integer(current&&current.count),integer(item.count),1);
  seen.set(key,next)
 }));
 seen.forEach(item=>result.push(item));
 return result.sort((a,b)=>String(a.word).localeCompare(String(b.word)))
}

window.MV_WALLET={TYPE,blank,normalize,merge,slug,loadRemote,saveRemote,loadAll,payStudent};
window.MV_CLOUD={loadData,saveData,newerState,mergeNotebook};
})();
