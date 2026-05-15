// NAVBAR SCROLL
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
  let current = "";
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute("id");
  });
  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) link.classList.add("active");
  });
});

// HAMBURGER
const hamburger = document.getElementById("hamburger");
const navLinksEl = document.getElementById("navLinks");
hamburger.addEventListener("click", () => {
  navLinksEl.classList.toggle("open");
  const spans = hamburger.querySelectorAll("span");
  if (navLinksEl.classList.contains("open")) {
    spans[0].style.transform = "rotate(45deg) translate(5px,5px)";
    spans[1].style.opacity = "0";
    spans[2].style.transform = "rotate(-45deg) translate(5px,-5px)";
  } else {
    spans[0].style.transform = "";
    spans[1].style.opacity = "";
    spans[2].style.transform = "";
  }
});
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navLinksEl.classList.remove("open");
    const spans = hamburger.querySelectorAll("span");
    spans[0].style.transform = "";
    spans[1].style.opacity = "";
    spans[2].style.transform = "";
  });
});

// PARTICLE CANVAS
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = document.querySelector(".hero").offsetHeight;
}

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
    this.radius = Math.random() * 3 + 1.5;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(90,106,133,0.55)";
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(Math.floor((canvas.width * canvas.height) / 10000), 120);
  for (let i = 0; i < count; i++) particles.push(new Particle());
}

function drawLines() {
  const maxDist = 140;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        const opacity = (1 - dist / maxDist) * 0.35;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = "rgba(90,106,133," + opacity + ")";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animateParticles);
}

resizeCanvas(); initParticles(); animateParticles();
window.addEventListener("resize", () => { resizeCanvas(); initParticles(); });

// TYPING ANIMATION
const typingTexts = ["Web Development","Video Editing","AI Content Creation","Instagram Marketing","Brand Design"];
let tIndex = 0, charIndex = 0, isDeleting = false;
const typingEl = document.getElementById("typingText");

function typeLoop() {
  if (!typingEl) return;
  const current = typingTexts[tIndex];
  if (isDeleting) { typingEl.textContent = current.substring(0, charIndex - 1); charIndex--; }
  else { typingEl.textContent = current.substring(0, charIndex + 1); charIndex++; }
  let speed = isDeleting ? 60 : 100;
  if (!isDeleting && charIndex === current.length) { speed = 1800; isDeleting = true; }
  else if (isDeleting && charIndex === 0) { isDeleting = false; tIndex = (tIndex + 1) % typingTexts.length; speed = 400; }
  setTimeout(typeLoop, speed);
}
typeLoop();

// AOS
function initAOS() {
  const aosEls = document.querySelectorAll("[data-aos]");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("shown"); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  aosEls.forEach(el => observer.observe(el));
}
initAOS();

// COUNTER ANIMATION
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suf = el.dataset.suf || "";
  const duration = 1800;
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suf;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target + suf;
  }
  requestAnimationFrame(update);
}
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll(".bnum").forEach(n => animateCounter(n));
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
const strip = document.querySelector(".stats-strip");
if (strip) counterObserver.observe(strip);

// SKILL BAR ANIMATION
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll(".skill-fill").forEach(fill => { fill.style.width = fill.dataset.w + "%"; });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll(".skills-box").forEach(box => skillObserver.observe(box));

// PORTFOLIO FILTER
const filterBtns = document.querySelectorAll(".flt-btn");
const portCards = document.querySelectorAll(".port-card");
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    portCards.forEach(card => {
      if (filter === "all" || card.dataset.cat === filter) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  });
});

// SMOOTH SCROLL
document.querySelectorAll("a[href^='#']").forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth", block: "start" }); }
  });
});
