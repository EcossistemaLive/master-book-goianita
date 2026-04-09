document.addEventListener('DOMContentLoaded', () => {

    // ── Tab switching ──────────────────────────────────────────────
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const navMasterbook = document.getElementById('nav-masterbook');
    const navCampanhas = document.getElementById('nav-campanhas');

    function switchTab(tabName) {
        tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        tabContents.forEach(el => {
            const isTarget = el.id === `tab-${tabName}`;
            el.classList.toggle('hidden', !isTarget);
        });

        if (tabName === 'masterbook') {
            navMasterbook.classList.remove('hidden');
            navCampanhas.classList.add('hidden');
        } else {
            navMasterbook.classList.add('hidden');
            navCampanhas.classList.remove('hidden');
        }

        // Scroll to top
        document.querySelector('.content').scrollTo({ top: 0, behavior: 'smooth' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Expose for inline use
    window.switchTab = switchTab;

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // ── Smooth scroll for nav links ────────────────────────────────
    function attachSmoothScroll(navEl) {
        navEl.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    attachSmoothScroll(navMasterbook);
    attachSmoothScroll(navCampanhas);

    // ── ScrollSpy (runs on whichever tab is active) ─────────────────
    function setupScrollSpy() {
        const activeNav = navMasterbook.classList.contains('hidden') ? navCampanhas : navMasterbook;
        const navLinks = activeNav.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.tab-content:not(.hidden) .doc-section');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${entry.target.id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { rootMargin: '0px', threshold: 0.3 });

        sections.forEach(section => observer.observe(section));
        return observer;
    }

    let scrollSpyObserver = setupScrollSpy();

    // Re-init scroll spy when tab changes
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (scrollSpyObserver) scrollSpyObserver.disconnect();
            setTimeout(() => { scrollSpyObserver = setupScrollSpy(); }, 50);
        });
    });

    // ── Entry animations ───────────────────────────────────────────
    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.08 });

    const animatedEls = document.querySelectorAll(
        '.card, .commission-card, .process-step, .sugestao-item, .premio-destaque'
    );

    animatedEls.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1), transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
        animObserver.observe(el);
    });
});
