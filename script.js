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
