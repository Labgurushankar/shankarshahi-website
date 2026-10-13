/* Shankar Shahi — standalone banner button add-on. No other site UI changes. */
(() => {
  'use strict';
  const install = () => {
    const hero = document.querySelector('section#home.reference-hero');
    if (!hero || document.getElementById('visitVirtualLabBannerButton')) return;
    const style = document.createElement('style');
    style.id = 'visitVirtualLabBannerStyle';
    style.textContent = `
      #visitVirtualLabBannerButton {
        position:absolute;right:clamp(12px,3.5vw,56px);bottom:clamp(14px,6vw,80px);
        z-index:15;display:inline-flex;align-items:center;justify-content:center;gap:9px;
        min-height:48px;padding:12px 22px;border-radius:999px;
        background:linear-gradient(110deg,#078376,#0a9f9a);color:#fff;
        border:2px solid #f9df82;box-shadow:0 8px 22px rgba(0,38,56,.34);
        font:800 clamp(14px,1.5vw,18px)/1.2 system-ui,Arial,sans-serif;
        letter-spacing:.1px;text-decoration:none;transition:transform .15s,filter .15s;
      }
      #visitVirtualLabBannerButton:hover,#visitVirtualLabBannerButton:focus-visible{
        transform:translateY(-2px);filter:brightness(1.09);outline-offset:3px;
      }
      @media(max-width:620px){
        #visitVirtualLabBannerButton{right:12px;bottom:12px;min-height:38px;padding:8px 12px;font-size:12px;gap:5px;box-shadow:0 3px 11px rgba(0,38,56,.3)}
      }
    `;
    document.head.appendChild(style);
    if (getComputedStyle(hero).position === 'static') hero.style.position = 'relative';
    const a = document.createElement('a');
    a.id = 'visitVirtualLabBannerButton';
    a.href = '/virtual-lab/';
    a.textContent = '🧪 Visit Virtual Lab  →';
    a.setAttribute('aria-label','Visit Shankar Virtual Medical Laboratory');
    hero.appendChild(a);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
