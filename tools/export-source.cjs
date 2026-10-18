'use strict';
// Read-only decoder and verifier. This does not rebuild or modify the input QSP.
const fs=require('node:fs'),path=require('node:path');
const core=require('./text-workshop/core.cjs');
function decode(raw){
 const doc=core.parse(raw);
 if(!core.serialize(doc).equals(raw))throw Error('QSP byte roundtrip failed');
 const locations=doc.locations.map(loc=>{
  const count=Number(core.shift(doc.lines[loc.body+1],5));
  const actions=Array.from({length:count},(_,i)=>({image:core.shift(doc.lines[loc.body+2+i*3],5),name:core.shift(doc.lines[loc.body+3+i*3],5),body:core.shift(doc.lines[loc.body+4+i*3],5)}));
  return{index:loc.index,name:loc.name,desc:core.shift(doc.lines[loc.desc],5),body:core.shift(doc.lines[loc.body],5),actions};
 });
 return{schema:1,format:'QSPGAME',sha256:core.hash(raw),rawHeader:doc.lines.slice(0,3),locations};
}
function restore(data){
 const lines=[...data.rawHeader,core.shift(String(data.locations.length),-5)];
 for(const loc of data.locations){
  for(const field of [loc.name,loc.desc,loc.body,String(loc.actions.length)])lines.push(core.shift(field,-5));
  for(const action of loc.actions)for(const field of [action.image,action.name,action.body])lines.push(core.shift(field,-5));
 }
 lines.push('');return Buffer.from(lines.join('\r\n'),'utf16le');
}
function run(input,output){
 const raw=fs.readFileSync(input),data=decode(raw);
 // The JSON is the lossless representation. Per-location QSP source views are
 // provided for browsing; they are not a separate supported build pipeline.
 fs.mkdirSync(path.join(output,'locations'),{recursive:true});
 fs.writeFileSync(path.join(output,'locations.json'),JSON.stringify(data,null,2)+'\n');
 const reread=JSON.parse(fs.readFileSync(path.join(output,'locations.json'),'utf8'));
 if(!restore(reread).equals(raw))throw Error('Decoded JSON cannot reproduce input QSP exactly');
 const index=[];
 for(const loc of data.locations){
  const slug=loc.name.replace(/[^A-Za-z0-9_-]+/g,'_').replace(/^_+|_+$/g,'').slice(0,70)||'location';
  const file=String(loc.index).padStart(3,'0')+'-'+slug+'.qsrc';
  let view='# '+loc.name+'\r\n! Readable view; authoritative fields are in ../locations.json.\r\n';
  if(loc.desc)view+='! Static description (JSON escaped): '+JSON.stringify(loc.desc)+'\r\n';
  view+=loc.body+'\r\n';
  for(const [i,a]of loc.actions.entries())view+='\r\n! Built-in action '+i+' image='+JSON.stringify(a.image)+' name='+JSON.stringify(a.name)+'\r\n'+a.body+'\r\n';
  view+='------------ '+loc.name+' ------------\r\n';
  fs.writeFileSync(path.join(output,'locations',file),view,'utf8');
  index.push({index:loc.index,name:loc.name,file:'locations/'+file,actions:loc.actions.length});
 }
 fs.writeFileSync(path.join(output,'index.json'),JSON.stringify(index,null,2)+'\n');
 const result={sha256:core.hash(raw),bytes:raw.length,locations:data.locations.length,byteExactJsonRoundtrip:true};
 console.log(JSON.stringify(result));return result;
}
if(require.main===module){const input=process.argv[2],output=process.argv[3];if(!input||!output)throw Error('Usage: node tools/export-source.cjs <input.qsp> <output-directory>');run(input,output);}
module.exports={decode,restore,run};
