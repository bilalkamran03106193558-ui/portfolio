window.addEventListener('scroll',()=>{
 const items=document.querySelectorAll('.card,.project');
 items.forEach(item=>{
  const position=item.getBoundingClientRect().top;
  if(position < window.innerHeight-100){
   item.style.opacity='1';
   item.style.transform='translateY(0)';
  }
 });
});
