// ========== MAGNETIC CURSOR ==========
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const cursor = document.createElement('div');
  cursor.classList.add('magnetic-cursor');
  document.body.appendChild(cursor);

  let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.25;
    cursorY += (mouseY - cursorY) * 0.25;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
  document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
}

// ========== AOS INIT ==========
if (window.AOS) {
  AOS.init({
    duration: 1000,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
  });
}

// ========== SIDE DRAWER ==========
const hamburger = document.getElementById('hamburger');
const sideDrawer = document.getElementById('sideDrawer');
const drawerOverlay = document.getElementById('drawerOverlay');
const drawerLinks = document.querySelectorAll('.drawer-link');

if (hamburger && sideDrawer && drawerOverlay) {
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    hamburger.classList.toggle('active');
    sideDrawer.classList.toggle('active');
    drawerOverlay.classList.toggle('active');
  });

  drawerOverlay.addEventListener('click', () => {
    hamburger.classList.remove('active');
    sideDrawer.classList.remove('active');
    drawerOverlay.classList.remove('active');
  });

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      sideDrawer.classList.remove('active');
      drawerOverlay.classList.remove('active');
    });
  });
}

// ========== NAVBAR SCROLL ==========
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      navbar.style.padding = '0.9rem 1.25rem';
    } else {
      navbar.style.padding = window.scrollY > 50
        ? '0.85rem 3rem'
        : '1.25rem 3rem';
    }
  });
}

// ========== WORK SECTION SPOTLIGHT ==========
function startSpotlight() {
  const cards = Array.from(document.querySelectorAll('.work-card'));
  if (cards.length === 0) return;

  function shuffle(arr) {
    let array = [...arr];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const shuffled = shuffle(cards);
  let index = 0;
  let spotlightDone = false;

  function highlightNext() {
    if (spotlightDone) return;
    cards.forEach(c => c.classList.remove('spotlight'));

    if (index < shuffled.length) {
      shuffled[index].classList.add('spotlight');
      index++;
      setTimeout(highlightNext, 3000);
    } else {
      setTimeout(() => {
        cards.forEach(c => c.classList.remove('spotlight'));
        spotlightDone = true;
      }, 3000);
    }
  }

  highlightNext();
}

const workSection = document.querySelector('#work');
if (workSection) {
  let spotlightTriggered = false;
  const workObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !spotlightTriggered) {
        spotlightTriggered = true;
        setTimeout(startSpotlight, 400);
        workObserver.disconnect();
      }
    });
  }, { threshold: 0.1 });

  workObserver.observe(workSection);
}

// ========== ACHIEVEMENTS CAROUSEL ==========
const achSlides = document.querySelectorAll('.ach-slide');
const achDotsContainer = document.getElementById('achDots');
const achPrevBtn = document.getElementById('achPrev');
const achNextBtn = document.getElementById('achNext');
const achCarousel = document.getElementById('achCarousel');
const total = achSlides.length;

let achCurrent = 0;
let achTimer;

if (achSlides.length > 0 && achDotsContainer) {
  achSlides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('ach-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToAch(i));
    achDotsContainer.appendChild(dot);
  });

  function updateCounter() {
    achSlides.forEach((slide, i) => {
      const counter = slide.querySelector('.ach-counter');
      if (counter) {
        const num = String(i + 1).padStart(2, '0');
        const tot = String(total).padStart(2, '0');
        counter.textContent = `${num} / ${tot}`;
      }
    });
  }

  function goToAch(index) {
    achSlides[achCurrent].classList.remove('active');
    const dots = document.querySelectorAll('.ach-dot');
    if (dots[achCurrent]) dots[achCurrent].classList.remove('active');

    achCurrent = (index + total) % total;

    achSlides[achCurrent].classList.add('active');
    if (dots[achCurrent]) dots[achCurrent].classList.add('active');

    resetAchTimer();
  }

  function resetAchTimer() {
    clearInterval(achTimer);
    achTimer = setInterval(() => goToAch(achCurrent + 1), 5000);
  }

  updateCounter();
  if (achPrevBtn) achPrevBtn.addEventListener('click', () => goToAch(achCurrent - 1));
  if (achNextBtn) achNextBtn.addEventListener('click', () => goToAch(achCurrent + 1));

  // Touch swipe support for Achievements
  if (achCarousel) {
    let touchStartX = 0;
    let touchEndX = 0;

    achCarousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    achCarousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleAchSwipe();
    }, { passive: true });

    function handleAchSwipe() {
      const swipeThreshold = 40;
      if (touchEndX < touchStartX - swipeThreshold) {
        goToAch(achCurrent + 1);
      } else if (touchEndX > touchStartX + swipeThreshold) {
        goToAch(achCurrent - 1);
      }
    }
  }

  resetAchTimer();
}

// ========== PROJECTS SLIDER ==========
const projSlides = document.querySelectorAll('.proj-slide');
const projPrevBtn = document.getElementById('projPrev');
const projNextBtn = document.getElementById('projNext');
const projDotsContainer = document.getElementById('projDots');
const projSlider = document.getElementById('projSlider');

let projCurrent = 0;
const projTotal = projSlides.length;

if (projSlides.length > 0 && projDotsContainer) {
  projSlides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('proj-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToProj(i));
    projDotsContainer.appendChild(dot);
  });

  function goToProj(index) {
    const dots = document.querySelectorAll('.proj-dot');
    if (dots[projCurrent]) dots[projCurrent].classList.remove('active');

    projCurrent = (index + projTotal) % projTotal;

    projSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === projCurrent);
      slide.style.display = i === projCurrent ? 'grid' : 'none';
    });

    if (dots[projCurrent]) {
      dots[projCurrent].classList.add('active');
      dots[projCurrent].style.transform = 'scale(1.4)';
      setTimeout(() => {
        dots[projCurrent].style.transform = 'scale(1)';
      }, 300);
    }
  }

  projSlides.forEach((slide, i) => {
    slide.style.display = i === 0 ? 'grid' : 'none';
    if (i === 0) slide.classList.add('active');
  });

  if (projPrevBtn) projPrevBtn.addEventListener('click', () => goToProj(projCurrent - 1));
  if (projNextBtn) projNextBtn.addEventListener('click', () => goToProj(projCurrent + 1));

  // Touch swipe support for Projects
  if (projSlider) {
    let projTouchStartX = 0;
    let projTouchEndX = 0;
    let projWheelLock = false;
    let projScrollLock = false;
    let lastProjScrollY = window.scrollY;

    projSlider.addEventListener('touchstart', (e) => {
      projTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    projSlider.addEventListener('touchend', (e) => {
      projTouchEndX = e.changedTouches[0].screenX;
      handleProjSwipe();
    }, { passive: true });

    projSlider.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) < 12) return;
      e.preventDefault();
      if (projWheelLock) return;

      projWheelLock = true;
      if (e.deltaY > 0) {
        goToProj(projCurrent + 1);
      } else {
        goToProj(projCurrent - 1);
      }

      setTimeout(() => {
        projWheelLock = false;
      }, 550);
    }, { passive: false });

    window.addEventListener('scroll', () => {
      const sliderRect = projSlider.getBoundingClientRect();
      const isVisible = sliderRect.top < window.innerHeight * 0.9 && sliderRect.bottom > 100;
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastProjScrollY;

      if (!isVisible || projScrollLock) {
        lastProjScrollY = currentScrollY;
        return;
      }

      if (deltaY > 20) {
        projScrollLock = true;
        goToProj(projCurrent + 1);
        setTimeout(() => { projScrollLock = false; }, 650);
      } else if (deltaY < -20) {
        projScrollLock = true;
        goToProj(projCurrent - 1);
        setTimeout(() => { projScrollLock = false; }, 650);
      }

      lastProjScrollY = currentScrollY;
    }, { passive: true });

    function handleProjSwipe() {
      const swipeThreshold = 40;
      if (projTouchEndX < projTouchStartX - swipeThreshold) {
        goToProj(projCurrent + 1);
      } else if (projTouchEndX > projTouchStartX + swipeThreshold) {
        goToProj(projCurrent - 1);
      }
    }
  }
}

// ========== ROAD AHEAD ANIMATION ==========
const roadSection = document.querySelector('.road');
const roadLine = document.querySelector('.road-line');
const roadParas = document.querySelectorAll('.road-text p');

if (roadSection) {
  let roadAnimated = false;
  const roadObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !roadAnimated) {
        roadAnimated = true;
        if (roadLine) roadLine.classList.add('animate');
        setTimeout(() => {
          roadParas.forEach(p => p.classList.add('animate'));
        }, 900);
        roadObserver.disconnect();
      }
    });
  }, { threshold: 0.1 });

  roadObserver.observe(roadSection);
}