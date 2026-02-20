/* =============================================================
   PORTFOLIO ISAAC JUNIOR — main.js
   ============================================================= */
(function () {
  'use strict';

  const html = document.documentElement;

  /* ── CUSTOM CURSOR (desktop only) ─────────────────────────── */
  if (window.matchMedia('(pointer:fine)').matches) {
    const dot  = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    let mx = 0, my = 0, rx = 0, ry = 0;

    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    // dot follows instantly
    window.addEventListener('mousemove', e => {
      dot.style.transform  = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
    });

    // ring lerps
    (function lerp() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(lerp);
    })();

    // hover effect on interactive elements
    document.querySelectorAll('a, button, .proj-item, .cert-item').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
  }

  /* ── LANGUAGE TOGGLE ─────────────────────────────────────── */
  const langBtn = document.getElementById('langBtn');
  langBtn.addEventListener('click', () => {
    const next = html.getAttribute('data-lang') === 'fr' ? 'en' : 'fr';
    html.setAttribute('data-lang', next);
    langBtn.textContent = next === 'fr' ? 'EN' : 'FR';

    // Update the CV download link based on language
    updateCvLink(next);
  });

  function updateCvLink(lang) {
    const cvLink = document.getElementById('cv-download');
    if (!cvLink) return;
    if (lang === 'en') {
      cvLink.href     = 'cv/CAMUS-Letranger.pdf';
      cvLink.setAttribute('download', 'CAMUS-Letranger.pdf');
    } else {
      cvLink.href     = 'cv/HOUNBO K.I.Junior CV_UPDATE.pdf';
      cvLink.setAttribute('download', 'HOUNBO_Isaac_Junior_CV.pdf');
    }
  }

  /* ── MOBILE MENU ─────────────────────────────────────────── */
  const overlay  = document.getElementById('mobOverlay');
  const burger   = document.getElementById('burger');
  const closeBtn = document.getElementById('mobClose');

  burger.addEventListener('click',  () => overlay.classList.add('open'));
  closeBtn.addEventListener('click',() => overlay.classList.remove('open'));
  overlay.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => overlay.classList.remove('open'));
  });

  /* ── ACTIVE SIDENAV ──────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const snItems  = document.querySelectorAll('.sn-item');

  const navObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        snItems.forEach(sn =>
          sn.classList.toggle('active', sn.dataset.s === e.target.id)
        );
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => navObs.observe(s));

  /* ── SCROLL REVEAL ───────────────────────────────────────── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('on');
      // animate skill bars contained within
      e.target.querySelectorAll('.sk-bar').forEach(b => {
        b.style.width = b.dataset.w + '%';
      });
      revealObs.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.rv').forEach(el => revealObs.observe(el));

  /* ── CONTACT FORM ────────────────────────────────────────── */
  const form   = document.getElementById('contactForm');
  const status = document.getElementById('cfStatus');

  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn  = form.querySelector('button[type=submit]');
      const lang = html.getAttribute('data-lang');
      btn.disabled = true;
      status.textContent = lang === 'fr' ? 'Envoi en cours…' : 'Sending…';

      try {
        const res  = await fetch(form.action, { method: 'POST', body: new FormData(form) });
        const data = await res.json();
        if (data.success) {
          status.textContent = lang === 'fr'
            ? '✓ Message envoyé ! Je vous répondrai sous peu.'
            : '✓ Message sent! I\'ll get back to you shortly.';
          form.reset();
        } else throw new Error();
      } catch {
        status.textContent = lang === 'fr'
          ? '✗ Erreur. Veuillez réessayer.'
          : '✗ Error. Please try again.';
      } finally {
        btn.disabled = false;
      }
    });
  }

})();
