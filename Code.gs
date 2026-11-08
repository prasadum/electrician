/* NSTI Calicut modules - email-code login + progress (Google Apps Script bound to a Sheet)
   Setup: Extensions > Apps Script > paste. Project Settings > Script properties: ADMIN_KEY = your secret.
   Deploy > New deployment > Web app > Execute as: Me > Access: Anyone. Authorise (Gmail send + Sheets). Copy /exec URL to config.js */
const HEAD=['email','batch','module','slide','xp','done','updated','json'];
const sh_=()=>{const s=SpreadsheetApp.getActiveSpreadsheet();let t=s.getSheetByName('Progress');if(!t){t=s.insertSheet('Progress');t.appendRow(HEAD)}return t};
const out_=o=>ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
function secret_(){const p=PropertiesService.getScriptProperties();let s=p.getProperty('SECRET');if(!s){s=Utilities.getUuid()+Utilities.getUuid();p.setProperty('SECRET',s)}return s}
function tok_(email){return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(email,secret_()))}
function okTok_(email,t){return !!t&&t===tok_(email)}
const norm_=e=>String(e||'').trim().toLowerCase();
const valid_=e=>/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)&&e.length<=100;
function doPost(e){try{const b=JSON.parse(e.postData.contents),c=CacheService.getScriptCache(),em=norm_(b.email);if(!valid_(em))return out_({ok:false,e:'email'});
 if(b.action==='send'){const n=+(c.get('n:'+em)||0);if(n>=5)return out_({ok:false,e:'limit'});c.put('n:'+em,String(n+1),3600);
  const code=String(Math.floor(100000+Math.random()*900000));c.put('otp:'+em,code,600);c.put('try:'+em,'0',600);
  MailApp.sendEmail(em,'NSTI Calicut login code: '+code,'Your NSTI Calicut login code is '+code+'. It works for 10 minutes. If you did not ask for it, ignore this email.');return out_({ok:true})}
 if(b.action==='verify'){const code=c.get('otp:'+em),tr=+(c.get('try:'+em)||0);if(!code||tr>=5)return out_({ok:false,e:'expired'});
  if(String(b.code).trim()!==code){c.put('try:'+em,String(tr+1),600);return out_({ok:false,e:'wrong'})}
  c.remove('otp:'+em);const t=sh_(),v=t.getDataRange().getValues();for(let i=1;i<v.length;i++)if(v[i][0]===em)return out_({ok:true,token:tok_(em),batch:v[i][1],data:JSON.parse(v[i][7]||'{}')});return out_({ok:true,token:tok_(em),batch:'',data:{}})}
 if(b.action==='save'){if(!okTok_(em,b.token))return out_({ok:false,e:'auth'});const t=sh_(),v=t.getDataRange().getValues();let r=-1;for(let i=1;i<v.length;i++)if(v[i][0]===em){r=i+1;break}
  const row=[em,String(b.batch||'').slice(0,30),String(b.module||''),b.slide||0,b.xp||0,b.done||0,new Date(),JSON.stringify(b.data||{}).slice(0,40000)];
  if(r<0)t.appendRow(row);else t.getRange(r,1,1,row.length).setValues([row]);return out_({ok:true})}
 return out_({ok:false})}catch(err){return out_({ok:false,e:String(err)})}}
function doGet(e){if(e.parameter.action==='summary'){if(e.parameter.key!==PropertiesService.getScriptProperties().getProperty('ADMIN_KEY'))return out_({ok:false,e:'key'});
  const v=sh_().getDataRange().getValues();return out_({ok:true,rows:v.slice(1).map(r=>({email:r[0],batch:r[1],module:r[2],slide:r[3],xp:r[4],done:r[5],updated:r[6]}))})}
 return out_({ok:true})}
