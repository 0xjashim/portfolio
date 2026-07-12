/* ================= Nav toggle (mobile) ================= */
(function(){
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if(toggle && links){
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }
})();

/* ================= Cert badge images (uploaded) ================= */
const BADGES_KEYS = ["ceh_master","ceh_practical","ceh","ewptx","ejpt","csa","ecih","cap","cnsp","iso27001"];
/* Full base64 badge data lives in badges-data.js, loaded before this file */

/* ================= Animated stat counters ================= */
function initCounters(){
  const stats = document.querySelectorAll('.stat-num[data-count]');
  if(!stats.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el = entry.target;
        const target = parseInt(el.dataset.count,10);
        let cur = 0;
        const step = Math.max(1, Math.round(target/40));
        const iv = setInterval(()=>{
          cur += step;
          if(cur >= target){ cur = target; clearInterval(iv); }
          el.textContent = cur;
        }, 30);
        io.unobserve(el);
      }
    });
  }, {threshold:.5});
  stats.forEach(s=>io.observe(s));
}

/* ================= Skill proficiency radar chart ================= */
function initRadarChart(){
  const svg = document.getElementById('radar-chart');
  if(!svg) return;
  const NS = 'http://www.w3.org/2000/svg';
  const data = [
    {label:'Web AppSec', value:0.95},
    {label:'Network/AD', value:0.9},
    {label:'Governance', value:0.92},
    {label:'Cloud/OCI', value:0.75},
    {label:'DFIR/SOC', value:0.8},
    {label:'Dev/Scripting', value:0.6},
  ];
  const cx=150, cy=150, maxR=100;
  const n = data.length;
  function pt(i, r){
    const angle = (Math.PI*2*i/n) - Math.PI/2;
    return [cx + r*Math.cos(angle), cy + r*Math.sin(angle)];
  }
  function el(tag, attrs){
    const e = document.createElementNS(NS, tag);
    for(const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  [0.25,0.5,0.75,1].forEach(f=>{
    let pts=[];
    for(let i=0;i<n;i++){ const [x,y]=pt(i, maxR*f); pts.push(x+','+y); }
    svg.appendChild(el('polygon',{points:pts.join(' '),fill:'none',stroke:'rgba(46,230,166,0.15)','stroke-width':'1'}));
  });
  for(let i=0;i<n;i++){
    const [x,y] = pt(i, maxR);
    svg.appendChild(el('line',{x1:cx,y1:cy,x2:x,y2:y,stroke:'rgba(46,230,166,0.15)','stroke-width':'1'}));
    const [lx,ly] = pt(i, maxR+22);
    const t = el('text',{x:lx,y:ly,'text-anchor':'middle','font-size':'9','fill':'#6b7680','font-family':'JetBrains Mono, monospace'});
    t.textContent = data[i].label;
    svg.appendChild(t);
  }
  let dpts = [];
  for(let i=0;i<n;i++){ const [x,y]=pt(i, maxR*data[i].value); dpts.push(x+','+y); }
  svg.appendChild(el('polygon',{points:dpts.join(' '),fill:'rgba(46,230,166,0.18)',stroke:'#2ee6a6','stroke-width':'2'}));
  for(let i=0;i<n;i++){
    const [x,y]=pt(i, maxR*data[i].value);
    svg.appendChild(el('circle',{cx:x,cy:y,r:3,fill:'#2ee6a6'}));
  }
}

/* ================= Certification grid renderer ================= */
function initCertGrid(){
  const certsGrid = document.getElementById('certs-grid');
  if(!certsGrid || typeof BADGES === 'undefined' || typeof CREDLY_CERTS === 'undefined') return;

  const CERTS_UPLOADED = [
    ["C|EH Master","EC-Council","https://aspen.eccouncil.org/VerifyBadge?type=certification&a=mCBTSKgUjYoRugeLwGrmoRAIQ/SKh7kyLW60F1bEagg=","ceh_master"],
    ["C|EH Practical","EC-Council","https://aspen.eccouncil.org/VerifyBadge?type=certification&a=B+aEtzVCE8h+aXDJsGdxQrBxNbwmesAIzBbUUIOVLKo=","ceh_practical"],
    ["CEH","EC-Council","https://aspen.eccouncil.org/VerifyBadge?type=certification&a=B+aEtzVCE8h+aXDJsGdxQqEMG8QedAO0l67NXZQa5BI=","ceh"],
    ["eWPTXv2","INE Security","https://certs.ine.com/af160ea1-4f11-4065-8581-7f68c4703dfa","ewptx"],
    ["eJPTv2","INE Security","https://certs.ine.com/ba09764e-228c-4120-8ef0-b55134d1e924","ejpt"],
    ["Certified SOC Analyst (CSA)","EC-Council","https://www.credly.com/users/0x0jashim/badges","csa"],
    ["EC-Council Certified Incident Handler","EC-Council","https://www.credly.com/users/0x0jashim/badges","ecih"],
    ["Certified AppSec Practitioner (CAP)","The SecOps Group","https://www.credly.com/users/0x0jashim/badges","cap"],
    ["Certified Network Security Practitioner (CNSP)","The SecOps Group","https://www.credly.com/users/0x0jashim/badges","cnsp"],
    ["ISO 27001 Lead Auditor","CQI IRCA","https://www.credly.com/users/0x0jashim/badges","iso27001"],
  ];
  const CERTS_TEXT_ONLY = [
    ["ACMP 4.0","IBA, University of Dhaka",null],
  ];

  function renderCertCard(name, issuer, link, iconHtml){
    const card = document.createElement(link ? 'a' : 'div');
    card.className = 'cert-card';
    if(link){ card.href = link; card.target = '_blank'; card.rel = 'noopener'; }
    card.innerHTML = `${iconHtml}<div><div class="cert-name">${name}</div><div class="cert-issuer">${issuer}</div></div>`;
    certsGrid.appendChild(card);
  }

  CERTS_UPLOADED.forEach(([name, issuer, link, imgKey]) => {
    const initials = name.replace(/\(.*?\)/g,'').replace(/[|]/g,' ').trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase();
    const iconHtml = (imgKey && BADGES[imgKey])
      ? `<img src="${BADGES[imgKey]}" alt="${name} badge" class="cert-badge-img" loading="lazy"/>`
      : `<div class="cert-icon-fallback">${initials}</div>`;
    renderCertCard(name, issuer, link, iconHtml);
  });

  CREDLY_CERTS.forEach(([name, issuer, link, imgUrl]) => {
    const iconHtml = `<img src="${imgUrl}" alt="${name} badge" class="cert-badge-img" loading="lazy" referrerpolicy="no-referrer"/>`;
    renderCertCard(name, issuer, link, iconHtml);
  });

  CERTS_TEXT_ONLY.forEach(([name, issuer, link]) => {
    const initials = name.replace(/\(.*?\)/g,'').trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase();
    renderCertCard(name, issuer, link, `<div class="cert-icon-fallback">${initials}</div>`);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initCounters();
  initRadarChart();
  initCertGrid();
});
