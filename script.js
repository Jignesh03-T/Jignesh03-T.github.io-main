// =====================
// SCROLL REVEAL
// =====================
const revealElements = document.querySelectorAll(".project-card, .skill-card, .cert-card");

function revealOnScroll() {
  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      el.style.opacity = 1;
      el.style.transform = "translateY(0)";
    }
  });
}
window.addEventListener("scroll", revealOnScroll);
revealOnScroll();


// =====================
// TYPING EFFECT (optional)
// =====================
const typingSpan = document.getElementById("typing");

if (typingSpan) {
  const roles = ["Python Developer","Web Developer","AI/ML Enthusiast"];
  let i=0,j=0,deleting=false;

  function typeText(){
    const speed = deleting?60:120;
    typingSpan.textContent = roles[i].slice(0,j);
    j += deleting?-1:1;

    if(j===roles[i].length){
      deleting=true;
      setTimeout(typeText,1000);
      return;
    }
    if(deleting && j===0){
      deleting=false;
      i=(i+1)%roles.length;
    }
    setTimeout(typeText,speed);
  }
  typeText();
}


// =====================
// HAMBURGER MENU
// =====================
const toggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if(toggle && navLinks){
  toggle.addEventListener("click",()=>{
    navLinks.classList.toggle("active");
  });
}


// =====================
// SMOOTH SCROLL CONTACT FIX
// =====================
document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
  anchor.addEventListener("click",function(e){
    const target = document.querySelector(this.getAttribute("href"));
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:"smooth"});
      navLinks.classList.remove("active"); // close menu mobile
    }
  });
});
