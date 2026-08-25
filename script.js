// Always open website from the top
window.onload = function(){
    window.scrollTo(0,0);
};

// Scroll animation
window.addEventListener('scroll',()=>{
 const items=document.querySelectorAll('.card,.project,.about-box');
 items.forEach(item=>{
  const position=item.getBoundingClientRect().top;
  if(position < window.innerHeight-100){
   item.style.opacity='1';
   item.style.transform='translateY(0)';
  }
 });
});
