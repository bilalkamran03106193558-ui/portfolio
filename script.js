// Open website from top
window.onload = function(){
    window.scrollTo(0,0);
};

// Smooth scroll without adding #section to URL
function scrollToSection(id){
    const section = document.getElementById(id);
    if(section){
        section.scrollIntoView({behavior:'smooth'});
        history.replaceState(null,null,window.location.pathname);
    }
}

// Reveal animation on scroll
const revealItems = document.querySelectorAll('.card, .about-box, .service-box, .stat');

const observer = new IntersectionObserver((entries)=>{
 entries.forEach(entry=>{
  if(entry.isIntersecting){
   entry.target.classList.add('show');
  }
 });
},{threshold:0.15});

revealItems.forEach(item=>observer.observe(item));

const buttons=document.querySelectorAll('button');
buttons.forEach(btn=>{
 btn.addEventListener('mouseenter',()=>{
  btn.style.transform='scale(1.08)';
 });
 btn.addEventListener('mouseleave',()=>{
  btn.style.transform='scale(1)';
 });
});