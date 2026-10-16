// SF LAN upload only; no SF task requests. Key is paired locally, never in GitHub.
(function(){
 const base='http://192.168.9.102:8768', key=$persistentStore.read('sf_lan_key');
 const note=(s)=>$notification.post('顺丰会话同步','局域网模式',s);
 const hex=b=>Array.from(b,x=>x.toString(16).padStart(2,'0')).join('');
 const bytes=h=>new Uint8Array(h.match(/../g).map(x=>parseInt(x,16)));
 const utf=s=>new Uint8Array(Array.from(unescape(encodeURIComponent(s)),x=>x.charCodeAt(0)));
 if(typeof $request==='undefined'){note(key?'配对已设置；连接家中Wi-Fi后进入顺丰积分页。':'尚未配对，请先运行私密配对脚本。');return $done({});}
 if(!key)return $done({});
 const h=$request.headers||{},k=Object.keys(h).find(k=>k.toLowerCase()==='cookie'),cookie=k?String(h[k]):'';
 if(!/(?:^|;\s*)sessionId=[^;\s]+/.test(cookie))return $done({});
 if(Date.now()-Number($persistentStore.read('sf_lan_last_upload')||0)<60000)return $done({});
 $httpClient.get({url:base+'/challenge',timeout:1500,node:'DIRECT'},(err,res,body)=>{
  if(err||!res||res.status!==200)return $done({}); // Away from home: no cookie sent, no noisy notification.
  try{
   const nonce=JSON.parse(body).nonce;
   if(!/^[0-9a-f]{24}$/.test(nonce))throw Error();
   const enc=$crypto.aes.encrypt(utf(JSON.stringify({cookie,time:Date.now()/1000})),{mode:'gcm',key:bytes(key),iv:bytes(nonce),aad:utf('sf-lan-v1')});
   $httpClient.post({url:base+'/cookie',timeout:8000,node:'DIRECT',headers:{'Content-Type':'application/json'},body:JSON.stringify({nonce,ciphertext:hex(enc.ciphertext),tag:hex(enc.tag)})},(e,r,b)=>{
    let ok=false;try{ok=!e&&r.status===200&&JSON.parse(b).synced===true}catch(_){}
    if(ok){$persistentStore.write(String(Date.now()),'sf_lan_last_upload');note('已加密同步到102青龙；手机不再执行签到。');}else note('同步未确认，请查看102接收服务；未显示或记录Cookie。');
    $done({});
   });
  }catch(_){note('加密或配对错误，未上传会话。');$done({});}
 });
})();
