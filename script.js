// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.nav-item').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const navHeight = 64;
    const targetY = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ===== NAV ACTIVE HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) cur = s.id;
  });
  navLinks.forEach(a => {
    const isActive = a.getAttribute('href') === '#' + cur;
    a.classList.toggle('active', isActive);
  });
}, { passive: true });

// ===== TYPED ROLE =====
const roles = [
  'Cybersecurity Consultant',
  'Penetration Tester',
  'SOC Analyst',
];
let ri = 0, ci = 0, isDeleting = false;
const el = document.getElementById('typed-role');
function type() {
  const cur = roles[ri];
  if (!isDeleting) {
    el.textContent = cur.slice(0, ci + 1);
    ci++;
    if (ci === cur.length) { isDeleting = true; setTimeout(type, 1600); return; }
  } else {
    el.textContent = cur.slice(0, ci - 1);
    ci--;
    if (ci === 0) { isDeleting = false; ri = (ri + 1) % roles.length; }
  }
  setTimeout(type, isDeleting ? 55 : 85);
}
type();

// ===== CANVAS NETWORK BACKGROUND =====
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
let W, H, nodes = [];

function resize() {
  W = canvas.width = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}
function initNodes() {
  nodes = [];
  const count = Math.floor((W * H) / 14000);
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - .5) * .35,
      vy: (Math.random() - .5) * .35,
      r: Math.random() * 1.5 + .5
    });
  }
}
function draw() {
  ctx.clearRect(0, 0, W, H);
  const ac = '0,255,120';
  nodes.forEach(n => {
    n.x += n.vx; n.y += n.vy;
    if (n.x < 0 || n.x > W) n.vx *= -1;
    if (n.y < 0 || n.y > H) n.vy *= -1;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${ac},.6)`;
    ctx.fill();
  });
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 130) {
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.strokeStyle = `rgba(${ac},${(1 - d / 130) * .22})`;
        ctx.lineWidth = .6;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(draw);
}
resize(); initNodes(); draw();
window.addEventListener('resize', () => { resize(); initNodes(); }, { passive: true });

// ===== SCROLL REVEAL =====
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 40);
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });
reveals.forEach(r => revealObserver.observe(r));

// ===== PROJECT MEDIA SLIDERS =====
document.querySelectorAll('.proj-media-slider').forEach(slider => {
  const track = slider.querySelector('.proj-media-track');
  const prev = slider.querySelector('.prev');
  const next = slider.querySelector('.next');
  if (!track || !prev || !next) return;

  const slideWidth = () => slider.clientWidth;

  next.addEventListener('click', () => {
    track.scrollBy({ left: slideWidth(), behavior: 'smooth' });
  });
  prev.addEventListener('click', () => {
    track.scrollBy({ left: -slideWidth(), behavior: 'smooth' });
  });
});

// ===== PROFESSIONAL ENGAGEMENTS SLIDER =====
(function() {
  const track = document.getElementById('engTrack');
  const prevBtn = document.getElementById('engPrev');
  const nextBtn = document.getElementById('engNext');
  const dotsContainer = document.getElementById('engDots');

  if (!track) return;

  const slides = track.querySelectorAll('.eng-slide');
  const total = slides.length;
  let current = 0;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'eng-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to engagement ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function getDots() { return dotsContainer.querySelectorAll('.eng-dot'); }

  function goTo(idx) {
    if (idx < 0) idx = total - 1;
    if (idx >= total) idx = 0;
    current = idx;

    // Scroll to slide
    const slideEl = slides[idx];
    const trackRect = track.getBoundingClientRect();
    const slideRect = slideEl.getBoundingClientRect();
    const offset = slideRect.left - trackRect.left + track.scrollLeft - 32; // 32 = padding
    track.scrollTo({ left: offset, behavior: 'smooth' });

    // Update dots
    getDots().forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  prevBtn && prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn && nextBtn.addEventListener('click', () => goTo(current + 1));

  // Sync dots on manual scroll
  let scrollTimeout;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const trackLeft = track.getBoundingClientRect().left;
      let closest = 0, minDist = Infinity;
      slides.forEach((s, i) => {
        const dist = Math.abs(s.getBoundingClientRect().left - trackLeft);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      current = closest;
      getDots().forEach((d, i) => d.classList.toggle('active', i === closest));
    }, 80);
  }, { passive: true });

  // Auto-advance every 5s
  let autoTimer = setInterval(() => goTo(current + 1), 5000);
  track.addEventListener('pointerdown', () => clearInterval(autoTimer));
})();

// ===== CONTACT FORM =====
function handleSubmit() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const msg = document.getElementById('message').value.trim();
  if (!name || !email || !msg) { alert('Please fill in all fields.'); return; }
  const btn = document.getElementById('submitBtn');
  const orig = btn.textContent;
  btn.textContent = 'Message Sent ✓';
  btn.style.background = '#00ff78';
  btn.style.color = '#0f1a14';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = orig;
    btn.style.background = '';
    btn.style.color = '';
    btn.disabled = false;
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('message').value = '';
  }, 3500);
}