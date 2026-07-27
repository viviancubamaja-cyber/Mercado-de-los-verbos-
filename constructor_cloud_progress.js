(function(){
'use strict';

const timers={};

function readLocal(key){
 try{return JSON.parse(localStorage.getItem(key)||'null')}catch(e){return null}
}
function writeLocal(key,value){
 if(value&&typeof value==='object')localStorage.setItem(key,JSON.stringify(value));
 else localStorage.removeItem(key)
}
async function sync(student,type,key){
 const local=readLocal(key);
 if(!window.MV_CLOUD)return local;
 const remote=await MV_CLOUD.loadData(student,type);
 const chosen=MV_CLOUD.newerState(local,remote);
 if(chosen&&Object.keys(chosen).length)writeLocal(key,chosen);
 return chosen
}
function save(student,type,key,value){
 const data=Object.assign({},value||{},{updatedAt:new Date().toISOString()});
 writeLocal(key,data);
 if(!window.MV_CLOUD||!student)return data;
 clearTimeout(timers[type]);
 timers[type]=setTimeout(()=>MV_CLOUD.saveData(student,type,data),300);
 return data
}
async function flush(student,type,key){
 if(!window.MV_CLOUD||!student)return readLocal(key);
 clearTimeout(timers[type]);
 return MV_CLOUD.saveData(student,type,readLocal(key)||{})
}
async function clear(student,type,key,tombstone){
 clearTimeout(timers[type]);
 delete timers[type];
 try{localStorage.removeItem(key)}catch(_){}
 const value=Object.assign({student,finished:true,updatedAt:new Date().toISOString()},tombstone||{});
 if(window.MV_CLOUD)return MV_CLOUD.saveData(student,type,value);
 return value;
}
async function syncFlags(student,type,prefix,zones){
 const local={};
 zones.forEach(zone=>{if(localStorage.getItem(prefix+zone)==='completed')local[zone]=true});
 let remote=null;
 if(window.MV_CLOUD)remote=await MV_CLOUD.loadData(student,type);
 const merged=Object.assign({},remote&&remote.zones||{},local);
 Object.keys(merged).forEach(zone=>{if(merged[zone])localStorage.setItem(prefix+zone,'completed')});
 if(window.MV_CLOUD)MV_CLOUD.saveData(student,type,{zones:merged});
 return merged
}
function saveFlags(student,type,prefix,zones){
 const completed={};
 zones.forEach(zone=>{if(localStorage.getItem(prefix+zone)==='completed')completed[zone]=true});
 if(window.MV_CLOUD&&student)MV_CLOUD.saveData(student,type,{zones:completed});
 return completed
}

window.MV_PROGRESS={readLocal,writeLocal,sync,save,flush,clear,syncFlags,saveFlags};
})();
