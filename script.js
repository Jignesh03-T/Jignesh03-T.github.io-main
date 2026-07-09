// =====================
// THEME TOGGLE
// =====================
const themeToggle = document.getElementById("theme-toggle");

function updateThemeButton(){
  if(!themeToggle) return;

  const isLightMode = document.body.classList.contains("light-mode");
  themeToggle.innerHTML = isLightMode
    ? '<i class="fas fa-sun"></i><span>Light</span>'
    : '<i class="fas fa-moon"></i><span>Night</span>';
  themeToggle.setAttribute("aria-label", isLightMode ? "Switch to dark mode" : "Switch to light mode");
}

if(localStorage.getItem("portfolioTheme")==="light"){
  document.body.classList.add("light-mode");
}

updateThemeButton();

if(themeToggle){
  themeToggle.addEventListener("click",()=>{
    document.body.classList.toggle("light-mode");
    localStorage.setItem(
      "portfolioTheme",
      document.body.classList.contains("light-mode") ? "light" : "dark"
    );
    updateThemeButton();
  });
}


// =====================
// MOBILE MENU
// =====================
const toggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

function closeMobileMenu(){
  if(navLinks){
    navLinks.classList.remove("active");
  }
  if(toggle){
    toggle.setAttribute("aria-expanded","false");
  }
}

if(toggle && navLinks){
  toggle.addEventListener("click",()=>{
    navLinks.classList.toggle("active");
    toggle.setAttribute("aria-expanded", navLinks.classList.contains("active"));
  });
}


// =====================
// SMOOTH SCROLL
// =====================
document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
  anchor.addEventListener("click",function(e){
    const target = document.querySelector(this.getAttribute("href"));
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:"smooth", block:"start"});
      closeMobileMenu();
    }
  });
});


// =====================
// ACTIVE NAV LINK
// =====================
const sectionLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const pageSections = Array.from(sectionLinks)
  .map(link => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if("IntersectionObserver" in window){
  const navObserver = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        sectionLinks.forEach(link=>{
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });

  pageSections.forEach(section=>navObserver.observe(section));
}


// =====================
// REVEAL ON SCROLL
// =====================
const revealElements = document.querySelectorAll(".about-card, .project-card, .skill-card, .cert-card, .exp-card, .contact-card");

if("IntersectionObserver" in window){
  const revealObserver = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("is-revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  revealElements.forEach(el=>revealObserver.observe(el));
} else {
  revealElements.forEach(el=>el.classList.add("is-revealed"));
}


// =====================
// SKILL FILTERS
// =====================
const skillButtons = document.querySelectorAll("[data-skill-filter]");
const skillCards = document.querySelectorAll(".skill-card[data-tags]");

skillButtons.forEach(button=>{
  button.addEventListener("click",()=>{
    const filter = button.dataset.skillFilter;

    skillButtons.forEach(btn=>{
      const isActive = btn === button;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", isActive);
    });

    skillCards.forEach(card=>{
      const tags = (card.dataset.tags || "").split(" ");
      const isMatch = filter === "all" || tags.includes(filter);
      card.classList.toggle("is-muted", !isMatch);
      card.classList.toggle("is-match", isMatch && filter !== "all");
    });
  });
});


// =====================
// PROJECT FILTERS
// =====================
const projectFilterButtons = document.querySelectorAll("[data-project-filter]");
const projectCards = document.querySelectorAll(".project-card[data-category]");

projectFilterButtons.forEach(button=>{
  button.addEventListener("click",()=>{
    const filter = button.dataset.projectFilter;

    projectFilterButtons.forEach(btn=>{
      const isActive = btn === button;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", isActive);
    });

    projectCards.forEach(card=>{
      const categories = (card.dataset.category || "").split(" ");
      const shouldShow = filter === "all" || categories.includes(filter);
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});


// =====================
// PROJECT DETAILS MODAL
// =====================
const modal = document.getElementById("project-modal");
const modalImage = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalBadges = document.getElementById("modal-badges");
const modalFeatures = document.getElementById("modal-features");
const modalActions = document.getElementById("modal-actions");
let lastFocusedElement = null;

function cloneButtonForModal(element){
  if(element.tagName.toLowerCase()==="a"){
    const link = document.createElement("a");
    link.href = element.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = element.className;
    link.textContent = element.textContent.trim();
    return link;
  }

  const span = document.createElement("span");
  span.className = `${element.className} btn-disabled`;
  span.textContent = element.textContent.trim() || "Demo Coming Soon";
  return span;
}

function openProjectModal(card, trigger){
  if(!modal) return;

  lastFocusedElement = trigger;
  const title = card.querySelector(".project-content h3")?.childNodes[0]?.textContent.trim() || "Project Details";
  const description = card.querySelector(".project-content p")?.textContent.trim() || "";
  const image = card.dataset.modalImage || card.querySelector(".slider-track img")?.getAttribute("src") || "Icon.png";
  const firstImageAlt = card.querySelector(".slider-track img")?.getAttribute("alt") || title;

  modalTitle.textContent = title;
  modalDescription.textContent = description;
  modalImage.src = image;
  modalImage.alt = firstImageAlt;

  modalBadges.innerHTML = "";
  card.querySelectorAll(".tech-badges span").forEach(badge=>{
    const span = document.createElement("span");
    span.textContent = badge.textContent;
    modalBadges.appendChild(span);
  });

  modalFeatures.innerHTML = "";
  card.querySelectorAll(".project-features li").forEach(feature=>{
    const li = document.createElement("li");
    li.textContent = feature.textContent;
    modalFeatures.appendChild(li);
  });

  modalActions.innerHTML = "";
  card.querySelectorAll(".project-links a, .project-links span").forEach(action=>{
    modalActions.appendChild(cloneButtonForModal(action));
  });

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden","false");
  document.body.classList.add("no-scroll");
  modal.querySelector(".modal-close")?.focus();
}

function closeProjectModal(){
  if(!modal) return;

  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden","true");
  document.body.classList.remove("no-scroll");

  if(lastFocusedElement){
    lastFocusedElement.focus();
  }
}

document.querySelectorAll(".btn-details").forEach(button=>{
  button.addEventListener("click",()=>{
    const card = button.closest(".project-card");
    if(card){
      openProjectModal(card, button);
    }
  });
});

document.querySelectorAll("[data-close-modal]").forEach(closeControl=>{
  closeControl.addEventListener("click", closeProjectModal);
});

document.addEventListener("keydown",event=>{
  if(event.key==="Escape" && modal?.classList.contains("is-open")){
    closeProjectModal();
  }

  if(event.key==="Tab" && modal?.classList.contains("is-open")){
    const focusable = modal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
    if(!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if(event.shiftKey && document.activeElement === first){
      event.preventDefault();
      last.focus();
    } else if(!event.shiftKey && document.activeElement === last){
      event.preventDefault();
      first.focus();
    }
  }
});


// =====================
// COPY EMAIL
// =====================
const copyEmailButton = document.getElementById("copy-email");
const copyFeedback = document.getElementById("copy-feedback");

function showCopyFeedback(message){
  if(!copyFeedback) return;
  copyFeedback.textContent = message;
  setTimeout(()=>{ copyFeedback.textContent = ""; }, 2000);
}

if(copyEmailButton){
  copyEmailButton.addEventListener("click",async()=>{
    const email = copyEmailButton.dataset.email;

    try {
      if(navigator.clipboard){
        await navigator.clipboard.writeText(email);
      } else {
        const tempInput = document.createElement("input");
        tempInput.value = email;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        tempInput.remove();
      }
      showCopyFeedback("Copied!");
    } catch(error) {
      showCopyFeedback("Copy failed. Please use the email card.");
    }
  });
}


// =====================
// SCROLL TO TOP
// =====================
const scrollTopButton = document.getElementById("scroll-top");

function updateScrollTopButton(){
  if(!scrollTopButton) return;
  scrollTopButton.classList.toggle("is-visible", window.scrollY > 500);
}

window.addEventListener("scroll", updateScrollTopButton);
updateScrollTopButton();

if(scrollTopButton){
  scrollTopButton.addEventListener("click",()=>{
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}


// =====================
// IMAGE PERFORMANCE
// =====================
document.querySelectorAll("img").forEach(img=>{
  if(img.getAttribute("src") !== "profile.jpg"){
    img.setAttribute("loading","lazy");
  }
});


// =====================
// AI PLAYGROUND
// =====================
const AI_CHAT_API_URL = "http://localhost:8000/api/ai-chat";
const aiModal = document.getElementById("ai-modal");
const aiChatWindow = document.getElementById("ai-chat-window");
const aiChatForm = document.getElementById("ai-chat-form");
const aiChatInput = document.getElementById("ai-chat-input");
const aiChatSubmit = document.getElementById("ai-chat-submit");
const aiTyping = document.getElementById("ai-typing");
const aiModalAvatar = document.getElementById("ai-modal-avatar");
const heroAiStrip = document.getElementById("hero-ai-strip");
const heroAiForm = document.getElementById("hero-ai-form");
const heroAiInput = document.getElementById("hero-ai-input");
let lastAiFocusedElement = null;

function scrollAiChatToBottom(){
  if(!aiChatWindow) return;
  aiChatWindow.scrollTop = aiChatWindow.scrollHeight;
}

function appendAiMessage(role, text){
  if(!aiChatWindow) return null;

  const message = document.createElement("div");
  message.className = `chat-message ${role}-message`;

  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  message.appendChild(paragraph);
  aiChatWindow.appendChild(message);
  scrollAiChatToBottom();
  return message;
}

function setAiTyping(message){
  if(aiTyping){
    aiTyping.textContent = message || "";
  }
}

function setAiAvatarState(state){
  if(!aiModalAvatar) return;

  const avatars = {
    idle: "assets/images/avt4.png",
    thinking: "assets/images/avt2.png",
    answering: "assets/images/avt3.png",
    error: "assets/images/avt5.png"
  };

  aiModalAvatar.src = avatars[state] || avatars.idle;
}

function resetAiChat(){
  if(!aiChatWindow) return;

  aiChatWindow.innerHTML = "";
}

async function askAiBackend(question){
  const response = await fetch(AI_CHAT_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: question })
  });

  if(!response.ok){
    throw new Error("Portfolio chat request failed");
  }

  const data = await response.json();
  return data?.reply || data?.message || data?.response || "";
}

function openAiModal(options = {}){
  if(!aiModal) return;

  lastAiFocusedElement = document.activeElement;
  aiModal.classList.add("is-open");
  aiModal.setAttribute("aria-hidden","false");
  document.body.classList.add("no-scroll");
  setAiAvatarState("idle");
  if(options.reset){
    resetAiChat();
    setAiTyping("");
  }
  aiChatInput?.focus();
}

function closeAiModal(){
  if(!aiModal) return;

  aiModal.classList.remove("is-open");
  aiModal.setAttribute("aria-hidden","true");
  setAiTyping("");
  if(!modal?.classList.contains("is-open")){
    document.body.classList.remove("no-scroll");
  }

  if(lastAiFocusedElement){
    lastAiFocusedElement.focus();
  }
}

async function handleAiQuestion(question){
  const cleanQuestion = question.trim();
  if(!cleanQuestion || !aiChatWindow) return;

  openAiModal();
  appendAiMessage("user", cleanQuestion);
  setAiTyping("AI is thinking...");
  setAiAvatarState("thinking");

  if(aiChatSubmit){
    aiChatSubmit.disabled = true;
  }

  try {
    const reply = await askAiBackend(cleanQuestion);
    setAiAvatarState("answering");
    appendAiMessage("assistant", reply || "I did not receive a response from the AI backend.");
  } catch(error) {
    setAiAvatarState("error");
    appendAiMessage("assistant", "The AI backend is not connected right now. Once the Python backend is running, this demo will answer using the configured LLM API.");
  } finally {
    setAiTyping("");
    if(aiChatSubmit){
      aiChatSubmit.disabled = false;
    }
    if(aiChatInput){
      aiChatInput.value = "";
      aiChatInput.focus();
    }
  }
}

function sendAiPrompt(question){
  const cleanQuestion = question.trim();
  if(!cleanQuestion){
    openAiModal({ reset: true });
    return;
  }

  handleAiQuestion(cleanQuestion);

  if(heroAiInput){
    heroAiInput.value = "";
  }
}

if(aiChatForm && aiChatInput){
  aiChatForm.addEventListener("submit",event=>{
    event.preventDefault();
    handleAiQuestion(aiChatInput.value);
  });
}

if(heroAiStrip){
  heroAiStrip.addEventListener("click",()=>{
    openAiModal({ reset: true });
  });

  heroAiStrip.addEventListener("keydown",event=>{
    if(event.target === heroAiStrip && (event.key==="Enter" || event.key===" ")){
      event.preventDefault();
      openAiModal({ reset: true });
    }
  });
}

if(heroAiForm && heroAiInput){
  heroAiForm.addEventListener("click",event=>{
    event.stopPropagation();
  });

  heroAiForm.addEventListener("submit",event=>{
    event.preventDefault();
    sendAiPrompt(heroAiInput.value);
  });
}

document.querySelectorAll("[data-close-ai-modal]").forEach(closeControl=>{
  closeControl.addEventListener("click", closeAiModal);
});

document.addEventListener("keydown",event=>{
  if(event.key==="Escape" && aiModal?.classList.contains("is-open")){
    closeAiModal();
  }
});
