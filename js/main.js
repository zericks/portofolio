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

  /* ==========================================================================
     6.5. CASE STUDY BREAKDOWN DATA & MODAL HANDLERS (RUBRIK DIGIPRENEURSHIP 35%)
     ========================================================================== */
  const caseStudiesData = {
    doorlock: {
      badges: [
        { label: "IoT Embedded System", class: "pill-iot", icon: "fas fa-microchip" },
        { label: "Juara 1 Divisi IoT AMCC 2025", class: "pill-award", icon: "fas fa-trophy" },
        { label: "Hardware & Cloud Automation", class: "pill-digipreneur", icon: "fas fa-network-wired" }
      ],
      title: "Sistem Keamanan Pintu Depan & Smart Bell ESP32",
      lead: "Solusi rekayasa sistem tertanam (*embedded system*) berbasis ESP32 dan ESP32-CAM yang mengintegrasikan autentikasi ganda RFID/PIN, kendali jarak jauh cloud Blynk IoT, serta pengiriman foto notifikasi tamu real-time ke bot Telegram.",
      problem: [
        "Sistem kunci mekanis konvensional rentan terhadap pembobolan manual dan duplikasi fisik tanpa jejak digital.",
        "Pemilik rumah tidak memiliki visibilitas atas siapa tamu yang datang atau menekan bel saat rumah dalam keadaan kosong.",
        "Solusi smart lock komersial di pasaran umumnya mahal, tertutup (*closed-source*), dan tidak mengintegrasikan snapshot kamera dengan alert bot pesan instan."
      ],
      solution: [
        "Arsitektur Hardware: Mengombinasikan ESP32 sebagai kontroller utama logika kunci & konektivitas cloud, modul kamera ESP32-CAM (OV2640), sensor RFID RC522 (13.56 MHz), keypad matriks 4x4, relay 1-channel, solenoid door lock 12V, serta layar LCD 16x2 I2C.",
        "Integrasi Cloud Ganda: Protokol Wi-Fi menghubungkan sistem ke Blynk IoT Cloud untuk trigger buka kunci jarak jauh dan Telegram Bot API untuk pengiriman foto tamu otomatis saat bel ditekan.",
        "Sistem Failsafe: Mendukung metode buka ganda (kartu RFID terdaftar atau PIN darurat keypad jika kartu tertinggal)."
      ],
      features: [
        "Autentikasi Cepat: Pembacaan UID kartu RFID dengan enkripsi verifikasi ID tersimpan.",
        "Otomasi Snapshot Tamu: Saat push button bel ditekan, ESP32 mentrigger ESP32-CAM mengambil foto dan mengirimkannya via HTTP POST multipart ke bot Telegram pemilik rumah.",
        "Remote Unlock via Smartphone: Kontrol relay solenoid dari aplikasi Blynk Android/iOS di mana saja.",
        "Indikator Status Interaktif: Layar LCD I2C dan buzzer memberikan feedback audio-visual status akses (Accepted / Denied)."
      ],
      metrics: [
        { val: "< 0.8 s", lbl: "Latensi Verifikasi RFID" },
        { val: "< 2.5 s", lbl: "Waktu Kirim Foto ke Telegram" },
        { val: "100%", lbl: "Tingkat Keberhasilan Buka Kunci" }
      ],
      actions: [
        { href: "https://github.com/zericks/Sistem-Keamanan-Pintu-Depan", label: "Repositori GitHub", icon: "fab fa-github", primary: false },
        { img: "assets/images/smart_door_lock.png", label: "Lihat Fisik Alat", icon: "fas fa-search-plus", isLightbox: true },
        { img: "assets/images/award_amcc_group.jpg", label: "Dokumentasi Juara 1", icon: "fas fa-award", isLightbox: true }
      ]
    },

    rakitproject: {
      badges: [
        { label: "Produk Digipreneurship", class: "pill-digipreneur", icon: "fas fa-store" },
        { label: "Digital Information Goods", class: "pill-iot", icon: "fas fa-book-open" },
        { label: "Platform: Lynk.id", class: "pill-award", icon: "fas fa-bolt" }
      ],
      title: "RakitProject: Kewirausahaan Digital Produk Edukasi IoT",
      lead: "Studi kasus implementasi kewirausahaan digital (*Digipreneurship*) melalui penciptaan, pengemasan, dan monetisasi produk informasi digital (modul tutorial & ebook praktis mikrokontroler) mandiri di platform Lynk.id.",
      problem: [
        "Banyak mahasiswa pemula dan siswa SMK jurusan teknologi kesulitan mempelajari IoT karena referensi yang ada terlalu teoritis, tidak aplikatif, atau berbahasa asing.",
        "Tingginya kurva belajar perakitan mikrokontroler karena minimnya panduan langkah-demi-langkah yang memadukan skematik kabel fisik dengan kode program yang terverifikasi jalan.",
        "Potensi keahlian teknis mahasiswa sering kali hanya berhenti sebagai tugas akhir atau praktikum tanpa memiliki nilai ekonomi nyata (*commercial viability*)."
      ],
      solution: [
        "Penciptaan Produk Digital (*Digital Goods*): Menyusun serial ebook dan modul tutorial praktikum terstruktur (berbasis proyek nyata dari dasar hingga IoT cloud) yang siap dipelajari secara mandiri.",
        "Infrastruktur Bisnis Tanpa Biaya Inventaris: Memanfaatkan platform e-commerce digital Lynk.id (https://lynk.id/rakitproject) dengan sistem pembayaran instan (QRIS, E-Wallet, Virtual Account) dan download otomatis tanpa biaya cetak/gudang (*zero marginal cost*).",
        "Pemasaran Berbasis Nilai (*Content-Led Growth*): Membangun personal branding dan membuktikan kredibilitas teknis melalui rekam jejak juara kompetisi nasional dan asisten praktikum kampus."
      ],
      features: [
        "Kurikulum Berorientasi Proyek: Modul dilengkapi skematik diagram resolusi tinggi, tabel pengkabelan pin, dan file source code yang siap diunggah.",
        "Monetisasi Mandiri: Mengonversi pengetahuan teknis menjadi aliran pendapatan digital (*digital revenue stream*) berkelanjutan bagi mahasiswa.",
        "Aksesibilitas Cepat: Pembeli langsung mendapatkan tautan unduh instan dokumen PDF materi setelah pembayaran terverifikasi otomatis.",
        "Pemberdayaan Komunitas: Menjadi wadah berbagi ilmu untuk memajukan talenta rekayasa hardware & IoT di Indonesia."
      ],
      metrics: [
        { val: "95%+", lbl: "Margin Keuntungan Digital" },
        { val: "Instan", lbl: "Pengiriman Otomatis via Lynk.id" },
        { val: "100% Riil", lbl: "Validasi Transaksi Pasar" }
      ],
      actions: [
        { href: "https://lynk.id/rakitproject", label: "Kunjungi Etalase Lynk.id", icon: "fas fa-shopping-bag", primary: true },
        { href: "https://lynk.id/rakitproject", label: "Katalog Ebook & Modul", icon: "fas fa-book-reader", primary: false }
      ]
    },

    spaceimpact: {
      badges: [
        { label: "Embedded Gaming & C/C++", class: "pill-iot", icon: "fas fa-gamepad" },
        { label: "Hardware Resource Optimization", class: "pill-award", icon: "fas fa-microchip" }
      ],
      title: "Game Space Impact Portabel Berbasis Arduino Nano & LCD 16x2",
      lead: "Rekayasa konsol game retro portabel yang mengimplementasikan game klasik Space Impact pada mikrokontroler 8-bit ATmega328P dengan optimalisasi memori dan custom character rendering.",
      problem: [
        "Keterbatasan memori hardware: Arduino Nano hanya memiliki 2 KB SRAM dan 32 KB Flash Memory, sangat rentan mengalami memory overflow pada game berbasis array.",
        "Keterbatasan layar karakter LCD 16x2: Hanya menyediakan 8 slot karakter kustom (CGRAM 5x8 pixel), tidak memiliki buffer grafik piksel bebas seperti OLED/TFT.",
        "Kebutuhan siklus game loop non-blocking agar pergerakan peluru laser, musuh, dan deteksi tabrakan berjalan halus tanpa jeda fungsi delay()."
      ],
      solution: [
        "Dynamic CGRAM Shifting: Mengembangkan algoritma pemetaan bitmap piksel pesawat tempur dan musuh ke dalam 8 register CGRAM secara bergantian mengikuti koordinat gerakan.",
        "Non-blocking Timer Loop: Menggunakan pembacaan fungsi millis() untuk mengelola siklus animasi peluru, kecepatan alien, dan input kendali secara independen.",
        "Integrasi Hardware: Menggabungkan modul analog 2-axis joystick untuk manuver sumbu vertikal/horizontal, push-button taktil untuk tombol tembak, dan housing casing kustom portabel."
      ],
      features: [
        "Fisika Game Klasik: Pesawat dapat bergerak multi-arah, menembakkan laser proyektil, dan menghindar dari serangan alien.",
        "Collision Detection Akurat: Algoritma pengecekan koordinat benturan peluru vs musuh secara real-time.",
        "Sistem Skor & Nyawa: Pencatatan poin skor dinamis yang tampil langsung di antarmuka layar LCD.",
        "Simulasi Web Interaktif: Proyek ini juga dilengkapi simulator layar LCD hijau di portofolio dengan efek suara 8-bit synthesizer."
      ],
      metrics: [
        { val: "< 55%", lbl: "Penggunaan Memori SRAM (Aman)" },
        { val: "28 FPS", lbl: "Frame Rate Layar Tanpa Flicker" },
        { val: "Portabel", lbl: "Ditenagai Baterai Mandiri" }
      ],
      actions: [
        { href: "https://github.com/zericks/Game-Space-Impact", label: "Repositori GitHub", icon: "fab fa-github", primary: false },
        { img: "assets/images/space_impact.png", label: "Lihat Casing Fisik", icon: "fas fa-search-plus", isLightbox: true }
      ]
    },

    smartbell: {
      badges: [
        { label: "IoT Security & Vision", class: "pill-iot", icon: "fas fa-camera" },
        { label: "Telegram Bot API", class: "pill-award", icon: "fab fa-telegram-plane" }
      ],
      title: "Smart Bell Telegram ESP32-CAM",
      lead: "Sistem pengawasan pintu masuk cerdas yang memanfaatkan modul ESP32-CAM untuk menangkap foto pengunjung saat bel ditekan dan mengirimkan notifikasi foto instan ke akun Telegram pemilik rumah.",
      problem: [
        "Pemilik rumah sering tidak berada di tempat saat tamu atau kurir paket penting datang berkunjung.",
        "Kamera CCTV komersial membutuhkan perangkat DVR mahal, penyimpanan besar, dan sering kali tidak memberikan peringatan foto instan saat ada interaksi di pintu."
      ],
      solution: [
        "Memanfaatkan modul ESP32-CAM berbiaya terjangkau dengan sensor kamera OV2640 dan antena Wi-Fi internal.",
        "Menerapkan protokol HTTP POST multipart/form-data untuk mentransmisikan data biner citra langsung ke server Telegram Bot API secara aman (HTTPS).",
        "Mode siaga hemat energi yang hanya mengaktifkan modul kamera dan transmisi radio saat ada trigger penekanan tombol bel."
      ],
      features: [
        "Notifikasi Foto Instan: Gambar beresolusi tajam langsung masuk ke smartphone pemilik rumah dalam hitungan detik.",
        "Tanpa Biaya Langganan Cloud: Memanfaatkan infrastruktur gratis Telegram yang andal tanpa batasan kuota pesan.",
        "Pengoperasian Sederhana: Cukup terhubung ke jaringan Wi-Fi rumah tanpa memerlukan konfigurasi router yang rumit."
      ],
      metrics: [
        { val: "< 3.0 s", lbl: "Kecepatan Pengiriman Foto" },
        { val: "SVGA", lbl: "Resolusi Citra Kamera" },
        { val: "0 Rupiah", lbl: "Biaya Server / Cloud" }
      ],
      actions: [
        { href: "https://github.com/zericks/SmartBell-Telegram", label: "Repositori GitHub", icon: "fab fa-github", primary: false },
        { img: "assets/images/telegram_bot.jpg", label: "Bukti Notifikasi Telegram", icon: "fas fa-eye", isLightbox: true }
      ]
    },

    signlanguage: {
      badges: [
        { label: "Computer Vision & AI", class: "pill-iot", icon: "fas fa-brain" },
        { label: "Python & OpenCV", class: "pill-award", icon: "fab fa-python" }
      ],
      title: "Deteksi Penerjemah Bahasa Isyarat Alfabet",
      lead: "Sistem computer vision dan machine learning berbasis Python untuk mengenali dan mengklasifikasikan gesture tangan alfabet bahasa isyarat secara real-time melalui kamera web.",
      problem: [
        "Terdapat jurang komunikasi antara masyarakat umum dengan teman tuli/disabilitas rungu-wicara yang mengandalkan bahasa isyarat.",
        "Minimnya alat bantu penerjemah bahasa isyarat otomatis yang praktis, ringan, dan dapat dijalankan langsung di perangkat komputer biasa tanpa sensor sarung tangan khusus."
      ],
      solution: [
        "Pipeline Pemrosesan Citra: Mengakuisisi frame video webcam, melakukan segmentasi area tangan, normalisasi kontur, dan ekstraksi fitur posisi jari.",
        "Klasifikasi Cepat: Memetakan pola koordinat jari tangan ke dalam karakter huruf alfabet (A-Z) dengan latensi minimal.",
        "Antarmuka Visual Informatif: Menampilkan bounding box dan teks huruf hasil terjemahan langsung di atas frame video secara real-time."
      ],
      features: [
        "Deteksi Real-time: Berjalan lancar pada kamera web standar tanpa lag.",
        "Akurasi Pengenalan Alfabet: Mengidentifikasi formasi jari tangan unik untuk setiap huruf abjad.",
        "Open-source & Aplikatif: Kode sumber terbuka yang dapat dikembangkan lebih lanjut untuk sistem pembelajaran interaktif bahasa isyarat."
      ],
      metrics: [
        { val: "30 FPS", lbl: "Kecepatan Pemrosesan Video" },
        { val: "Real-time", lbl: "Inferensi Klasifikasi Huruf" },
        { val: "Webcam", lbl: "Hanya Butuh Kamera Biasa" }
      ],
      actions: [
        { href: "https://github.com/zericks/alphabet-sign-language-detection", label: "Repositori GitHub", icon: "fab fa-github", primary: false },
        { href: "https://github.com/zericks/alphabet-sign-language-detection", label: "Source Code Python", icon: "fas fa-code", primary: true }
      ]
    }
  };

  const caseStudyModal = document.getElementById('case-study-modal');
  const caseStudyContent = document.getElementById('case-study-modal-content');
  const caseStudyCloseBtn = document.getElementById('case-study-close-btn');

  function openCaseStudy(studyKey) {
    const data = caseStudiesData[studyKey];
    if (!data || !caseStudyModal || !caseStudyContent) return;

    let badgesHtml = data.badges.map(b => `<span class="case-study-pill ${b.class}"><i class="${b.icon}"></i> ${b.label}</span>`).join('');
    let problemHtml = data.problem.map(p => `<li>${p}</li>`).join('');
    let solutionHtml = data.solution.map(s => `<li>${s}</li>`).join('');
    let featuresHtml = data.features.map(f => {
      const parts = f.split(':');
      if (parts.length > 1) {
        return `<li><strong>${parts[0]}:</strong>${parts.slice(1).join(':')}</li>`;
      }
      return `<li>${f}</li>`;
    }).join('');
    let metricsHtml = data.metrics.map(m => `
      <div class="metric-highlight-card">
        <span class="metric-val">${m.val}</span>
        <span class="metric-lbl">${m.lbl}</span>
      </div>
    `).join('');

    let actionsHtml = data.actions.map(act => {
      if (act.isLightbox) {
        return `<button class="btn-card-github" data-lightbox data-img="${act.img}" data-title="${data.title}" data-sub="${act.label}"><i class="${act.icon}"></i> ${act.label}</button>`;
      } else {
        return `<a href="${act.href}" target="_blank" rel="noopener" class="${act.primary ? 'btn-primary' : 'btn-card-github'}"><i class="${act.icon}"></i> ${act.label}</a>`;
      }
    }).join('');

    caseStudyContent.innerHTML = `
      <div class="case-study-panel">
        <div class="case-study-header">
          <div class="case-study-badge-row">${badgesHtml}</div>
          <h2 class="case-study-title">${data.title}</h2>
          <p class="case-study-lead">${data.lead}</p>
        </div>

        <div class="case-study-grid-2">
          <div class="case-study-box problem">
            <h4><i class="fas fa-exclamation-triangle" style="color: #ef4444;"></i> Latar Belakang &amp; Masalah</h4>
            <ul>${problemHtml}</ul>
          </div>
          <div class="case-study-box solution">
            <h4><i class="fas fa-lightbulb" style="color: #06d6a0;"></i> Solusi Rekayasa &amp; Eksekusi</h4>
            <ul>${solutionHtml}</ul>
          </div>
        </div>

        <div class="case-study-section">
          <h4><i class="fas fa-cogs" style="color: var(--primary-cyan);"></i> Fitur Kunci &amp; Implementasi Sistem</h4>
          <ul style="padding-left: 1.2rem; color: var(--text-secondary); line-height: 1.8;">
            ${featuresHtml}
          </ul>
        </div>

        <div class="case-study-section">
          <h4><i class="fas fa-chart-pie" style="color: #ffb703;"></i> Validasi Hasil &amp; Metrik Capaian</h4>
          <div class="metrics-flex-row">
            ${metricsHtml}
          </div>
        </div>

        <div class="case-study-actions">
          ${actionsHtml}
        </div>
      </div>
    `;

    // Re-bind any data-lightbox inside the newly generated modal content
    caseStudyContent.querySelectorAll('[data-lightbox]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const src = el.getAttribute('data-img');
        const title = el.getAttribute('data-title');
        const subtitle = el.getAttribute('data-sub');
        if (src) openLightbox(src, title, subtitle);
      });
    });

    caseStudyModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCaseStudy() {
    if (!caseStudyModal) return;
    caseStudyModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.btn-open-case-study').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const studyKey = btn.getAttribute('data-study');
      if (studyKey) openCaseStudy(studyKey);
    });
  });

  if (caseStudyCloseBtn) {
    caseStudyCloseBtn.addEventListener('click', closeCaseStudy);
  }

  if (caseStudyModal) {
    caseStudyModal.addEventListener('click', (e) => {
      if (e.target === caseStudyModal) closeCaseStudy();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeGame();
      closeCaseStudy();
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
