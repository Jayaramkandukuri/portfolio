// ═══════════════════════════════════════════════════════════════
// MOBILE APP SHELL — Slide transitions between sections
// ═══════════════════════════════════════════════════════════════

(function () {
    let isSwipe = false;
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
        clone.style.cssText = 'min-height:100%; margin:0; border-radius:0; box-shadow:none; padding:0 2px;';
        clone.classList.remove('fade-in');
        clone.classList.add('visible');

        // ── Skills: fix 3-col grid overflow ──────────────────
        if (section.id === 'skills') {
            const sg = clone.querySelector('.skills-grid');
            if (sg) {
                sg.style.setProperty('display',               'grid',        'important');
                sg.style.setProperty('grid-template-columns', 'repeat(3,1fr)', 'important');
                sg.style.setProperty('gap',                   '12px',        'important');
                sg.style.setProperty('width',                 '100%',        'important');
                sg.style.setProperty('box-sizing',            'border-box',  'important');
                sg.style.setProperty('overflow',              'hidden',      'important');
            }
            const pg = clone.querySelector('.platforms-grid');
            if (pg) {
                pg.style.setProperty('display',               'grid',        'important');
                pg.style.setProperty('grid-template-columns', 'repeat(3,1fr)', 'important');
                pg.style.setProperty('gap',                   '12px',        'important');
                pg.style.setProperty('width',                 '100%',        'important');
                pg.style.setProperty('box-sizing',            'border-box',  'important');
                pg.style.setProperty('overflow',              'hidden',      'important');
            }
            clone.querySelectorAll('.skill-box, .platform-box').forEach(b => {
                b.style.setProperty('width',      '100%',       'important');
                b.style.setProperty('min-width',  '0',          'important');
                b.style.setProperty('box-sizing', 'border-box', 'important');
            });
        }

        // ── Education: fix timeline card spacing ──────────────
        if (section.id === 'education') {
            const timeline = clone.querySelector('.timeline');
            if (timeline) {
                timeline.style.setProperty('width',      '100%',       'important');
                timeline.style.setProperty('box-sizing', 'border-box', 'important');
                timeline.style.setProperty('overflow',   'hidden',     'important');
            }
            clone.querySelectorAll('.timeline-item').forEach(item => {
                item.style.setProperty('padding-bottom', '16px',       'important');
                item.style.setProperty('box-sizing',     'border-box', 'important');
                item.style.setProperty('width',          '100%',       'important');
                item.style.setProperty('overflow',       'hidden',     'important');
            });
            clone.querySelectorAll('.timeline-content').forEach(card => {
                card.style.setProperty('margin-bottom', '0',          'important');
                card.style.setProperty('border-radius', '12px',       'important');
                card.style.setProperty('width',         '100%',       'important');
                card.style.setProperty('box-sizing',    'border-box', 'important');
                card.style.setProperty('overflow',      'hidden',     'important');
            });
        }

        // ── Certificates: fix cert card spacing ───────────────
        if (section.id === 'Certificates') {
            const grid = clone.querySelector('.cert-grid');
            if (grid) {
                grid.style.setProperty('gap',     '14px',       'important');
                grid.style.setProperty('padding', '2px 4px',    'important');
                grid.style.setProperty('width',   '100%',       'important');
                grid.style.setProperty('box-sizing', 'border-box', 'important');
            }
            clone.querySelectorAll('.cert-card').forEach(card => {
                card.style.setProperty('margin',        '0',          'important');
                card.style.setProperty('border-radius', '12px',       'important');
                card.style.setProperty('box-sizing',    'border-box', 'important');
                card.style.setProperty('width',         '100%',       'important');
            });
        }

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
        themeToggle.style.top    = '14px';
        themeToggle.style.right  = '14px';
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
        const swipeMode = isSwipe;   
        isSwipe = false;            

        isAnimating  = true;
        currentIndex = index;

        const pct = (index / totalSlides) * 100;
        if (swipeMode) {
        // slidesWrapper.style.transition = 'transform 0.38s cubic-bezier(0.4, 0, 0.2, 1)';
        slidesWrapper.style.transition = 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)';
        slidesWrapper.style.transform  = `translateX(-${pct}%)`;
        } else {
            // 👉 Fade OUT
            slidesWrapper.style.transition = 'opacity 0.3s ease';
            slidesWrapper.style.opacity = '0';

            setTimeout(() => {
                // 👉 Move instantly (no slide)
                slidesWrapper.style.transition = 'none';
                slidesWrapper.style.transform = `translateX(-${pct}%)`;

                // 👉 Fade IN
                slidesWrapper.style.transition = 'opacity 0.3s ease';
                slidesWrapper.style.opacity = '1';
            }, 300);
        }

        const targetSlide = allSlides[index];
        if (targetSlide) targetSlide.scrollTop = 0;

        animateSlide(index);
        updateNav();

        // Show/hide home button
        homeBtn.style.opacity       = index === 0 ? '0' : '1';
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
            isSwipe = false; 
            const idx = NAV_TO_INDEX[btn.dataset.target];
            if (idx !== undefined) goToSlide(idx);
        });
    });

    // ── 9. Swipe gestures ─────────────────────────────────────
    let touchStartX = 0, touchStartY = 0, touchDeltaX = 0, isSwiping = false;
    let touchStartTarget = null, isHorizontalLocked = false, isVerticalLocked = false;

    appShell.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchDeltaX = 0;
        isSwiping = false;
        isHorizontalLocked = false;
        isVerticalLocked = false;
        touchStartTarget = e.target;
    }, { passive: true });

    appShell.addEventListener('touchmove', e => {
        // ── Ignore if inside horizontal scroll container ──
        if (touchStartTarget && touchStartTarget.closest('.project-cards-grid')) return;

        const dx = e.touches[0].clientX - touchStartX;
        const dy = Math.abs(e.touches[0].clientY - touchStartY);
        const adx = Math.abs(dx);

        // ── Lock direction after 10px movement ──
        if (!isHorizontalLocked && !isVerticalLocked) {
            if (adx > dy && adx > 10) {
                isHorizontalLocked = true;
                isSwipe = true; // ✅ ONLY when confirmed horizontal swipe
            }
            else if (dy > adx && dy > 10) {
                isVerticalLocked = true;
            }
        }

        // ── Only handle horizontal swipes ──
        if (!isHorizontalLocked) return;

        touchDeltaX = dx;
        isSwiping = true;

        // ── Rubber band at edges ──
        let resistance = 1;
        if ((currentIndex === 0 && dx > 0) || (currentIndex === totalSlides - 1 && dx < 0)) {
            resistance = 0.2;
        }

        const basePct = (currentIndex / totalSlides) * 100;
        slidesWrapper.style.transition = 'none';
        slidesWrapper.style.transform  = `translateX(calc(-${basePct}% + ${dx * resistance * 0.4}px))`;
    }, { passive: true });

    appShell.addEventListener('touchend', () => {
        // ── Ignore if inside project cards ──
        if (touchStartTarget && touchStartTarget.closest('.project-cards-grid')) {
            touchDeltaX = 0; isSwiping = false; touchStartTarget = null;
            isHorizontalLocked = false; isVerticalLocked = false;
            return;
        }
        if (isSwiping && isHorizontalLocked) {
            if      (touchDeltaX < -80) goToSlide(currentIndex + 1);
            else if (touchDeltaX >  80) goToSlide(currentIndex - 1);
            else {
                // ── Snap back smoothly ──
                slidesWrapper.style.transition = 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)';
                const pct = (currentIndex / totalSlides) * 100;
                slidesWrapper.style.transform = `translateX(-${pct}%)`;
            }
        }
        touchDeltaX = 0; isSwiping = false; touchStartTarget = null;
        isHorizontalLocked = false; isVerticalLocked = false;
        setTimeout(() => {
            isSwipe = false;
        }, 50);
    }, { passive: true });

    // ── 10. Start ─────────────────────────────────────────────
    goToSlide(0);

})();