const m=document.getElementById('menu'),l=document.getElementById('links');
if(m&&l)m.onclick=()=>l.classList.toggle('open');

const modal=document.getElementById('bookModal');
const buy=document.getElementById('buyBookBtn');
const closeBtn=document.getElementById('closeBookModal');
if(buy&&modal) buy.onclick=()=>{modal.classList.add('open');modal.setAttribute('aria-hidden','false');};
if(closeBtn&&modal) closeBtn.onclick=()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true');};
if(modal) modal.onclick=(e)=>{if(e.target===modal){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');}};
document.addEventListener('keydown',(e)=>{if(e.key==='Escape'&&modal){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');}});
