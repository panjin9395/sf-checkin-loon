/*
 * 顺丰签到 - Loon 插件
 * 原理: 挂在顺丰 mcs-mimp-web 流量上, 每次 App 发起请求时抓取当前新鲜 cookie,
 *       立即调用签到接口 (cookie 抓到瞬间就用, 不受 20 分钟过期影响)
 * 触发: 打开顺丰 App 进入会员/积分相关页面即可
 */

// ===== MD5 (精简实现) =====
function md5(s){
  function rl(n,c){return(n<<c)|(n>>>(32-c));}
  function au(x,y){var l=(x&0xFFFF)+(y&0xFFFF),m=(x>>16)+(y>>16)+(l>>16);return(m<<16)|(l&0xFFFF);}
  function cmn(q,a,b,x,s,t){return au(rl(au(au(a,q),au(x,t)),s),b);}
  function ff(a,b,c,d,x,s,t){return cmn((b&c)|((~b)&d),a,b,x,s,t);}
  function gg(a,b,c,d,x,s,t){return cmn((b&d)|(c&(~d)),a,b,x,s,t);}
  function hh(a,b,c,d,x,s,t){return cmn(b^c^d,a,b,x,s,t);}
  function ii(a,b,c,d,x,s,t){return cmn(c^(b|(~d)),a,b,x,s,t);}
  function sb(str){
    var n=str.length,b=[(n)],i;
    for(i=0;i<(n-(n%4));i+=4){b[i>>2]=(str.charCodeAt(i))|(str.charCodeAt(i+1)<<8)|(str.charCodeAt(i+2)<<16)|(str.charCodeAt(i+3)<<24);}
    var bl=[0,8,16,24];
    switch(n%4){case 0:b[i>>2]=0x80;break;case 1:b[i>>2]=(str.charCodeAt(i))|(0x80<<8);break;case 2:b[i>>2]=(str.charCodeAt(i))|(str.charCodeAt(i+1)<<8)|(0x80<<16);break;case 3:b[i>>2]=(str.charCodeAt(i))|(str.charCodeAt(i+1)<<8)|(str.charCodeAt(i+2)<<16)|(0x80<<24);break;}
    return b;
  }
  function bh(num){var s="",j;for(j=0;j<=3;j++){s+=("0123456789abcdef".charAt((num>>(j*8+4))&0x0F))+("0123456789abcdef".charAt((num>>(j*8))&0x0F));}return s;}
  function ue(str){str=str.replace(/\r\n/g,"\n");var u="";for(var n=0;n<str.length;n++){var c=str.charCodeAt(n);if(c<128){u+=String.fromCharCode(c);}else if((c>127)&&(c<2048)){u+=String.fromCharCode((c>>6)|192);u+=String.fromCharCode((c&63)|128);}else{u+=String.fromCharCode((c>>12)|224);u+=String.fromCharCode(((c>>6)&63)|128);u+=String.fromCharCode((c&63)|128);}}return u;}
  var x=[],k,AA,BB,CC,DD,a=1732584193,b=-271733879,c=-1732584194,d=271733878;
  s=ue(s);x=sb(s);var len=s.length*8;
  x[(((len+64)>>>9)<<4)+14]=len;
  for(var i=0;i<x.length;i+=16){
    AA=a;BB=b;CC=c;DD=d;
    a=ff(a,b,c,d,x[i+0],7,-680876936);d=ff(d,a,b,c,x[i+1],12,-389564586);c=ff(c,d,a,b,x[i+2],17,606105819);b=ff(b,c,d,a,x[i+3],22,-1044525330);
    a=ff(a,b,c,d,x[i+4],7,-176418897);d=ff(d,a,b,c,x[i+5],12,1200080426);c=ff(c,d,a,b,x[i+6],17,-1473231341);b=ff(b,c,d,a,x[i+7],22,-45705983);
    a=ff(a,b,c,d,x[i+8],7,1770035416);d=ff(d,a,b,c,x[i+9],12,-1958414417);c=ff(c,d,a,b,x[i+10],17,-42063);b=ff(b,c,d,a,x[i+11],22,-1990404162);
    a=ff(a,b,c,d,x[i+12],7,1804603682);d=ff(d,a,b,c,x[i+13],12,-40341101);c=ff(c,d,a,b,x[i+14],17,-1502002290);b=ff(b,c,d,a,x[i+15],22,1236535329);
    a=gg(a,b,c,d,x[i+1],5,-165796510);d=gg(d,a,b,c,x[i+6],9,-1069501632);c=gg(c,d,a,b,x[i+11],14,643717713);b=gg(b,c,d,a,x[i+0],20,-373897302);
    a=gg(a,b,c,d,x[i+5],5,-701558691);d=gg(d,a,b,c,x[i+10],9,38016083);c=gg(c,d,a,b,x[i+15],14,-660478335);b=gg(b,c,d,a,x[i+4],20,-405537848);
    a=gg(a,b,c,d,x[i+9],5,568446438);d=gg(d,a,b,c,x[i+14],9,-1019803690);c=gg(c,d,a,b,x[i+3],14,-187363961);b=gg(b,c,d,a,x[i+8],20,1163531501);
    a=gg(a,b,c,d,x[i+13],5,-1444681467);d=gg(d,a,b,c,x[i+2],9,-51403784);c=gg(c,d,a,b,x[i+7],14,1735328473);b=gg(b,c,d,a,x[i+12],20,-1926607734);
    a=hh(a,b,c,d,x[i+5],4,-378558);d=hh(d,a,b,c,x[i+8],11,-2022574463);c=hh(c,d,a,b,x[i+11],16,1839030562);b=hh(b,c,d,a,x[i+14],23,-35309556);
    a=hh(a,b,c,d,x[i+1],4,-1530992060);d=hh(d,a,b,c,x[i+4],11,1272893353);c=hh(c,d,a,b,x[i+7],16,-155497632);b=hh(b,c,d,a,x[i+10],23,-1094730640);
    a=hh(a,b,c,d,x[i+13],4,681279174);d=hh(d,a,b,c,x[i+0],11,-358537222);c=hh(c,d,a,b,x[i+3],16,-722521979);b=hh(b,c,d,a,x[i+6],23,76029189);
    a=hh(a,b,c,d,x[i+9],4,-640364487);d=hh(d,a,b,c,x[i+12],11,-421815835);c=hh(c,d,a,b,x[i+15],16,530742520);b=hh(b,c,d,a,x[i+2],23,-995338651);
    a=ii(a,b,c,d,x[i+0],6,-198630844);d=ii(d,a,b,c,x[i+7],10,1126891415);c=ii(c,d,a,b,x[i+14],15,-1416354905);b=ii(b,c,d,a,x[i+5],21,-57434055);
    a=ii(a,b,c,d,x[i+12],6,1700485571);d=ii(d,a,b,c,x[i+3],10,-1894986606);c=ii(c,d,a,b,x[i+10],15,-1051523);b=ii(b,c,d,a,x[i+1],21,-2054922799);
    a=ii(a,b,c,d,x[i+8],6,1873313359);d=ii(d,a,b,c,x[i+15],10,-30611744);c=ii(c,d,a,b,x[i+6],15,-1560198380);b=ii(b,c,d,a,x[i+13],21,1309151649);
    a=ii(a,b,c,d,x[i+4],6,-145523070);d=ii(d,a,b,c,x[i+11],10,-1120210379);c=ii(c,d,a,b,x[i+2],15,718787259);b=ii(b,c,d,a,x[i+9],21,-343485551);
    a=au(a,AA);b=au(b,BB);c=au(c,CC);d=au(d,DD);
  }
  return (bh(a)+bh(b)+bh(c)+bh(d));
}
/*
 * 顺丰签到主逻辑 (Loon http-request 脚本)
 * 依赖: sf_lib.js 的 md5 函数 (本文件会内联, 见下方合并版 sf_checkin.js)
 *
 * 工作流程:
 *  1. 从拦截到的顺丰请求 header 里取出当前 cookie
 *  2. 用 cookie 调 automaticSignFetchPackage 签到
 *  3. 推送结果, 并对原请求放行 (不修改)
 */

const BASE = "https://mcs-mimp-web.sf-express.com";
const SYS_CODE = "MCS-MIMP-CORE";
const DEVICE_ID = "33B73C32-36C8-4E69-A199-F34AB52E6E9E";
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 mediaCode=SFEXPRESSAPP-iOS-ML";

// ---- 防重复: 每天只签一次 ----
const TODAY = new Date().toISOString().slice(0, 10);
const LASTRUN_KEY = "sf_lastrun_ts";

function genSignature(ts) {
  return md5(`wwesldfs29aniversaryvdld29&timestamp=${ts}&sysCode=${SYS_CODE}`);
}

// sw8: base64(uuid) 拼接, 复刻 code.js 的 ft()
function b64(s) {
  // utf8 -> base64
  const bytes = unescape(encodeURIComponent(s));
  let r = "", i;
  const t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (i = 0; i < bytes.length; i += 3) {
    const a = bytes.charCodeAt(i), b = bytes.charCodeAt(i + 1), c = bytes.charCodeAt(i + 2);
    const n = (a << 16) | ((isNaN(b) ? 0 : b) << 8) | (isNaN(c) ? 0 : c);
    r += t.charAt((n >> 18) & 63) + t.charAt((n >> 12) & 63);
    r += isNaN(b) ? "=" : t.charAt((n >> 6) & 63);
    r += isNaN(c) ? "=" : t.charAt(n & 63);
  }
  return r;
}
function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0, v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
function genSw8(urlPath) {
  const traceId = uuid();
  const n = b64(traceId);
  const i = b64(uuid());
  const o = b64("fb40817085be4e398e0b6f4b08177746");
  const a = b64("web");
  const s = b64("");
  const c = b64(urlPath);
  return `1-${n}-${i}-0-${o}-${a}-${s}-${c}`;
}

function buildHeaders(cookie, urlPath, referer, extra) {
  const ts = String(Date.now());
  const h = {
    "User-Agent": UA,
    "Content-Type": "application/json",
    "timestamp": ts,
    "signature": genSignature(ts),
    "channel": "weixin",
    "syscode": SYS_CODE,
    "sw8": genSw8(urlPath),
    "platform": "SFAPP",
    "accept-language": "zh-CN,zh-Hans;q=0.9",
    "origin": BASE,
    "referer": referer,
    "deviceid": DEVICE_ID,
    "cookie": cookie,
  };
  if (extra) for (const k in extra) h[k] = extra[k];
  return h;
}

function notify(title, sub, body) {
  $notification.post(title, sub, body);
}

function done() { $done({}); }

function main() {
  // 保护: 必须在 http-request 流量拦截上下文运行
  if (typeof $request === "undefined" || !$request) {
    notify("顺丰签到[调试]", "未在流量拦截上下文运行", "请勿手动运行脚本; 应打开顺丰App进入积分页, 由插件自动触发");
    done(); return;
  }

  // 取拦截请求的 cookie (兼容各种大小写写法)
  const reqHeaders = $request.headers || {};
  let cookie = "";
  for (const k in reqHeaders) {
    if (k.toLowerCase() === "cookie") { cookie = reqHeaders[k]; break; }
  }

  const hasSession = cookie.indexOf("sessionId=") !== -1;
  if (!cookie || !hasSession) {
    done(); return;
  }

  // 限流: 距上次执行不足 10 分钟则跳过 (防止 App 内翻页反复触发刷屏)
  // 注意: 不再"整天跳过", 这样可随时手动重测; 签到/任务接口对重复调用安全
  const lastTs = parseInt($persistentStore.read(LASTRUN_KEY) || "0", 10);
  const nowTs = Date.now();
  if (nowTs - lastTs < 0 * 60 * 1000) { done(); return; }
  $persistentStore.write(String(nowTs), LASTRUN_KEY);

  const urlPath = "/mcs-mimp/commonPost/~memberNonactivity~integralTaskSignPlusService~automaticSignFetchPackage";
  const referer = `${BASE}/superWelfare?path=/superWelfare&supportShare=YES&from=appIndex&tab=1`;
  const headers = buildHeaders(cookie, urlPath, referer, {
    "Accept": "application/json, text/plain, */*",
  });

  $httpClient.post({
    url: BASE + urlPath,
    headers: headers,
    body: JSON.stringify({ comeFrom: "vioin", channelFrom: "SFAPP" }),
  }, function (err, resp, data) {
    let signMsg = "";
    if (err) {
      signMsg = "签到请求失败";
    } else {
      try {
        const j = JSON.parse(data);
        if (j.success) {
          const obj = j.obj || {};
          const days = obj.countDay || 0;
          const list = obj.integralTaskSignPackageVOList || [];
          const pkg = list.length ? list.map(p => p.packetName || p.commodityName).join("、") : "";
          signMsg = obj.hasFinishSign === 1
            ? `今日已签 连签${days}天`
            : `签到成功 连签${days}天 ${pkg ? "获得:" + pkg : ""}`;
        } else {
          signMsg = "签到: " + (j.errorMessage || "失败");
        }
      } catch (e) {
        signMsg = "签到解析失败";
      }
    }
    // 签到后继续做每日任务
    doTasks(cookie, function (taskMsg) {
      notify("顺丰积分 ✅", signMsg, taskMsg);
      done();
    });
  });
}

// ===== 每日任务: 查询 -> 完成未完成 -> 领奖励 =====
function postJson(cookie, urlPath, bodyObj, cb) {
  const referer = `${BASE}/superWelfare?path=/superWelfare&supportShare=YES&from=appIndex&tab=1`;
  const headers = buildHeaders(cookie, urlPath, referer, {
    "Accept": "application/json, text/plain, */*",
  });
  $httpClient.post({
    url: BASE + urlPath,
    headers: headers,
    body: JSON.stringify(bodyObj),
  }, function (err, resp, data) {
    if (err) { cb(null); return; }
    try { cb(JSON.parse(data)); } catch (e) { cb(null); }
  });
}

function doTasks(cookie, finalCb) {
  const QUERY = "/mcs-mimp/commonPost/~memberNonactivity~integralTaskStrategyService~queryPointTaskAndSignFromES";
  const FINISH = "/mcs-mimp/commonPost/~memberEs~taskRecord~finishTask";
  const REWARD = "/mcs-mimp/commonNoLoginPost/~memberNonactivity~integralTaskStrategyService~fetchTasksReward";
  const body = { channelType: "1", deviceId: DEVICE_ID };

  postJson(cookie, QUERY, body, function (qr) {
    if (!qr || !qr.success) { finalCb("任务查询失败: " + (qr ? (qr.errorMessage||"") : "无返回")); return; }
    let tasks = (qr.obj && (qr.obj.taskTitleLevels || qr.obj.taskDtoList || qr.obj.taskList)) || [];

    const total = tasks.length;
    // "去完成" 表示未做; 其他(已完成/去领取等)视为已处理
    const todo = tasks.filter(t => t.taskCode && t.buttonContent === "去完成");
    const finished = total - todo.length;
    const doneNames = [];

    let done2 = 0;
    function step(i) {
      if (i >= todo.length) {
        // 全部完成后领奖励
        postJson(cookie, REWARD, body, function (rr) {
          let rmsg = "领奖未知";
          if (rr && rr.success) {
            const robj = rr.obj || {};
            const pts = robj.totalReward || robj.point || robj.integral || "";
            rmsg = "奖励已领取" + (pts ? `(+${pts})` : "");
          } else if (rr) {
            const m = rr.errorMessage || "";
            rmsg = (m.indexOf("无可领") !== -1 || m.indexOf("已领") !== -1) ? "暂无可领奖励" : ("领奖:" + m);
          }
          const detail = doneNames.length ? ("完成:" + doneNames.join("、")) : "";
          finalCb(`任务 ${finished + done2}/${total}; ${rmsg}${detail ? "; " + detail : ""}`);
        });
        return;
      }
      postJson(cookie, FINISH, { taskCode: todo[i].taskCode }, function (fr) {
        if (fr && fr.success) { done2++; doneNames.push(todo[i].title || ""); }
        setTimeout(function () { step(i + 1); }, 1500);
      });
    }
    step(0);
  });
}

main();
