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

  const renderDots = () => {
    if (!dots) return;
    dots.innerHTML = cards.map((_, index) =>
      `<button class="dot ${index === current ? "active" : ""}" aria-label="Ir al proyecto ${index + 1}" data-index="${index}"></button>`
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
    const visible = window.innerWidth >= 768 ? 2 : 1;
    const maxIndex = Math.max(0, cards.length - visible);
    current = Math.min(current, maxIndex);

    const cardWidth = cards[0].getBoundingClientRect().width + gap;
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    renderDots();
  };

  prev?.addEventListener("click", () => {
    current = Math.max(0, current - 1);
    renderProject();
  });

  next?.addEventListener("click", () => {
    current += 1;
    renderProject();
  });

  window.addEventListener("resize", renderProject);
  renderDots();
  renderProject();

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

    const mailto = `mailto:francocacu58@gmail.com?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;

    if (status) {
      status.textContent = "Se abrió tu cliente de correo para completar el envío.";
      status.classList.remove("hidden");
    }
  });

  document.getElementById("year").textContent = new Date().getFullYear();
});
