delete process.env.DEBUG; // Login credentials must never enter library debug logs.
const crypto=require('node:crypto');
const http=require('node:http');
const {spawnSync}=require('node:child_process');
const {LoginSession,EAuthTokenPlatformType}=require('steam-session');
const QRCode=require('qrcode');
const {steamid,checkRefresh,save}=require('./state.cjs');
const {validateToken}=require('../steam-family.cjs');
const repo='zixu0779/zixu0779.github.io';
async function main(){
  if(spawnSync('gh',['auth','status'],{stdio:'ignore'}).status!==0) throw Error('Run gh auth login first');
  const options={machineFriendlyName:'Sycamore Blog Daily Sync'};
  if(process.env.HTTPS_PROXY) options.httpProxy=process.env.HTTPS_PROXY;
  let session, busy=false, version=0;
  let state={phase:'idle',message:'准备好手机后，点击生成二维码。',qr:''};
  const page=`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Steam 首次授权</title><style>body{font:16px system-ui;background:#171c26;color:#e6e8ef;text-align:center;padding:48px 20px}img{width:300px;max-width:90vw;border-radius:12px}p{line-height:1.8}h1{font-size:24px}button{padding:12px 24px;border:0;border-radius:10px;background:#aebfd8;color:#171c26;font:inherit;cursor:pointer}button:disabled{opacity:.5}</style><h1>Steam · 博客每日同步</h1><p id="status"></p><img id="qr" hidden alt="Steam 登录二维码"><p><button id="start">生成新二维码</button></p><p>授权账号：${steamid}<br>用 Steam 手机 App 的扫码功能确认登录。<br>不要扫描聊天里的旧图片。</p><script>
  const statusNode=document.querySelector('#status'),image=document.querySelector('#qr'),button=document.querySelector('#start');let last='';
  async function update(){try{const s=await fetch('/status',{cache:'no-store'}).then(r=>r.json());statusNode.textContent=s.message;image.hidden=!s.qr;if(s.qr!==last){image.src=s.qr;last=s.qr}button.disabled=['starting','saving','success'].includes(s.phase);button.textContent=s.phase==='idle'?'生成二维码':'重新生成二维码';}catch{statusNode.textContent='本机授权服务未连接，请告诉助手。'}}
  button.onclick=async()=>{button.disabled=true;await fetch('/start',{method:'POST'});await update()};update();setInterval(update,1500);
  </script>`;
  const server=http.createServer(async(req,res)=>{
    const host=req.headers.host;
    if(!['127.0.0.1:46801','localhost:46801'].includes(host)){res.writeHead(403);return res.end()}
    res.setHeader('Cache-Control','no-store');
    res.setHeader('X-Content-Type-Options','nosniff');
    if(req.url==='/status'){res.setHeader('Content-Type','application/json');return res.end(JSON.stringify(state))}
    if(req.url==='/start' && req.method==='POST'){
      if(req.headers.origin && !['http://127.0.0.1:46801','http://localhost:46801'].includes(req.headers.origin)){res.writeHead(403);return res.end()}
      if(!busy && !['saving','success'].includes(state.phase)) start();
      return res.end('ok');
    }
    res.setHeader('Content-Type','text/html; charset=utf-8');res.end(page);
  });
  server.on('error',()=>{console.error('Local authorization port unavailable. Stop the previous login process and retry.');process.exitCode=1});
  server.listen(46801,'127.0.0.1',()=>console.log('Authorization page ready: http://127.0.0.1:46801 . Generate the QR only when ready to scan.'));
  async function start(){
    busy=true;const current=++version;
    if(session) session.cancelLoginAttempt();
    const attempt=session=new LoginSession(EAuthTokenPlatformType.MobileApp,options);
    attempt.loginTimeout=300000;
    state={phase:'starting',message:'正在向 Steam 申请新二维码…',qr:''};
    function fail(message){if(current!==version)return;attempt.cancelLoginAttempt();state={phase:'error',message,qr:''};busy=false;}
    async function updateQR(url){
      const qr=await QRCode.toDataURL(url,{margin:3,width:420});
      if(current===version && !['saving','success','error'].includes(state.phase)) state.qr=qr;
    }
    // steam-session 1.9.4 exposes replacement challenges through its debug event
    // but does not update the originally returned QR. Inspect only this field; never log payloads.
    attempt.on('debug',(message,payload)=>{
      if(message==='poll response' && payload?.newChallengeUrl) updateQR(payload.newChallengeUrl).catch(()=>fail('二维码更新失败，请重新生成。'));
    });
    attempt.on('remoteInteraction',()=>{if(current===version)state.message='Steam 已检测到扫码，请在手机上确认。'});
    attempt.on('error',error=>fail(`Steam 登录会话中断${Number.isInteger(error.eresult)?'（状态码 '+error.eresult+'）':''}。请重新生成；若手机仍报错，请告诉助手具体提示。`));
    attempt.on('timeout',()=>fail('本机等待超时，请点击重新生成。Steam 二维码本身也可能提前失效。'));
    attempt.on('authenticated',async()=>{
      if(current!==version)return;
      state={phase:'saving',message:'已收到授权，正在验证续期并安全保存…',qr:''};busy=true;
      try{
        checkRefresh(attempt.refreshToken);
        await attempt.refreshAccessToken();validateToken(attempt.accessToken,steamid);
        const key=crypto.randomBytes(32).toString('base64');
        const result=spawnSync('gh',['secret','set','STEAM_TOKEN_KEY','--repo',repo],{input:key,encoding:'utf8',stdio:['pipe','ignore','ignore']});
        if(result.status!==0)throw Error();
        save(attempt.refreshToken,key);
        state={phase:'success',message:'授权成功，自动获取访问令牌已验证，凭据已加密保存。请回到聊天告诉助手“已授权”。',qr:''};
        console.log('Steam authorization succeeded; encrypted credential saved and GitHub Secret configured.');
      }catch{fail('扫码已完成，但账号校验、续期验证或保存失败。这不是二维码过期，请告诉助手。')}
    });
    try{
      const result=await attempt.startWithQR();
      if(current!==version)return;
      state.phase='waiting';state.message='新二维码已生成，请现在扫码。若手机提示失效，可直接点击重新生成。';
      await updateQR(result.qrChallengeUrl);
    }catch{fail('无法向 Steam 申请二维码，请检查网络后重试。')}
    finally{busy=false}
  }
}
main().catch(e=>{console.error(e.message==='Run gh auth login first'?e.message:'Steam authorization could not start; check network and retry.');process.exitCode=1});
