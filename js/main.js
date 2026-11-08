/**
 * MAIN INTERACTIVE SCRIPT
 * Typewriter effect, Scrollspy, Mobile Menu, Projects Carousel (Buttons + Mouse Drag), Lightbox & Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. TYPEWRITER EFFECT (CLEAN & PROFESSIONAL)
     ========================================================================== */
  const typewriterElement = document.getElementById('typewriter-text');
  if (typewriterElement) {
    const phrases = [
      "IoT & Embedded Systems Engineer",
      "Microcontroller Developer (ESP32 & Arduino)",
      "Informatics Student @ Universitas Amikom Yogyakarta",
      "Hardware & Smart Automation Builder",
      "Creator & Author @ RakitProject (Lynk.id)",
      "Computer Vision & Applied AI Explorer"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 85;

    function type() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 40;
      } else {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 85;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        typingSpeed = 2200; // Pause at end of phrase
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 450; // Pause before typing next
      }

      setTimeout(type, typingSpeed);
    }

    type();
  }

  /* ==========================================================================
     2. FLOATING NAVBAR & SCROLL SPY
     ========================================================================== */
  const navLinks = document.querySelectorAll('.nav-links li a');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navLinksContainer = document.getElementById('nav-links');

  // Mobile menu toggle
  if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navLinksContainer.classList.toggle('mobile-open');
    });

    // Close mobile menu on clicking any link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinksContainer.classList.remove('mobile-open');
      });
    });
  }

  // Active section scroll spy
  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 140;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });
  highlightNavOnScroll();

  /* ==========================================================================
     3. PROJECTS HORIZONTAL SLIDER CONTROLS & DESKTOP MOUSE DRAG
     ========================================================================== */
  const sliderTrack = document.getElementById('projects-slider-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  if (sliderTrack) {
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        const cardWidth = sliderTrack.querySelector('.project-slide-card')?.offsetWidth || 380;
        sliderTrack.scrollBy({ left: -(cardWidth + 28), behavior: 'smooth' });
      });

      nextBtn.addEventListener('click', () => {
        const cardWidth = sliderTrack.querySelector('.project-slide-card')?.offsetWidth || 380;
        sliderTrack.scrollBy({ left: cardWidth + 28, behavior: 'smooth' });
      });
    }

    // Mouse drag-to-scroll for desktop
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    sliderTrack.addEventListener('mousedown', (e) => {
      if (e.target.closest('button, a')) return;
      isDown = true;
      sliderTrack.style.cursor = 'grabbing';
      sliderTrack.style.userSelect = 'none';
      startX = e.pageX - sliderTrack.offsetLeft;
      scrollLeft = sliderTrack.scrollLeft;
    });

    sliderTrack.addEventListener('mouseleave', () => {
      isDown = false;
      sliderTrack.style.cursor = '';
      sliderTrack.style.userSelect = '';
    });

    sliderTrack.addEventListener('mouseup', () => {
      isDown = false;
      sliderTrack.style.cursor = '';
      sliderTrack.style.userSelect = '';
    });

    sliderTrack.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - sliderTrack.offsetLeft;
      const walk = (x - startX) * 1.5;
      sliderTrack.scrollLeft = scrollLeft - walk;
    });
  }

  /* ==========================================================================
     4. ANIMATED NUMBER COUNTERS (INTERSECTION OBSERVER)
     ========================================================================== */
  const counterElements = document.querySelectorAll('.counter-value');
  let countersAnimated = false;

  function runCounters() {
    counterElements.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target') || '0', 10);
      const suffix = counter.getAttribute('data-suffix') || '';
      const prefix = counter.getAttribute('data-prefix') || '';
      const duration = 1800;
      const stepTime = 30;
      const steps = duration / stepTime;
      const increment = target / steps;
      let currentVal = 0;

      const timer = setInterval(() => {
        currentVal += increment;
        if (currentVal >= target) {
          counter.textContent = `${prefix}${target}${suffix}`;
          clearInterval(timer);
        } else {
          counter.textContent = `${prefix}${Math.floor(currentVal)}${suffix}`;
        }
      }, stepTime);
    });
  }

  const statsSection = document.getElementById('stats-grid');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          runCounters();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  }

  /* ==========================================================================
     5. LIGHTBOX MODAL FOR CERTIFICATES & HARDWARE PHOTOS
     ========================================================================== */
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxSub = document.getElementById('lightbox-sub');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');

  function openLightbox(src, title, subtitle) {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = src;
    if (lightboxTitle) lightboxTitle.textContent = title || '';
    if (lightboxSub) lightboxSub.textContent = subtitle || '';
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // Bind clickable zoomable elements
  document.querySelectorAll('[data-lightbox]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const src = el.getAttribute('data-img') || el.querySelector('img')?.src;
      const title = el.getAttribute('data-title') || el.querySelector('.cert-title')?.textContent;
      const subtitle = el.getAttribute('data-sub') || el.querySelector('.cert-issuer')?.textContent;
      if (src) openLightbox(src, title, subtitle);
    });
  });

  /* ==========================================================================
     6. RETRO SPACE IMPACT GAME MODAL
     ========================================================================== */
  const gameModal = document.getElementById('game-modal');
  const openGameBtns = document.querySelectorAll('.btn-open-game');
  const closeGameBtn = document.getElementById('game-modal-close');

  function openGame() {
    if (!gameModal) return;
    gameModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (window.spaceImpactApp) {
      window.spaceImpactApp.startGame();
    }
  }

  function closeGame() {
    if (!gameModal) return;
    gameModal.classList.remove('active');
    document.body.style.overflow = '';
    if (window.spaceImpactApp) {
      window.spaceImpactApp.state = 'PAUSED';
    }
  }

  openGameBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openGame();
    });
  });

  if (closeGameBtn) {
    closeGameBtn.addEventListener('click', closeGame);
  }

  if (gameModal) {
    gameModal.addEventListener('click', (e) => {
      if (e.target === gameModal) closeGame();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeGame();
    }
  });

  /* ==========================================================================
     7. COPY TO CLIPBOARD FUNCTIONALITY
     ========================================================================== */
  document.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', (e) => {
      const textToCopy = button.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          const originalHint = button.querySelector('.contact-action-hint');
          if (originalHint) {
            const prevText = originalHint.textContent;
            originalHint.textContent = '✓ Tersalin ke clipboard!';
            originalHint.style.color = '#06d6a0';
            setTimeout(() => {
              originalHint.textContent = prevText;
              originalHint.style.color = '';
            }, 2500);
          }
        }).catch(err => {
          console.error('Copy failed:', err);
        });
      }
    });
  });

  /* ==========================================================================
     8. INTERACTIVE CONTACT FORM SUBMISSION
     ========================================================================== */
  const contactForm = document.getElementById('portfolio-contact-form');
  const formSuccessAlert = document.getElementById('form-success-alert');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim sinyal...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        contactForm.reset();

        if (formSuccessAlert) {
          formSuccessAlert.style.display = 'block';
          formSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          setTimeout(() => {
            formSuccessAlert.style.display = 'none';
          }, 6000);
        }
      }, 1000);
    });
  }

  /* ==========================================================================
     9. LIVE COSMIC CLOCK (WIB)
     ========================================================================== */
  const cosmicClockEl = document.getElementById('cosmic-clock');
  function updateClock() {
    if (!cosmicClockEl) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    cosmicClockEl.textContent = `${timeStr} WIB`;
  }
  setInterval(updateClock, 1000);
  updateClock();
});
