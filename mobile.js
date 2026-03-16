// ═══════════════════════════════════════════════════════════════
// MOBILE APP SHELL — Slide transitions between sections
// ═══════════════════════════════════════════════════════════════

(function () {
    if (window.innerWidth > 768) return;

    // ── 1. Config ─────────────────────────────────────────────
    const SECTION_IDS  = ['about', 'education', 'skills', 'Certificates', 'projects', 'contact'];
    const NAV_TO_INDEX = { 'about':1, 'education':2, 'skills':3, 'certs':4, 'projects':5, 'contact':6 };

    let currentIndex = 0;
    let isAnimating  = false;

    // ── 2. Bottom nav ─────────────────────────────────────────
    const nav = document.createElement('nav');
    nav.className = 'mobile-bottom-nav';
    nav.innerHTML = `
        <button class="mobile-nav-item" data-target="about"><i class="fas fa-user"></i><span>About</span></button>
        <button class="mobile-nav-item" data-target="education"><i class="fas fa-graduation-cap"></i><span>Edu</span></button>
        <button class="mobile-nav-item" data-target="skills"><i class="fas fa-code"></i><span>Skills</span></button>
        <button class="mobile-nav-item" data-target="certs"><i class="fas fa-award"></i><span>Certs</span></button>
        <button class="mobile-nav-item" data-target="projects"><i class="fas fa-folder-open"></i><span>Projects</span></button>
        <button class="mobile-nav-item" data-target="contact"><i class="fas fa-envelope"></i><span>Contact</span></button>
    `;
    document.body.appendChild(nav);

    // ── 3. Grab elements ──────────────────────────────────────
    const sectionContainer = document.querySelector('.section-container');
    const header           = document.querySelector('header');
    const footer           = document.querySelector('footer');
    const scrollBtns       = document.querySelector('.scroll-buttons');
    const homeBtnDesktop   = document.getElementById('home-btn');
    const themeToggle      = document.getElementById('theme-toggle');

    if (scrollBtns)     scrollBtns.style.display    = 'none';
    if (footer)         footer.style.display         = 'none';
    if (homeBtnDesktop) homeBtnDesktop.style.display = 'none';

    const sections    = SECTION_IDS.map(id => document.getElementById(id)).filter(Boolean);
    const totalSlides = sections.length + 1; // +1 for hero

    // ── 4. Build app shell ────────────────────────────────────
    const appShell = document.createElement('div');
    appShell.id = 'app-shell';
    appShell.style.cssText = `
        position: fixed; top:0; left:0; right:0; bottom:64px;
        overflow: hidden; z-index: 100; background: #0d0d0d;
    `;

    const slidesWrapper = document.createElement('div');
    slidesWrapper.id = 'slides-wrapper';
    slidesWrapper.style.cssText = `
        display: flex;
        width: ${totalSlides * 100}%;
        height: 100%;
        transition: transform 0.38s cubic-bezier(0.4, 0, 0.2, 1);
        will-change: transform;
    `;

    const slideWidth = `${100 / totalSlides}%`;
    const slideBase  = `height:100%; overflow-y:auto; overflow-x:hidden;
        -webkit-overflow-scrolling:touch; flex-shrink:0;
        box-sizing:border-box; background:#0d0d0d;`;

    // ── Slide 0: Hero — use header directly (not a clone) ─────
    const heroSlide = document.createElement('div');
    heroSlide.className = 'app-slide app-slide-hero';
    heroSlide.style.cssText = slideBase + `width:${slideWidth}; padding:0; overflow:hidden;`;

    // Move the actual header element INTO the hero slide
    // This preserves all CSS rules including background-image
    heroSlide.appendChild(header);
    header.style.cssText = `
        height: 100%; min-height: 100%; width: 100%;
        display: flex; flex-direction: column;
        justify-content: flex-end;
        position: relative;
        background: linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)),
                    url("photos/Jayaram_Photo.png") no-repeat 20% center / cover;
        filter: brightness(1.2);
        padding: 0;
    `;

    slidesWrapper.appendChild(heroSlide);

    // ── Slides 1-6: Sections ──────────────────────────────────
    sections.forEach(section => {
        const slide = document.createElement('div');
        slide.className = 'app-slide';
        slide.style.cssText = slideBase + `width:${slideWidth}; padding:28px 18px 24px;`;
        const clone = section.cloneNode(true);
        clone.style.cssText = 'min-height:100%; margin:0; border-radius:0; box-shadow:none; padding:0; background:transparent;';
        clone.classList.remove('fade-in');
        clone.classList.add('visible');
        slide.appendChild(clone);
        slidesWrapper.appendChild(slide);
    });

    appShell.appendChild(slidesWrapper);
    document.body.appendChild(appShell);

    // Hide original section container
    if (sectionContainer) sectionContainer.style.display = 'none';

    // ── 5. Home button — next to theme toggle ─────────────────
    const homeBtn = document.createElement('button');
    homeBtn.innerHTML = '<i class="fas fa-home"></i>';
    homeBtn.style.cssText = `
        position: fixed;
        top: 14px;
        right: 60px;
        z-index: 1200;
        background: rgba(10,10,10,0.55);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255,255,255,0.15);
        color: #fff;
        width: 38px; height: 38px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.3s, background 0.2s;
        opacity: 0;
        pointer-events: none;
    `;
    homeBtn.addEventListener('click', () => goToSlide(0));
    document.body.appendChild(homeBtn);

    // Move theme toggle to make room
    if (themeToggle) {
        themeToggle.style.top   = '14px';
        themeToggle.style.right = '14px';
        themeToggle.style.zIndex = '1200';
    }

    // ── 6. Re-init animations ─────────────────────────────────
    function animateCounter(el, target) {
        let start = 0;
        const step = Math.ceil(target / 30);
        const timer = setInterval(() => {
            start = Math.min(start + step, target);
            el.textContent = start + '+';
            if (start >= target) clearInterval(timer);
        }, 30);
    }

    const allSlides = appShell.querySelectorAll('.app-slide');
    allSlides.forEach(slide => {
        slide.querySelectorAll('.skill-mini-fill').forEach(bar => { bar.style.width = '0%'; });
    });

    const animated = new Set();
    function animateSlide(index) {
        if (animated.has(index)) return;
        animated.add(index);
        const slide = allSlides[index];
        if (!slide) return;
        slide.querySelectorAll('.skill-mini-fill').forEach(bar => {
            bar.style.transition = 'width 1.2s ease';
            bar.style.width = (bar.dataset.width || 0) + '%';
        });
        slide.querySelectorAll('.counter-number').forEach(el => {
            animateCounter(el, parseInt(el.dataset.target) || 0);
        });
    }

    // Re-wire project modal clicks on clones
    appShell.querySelectorAll('.project-card-new').forEach(card => {
        const val = card.getAttribute('onclick');
        if (val) {
            card.removeAttribute('onclick');
            card.addEventListener('click', () => { try { eval(val); } catch(e){} });
        }
    });

    // ── 7. Navigate ───────────────────────────────────────────
    function goToSlide(index) {
        if (isAnimating || index < 0 || index >= totalSlides) return;
        isAnimating  = true;
        currentIndex = index;

        const pct = (index / totalSlides) * 100;
        slidesWrapper.style.transition = 'transform 0.38s cubic-bezier(0.4, 0, 0.2, 1)';
        slidesWrapper.style.transform  = `translateX(-${pct}%)`;

        const targetSlide = allSlides[index];
        if (targetSlide) targetSlide.scrollTop = 0;

        animateSlide(index);
        updateNav();

        // Show/hide home button
        homeBtn.style.opacity      = index === 0 ? '0' : '1';
        homeBtn.style.pointerEvents = index === 0 ? 'none' : 'auto';

        setTimeout(() => { isAnimating = false; }, 420);
    }

    function updateNav() {
        const sectionId = currentIndex === 0 ? null : SECTION_IDS[currentIndex - 1];
        const navTarget = sectionId === 'Certificates' ? 'certs' : sectionId;
        nav.querySelectorAll('.mobile-nav-item').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.target === navTarget);
        });
    }

    // ── 8. Nav taps ───────────────────────────────────────────
    nav.querySelectorAll('.mobile-nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = NAV_TO_INDEX[btn.dataset.target];
            if (idx !== undefined) goToSlide(idx);
        });
    });

    // ── 9. Swipe gestures ─────────────────────────────────────
    let touchStartX = 0, touchStartY = 0, touchDeltaX = 0, isSwiping = false;

    appShell.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchDeltaX = 0; isSwiping = false;
    }, { passive: true });

    appShell.addEventListener('touchmove', e => {
        const dx = e.touches[0].clientX - touchStartX;
        const dy = Math.abs(e.touches[0].clientY - touchStartY);
        touchDeltaX = dx;
        if (!isSwiping && Math.abs(dx) > dy && Math.abs(dx) > 8) isSwiping = true;
        if (isSwiping) {
            const basePct = (currentIndex / totalSlides) * 100;
            slidesWrapper.style.transition = 'none';
            slidesWrapper.style.transform  = `translateX(calc(-${basePct}% + ${dx * 0.35}px))`;
        }
    }, { passive: true });

    appShell.addEventListener('touchend', () => {
        if (isSwiping) {
            if      (touchDeltaX < -60) goToSlide(currentIndex + 1);
            else if (touchDeltaX >  60) goToSlide(currentIndex - 1);
            else {
                slidesWrapper.style.transition = 'transform 0.3s ease';
                const pct = (currentIndex / totalSlides) * 100;
                slidesWrapper.style.transform = `translateX(-${pct}%)`;
            }
        }
        touchDeltaX = 0; isSwiping = false;
    }, { passive: true });

    // ── 10. Start ─────────────────────────────────────────────
    goToSlide(0);

})();