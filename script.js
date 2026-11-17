'use strict';
// Navigation works as normal anchor links; only the small-screen menu needs JS.
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu(){ if(!menu) return; menu.setAttribute('aria-expanded','false'); navigation.classList.remove('is-open'); }
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));navigation.classList.toggle('is-open',open);});
navigation?.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape' && menu?.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
// A missing remote thumbnail never removes the project or its playback link.
document.querySelectorAll('.project-art img, .featured-frame img').forEach(img=>{const fail=()=>img.classList.add('is-broken');img.addEventListener('error',fail);if(img.complete&&!img.naturalWidth)fail();});
const gallery=document.querySelector('[data-home-gallery]');
if(gallery){
  const cards=[...gallery.querySelectorAll('.project')];
  const filters=[...document.querySelectorAll('[data-filter]')];
  const more=document.querySelector('.show-more');
  let active='all', expanded=false;
  function render(){
    const matching=cards.filter(card=>active==='all'||card.dataset.categories.split(' ').includes(active));
    cards.forEach(card=>{card.hidden=!matching.includes(card)||(active==='all'&&!expanded&&matching.indexOf(card)>=6);});
    more.hidden=active!=='all'||expanded||matching.length<=6;
    document.querySelector('#work-count').textContent=`Showing ${cards.filter(c=>!c.hidden).length} of ${matching.length} edits.`;
    filters.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.filter===active)));
  }
  filters.forEach(button=>button.addEventListener('click',()=>{active=button.dataset.filter;expanded=false;render();}));
  more.addEventListener('click',()=>{expanded=true;render();const next=cards[6]?.querySelector('a');next?.focus({preventScroll:true});next?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});});
  render();
}
const copy=document.querySelector('.copy-email');
copy?.addEventListener('click',async()=>{const status=document.querySelector('.copy-status');try{await navigator.clipboard.writeText('bilalkamran0310@gmail.com');status.textContent='Email copied!';}catch{status.textContent='Select the email address to copy it, or click it to open your email app.';}});
// Support all old video.html?url= links, but only embed the original providers.
const player=document.querySelector('#player');
if(player){
  const raw=new URLSearchParams(location.search).get('url');
  const error=document.querySelector('#player-error');
  const source=document.querySelector('#source-link');
  try{
    if(!raw)throw new Error('Select a video from the portfolio to start watching.');
    const url=new URL(raw.trim());
    const youtube=['www.youtube.com','youtube.com','www.youtube-nocookie.com'].includes(url.hostname)&&/^\/embed\/[a-zA-Z0-9_-]+\/?$/.test(url.pathname);
    const drive=url.hostname==='drive.google.com'&&/^\/file\/d\/[a-zA-Z0-9_-]+\/preview\/?$/.test(url.pathname);
    if(url.protocol!=='https:'||(!youtube&&!drive)||url.username||url.password)throw new Error('This video link is not supported. Please choose a video from the portfolio.');
    player.src=url.href;player.hidden=false;error.hidden=true;source.hidden=false;
    source.href=youtube?'https://www.youtube.com/watch?v='+url.pathname.split('/')[2]:url.href.replace(/\/preview\/?(?:\?.*)?$/,'/view');
  }catch(err){error.textContent=err.message;}
}
