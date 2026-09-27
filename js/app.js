/**
 * PSIKOBADEM DERGISI - ACIBADEM UNIVERSITESI PSIKOLOJI KULUBU
 * Interactive Dossier & Flipbook Reader Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // DATA REGISTRY FOR ALL 7 ISSUES
  // =========================================================================
  const issuesData = {
    1: {
      number: '1.',
      badgeText: '1. SAYI',
      title: '1. Sayı',
      theme: 'Tema: Pozitif Psikoloji',
      fullTitle: 'Psikobadem Dergisi — Sayı 1: Pozitif Psikoloji',
      type: 'iframe',
      url: 'https://online.fliphtml5.com/indxoa/kpma/#p=1',
      originalUrl: 'https://online.fliphtml5.com/indxoa/kpma/#p=1',
      cover: 'assets/covers/cover_1.jpg'
    },
    2: {
      number: '2.',
      badgeText: '2. SAYI',
      title: '2. Sayı',
      theme: 'Tema: Bağlanma ve İlişkiler',
      fullTitle: 'Psikobadem Dergisi — Sayı 2: Bağlanma ve İlişkiler',
      type: 'iframe',
      url: 'https://heyzine.com/flip-book/665e799a69.html',
      originalUrl: 'https://heyzine.com/flip-book/665e799a69.html',
      cover: 'assets/covers/cover_2.jpg'
    },
    3: {
      number: '3.',
      badgeText: '3. SAYI',
      title: '3. Sayı',
      theme: 'Tema: Yas Psikolojisi (Yas, Kayıp ve Anlam)',
      fullTitle: 'Psikobadem Dergisi — Sayı 3: Yas Psikolojisi',
      type: 'iframe',
      url: 'https://heyzine.com/flip-book/6c6dc8b0c6.html',
      originalUrl: 'https://heyzine.com/flip-book/6c6dc8b0c6.html',
      cover: 'assets/covers/cover_3.jpg'
    },
    4: {
      number: '4.',
      badgeText: '4. SAYI',
      title: '4. Sayı',
      theme: 'Tema: Yeni Yıl ve OKB (Psikolojik Farkındalık)',
      fullTitle: 'Psikobadem Dergisi — Sayı 4: Yeni Yıl ve OKB',
      type: 'iframe',
      url: 'https://heyzine.com/flip-book/f3134ee752.html',
      originalUrl: 'https://heyzine.com/flip-book/f3134ee752.html',
      cover: 'assets/covers/cover_4.jpg'
    },
    5: {
      number: '5.',
      badgeText: '5. SAYI',
      title: '5. Sayı',
      theme: 'Bahar Edisyonu (34 Sayfa Vektörel)',
      fullTitle: 'Psikobadem Dergisi — Sayı 5: Bahar Edisyonu',
      type: 'native',
      totalPages: 34,
      pagesPath: 'assets/s5_pages',
      originalUrl: '',
      cover: 'assets/covers/cover_5.webp'
    },
    6: {
      number: '6.',
      badgeText: '6. SAYI',
      title: '6. Sayı',
      theme: 'Psikobadem 6. Sayı (Güncel Sayı)',
      fullTitle: 'Psikobadem Dergisi — Sayı 6',
      type: 'iframe',
      url: 'https://heyzine.com/flip-book/8ed8e88479.html#page/1',
      originalUrl: 'https://heyzine.com/flip-book/8ed8e88479.html#page/1',
      cover: 'assets/covers/cover_6.jpg'
    },
    7: {
      number: 'SON SAYI',
      badgeText: 'SON SAYI',
      title: 'Son Sayı',
      theme: 'Psikobadem 6 (Değişen Dünyada Psikoloji)',
      fullTitle: 'Psikobadem Dergisi — Son Sayı (Sayı 6)',
      type: 'iframe',
      url: 'https://heyzine.com/flip-book/8ed8e88479.html#page/1',
      originalUrl: 'https://heyzine.com/flip-book/8ed8e88479.html#page/1',
      cover: 'assets/covers/cover_6.jpg'
    }
  };

  // =========================================================================
  // AUDIO SYNTHESIZER (Web Audio API - Paper & Ambient Atmosphere)
  // =========================================================================
  let audioCtx = null;
  let ambientSource = null;
  let isAmbientPlaying = false;
  let soundEnabled = true;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Realistic Paper Slide / Rustle Sound
  function playPaperRustle() {
    if (!soundEnabled) return;
    try {
      initAudioContext();
      const bufferSize = audioCtx.sampleRate * 0.15;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const decay = Math.exp(-i / (bufferSize * 0.22));
        data[i] = (Math.random() * 2 - 1) * decay;
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1100, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(450, audioCtx.currentTime + 0.15);
      filter.Q.value = 2.2;

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start();
    } catch (e) {
      // Audio not permitted yet or unsupported
    }
  }

  // Page Turn Sound
  function playPageTurn() {
    if (!soundEnabled) return;
    try {
      initAudioContext();
      const bufferSize = audioCtx.sampleRate * 0.22;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const decay = Math.exp(-i / (bufferSize * 0.3));
        data[i] = (Math.random() * 2 - 1) * decay;
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(320, audioCtx.currentTime + 0.22);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.22);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start();
    } catch (e) {}
  }

  // Cozy Ambient Sound (Soft Rain & Fireplace crackle simulation)
  function toggleAmbientSound() {
    initAudioContext();
    const btn = document.getElementById('btn-ambient');

    if (isAmbientPlaying) {
      if (ambientSource) {
        ambientSource.stop();
        ambientSource.disconnect();
        ambientSource = null;
      }
      isAmbientPlaying = false;
      btn.classList.remove('playing');
      btn.querySelector('.ambient-status').textContent = 'Ambiyans: Kapalı';
    } else {
      // Create cozy pink noise / rain simulation
      const bufferSize = audioCtx.sampleRate * 4;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      ambientSource = audioCtx.createBufferSource();
      ambientSource.buffer = buffer;
      ambientSource.loop = true;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 650;

      const gain = audioCtx.createGain();
      gain.gain.value = 0.18;

      ambientSource.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      ambientSource.start();

      isAmbientPlaying = true;
      btn.classList.add('playing');
      btn.querySelector('.ambient-status').textContent = 'Ambiyans: Açık';
    }
  }

  // =========================================================================
  // DOM ELEMENTS
  // =========================================================================
  const folderLayers = document.querySelectorAll('.folder-item');
  const tabHitboxes = document.querySelectorAll('.tab-hitbox');
  const previewCard = document.getElementById('magazine-preview-card');
  const frontPromptInfo = document.getElementById('front-prompt-info');
  const btnReadNow = document.getElementById('btn-read-now');
  const frontCoverImg = document.getElementById('front-cover-img');
  const previewIssueBadge = document.getElementById('preview-issue-badge');
  const previewIssueTheme = document.getElementById('preview-issue-theme');
  const folderDossier = document.getElementById('folder-dossier');

  const readerModal = document.getElementById('reader-modal');
  const btnBack = document.getElementById('btn-back');
  const btnClose = document.getElementById('btn-close');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const btnExternal = document.getElementById('btn-external');
  const btnSoundToggle = document.getElementById('btn-sound-toggle');
  const btnAmbient = document.getElementById('btn-ambient');
  const issueSwitcherPills = document.querySelectorAll('.switch-pill');

  const readerIssueNumber = document.getElementById('reader-issue-number');
  const readerIssueTheme = document.getElementById('reader-issue-theme');
  const iframeWrap = document.getElementById('iframe-wrap');
  const nativeWrap = document.getElementById('native-wrap');
  const iframeElement = document.getElementById('flipbook-iframe');
  const flipbookContainer = document.getElementById('flipbook-book');

  const btnPrevPage = document.getElementById('btn-prev-page');
  const btnNextPage = document.getElementById('btn-next-page');
  const pageCounter = document.getElementById('page-counter');

  let currentIssueIndex = 7;
  let currentActivePreviewIndex = 7;
  let pageFlipInstance = null;
  let coverSwitchTimeout = null;

  // =========================================================================
  // DYNAMIC COVER & FOLDER PREVIEW
  // =========================================================================
  function activateFolderPreview(index) {
    if (!issuesData[index]) return;
    currentActivePreviewIndex = index;

    // Lift corresponding folder (each folder has its own static cover showcase)
    folderLayers.forEach((folder) => {
      const idx = parseInt(folder.getAttribute('data-index'), 10);
      folder.classList.toggle('is-hovered', idx === index);
    });
  }

  function resetFolderDossier() {
    folderLayers.forEach(folder => folder.classList.remove('is-hovered'));
    currentActivePreviewIndex = 7;
  }

  // =========================================================================
  // FOLDER DOSSIER INTERACTIONS & TAB HITBOXES
  // =========================================================================
  tabHitboxes.forEach((hitbox) => {
    const tabIndex = parseInt(hitbox.getAttribute('data-tab-index'), 10);

    // Hover on tab lifts that folder
    hitbox.addEventListener('mouseenter', () => {
      activateFolderPreview(tabIndex);
      playPaperRustle();
    });

    // Click on tab (Opens specific issue directly)
    hitbox.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openIssue(tabIndex);
    });

    // Keyboard accessibility
    hitbox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openIssue(tabIndex);
      }
    });

    // Touch support for mobile/tablet
    hitbox.addEventListener('touchstart', () => {
      activateFolderPreview(tabIndex);
    }, { passive: true });
  });

  // Revert showcase to Son Sayı when leaving dossier completely
  if (folderDossier) {
    folderDossier.addEventListener('mouseleave', () => {
      resetFolderDossier();
    });
  }

  // Wire up click listeners on EVERY folder's cover card, prompt info & button
  folderLayers.forEach((folder) => {
    const idx = parseInt(folder.getAttribute('data-index'), 10);
    const card = folder.querySelector('.magazine-preview-card');
    const promptInfo = folder.querySelector('.front-prompt-info');
    const readBtn = folder.querySelector('.prompt-hint-pill');

    if (card) {
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        openIssue(idx);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          openIssue(idx);
        }
      });
    }

    if (promptInfo) {
      promptInfo.addEventListener('click', (e) => {
        e.stopPropagation();
        openIssue(idx);
      });
      promptInfo.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          openIssue(idx);
        }
      });
    }

    if (readBtn) {
      readBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openIssue(idx);
      });
    }
  });

  // =========================================================================
  // OPEN ISSUE IN FLIPBOOK READER
  // =========================================================================
  function openIssue(index, immediate = false) {
    currentIssueIndex = index;
    const data = issuesData[index];
    if (!data) return;

    const targetFolder = document.querySelector(`.folder-item[data-index="${index}"]`);
    if (targetFolder && !immediate) {
      targetFolder.classList.add('opening');
    }

    if (!immediate) playPaperRustle();

    const applyOpen = () => {
      // Update Reader Header
      readerIssueNumber.textContent = data.title;
      readerIssueTheme.textContent = data.theme;

      // Update Switcher Pills active state
      issueSwitcherPills.forEach(pill => {
        const pillIdx = parseInt(pill.getAttribute('data-switch-to'), 10);
        const isActive = pillIdx === index;
        pill.classList.toggle('active', isActive);
        if (isActive) {
          try {
            pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          } catch (e) {}
        }
      });

      // Update External Link Button
      if (data.originalUrl) {
        btnExternal.style.display = 'flex';
        btnExternal.href = data.originalUrl;
      } else {
        btnExternal.style.display = 'none';
      }

      // Render Issue Content based on Type
      if (data.type === 'iframe') {
        nativeWrap.style.display = 'none';
        iframeWrap.style.display = 'flex';
        destroyNativeFlipbook();
        iframeElement.src = data.url;
      } else if (data.type === 'native' || data.type === 'special') {
        iframeWrap.style.display = 'none';
        iframeElement.src = 'about:blank';
        nativeWrap.style.display = 'flex';
        initNativeFlipbook(index);
      }

      // Show Reader Modal
      readerModal.classList.add('active');
      document.body.style.overflow = 'hidden';

      if (targetFolder) {
        targetFolder.classList.remove('opening');
      }
    };

    if (immediate) {
      applyOpen();
    } else {
      setTimeout(applyOpen, 240);
    }
  }

  // Close Reader Modal
  function closeReader() {
    readerModal.classList.remove('active');
    document.body.style.overflow = '';
    iframeElement.src = 'about:blank';
    destroyNativeFlipbook();
    playPaperRustle();
  }

  btnBack.addEventListener('click', closeReader);
  btnClose.addEventListener('click', closeReader);

  // Switcher Pills inside Reader
  issueSwitcherPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const idx = parseInt(pill.getAttribute('data-switch-to'), 10);
      if (idx !== currentIssueIndex) {
        openIssue(idx);
      }
    });
  });

  // =========================================================================
  // NATIVE STPAGEFLIP ENGINE (Sayı 5 & Özel Sayı)
  // =========================================================================
  function destroyNativeFlipbook() {
    if (pageFlipInstance) {
      try {
        pageFlipInstance.destroy();
      } catch (e) {}
      pageFlipInstance = null;
    }
    flipbookContainer.innerHTML = '';
  }

  function initNativeFlipbook(index, startPageIndex = 0) {
    destroyNativeFlipbook();

    const data = issuesData[index];
    if (!data) return;

    // Measure stage dimensions accurately
    const stage = document.querySelector('.flipbook-stage') || nativeWrap;
    const stageW = stage ? stage.clientWidth : window.innerWidth;
    const stageH = stage ? stage.clientHeight : (window.innerHeight - 130);

    const isMobile = stageW < 768;

    // Calculate responsive flipbook dimensions
    let bookWidth, bookHeight;

    if (isMobile) {
      // Single-page portrait mode on mobile
      const availW = Math.max(260, stageW - 20);
      const availH = Math.max(340, stageH - 12);

      // Single A4 page: ratio = 1.4142 (height / width)
      const maxW_from_H = availH / 1.4142;
      bookWidth = Math.round(Math.min(availW, maxW_from_H));
      bookHeight = Math.round(bookWidth * 1.4142);
    } else {
      // Two-page spread on desktop & tablets
      const availW = Math.max(500, stageW - 44);
      const availH = Math.max(360, stageH - 16);

      // Two A4 pages side-by-side: spread ratio = 1.4142 (spreadWidth / height)
      // spreadWidth = 2 * bookWidth = 1.4142 * bookHeight
      // bookHeight = spreadWidth / 1.4142 <= availW / 1.4142
      const maxH_from_W = availW / 1.4142;
      bookHeight = Math.round(Math.min(availH, maxH_from_W));
      bookWidth = Math.round(bookHeight / 1.4142);
    }

    // Build Pages HTML
    let pagesHtml = '';

    if (index === 5) {
      // Issue 5 (34 High-Res Pages)
      for (let p = 1; p <= data.totalPages; p++) {
        pagesHtml += `
          <div class="book-page" data-density="${p === 1 || p === data.totalPages ? 'hard' : 'soft'}">
            <img src="${data.pagesPath}/${p}.webp" alt="Psikobadem Sayı 5 - Sayfa ${p}" loading="${p <= 4 ? 'eager' : 'lazy'}" />
          </div>
        `;
      }
    } else if (index === 7) {
      // Özel Sayı (8 Curated Editorial Pages)
      pagesHtml = generateSpecialIssuePages();
    }

    flipbookContainer.innerHTML = pagesHtml;

    // Instantiate StPageFlip
    try {
      const PageFlip = window.St?.PageFlip;
      if (!PageFlip) {
        console.error('PageFlip library not loaded');
        return;
      }

      pageFlipInstance = new PageFlip(flipbookContainer, {
        width: bookWidth,
        height: bookHeight,
        size: 'fixed',
        autoSize: false,
        minWidth: 240,
        maxWidth: 1400,
        minHeight: 340,
        maxHeight: 1800,
        maxShadowOpacity: 0.55,
        showCover: true,
        mobileScrollSupport: false,
        usePortrait: isMobile,
        startPage: Math.min(startPageIndex, (index === 5 ? 33 : 7))
      });

      pageFlipInstance.loadFromHTML(document.querySelectorAll('.book-page'));

      // Event: Flip Page
      pageFlipInstance.on('flip', (e) => {
        playPageTurn();
        updatePageCounter();
      });

      pageFlipInstance.on('changeState', (e) => {
        updatePageCounter();
      });

      updatePageCounter();
    } catch (err) {
      console.error('Error initializing flipbook:', err);
    }
  }

  function updatePageCounter() {
    if (!pageFlipInstance) return;
    const current = pageFlipInstance.getCurrentPageIndex() + 1;
    const total = pageFlipInstance.getPageCount();
    const isMobile = window.innerWidth < 768;

    if (!isMobile && current > 1 && current < total) {
      const leftPage = current % 2 === 0 ? current : current - 1;
      const rightPage = Math.min(total, leftPage + 1);
      pageCounter.textContent = `Sayfa ${leftPage}-${rightPage} / ${total}`;
    } else {
      pageCounter.textContent = `Sayfa ${current} / ${total}`;
    }
  }

  // Next / Previous buttons for Native Flipbook
  btnPrevPage.addEventListener('click', () => {
    if (pageFlipInstance) {
      pageFlipInstance.flipPrev();
    }
  });

  btnNextPage.addEventListener('click', () => {
    if (pageFlipInstance) {
      pageFlipInstance.flipNext();
    }
  });

  // =========================================================================
  // ÖZEL SAYI PAGES GENERATOR
  // =========================================================================
  function generateSpecialIssuePages() {
    return `
      <!-- Sayfa 1: Kapak -->
      <div class="book-page special-page cover" data-density="hard">
        <div class="special-cover-badge">
          <img src="assets/logo.png" alt="Acıbadem Psikoloji Kulübü" />
        </div>
        <div class="special-cover-subtitle">Acıbadem Üniversitesi Psikoloji Kulübü</div>
        <h1 class="special-cover-title">PSİKOBADEM</h1>
        <div class="special-cover-theme">Özel Edisyon: Varoluş, Sanat ve İnsan Ruhu</div>
        <p style="margin-top: 1.5rem; font-size: 0.85rem; color: #eedbc7; letter-spacing: 1px;">ÖĞRENCİ ÜRETİMİYLE ŞEKİLLENEN İÇERİKLER</p>
      </div>

      <!-- Sayfa 2: Editörden -->
      <div class="book-page special-page" data-density="soft">
        <div class="special-header-decor">
          <span>Psikobadem Özel Sayı</span>
          <span>Editörden</span>
        </div>
        <h2 class="special-headline">Kelimelerin İyileştirici Gücü</h2>
        <div class="special-lead">
          "Bir dergi, bir araya gelmiş zihinlerin ortak nefesi, düşüncelerin sayfalar arasında yankılanan sesidir."
        </div>
        <div class="special-body-text">
          <p>Sevgili Psikobadem Okurları,</p>
          <p style="margin-top: 0.8rem;">Acıbadem Üniversitesi Psikoloji Kulübü olarak yola çıktığımız ilk günden beri, psikoloji bilimini yalnızca amfilerin ve ders kitaplarının sınırlarında tutmamayı, onu hayatın her alanına dokunan canlı bir anlatıya dönüştürmeyi amaçladık.</p>
          <p style="margin-top: 0.8rem;">Pozitif psikolojiden bağlanma kuramına, yasın derin dehlizlerinden yeni yılın umut dolu eşiklerine kadar uzanan bu yolculukta şimdi sizleri bu özel arşiv edisyonu ile selamlıyoruz.</p>
        </div>
        <div class="special-footer-decor">
          <span>Yayın Kurulu</span>
          <span>Sayfa 2</span>
        </div>
      </div>

      <!-- Sayfa 3: Özel Makale 1 -->
      <div class="book-page special-page" data-density="soft">
        <div class="special-header-decor">
          <span>Dosya Konusu</span>
          <span>Varoluş & Anlam</span>
        </div>
        <h2 class="special-headline">Anlam Arayışının İzinde</h2>
        <div class="special-lead">
          Viktor Frankl'dan Günümüz Modern İnsanına: Yaşamaya Değer Bir Neden Bulmak.
        </div>
        <div class="special-body-text">
          <p>Varoluşsal psikoterapi, insanı yalnızca biyolojik ya da psikolojik dürtülerin toplamı olarak değil; seçim yapabilen, sorumluluk alan ve en karanlık koşullarda dahi anlamına tutunan bir varlık olarak tanımlar.</p>
          <div class="special-quote">
            "Yaşamak için bir 'neden'i olan insan, hemen her 'nasıl'a katlanabilir."
            <div style="font-size: 0.85rem; margin-top: 6px; font-style: normal; color: #8b3c29;">— Friedrich Nietzsche</div>
          </div>
          <p>Belirsizliklerle dolu çağımızda, kendi anlam haritamızı çizmek belki de ruh sağlığımızın en sağlam çıpasıdır.</p>
        </div>
        <div class="special-footer-decor">
          <span>Psikobadem Araştırma</span>
          <span>Sayfa 3</span>
        </div>
      </div>

      <!-- Sayfa 4: Klinik Perspektif -->
      <div class="book-page special-page" data-density="soft">
        <div class="special-header-decor">
          <span>İlişkiler & Ruh</span>
          <span>Bağlanma Stilleri</span>
        </div>
        <h2 class="special-headline">Dijital Çağda Güvenli Bağlar</h2>
        <div class="special-body-text">
          <p>John Bowlby'nin temellerini attığı Bağlanma Kuramı, bebeklikte kurulan bağların yetişkinlikteki romantik ve sosyal ilişkilerimizi nasıl biçimlendirdiğini gösterir.</p>
          <p style="margin-top: 0.8rem;">Bugün ekranların arkasında kurulan ilişkiler, kaygılı ve kaçıngan bağlanma örüntülerini yeniden tetiklemekte. Ancak unutmamalıyız ki güvenli bağlanma bir kader değil; farkındalık, empati ve içgörüyle her yaşta kazanılabilen bir beceridir.</p>
          <div class="special-quote">
            "İyileşme, kendimizle ve başkalarıyla kurduğumuz şefkatli temasla başlar."
          </div>
        </div>
        <div class="special-footer-decor">
          <span>Klinik Psikoloji Masası</span>
          <span>Sayfa 4</span>
        </div>
      </div>

      <!-- Sayfa 5: Kulüp Etkinlikleri & Bellek -->
      <div class="book-page special-page" data-density="soft">
        <div class="special-header-decor">
          <span>Kulüp Belleği</span>
          <span>Acıbadem Psikoloji</span>
        </div>
        <h2 class="special-headline">Üretimle Büyüyen Bir Topluluk</h2>
        <div class="special-body-text">
          <p>Acıbadem Üniversitesi Psikoloji Kulübü olarak yıl boyunca gerçekleştirdiğimiz:</p>
          <ul style="margin: 0.8rem 0 0.8rem 1.5rem; line-height: 1.8;">
            <li>Geleneksel Psikoloji Zirveleri ve Alan Uzmanı Seminerleri</li>
            <li>Film Okumaları ve Karakter Analiz Atölyeleri</li>
            <li>Akademik Makale Tartışma Masaları</li>
            <li>Psikobadem Dergisi Yazı ve Tasarım Kolektifi</li>
          </ul>
          <p>Öğrencilerin kaleminden çıkan her bir yazı, paylaşılan her düşünce bizleri daha güçlü ve kenetlenmiş bir topluluk haline getiriyor.</p>
        </div>
        <div class="special-footer-decor">
          <span>Etkinlikler & Paylaşımlar</span>
          <span>Sayfa 5</span>
        </div>
      </div>

      <!-- Sayfa 6: Kitap & Sinema Önerileri -->
      <div class="book-page special-page" data-density="soft">
        <div class="special-header-decor">
          <span>Kültür & Sanat</span>
          <span>Tavsiyeler</span>
        </div>
        <h2 class="special-headline">Zihnin Derinliklerine Yolculuk</h2>
        <div class="special-lead">Kulüp üyelerimizin seçtiği başucu eserleri:</div>
        <div class="special-body-text">
          <p><strong>📖 İnsanın Anlam Arayışı</strong> — Viktor E. Frankl</p>
          <p style="margin-top: 0.5rem;"><strong>📖 Beden Kayıt Tutar</strong> — Bessel van der Kolk</p>
          <p style="margin-top: 0.5rem;"><strong>📖 Günübirlik Hayatlar</strong> — Irvin D. Yalom</p>
          <p style="margin-top: 0.5rem;"><strong>🎬 A Beautiful Mind</strong> — Ron Howard</p>
          <p style="margin-top: 0.5rem;"><strong>🎬 Ordinary People</strong> — Robert Redford</p>
        </div>
        <div class="special-footer-decor">
          <span>Kültür Sanat Seçkisi</span>
          <span>Sayfa 6</span>
        </div>
      </div>

      <!-- Sayfa 7: Teşekkür & Ekip -->
      <div class="book-page special-page" data-density="soft">
        <div class="special-header-decor">
          <span>Emeği Geçenler</span>
          <span>Yayın Ekibi</span>
        </div>
        <h2 class="special-headline">Birlikte Ürettik</h2>
        <div class="special-body-text">
          <p>Psikobadem dergisinin tüm sayılarında emeği geçen yazar ekibimize, tasarımcılarımıza, fikirleriyle dergimize zenginlik katan tüm kulüp üyelerimize ve bizi ilgiyle takip eden okurlarımıza sonsuz teşekkürlerimizle.</p>
          <div class="special-quote">
            "Fark etmek, anlamak ve paylaşmak için yazmaya devam ediyoruz."
          </div>
          <p style="margin-top: 1rem; text-align: center; font-weight: 600; color: #8b3c29;">
            Acıbadem Üniversitesi Psikoloji Kulübü Yönetim Kurulu
          </p>
        </div>
        <div class="special-footer-decor">
          <span>Teşekkürlerimizle</span>
          <span>Sayfa 7</span>
        </div>
      </div>

      <!-- Sayfa 8: Arka Kapak -->
      <div class="book-page special-page cover" data-density="hard">
        <div class="special-cover-badge" style="width: 80px; height: 80px; margin-bottom: 1.5rem;">
          <img src="assets/logo.png" alt="Acıbadem Psikoloji Kulübü" />
        </div>
        <h2 style="font-family: var(--font-display); font-size: 2rem; color: #fff; margin-bottom: 0.8rem;">Bize Ulaşın</h2>
        <p style="font-size: 1rem; color: #eedbc7; margin-bottom: 1.5rem;">Düşünceleriniz, yazı önerileriniz ve katkılarınız için:</p>
        <p style="font-size: 1.1rem; color: var(--accent-gold); font-weight: 600; margin-bottom: 0.5rem;">📸 @acupsikolojikulubu</p>
        <p style="font-size: 0.95rem; color: #eedbc7;">✉️ acupsikolojikulubu@gmail.com</p>
        <p style="margin-top: 2rem; font-size: 0.8rem; color: rgba(255, 255, 255, 0.6); letter-spacing: 2px;">
          ACIBADEM ÜNİVERSİTESİ • İSTANBUL
        </p>
      </div>
    `;
  }

  // =========================================================================
  // CONTROLS & EVENT LISTENERS
  // =========================================================================
  // Fullscreen Toggle
  btnFullscreen.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });

  // Fullscreen State Listener (Resize Flipbook & Update Icon)
  document.addEventListener('fullscreenchange', () => {
    const isFullscreen = !!document.fullscreenElement;
    btnFullscreen.innerHTML = isFullscreen ? `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
      </svg>
    ` : `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
      </svg>
    `;
    btnFullscreen.title = isFullscreen ? 'Tam Ekrandan Çık' : 'Tam Ekran';

    if (readerModal.classList.contains('active') && pageFlipInstance) {
      const savedPage = pageFlipInstance.getCurrentPageIndex();
      setTimeout(() => {
        initNativeFlipbook(currentIssueIndex, savedPage);
      }, 150);
    }
  });

  // Sound Effects Toggle
  btnSoundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    btnSoundToggle.style.color = soundEnabled ? 'var(--text-cream)' : '#ff6b6b';
    btnSoundToggle.title = soundEnabled ? 'Ses Efektleri: Açık' : 'Ses Efektleri: Kapalı';
  });

  // Ambient Writer Room Music / Sound Toggle
  btnAmbient.addEventListener('click', toggleAmbientSound);

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (!readerModal.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeReader();
    } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      if (pageFlipInstance) pageFlipInstance.flipNext();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      if (pageFlipInstance) pageFlipInstance.flipPrev();
    }
  });

  // Responsive Resize Handling with Page Preservation
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (readerModal.classList.contains('active') && pageFlipInstance) {
        const savedPage = pageFlipInstance.getCurrentPageIndex();
        initNativeFlipbook(currentIssueIndex, savedPage);
      }
    }, 200);
  });

  // URL Hash / Query Parameter Direct Link Support (?sayi=5 or #5)
  const urlParams = new URLSearchParams(window.location.search);
  const requestedSayi = urlParams.get('sayi') || urlParams.get('issue') || window.location.hash.replace('#', '');
  if (requestedSayi) {
    let targetIndex = null;
    if (requestedSayi.toLowerCase() === 'ozel' || requestedSayi.toLowerCase() === 'özel') {
      targetIndex = 7;
    } else {
      const parsed = parseInt(requestedSayi, 10);
      if (parsed >= 1 && parsed <= 7) targetIndex = parsed;
    }
    if (targetIndex) {
      openIssue(targetIndex, true);
    }
  }
});
