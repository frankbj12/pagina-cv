document.addEventListener("DOMContentLoaded", () => {
  // Lucide reemplaza automáticamente los <i data-lucide="..."> por SVG.
  if (window.lucide) window.lucide.createIcons();

  const header = document.getElementById("site-header");
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("main-nav");

  // Menú móvil
  menuToggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    menuToggle.innerHTML = open
      ? '<i data-lucide="x"></i>'
      : '<i data-lucide="menu"></i>';
    if (window.lucide) window.lucide.createIcons();
  });

  // Cerrar menú al navegar
  nav?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
      menuToggle?.setAttribute("aria-label", "Abrir menú");
      if (menuToggle) {
        menuToggle.innerHTML = '<i data-lucide="menu"></i>';
        if (window.lucide) window.lucide.createIcons();
      }
    });
  });

  // Sombra sutil del header al hacer scroll
  const updateHeader = () => {
    header?.classList.toggle("shadow-2xl", window.scrollY > 20);
  };
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  // Scroll reveal con IntersectionObserver: evita cálculos constantes en cada scroll.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  // Carrusel de proyectos
  const track = document.getElementById("project-track");
  const prev = document.getElementById("project-prev");
  const next = document.getElementById("project-next");
  const dots = document.getElementById("project-dots");
  const cards = track ? [...track.children] : [];
  let current = 0;

  const getVisibleCards = () => window.innerWidth >= 768 ? 2 : 1;
  const getMaxIndex = () => Math.max(0, cards.length - getVisibleCards());

  const renderDots = () => {
    if (!dots) return;
    const positions = getMaxIndex() + 1;
    dots.innerHTML = Array.from({ length: positions }, (_, index) =>
      `<button class="dot ${index === current ? "active" : ""}" aria-label="Ir a la posición ${index + 1} de proyectos" aria-current="${index === current}" data-index="${index}"></button>`
    ).join("");

    dots.querySelectorAll(".dot").forEach(dot => {
      dot.addEventListener("click", () => {
        current = Number(dot.dataset.index);
        renderProject();
      });
    });
  };

  const renderProject = () => {
    if (!track || !cards.length) return;
    const gap = 16;
    const maxIndex = getMaxIndex();
    current = Math.min(current, maxIndex);

    const cardWidth = cards[0].getBoundingClientRect().width + gap;
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    renderDots();
    if (prev) prev.disabled = current === 0;
    if (next) next.disabled = current === maxIndex;
  };

  prev?.addEventListener("click", () => {
    current = Math.max(0, current - 1);
    renderProject();
  });

  next?.addEventListener("click", () => {
    current = Math.min(getMaxIndex(), current + 1);
    renderProject();
  });

  window.addEventListener("resize", renderProject);
  renderDots();
  renderProject();

  // Carrusel de certificaciones: controles, indicadores, teclado y arrastre.
  const certSlider = document.getElementById("cert-slider");
  const certTrack = document.getElementById("cert-track");
  const certPrev = document.getElementById("cert-prev");
  const certNext = document.getElementById("cert-next");
  const certDots = document.getElementById("cert-dots");
  const certCount = document.getElementById("cert-count");
  const certCards = certTrack ? [...certTrack.children] : [];
  let certCurrent = 0;
  let dragStartX = null;

  const getVisibleCerts = () => window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
  const getLastCertIndex = () => Math.max(0, certCards.length - getVisibleCerts());

  const renderCertCarousel = () => {
    if (!certTrack || !certCards.length) return;

    const visible = getVisibleCerts();
    const lastIndex = getLastCertIndex();
    certCurrent = Math.min(certCurrent, lastIndex);
    const gap = Number.parseFloat(getComputedStyle(certTrack).gap) || 0;
    const cardWidth = certCards[0].getBoundingClientRect().width;
    certTrack.style.transform = `translateX(-${certCurrent * (cardWidth + gap)}px)`;

    certCards.forEach((card, index) => {
      card.setAttribute("aria-roledescription", "diapositiva");
      card.setAttribute("aria-label", `${index + 1} de ${certCards.length}`);
      card.setAttribute("aria-hidden", String(index < certCurrent || index >= certCurrent + visible));
    });

    if (certDots) {
      certDots.innerHTML = Array.from({ length: lastIndex + 1 }, (_, index) =>
        `<button class="dot ${index === certCurrent ? "active" : ""}" type="button" aria-label="Mostrar certificados desde el ${index + 1}" aria-current="${index === certCurrent}" data-index="${index}"></button>`
      ).join("");

      certDots.querySelectorAll(".dot").forEach(dot => {
        dot.addEventListener("click", () => {
          certCurrent = Number(dot.dataset.index);
          renderCertCarousel();
        });
      });
    }

    if (certCount) {
      certCount.textContent = `${certCurrent + 1}–${Math.min(certCurrent + visible, certCards.length)} de ${certCards.length}`;
    }
    if (certPrev) certPrev.disabled = certCurrent === 0;
    if (certNext) certNext.disabled = certCurrent === lastIndex;
  };

  certPrev?.addEventListener("click", () => {
    certCurrent = Math.max(0, certCurrent - 1);
    renderCertCarousel();
  });

  certNext?.addEventListener("click", () => {
    certCurrent = Math.min(getLastCertIndex(), certCurrent + 1);
    renderCertCarousel();
  });

  certSlider?.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") {
      certCurrent = Math.max(0, certCurrent - 1);
      renderCertCarousel();
    } else if (event.key === "ArrowRight") {
      certCurrent = Math.min(getLastCertIndex(), certCurrent + 1);
      renderCertCarousel();
    } else if (event.key === "Home") {
      certCurrent = 0;
      renderCertCarousel();
    } else if (event.key === "End") {
      certCurrent = getLastCertIndex();
      renderCertCarousel();
    } else {
      return;
    }
    event.preventDefault();
  });

  certSlider?.addEventListener("pointerdown", event => {
    if (event.target.closest("button") || event.button !== 0) return;
    dragStartX = event.clientX;
    certTrack?.classList.add("is-dragging");
    certSlider.setPointerCapture(event.pointerId);
  });

  certSlider?.addEventListener("pointerup", event => {
    if (dragStartX === null) return;
    const distance = event.clientX - dragStartX;
    dragStartX = null;
    certTrack?.classList.remove("is-dragging");

    if (Math.abs(distance) >= 45) {
      certCurrent = Math.max(0, Math.min(getLastCertIndex(), certCurrent + (distance < 0 ? 1 : -1)));
      renderCertCarousel();
    }
  });

  certSlider?.addEventListener("pointercancel", () => {
    dragStartX = null;
    certTrack?.classList.remove("is-dragging");
  });

  window.addEventListener("resize", renderCertCarousel);
  renderCertCarousel();

  // Formulario sin backend: abre el cliente de correo del usuario con los datos cargados.
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  form?.addEventListener("submit", event => {
    event.preventDefault();

    const data = new FormData(form);
    const nombre = data.get("nombre");
    const email = data.get("email");
    const asunto = data.get("asunto");
    const mensaje = data.get("mensaje");

    const body = [
      `Nombre: ${nombre}`,
      `Email: ${email}`,
      "",
      mensaje
    ].join("\n");

    const mailto = `mailto:devfrank007@gmail.com?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;

    if (status) {
      status.textContent = "Se abrió tu cliente de correo para completar el envío.";
      status.classList.remove("hidden");
    }
  });

  document.getElementById("year").textContent = new Date().getFullYear();
});
