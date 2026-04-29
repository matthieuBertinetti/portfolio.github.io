/* ============================================================
   PORTFOLIO — script.js
   ============================================================ */

// ── Loader ───────────────────────────────────────────────────
const loader = document.getElementById('loader');
if (loader) {
    if (sessionStorage.getItem('loaderShown')) {
        loader.remove();
    } else {
        sessionStorage.setItem('loaderShown', '1');
        const minDisplay = 1500;
        const startTime  = Date.now();

        window.addEventListener('load', () => {
            const elapsed   = Date.now() - startTime;
            const remaining = Math.max(0, minDisplay - elapsed);

            setTimeout(() => {
                loader.classList.add('loader--hidden');
                loader.addEventListener('transitionend', () => loader.remove(), { once: true });
            }, remaining);
        });
    }
}


// ── Sticky header ────────────────────────────────────────────
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Mobile menu ──────────────────────────────────────────────
const burger     = document.querySelector('.nav__burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen);

    const [s1, s2, s3] = burger.querySelectorAll('span');
    if (isOpen) {
        s1.style.transform = 'translateY(7px) rotate(45deg)';
        s2.style.opacity   = '0';
        s3.style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
        s1.style.transform = '';
        s2.style.opacity   = '';
        s3.style.transform = '';
    }
});

mobileMenu.querySelectorAll('.nav__mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        burger.setAttribute('aria-expanded', false);
        burger.querySelectorAll('span').forEach(s => {
            s.style.transform = '';
            s.style.opacity   = '';
        });
    });
});

// ── Scroll fade-in animations ─────────────────────────────────
const fadeSelectors = [
    '.section-title',
    '.objectif__body',
    '.about__text',
    '.stat',
    '.project-card',
    '.cv-section__image-wrap',
    '.localisation__text',
    '.localisation__map',
    '.footer__social',
];

document.querySelectorAll(fadeSelectors.join(',')).forEach((el, i) => {
    el.classList.add('fade-up');
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
});

const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

// ── Stats counter animation ───────────────────────────────────
function animateCounter(el) {
    const target  = parseInt(el.dataset.target, 10);
    const format  = el.dataset.format;
    const duration = 1600;
    const startTime = performance.now();

    function formatValue(val) {
        if (format === 'padded') return val < 10 ? '0' + val : String(val);
        return '+ ' + val;
    }

    function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = formatValue(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.6 });

document.querySelectorAll('.stat__number[data-target]').forEach(el => {
    counterObserver.observe(el);
});

// ── Interactive logo grid ─────────────────────────────────────
function initLogoGrid() {
    const grid = document.getElementById('logoGrid');
    if (!grid) return;

    const section = grid.parentElement;
    const cellSize = 60;
    const cols = Math.ceil(section.offsetWidth  / cellSize);
    const rows = Math.ceil(section.offsetHeight / cellSize);

    grid.style.setProperty('--grid-cols', cols);
    grid.innerHTML = '';

    const total = cols * rows;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < total; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.addEventListener('mouseenter', () => cell.classList.add('active'));
        cell.addEventListener('mouseleave', () => cell.classList.remove('active'));
        fragment.appendChild(cell);
    }

    grid.appendChild(fragment);
}

initLogoGrid();

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initLogoGrid, 150);
}, { passive: true });

// ── Methodology interactive tabs ─────────────────────────────
const methSteps = document.querySelectorAll('.method-step[data-step]');
if (methSteps.length) {
    const methContents = document.querySelectorAll('.method-content[data-content]');
    methSteps.forEach(step => {
        step.addEventListener('click', () => {
            const target = step.dataset.step;
            methSteps.forEach(s => s.classList.remove('method-step--active'));
            step.classList.add('method-step--active');
            methContents.forEach(c => c.classList.remove('method-content--active'));
            document.querySelector(`.method-content[data-content="${target}"]`).classList.add('method-content--active');
        });
    });
}

// ── Smooth scroll for in-page anchors ────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = header.offsetHeight + 16;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
});
