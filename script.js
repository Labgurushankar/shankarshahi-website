const m=document.getElementById('menu'),l=document.getElementById('links');
if(m&&l)m.onclick=()=>l.classList.toggle('open');

function setupModal(openButtonId, modalId, closeButtonId){
  const openBtn=document.getElementById(openButtonId);
  const modal=document.getElementById(modalId);
  const closeBtn=document.getElementById(closeButtonId);
  if(!modal)return;
  const close=()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true');};
  if(openBtn)openBtn.onclick=()=>{modal.classList.add('open');modal.setAttribute('aria-hidden','false');};
  if(closeBtn)closeBtn.onclick=close;
  modal.onclick=(e)=>{if(e.target===modal)close();};
  document.addEventListener('keydown',(e)=>{if(e.key==='Escape')close();});
}
setupModal('buyBookBtn','bookModal','closeBookModal');
setupModal('buySoftwareBtn','softwareModal','closeSoftwareModal');

// ---- Laboratory QC calculators ----
function parseQCValues(text){
  return String(text || '')
    .split(/[\s,;]+/)
    .map(v=>Number(v.trim()))
    .filter(v=>Number.isFinite(v));
}
function meanOf(a){return a.reduce((s,v)=>s+v,0)/a.length;}
function sampleSD(a){
  if(a.length<2)return NaN;
  const m=meanOf(a);
  return Math.sqrt(a.reduce((s,v)=>s+(v-m)*(v-m),0)/(a.length-1));
}
function fmt(v,d=2){return Number.isFinite(v)?v.toFixed(d):'—';}
function byId(id){return document.getElementById(id);}

const iqcBtn=byId('calculateIQC');
if(iqcBtn)iqcBtn.addEventListener('click',()=>{
  const targetMean=Number(byId('iqcTargetMean').value);
  const targetSD=Number(byId('iqcTargetSD').value);
  const values=parseQCValues(byId('iqcResults').value);
  const out=byId('iqcOutput');
  if(!Number.isFinite(targetMean)||!Number.isFinite(targetSD)||targetSD<=0||values.length<2){
    out.className='calc-output qc-status-bad';
    out.textContent='Please enter a valid target mean, target SD (>0) and at least 2 QC results.';
    return;
  }
  const obsMean=meanOf(values), obsSD=sampleSD(values);
  const cv=(obsSD/obsMean)*100;
  const bias=((obsMean-targetMean)/targetMean)*100;
  const sdi=(obsMean-targetMean)/targetSD;
  let cls='qc-status-good', decision='Within ±2 SD';
  if(Math.abs(sdi)>3){cls='qc-status-bad';decision='Beyond ±3 SD — investigate/reject';}
  else if(Math.abs(sdi)>2){cls='qc-status-warn';decision='Between ±2 and ±3 SD — warning';}
  out.className='calc-output';
  out.innerHTML=`<div class="calc-metrics"><span><strong>Observed Mean</strong><br>${fmt(obsMean)}</span><span><strong>Observed SD</strong><br>${fmt(obsSD)}</span><span><strong>CV%</strong><br>${fmt(cv)}%</span><span><strong>Bias%</strong><br>${fmt(bias)}%</span><span><strong>SDI</strong><br>${fmt(sdi)}</span><span><strong>QC Position</strong><br><em class="${cls}">${decision}</em></span></div>`;
});

function formatMonthLabel(value){
  if(!value)return 'Not specified';
  const [y,m]=String(value).split('-').map(Number);
  if(!y||!m)return value;
  return new Date(y,m-1,1).toLocaleDateString('en-US',{month:'long',year:'numeric'});
}
function safeFilePart(text){return String(text||'LJ-Chart').trim().replace(/[^a-z0-9_-]+/gi,'-').replace(/^-+|-+$/g,'')||'LJ-Chart';}
function drawLJ(canvas, mean, sd, values, meta={}){
  if(!canvas||!canvas.getContext)return;
  const ctx=canvas.getContext('2d');
  const w=canvas.width=760, h=canvas.height=390;
  ctx.clearRect(0,0,w,h);
  const pad={l:58,r:28,t:62,b:72};
  const yMin=mean-3.6*sd, yMax=mean+3.6*sd;
  const y=v=>pad.t+(yMax-v)/(yMax-yMin)*(h-pad.t-pad.b);
  const x=i=>pad.l+(values.length===1?0:(i/(values.length-1)))*(w-pad.l-pad.r);
  ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);

  ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#102b42';ctx.font='bold 18px Arial';
  ctx.fillText('Levey-Jennings QC Chart',w/2,20);
  ctx.font='bold 13px Arial';ctx.fillStyle='#315b78';
  ctx.fillText(`${meta.testName||'Test not specified'}  |  ${meta.monthLabel||'Month not specified'}`,w/2,42);

  ctx.font='12px Arial';ctx.textAlign='right';ctx.textBaseline='middle';
  const lines=[
    {k:3,label:'+3SD',c:'#b22c2c'},{k:2,label:'+2SD',c:'#d88700'},{k:1,label:'+1SD',c:'#6c9fc2'},
    {k:0,label:'Mean',c:'#17324d'},{k:-1,label:'-1SD',c:'#6c9fc2'},{k:-2,label:'-2SD',c:'#d88700'},{k:-3,label:'-3SD',c:'#b22c2c'}
  ];
  lines.forEach(L=>{
    const yy=y(mean+L.k*sd);
    ctx.strokeStyle=L.c;ctx.lineWidth=L.k===0?2:1;ctx.setLineDash(L.k===0?[]:[5,4]);
    ctx.beginPath();ctx.moveTo(pad.l,yy);ctx.lineTo(w-pad.r,yy);ctx.stroke();
    ctx.setLineDash([]);ctx.fillStyle=L.c;ctx.fillText(L.label,pad.l-7,yy);
  });
  ctx.strokeStyle='#9eb2c1';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(pad.l,pad.t);ctx.lineTo(pad.l,h-pad.b);ctx.lineTo(w-pad.r,h-pad.b);ctx.stroke();
  ctx.textAlign='center';ctx.fillStyle='#556b7b';
  values.forEach((v,i)=>{if(values.length<=20||i%Math.ceil(values.length/20)===0)ctx.fillText(String(i+1),x(i),h-pad.b+17);});
  ctx.strokeStyle='#1478c9';ctx.lineWidth=2;ctx.beginPath();
  values.forEach((v,i)=>{const xx=x(i),yy=y(v);if(i===0)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy);});ctx.stroke();
  values.forEach((v,i)=>{const z=(v-mean)/sd;ctx.beginPath();ctx.arc(x(i),y(v),4.2,0,Math.PI*2);ctx.fillStyle=Math.abs(z)>=3?'#b22c2c':Math.abs(z)>=2?'#d88700':'#1478c9';ctx.fill();});
  ctx.textAlign='center';ctx.fillStyle='#17324d';ctx.font='bold 12px Arial';ctx.fillText('QC Run', (pad.l+w-pad.r)/2, h-pad.b+36);

  ctx.strokeStyle='#dce7ef';ctx.beginPath();ctx.moveTo(pad.l,h-42);ctx.lineTo(w-pad.r,h-42);ctx.stroke();
  ctx.fillStyle='#17324d';ctx.font='12px Arial';ctx.textAlign='center';
  ctx.fillText(`Test: ${meta.testName||'Not specified'}    Month: ${meta.monthLabel||'Not specified'}    Mean: ${fmt(mean)}    SD: ${fmt(sd)}`,w/2,h-23);
}

const ljBtn=byId('plotLJ');
if(ljBtn)ljBtn.addEventListener('click',()=>{
  const mean=Number(byId('ljMean').value), sd=Number(byId('ljSD').value), values=parseQCValues(byId('ljResults').value), out=byId('ljSummary');
  const testName=(byId('ljTestName').value||'').trim();
  const monthValue=byId('ljMonth').value;
  const monthLabel=formatMonthLabel(monthValue);
  if(!Number.isFinite(mean)||!Number.isFinite(sd)||sd<=0||values.length<1){out.className='calc-output qc-status-bad';out.textContent='Please enter a valid target mean, SD (>0) and one or more QC results.';return;}
  const outside2=values.filter(v=>Math.abs((v-mean)/sd)>=2).length, outside3=values.filter(v=>Math.abs((v-mean)/sd)>=3).length;
  out.className='calc-output';
  out.innerHTML=`<div class="calc-metrics"><span><strong>Mean</strong><br>${fmt(mean)}</span><span><strong>±1 SD</strong><br>${fmt(mean-sd)} to ${fmt(mean+sd)}</span><span><strong>±2 SD</strong><br>${fmt(mean-2*sd)} to ${fmt(mean+2*sd)}</span><span><strong>±3 SD</strong><br>${fmt(mean-3*sd)} to ${fmt(mean+3*sd)}</span><span><strong>Runs ≥2 SD</strong><br>${outside2}</span><span><strong>Runs ≥3 SD</strong><br>${outside3}</span></div>`;
  const meta={testName:testName||'Not specified',monthValue,monthLabel};
  drawLJ(byId('ljCanvas'),mean,sd,values,meta);
  const metaBox=byId('ljMeta');
  metaBox.className='lj-meta';
  metaBox.innerHTML=`<strong>Test Name:</strong> ${meta.testName} &nbsp; | &nbsp; <strong>Month:</strong> ${monthLabel} &nbsp; | &nbsp; <strong>Mean:</strong> ${fmt(mean)} &nbsp; | &nbsp; <strong>SD:</strong> ${fmt(sd)}`;
  const dl=byId('downloadLJ');
  dl.disabled=false;
  dl.dataset.filename=`LJ-${safeFilePart(meta.testName)}-${safeFilePart(monthLabel)}.png`;
});

const downloadLJ=byId('downloadLJ');
if(downloadLJ)downloadLJ.addEventListener('click',()=>{
  const canvas=byId('ljCanvas');
  if(!canvas)return;
  const link=document.createElement('a');
  link.download=downloadLJ.dataset.filename||'Levey-Jennings-QC-Chart.png';
  link.href=canvas.toDataURL('image/png');
  document.body.appendChild(link);link.click();link.remove();
});


function westgardCheck(values, mean, sd){
  const z=values.map(v=>(v-mean)/sd), hits=[];
  z.forEach((v,i)=>{if(Math.abs(v)>=2)hits.push({rule:'1₂s',run:i+1,msg:`Run ${i+1} is ${fmt(v)} SD from mean (warning).`});if(Math.abs(v)>=3)hits.push({rule:'1₃s',run:i+1,msg:`Run ${i+1} is ${fmt(v)} SD from mean (reject).`});});
  for(let i=1;i<z.length;i++){
    if(Math.abs(z[i])>=2&&Math.abs(z[i-1])>=2&&Math.sign(z[i])===Math.sign(z[i-1]))hits.push({rule:'2₂s',run:i+1,msg:`Runs ${i}–${i+1} are ≥2 SD on the same side.`});
    if(Math.sign(z[i])!==Math.sign(z[i-1])&&Math.abs(z[i]-z[i-1])>=4)hits.push({rule:'R₄s',run:i+1,msg:`Runs ${i}–${i+1} differ by ≥4 SD on opposite sides.`});
  }
  for(let i=3;i<z.length;i++){
    const q=z.slice(i-3,i+1); if(q.every(v=>v>=1)||q.every(v=>v<=-1))hits.push({rule:'4₁s',run:i+1,msg:`Runs ${i-2}–${i+1} are ≥1 SD on the same side.`});
  }
  for(let i=9;i<z.length;i++){
    const q=z.slice(i-9,i+1); if(q.every(v=>v>0)||q.every(v=>v<0))hits.push({rule:'10x',run:i+1,msg:`Runs ${i-8}–${i+1} are all on the same side of the mean.`});
  }
  return {z,hits};
}
const wgBtn=byId('checkWestgard');
if(wgBtn)wgBtn.addEventListener('click',()=>{
  const mean=Number(byId('wgMean').value),sd=Number(byId('wgSD').value),values=parseQCValues(byId('wgResults').value),out=byId('wgOutput');
  if(!Number.isFinite(mean)||!Number.isFinite(sd)||sd<=0||values.length<1){out.className='calc-output qc-status-bad';out.textContent='Please enter a valid target mean, SD (>0) and sequential QC results.';return;}
  const {z,hits}=westgardCheck(values,mean,sd); const reject=hits.some(h=>['1₃s','2₂s','R₄s','4₁s','10x'].includes(h.rule));
  const decision=reject?'<span class="qc-status-bad">REJECT / INVESTIGATE</span>':hits.some(h=>h.rule==='1₂s')?'<span class="qc-status-warn">WARNING — review 1₂s</span>':'<span class="qc-status-good">NO LISTED RULE TRIGGERED</span>';
  const uniq=[]; const seen=new Set(); hits.forEach(h=>{const k=h.rule+'|'+h.msg;if(!seen.has(k)){seen.add(k);uniq.push(h);}});
  out.className='calc-output';
  out.innerHTML=`<strong>QC Decision:</strong> ${decision}<br><strong>SD positions:</strong> ${z.map((v,i)=>`R${i+1}: ${fmt(v)}`).join(' · ')}${uniq.length?`<ul class="rule-list">${uniq.map(h=>`<li><strong>${h.rule}</strong> — ${h.msg}</li>`).join('')}</ul>`:'<br>No 1₂s, 1₃s, 2₂s, R₄s, 4₁s or 10x pattern detected.'}`;
});
