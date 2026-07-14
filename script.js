const projects = [
  {
    id: "project-01",
    number: "01",
    title: "京东秒送真榜单菜品故事",
    meta: "创新项目 · AIGC 内容体系设计",
    note: "基于本地特色菜品故事的视觉资产生产与榜单转化优化",
    pages: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
  },
  {
    id: "project-02",
    number: "02",
    title: "京东秒送品牌会员店",
    meta: "UX / UI · 会员增长",
    note: "从曝光到入会，围绕品牌店的会员引导体验设计",
    pages: [17, 18, 19, 20, 21],
  },
  {
    id: "project-03",
    number: "03",
    title: "新人三单礼新人活动",
    meta: "拉新项目 · 活动设计",
    note: "面向新用户的活动升级、路径梳理与转化表达",
    pages: [22, 23, 24, 25, 26],
  },
  {
    id: "project-04",
    number: "04",
    title: "腾讯体育 APP 改版设计",
    meta: "APP DESIGN · 体验重构",
    note: "从设计规范、交互原型到核心页面的完整产品体验升级",
    pages: [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
  },
  {
    id: "project-05",
    number: "05",
    title: "其他项目",
    meta: "游戏化运营 · B 端设计",
    note: "游戏化活动视觉与后台管理工具的补充项目展示",
    pages: [40, 41],
  },
];

const sectionsRoot = document.querySelector("#project-sections");

projects.forEach((project) => {
  const section = document.createElement("section");
  section.className = "project-section";
  section.id = project.id;
  section.innerHTML = `
    <div class="section-shell">
      <header class="project-head">
        <div class="project-number">${project.number}</div>
        <div class="project-title">
          <h2>${project.title}</h2>
          <p>${project.meta}</p>
        </div>
        <p class="project-note"><span>PROJECT BRIEF</span>${project.note}</p>
      </header>
      <div class="project-gallery">
        ${project.pages
          .map(
            (page, index) => `
            <figure class="work-page image-button" data-image="Frame ${page}.png" data-caption="${project.title} · 第 ${String(index + 1).padStart(2, "0")} 页">
              <img src="Frame ${page}.png" alt="${project.title}项目页面 ${index + 1}" loading="lazy" decoding="async" />
              <figcaption><span>${project.number} / ${String(index + 1).padStart(2, "0")}</span><b>查看大图 ↗</b></figcaption>
            </figure>`
          )
          .join("")}
      </div>
    </div>`;
  sectionsRoot.append(section);
});

const body = document.body;
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = [...document.querySelectorAll(".nav-link")];
const progress = document.querySelector(".scroll-progress span");
const backToTop = document.querySelector(".back-to-top");

navToggle.addEventListener("click", () => {
  const open = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!open));
  body.classList.toggle("nav-open", !open);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navToggle.setAttribute("aria-expanded", "false");
    body.classList.remove("nav-open");
  });
});

const updateScrollUI = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  backToTop.classList.toggle("is-visible", window.scrollY > 700);
  header.classList.toggle("is-scrolled", window.scrollY > 30);
};

window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();

backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const target = visible.target.id;
    const key = target === "home" ? "home" : target === "about" ? "about" : target === "contact" ? "contact" : "projects";
    navLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${key}`));
  },
  { rootMargin: "-25% 0px -58%", threshold: [0, 0.15, 0.5] }
);

[...document.querySelectorAll("main > section, .project-section")].forEach((section) => observer.observe(section));

const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector(".lightbox-canvas img");
const lightboxCaption = lightbox.querySelector(".lightbox-caption");
const lightboxIndex = lightbox.querySelector(".lightbox-index");
const imageItems = [...document.querySelectorAll(".image-button")];
let activeImage = 0;

const showImage = (index) => {
  activeImage = (index + imageItems.length) % imageItems.length;
  const item = imageItems[activeImage];
  const source = item.dataset.image || item.querySelector("img").getAttribute("src");
  const caption = item.dataset.caption || item.querySelector("img").alt;
  lightboxImage.src = source;
  lightboxImage.alt = caption;
  lightboxCaption.textContent = caption;
  lightboxIndex.textContent = `${String(activeImage + 1).padStart(2, "0")} / ${String(imageItems.length).padStart(2, "0")}`;
  lightbox.querySelector(".lightbox-canvas").scrollTo(0, 0);
};

imageItems.forEach((item, index) => {
  item.setAttribute("role", "button");
  item.setAttribute("tabindex", "0");
  item.addEventListener("click", () => {
    showImage(index);
    lightbox.showModal();
    body.classList.add("lightbox-open");
  });
  item.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      item.click();
    }
  });
});

const closeLightbox = () => {
  lightbox.close();
  body.classList.remove("lightbox-open");
};

lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
lightbox.querySelector(".lightbox-prev").addEventListener("click", () => showImage(activeImage - 1));
lightbox.querySelector(".lightbox-next").addEventListener("click", () => showImage(activeImage + 1));
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
lightbox.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") showImage(activeImage - 1);
  if (event.key === "ArrowRight") showImage(activeImage + 1);
});
lightbox.addEventListener("close", () => body.classList.remove("lightbox-open"));

// Progressive motion enhancements. Touch devices and reduced-motion users keep
// the same experience without pointer-heavy effects.
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

const setupRevealMotion = () => {
  if (prefersReducedMotion.matches) return;

  const revealSelectors = [
    ".hero-copy > *",
    ".hero-meta",
    ".hero-visual",
    ".hero-stats > *",
    ".section-kicker",
    ".about-heading > *",
    ".about-card",
    ".projects-heading > *",
    ".catalog-image",
    ".project-jump > a",
    ".project-head > *",
    ".work-page",
    ".ending > *",
    ".site-footer > *",
  ];

  const revealItems = [...document.querySelectorAll(revealSelectors.join(","))];
  revealItems.forEach((item) => {
    item.classList.add("reveal");
    if (item.matches(".work-page, .about-card, .project-jump > a")) item.classList.add("reveal-soft");
    const siblingIndex = [...item.parentElement.children].indexOf(item);
    item.style.setProperty("--reveal-delay", `${Math.min(siblingIndex, 5) * 75}ms`);
  });

  body.classList.add("motion-ready");
  const revealObserver = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observerInstance.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -7%", threshold: 0.08 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
};

const setupPointerMotion = () => {
  if (!hasFinePointer.matches || prefersReducedMotion.matches) return;

  body.classList.add("has-fine-pointer");
  const glow = document.createElement("div");
  glow.className = "mouse-glow";
  glow.setAttribute("aria-hidden", "true");
  body.prepend(glow);

  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let glowX = pointerX;
  let glowY = pointerY;
  let glowFrame;

  const renderGlow = () => {
    glowX += (pointerX - glowX) * 0.14;
    glowY += (pointerY - glowY) * 0.14;
    glow.style.transform = `translate3d(${glowX - 230}px, ${glowY - 230}px, 0)`;
    if (Math.abs(pointerX - glowX) > 0.2 || Math.abs(pointerY - glowY) > 0.2) {
      glowFrame = requestAnimationFrame(renderGlow);
    } else {
      glowFrame = null;
    }
  };

  window.addEventListener(
    "pointermove",
    (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      glow.classList.add("is-active");
      if (!glowFrame) glowFrame = requestAnimationFrame(renderGlow);
    },
    { passive: true }
  );
  document.documentElement.addEventListener("mouseleave", () => glow.classList.remove("is-active"));
  document.documentElement.addEventListener("mouseenter", () => glow.classList.add("is-active"));

  document.querySelectorAll(".project-section").forEach((section) => {
    section.addEventListener("pointerenter", () => {
      const accent = getComputedStyle(section).getPropertyValue("--accent").trim();
      if (accent) glow.style.setProperty("--glow-color", accent);
    });
    section.addEventListener("pointerleave", () => glow.style.setProperty("--glow-color", "var(--lime)"));
  });

  const spotlightCards = [...document.querySelectorAll(".project-jump a, .work-page")];
  spotlightCards.forEach((card) => {
    card.classList.add("spotlight-card");
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      card.style.setProperty("--spot-x", `${x * 100}%`);
      card.style.setProperty("--spot-y", `${y * 100}%`);

      if (card.matches(".project-jump a")) {
        const rotateX = (0.5 - y) * 4;
        const rotateY = (x - 0.5) * 5;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
      }
    });
    card.addEventListener("pointerleave", () => {
      if (card.matches(".project-jump a")) card.style.transform = "";
    });
  });

  const heroVisual = document.querySelector(".hero-visual");
  const heroImage = heroVisual.querySelector("img");
  heroVisual.addEventListener("pointermove", (event) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    heroImage.style.transform = `scale(1.025) translate3d(${x * -9}px, ${y * -9}px, 0)`;
  });
  heroVisual.addEventListener("pointerleave", () => {
    heroImage.style.transform = "";
  });
};

setupRevealMotion();
setupPointerMotion();
