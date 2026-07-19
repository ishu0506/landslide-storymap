const nav=document.querySelector("nav");

window.addEventListener("scroll",()=>{

if(window.scrollY>50){

nav.style.background="#111";

}

else{

nav.style.background="rgba(0,0,0,.45)";

}

});