"use strict";
//////////////////////////////////////////////////
//// SELECTOR /////

///none interactive
const contentSection = document.getElementById("contentSection");
const foodSection = document.getElementById("foodSection");
const table = document.getElementById("table");
const body = document.querySelector("body");
const overlay = document.getElementById("overlay");
//text
const about = document.getElementById("about");
const intro = document.getElementById("intro");

///shapes
const shapes = document.getElementsByClassName("shape");

///tooltip
const tooltip = document.getElementById("tooltip");

///button
const reloadBtn = document.getElementById("reloadBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const chefBtn = document.getElementById("chefBtn");

let projects = [];
let shapeInstances = [];
let selectedCategories = new Set();
let contentExpanded = false;
let categoryBtns;

const ALL_CATEGORIES = [
  "Brand",
  "Print",
  "XR",
  "UX",
  "Spatial",
  "Experimental",
];

const shapeConfig = [
  { id: "parallelogram", hue: 236 },
  { id: "circle", hue: 0 },
  { id: "flower", hue: 58 },
  { id: "hex", hue: 149 },
  { id: "star", hue: 279 },
  { id: "scallop", hue: 236 },
  { id: "circle2", hue: 236 },
];

const shift = 105;

//////////////////////////////////////////////////
////  CONSTRUCTOR /////

class Shape {
  constructor(id, hueChoose) {
    this.shapeSelect = document.getElementById(id);
    this.shapeName = id;
    this.beenViewed = false;
    this.hueChooseOrig = hueChoose;
    this.hueChoose = getRandomNumber(hueChoose - shift, hueChoose + shift);
    this.hover = 3;
    this._rafPending = false;

    this.randomScale();
    this.randomPosition();
    this.randomColor();
    this.attachEventHandlers();
  }

  attachEventHandlers() {
    this.shapeSelect.addEventListener("click", this.handleClick.bind(this));
    this.shapeSelect.addEventListener(
      "mouseenter",
      this.handleEnter.bind(this),
    );
    this.shapeSelect.addEventListener(
      "mouseleave",
      this.handleLeave.bind(this),
    );
    this.shapeSelect.addEventListener("mousemove", this.handleMove.bind(this));
  }

  handleEnter() {
    this.shapeSelect.style.backgroundColor = `hsl(${this.hueChoose}, ${
      this.saturation + this.hover
    }%, ${this.light + this.hover}%)`;

    const project = projects.find((p) => p.shape === this.shapeName);
    if (project) {
      tooltip.textContent = project.title;
      tooltip.style.opacity = "1";
    }
  }

  handleLeave() {
    this.shapeSelect.style.backgroundColor = `hsl(${this.hueChoose}, ${
      this.saturation - this.hover
    }%, ${this.light - this.hover}%)`;

    tooltip.style.opacity = "0";
  }

  handleMove({ clientX, clientY }) {
    if (this._rafPending) return;
    this._rafPending = true;
    const x = clientX;
    const y = clientY;
    requestAnimationFrame(() => {
      tooltip.style.left = `${x + 16}px`;
      tooltip.style.top = `${y + 16}px`;
      this._rafPending = false;
    });
  }

  handleClick(event) {
    if (!contentExpanded) {
      contentExpanded = true;
      table.classList.add("content-expanded");
    }
    this.beenViewed = true;
    this.matchColor();
    this.loadContent();
    this.removeShape();
    intro.classList.add("hidden");
    about.classList.add("hidden");
    this.checkEnd();

    const project = projects.find((p) => p.shape === this.shapeName);
    if (project && project.slug) {
      const newPath = "/" + project.slug;
      if (window.location.pathname !== newPath) {
        history.pushState({ slug: project.slug }, "", newPath);
      }
    }
  }

  checkEnd() {
    const visibleShapes = shapeInstances.filter((s) =>
      projects.find((p) => p.shape === s.shapeName),
    );
    const numberViewed = visibleShapes.filter((s) => s.beenViewed).length;
    if (numberViewed === visibleShapes.length) {
      shuffleBtn.classList.add("hidden");
      reloadBtn.classList.remove("hidden");
      reloadBtn.classList.add("highlight");
    }
  }

  randomScale() {
    const scale = `${getRandomNumber(70, 100)}%`;
    this.shapeSelect.style.scale = scale;
  }

  randomPosition() {
    const position = [
      `${getRandomNumber(0, 100)}px`,
      `${getRandomNumber(0, 200)}px`,
    ];
    this.shapeSelect.style.left = position[0];
    this.shapeSelect.style.top = position[1];
  }

  randomColor() {
    let lightness = getRandomNumber(38, 90);
    let saturation = 80;
    if (lightness > 85) {
      saturation = getRandomNumber(80, 100);
    } else if (lightness > 65) {
      saturation = getRandomNumber(40, 60);
    } else {
      saturation = getRandomNumber(28, 50);
    }
    const project = projects.find((p) => p.shape === this.shapeName);
    if (project) {
      this.shapeSelect.style.backgroundColor = `hsl(${this.hueChoose}, ${saturation}%, ${lightness}%)`;
      this.saturation = saturation;
      this.light = lightness;
    }
  }

  matchColor() {
    const project = projects.find((p) => p.shape === this.shapeName);
    if (project && project.backgroundColor) {
      body.style.backgroundColor = project.backgroundColor;
      return;
    }
    const { saturation, lightness } = {
      saturation: getRandomNumber(5, 25),
      lightness: getRandomNumber(70, 95),
    };
    const colorBg = `hsl(${this.hueChoose}, ${saturation}%, ${lightness}%)`;
    body.style.backgroundColor = colorBg;
  }

  loadContent() {
    removeContent();
    const project = projects.find((p) => p.shape === this.shapeName);
    if (!project) return;

    let div = document.createElement("article");
    div.setAttribute("id", "content");
    div.setAttribute("class", "xx");
    div.style.setProperty("--title-color", project.titleColor);

    const header = `<h2 class="head">${project.title}</h2>
       <article class="meta">
        <p class="date">${project.date}</p>
        <p class="engagement">@ ${project.engagement}</p>
        <p class="client">For ${project.client}</p>
       </article>
       <p class="blurb">${project.blurb}</p>`;

    let gridHTML = "";
    if (Array.isArray(project.content) && project.content.length > 0) {
      const items = project.content.map((block) =>
        renderContentBlock(block, project.title, project.slug),
      );
      gridHTML = `<div class="projectGrid">${items.join("")}</div>`;
    } else if (Array.isArray(project.images) && project.images.length > 0) {
      const items = project.images.map((filename) => {
        const src = filename.startsWith("img/") ? filename : `img/${project.slug}/${filename}`;
        return `<figure class="gridItem" style="--cols: 6">
          <img class="projectMedia" src="${src}" loading="lazy" decoding="async" alt="Eszter Muray ${project.title}" />
        </figure>`;
      });
      gridHTML = `<div class="projectGrid">${items.join("")}</div>`;
    }

    div.innerHTML = header + gridHTML;
    contentSection.appendChild(div);
    initCarousels(div);
    initVideos(div);
    document.documentElement.style.setProperty(
      "--scrollbar-color",
      project.titleColor,
    );
  }

  removeShape() {
    if (this.beenViewed === true) {
      this.shapeSelect.style.display = "none";
    }
  }
}

//////////////////////////////////////////////////
//// FUNCTION /////

function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

//////////////////////////////////////////////////
//// DATA LOADING /////

function removeContent() {
  const element = document.getElementById("content");
  if (element) {
    destroyCarousels(element);
    element.remove();
  }
}

function showLoadError() {
  removeContent();
  intro.classList.add("hidden");
  about.classList.add("hidden");

  let div = document.createElement("article");
  div.setAttribute("id", "content");
  div.setAttribute("class", "xx");
  div.innerHTML = `<h2 class="head">Content unavailable</h2>
    <p class="blurb">Project data could not be loaded. Please refresh and try again.</p>`;
  contentSection.appendChild(div);
}

function renderContentBlock(block, projectTitle, projectSlug) {
  if (block.type === "image" || block.type === "video") {
    return renderMediaItem(block, projectTitle, projectSlug);
  }
  if (block.type === "gallery") {
    return renderGalleryItem(block, projectTitle, projectSlug);
  }

  if (block.type === "row") {
    return Array.isArray(block.content)
      ? `<div class="gridRow">${block.content.map((item) => renderSectionItem(item, projectTitle, projectSlug)).join("")}</div>`
      : "";
  }

  // section block (type === "section")
  let html = `<div class="gridSectionBlock">`;
  if (block.title) {
    html += `<h3 class="gridSection">${block.title}</h3>`;
  }
  if (Array.isArray(block.content)) {
    html += block.content
      .map((item) => renderSectionItem(item, projectTitle, projectSlug))
      .join("");
  }
  html += `</div>`;
  return html;
}

function renderSectionItem(item, projectTitle, projectSlug) {
  if (item.type === "row") {
    return Array.isArray(item.content)
      ? `<div class="gridRow">${item.content.map((child) => renderSectionItem(child, projectTitle, projectSlug)).join("")}</div>`
      : "";
  }
  if (item.type === "text") {
    const style = item.cols ? ` style="grid-column: span ${item.cols}"` : "";
    if (item.subheader) {
      const body = item.text ? `<p class="gridBody">${item.text}</p>` : "";
      return `<div${style}><h4 class="gridSubheader">${item.subheader}</h4>${body}</div>`;
    }
    return `<p class="gridBody"${style}>${item.text}</p>`;
  }
  if (item.type === "subtitle") {
    const style = item.cols ? ` style="grid-column: span ${item.cols}"` : "";
    return `<h4 class="gridSubtitle"${style}>${item.text}</h4>`;
  }
  if (item.type === "gallery") {
    return renderGalleryItem(item, projectTitle, projectSlug);
  }
  return renderMediaItem(item, projectTitle, projectSlug);
}

function renderMediaItem(item, projectTitle, projectSlug) {
  const src = item.src.startsWith("img/") ? item.src : `img/${projectSlug}/${item.src}`;
  const cols = item.cols || 6;
  const captionSide = item.captionSide || "bottom";
  const captionHTML = item.caption
    ? `<figcaption class="mediaCaption">${item.caption}</figcaption>`
    : "";

  if (item.type === "image") {
    if (captionSide === "left" && item.caption) {
      return `<figure class="gridItem gridItem--caption-left" style="--cols: ${cols}">
        ${captionHTML}
        <img class="projectMedia" src="${src}" loading="lazy" decoding="async" alt="Eszter Muray ${projectTitle}" />
      </figure>`;
    }
    return `<figure class="gridItem" style="--cols: ${cols}">
      <img class="projectMedia" src="${src}" loading="lazy" decoding="async" alt="Eszter Muray ${projectTitle}" />
      ${captionHTML}
    </figure>`;
  }

  if (item.type === "video") {
    const poster = item.poster
      ? `poster="${item.poster.startsWith("img/") ? item.poster : `img/${projectSlug}/${item.poster}`}"`
      : "";
    const autoScroll = item.autoplayOnScroll ? `data-autoplay-scroll` : "";
    const autoAttrs = item.autoplayOnScroll ? `muted playsinline` : "";
    const loop = item.loop ? `loop` : "";
    if (captionSide === "left" && item.caption) {
      return `<figure class="gridItem gridItem--caption-left" style="--cols: ${cols}">
        ${captionHTML}
        <div class="videoWrapper" ${autoScroll}>
          <video class="projectMedia" ${poster} ${autoAttrs} ${loop} preload="none">
            <source src="${src}" />
          </video>
          <button class="videoPlayBtn" aria-label="Play/Pause"></button>
        </div>
      </figure>`;
    }
    return `<figure class="gridItem" style="--cols: ${cols}">
      <div class="videoWrapper" ${autoScroll}>
        <video class="projectMedia" ${poster} ${autoAttrs} ${loop} preload="none">
          <source src="${src}" />
        </video>
        <button class="videoPlayBtn" aria-label="Play/Pause"></button>
      </div>
      ${captionHTML}
    </figure>`;
  }

  return "";
}

function renderGalleryItem(item, projectTitle, projectSlug) {
  const cols = item.cols || 6;
  const autoplay = item.autoplay ? "true" : "false";
  const interval = item.autoplayInterval || 4000;
  const captionSide = item.captionSide || "bottom";
  const captionHTML = item.caption
    ? `<figcaption class="mediaCaption">${item.caption}</figcaption>`
    : "";

  const images = Array.isArray(item.images) ? item.images : [];
  const slidesHTML = images
    .map((src, i) => {
      const resolvedSrc = src.startsWith("img/") ? src : `img/${projectSlug}/${src}`;
      const loadingAttr = i === 0 ? "" : ' loading="lazy"';
      return `<div class="carousel-slide${i === 0 ? " active" : ""}">
        <img class="projectMedia" src="${resolvedSrc}"${loadingAttr} decoding="async" alt="Eszter Muray ${projectTitle}" />
      </div>`;
    })
    .join("");

  const dotsHTML = images
    .map(
      (_, i) =>
        `<button class="carousel-dot${i === 0 ? " carousel-dot--active" : ""}" aria-label="Slide ${i + 1}"></button>`,
    )
    .join("");

  const carouselHTML = `<div class="carousel" data-autoplay="${autoplay}" data-interval="${interval}">
    <div class="carousel-track">${slidesHTML}</div>
    ${images.length > 1 ? `<div class="carousel-dots">${dotsHTML}</div>` : ""}
  </div>`;

  if (captionSide === "left" && item.caption) {
    return `<figure class="gridItem gridItem--caption-left" style="--cols: ${cols}">
      ${captionHTML}
      ${carouselHTML}
    </figure>`;
  }
  return `<figure class="gridItem" style="--cols: ${cols}">
    ${carouselHTML}
    ${captionHTML}
  </figure>`;
}

function makeEmojiCursor(emoji) {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");
  ctx.font = "24px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(emoji, 16, 16);
  return `url(${canvas.toDataURL()}) 16 16, auto`;
}

const cursorRight = makeEmojiCursor("👉");
const cursorLeft = makeEmojiCursor("👈");
const cursorVideoPlay = makeEmojiCursor("🎥");
const cursorVideoPause = makeEmojiCursor("⏸️");

function initCarousels(container) {
  container.querySelectorAll(".carousel").forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
    const dots = Array.from(carousel.querySelectorAll(".carousel-dot"));
    if (slides.length < 2) return;

    const firstImg = slides[0].querySelector("img");
    if (firstImg && !firstImg.complete) {
      const w = carousel.getBoundingClientRect().width;
      if (w > 0) carousel.style.minHeight = `${Math.round(w * 0.65)}px`;
      firstImg.addEventListener("load", () => {
        carousel.style.minHeight = "";
      }, { once: true });
    }

    carousel._currentIndex = 0;

    function goToSlide(index) {
      slides[carousel._currentIndex].classList.remove("active");
      dots[carousel._currentIndex]?.classList.remove("carousel-dot--active");
      carousel._currentIndex = (index + slides.length) % slides.length;
      slides[carousel._currentIndex].classList.add("active");
      dots[carousel._currentIndex]?.classList.add("carousel-dot--active");
    }

    dots.forEach((dot, i) => dot.addEventListener("click", () => goToSlide(i)));

    carousel.addEventListener("mousemove", (e) => {
      const half = carousel.getBoundingClientRect().width / 2;
      carousel.style.cursor = e.offsetX > half ? cursorRight : cursorLeft;
    });
    carousel.addEventListener("mouseleave", () => {
      carousel.style.cursor = "";
    });
    carousel.addEventListener("click", (e) => {
      const half = carousel.getBoundingClientRect().width / 2;
      if (e.offsetX > half) goToSlide(carousel._currentIndex + 1);
      else goToSlide(carousel._currentIndex - 1);
    });

    if (carousel.dataset.autoplay === "true") {
      const interval = parseInt(carousel.dataset.interval, 10) || 4000;
      carousel._autoplayId = setInterval(() => goToSlide(carousel._currentIndex + 1), interval);
      carousel.addEventListener("mouseenter", () => {
        clearInterval(carousel._autoplayId);
        carousel._autoplayId = null;
      });
      carousel.addEventListener("mouseleave", () => {
        carousel._autoplayId = setInterval(() => goToSlide(carousel._currentIndex + 1), interval);
      });
    }
  });
}

function initVideos(container) {
  const isPointer = window.matchMedia("(hover: hover)");

  container.querySelectorAll(".videoWrapper").forEach((wrapper) => {
    const video = wrapper.querySelector("video");
    const btn = wrapper.querySelector(".videoPlayBtn");

    function toggle() {
      if (video.paused) video.play();
      else video.pause();
    }

    function updateBtn() {
      btn.classList.toggle("videoPlayBtn--playing", !video.paused);
    }

    function updateCursor() {
      wrapper.style.cursor = video.paused ? cursorVideoPlay : cursorVideoPause;
    }

    if (isPointer.matches) {
      wrapper.addEventListener("click", toggle);
      updateCursor();
      video.addEventListener("play", updateCursor);
      video.addEventListener("pause", updateCursor);
      video.addEventListener("ended", updateCursor);
    } else {
      btn.addEventListener("click", toggle);
      video.addEventListener("play", updateBtn);
      video.addEventListener("pause", updateBtn);
      video.addEventListener("ended", updateBtn);
    }

    if ("autoplayScroll" in wrapper.dataset) {
      const observer = new IntersectionObserver(
        ([entry]) => { entry.isIntersecting ? video.play() : video.pause(); },
        { threshold: 1.0 }
      );
      observer.observe(wrapper);
    }
  });
}

function destroyCarousels(container) {
  container.querySelectorAll(".carousel").forEach((carousel) => {
    if (carousel._autoplayId) {
      clearInterval(carousel._autoplayId);
      carousel._autoplayId = null;
    }
  });
}

async function loadProjects() {
  const response = await fetch("data/projects.json");
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }
  const data = await response.json();
  if (!Array.isArray(data.projects)) {
    throw new Error("Invalid project data format");
  }
  return data.projects.filter((p) => !p.hidden);
}

function createShapes() {
  shapeInstances = shapeConfig.map(
    (shapeSetting) => new Shape(shapeSetting.id, shapeSetting.hue),
  );
}

//////////////////////////////////////////////////
//// EVENT LISTENERS /////

function updateCategoryURL() {
  if (selectedCategories.size === 0) {
    history.pushState(null, "", "/");
  } else {
    const path = Array.from(selectedCategories)
      .map((c) => c.toLowerCase())
      .join("+");
    history.pushState({ categories: path }, "", "/" + path);
  }
}

function applyCategoriesFromPath(path) {
  const parts = path.split("+");
  const matched = parts
    .map((p) => ALL_CATEGORIES.find((c) => c.toLowerCase() === p.toLowerCase()))
    .filter(Boolean);
  if (matched.length === 0) return false;

  selectedCategories.clear();
  categoryBtns.forEach((btn) => btn.classList.remove("active"));

  matched.forEach((cat) => {
    selectedCategories.add(cat);
    const btn = Array.from(categoryBtns).find((b) => b.dataset.category === cat);
    if (btn) btn.classList.add("active");
  });

  filterShapes();
  return true;
}

function filterShapes() {
  for (const shape of shapeInstances) {
    if (shape.beenViewed) continue;
    const project = projects.find((p) => p.shape === shape.shapeName);
    if (!project) {
      shape.shapeSelect.style.display = "none";
      continue;
    }
    if (selectedCategories.size === 0) {
      shape.shapeSelect.style.display = "";
    } else {
      const projectCategories = Array.isArray(project.category)
        ? project.category
        : [project.category];
      const matches = projectCategories.some((c) => selectedCategories.has(c));
      shape.shapeSelect.style.display = matches ? "" : "none";
    }
  }
}

function openProjectBySlug(slug) {
  const project = projects.find((p) => p.slug === slug);
  if (!project) return;
  const shapeInstance = shapeInstances.find(
    (s) => s.shapeName === project.shape,
  );
  if (shapeInstance) {
    if (!contentExpanded) {
      contentExpanded = true;
      table.classList.add("content-expanded");
    }
    shapeInstance.beenViewed = true;
    shapeInstance.matchColor();
    shapeInstance.loadContent();
    shapeInstance.removeShape();
    intro.classList.add("hidden");
    about.classList.add("hidden");
    shapeInstance.checkEnd();
  }
}

function addEventListeners() {
  categoryBtns = document.querySelectorAll(".categoryBtn");

  reloadBtn.addEventListener("click", function () {
    history.pushState(null, "", "/");
    location.reload();
  });

  shuffleBtn.addEventListener("click", function () {
    for (let i = 0; i < shapeInstances.length; i++) {
      shapeInstances[i].randomPosition();
      shapeInstances[i].randomScale();
    }
  });

  categoryBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const cat = this.dataset.category;
      if (selectedCategories.has(cat)) {
        selectedCategories.delete(cat);
        this.classList.remove("active");
      } else {
        selectedCategories.add(cat);
        this.classList.add("active");
      }
      filterShapes();
      updateCategoryURL();
    });
  });

  chefBtn.addEventListener("click", function () {
    about.classList.remove("hidden");
    removeContent();
    intro.classList.add("hidden");
  });

  window.addEventListener("popstate", function () {
    const slug = window.location.pathname.replace(/^\/|\/$/g, "");
    if (!slug) {
      removeContent();
      intro.classList.remove("hidden");
      body.style.backgroundColor = "";
      selectedCategories.clear();
      categoryBtns.forEach((btn) => btn.classList.remove("active"));
      filterShapes();
      contentExpanded = false;
      table.classList.remove("content-expanded");
    } else if (!applyCategoriesFromPath(slug)) {
      openProjectBySlug(slug);
    }
  });
}

async function init() {
  addEventListeners();
  try {
    projects = await loadProjects();
    createShapes();
    filterShapes();
    const slug = window.location.pathname.replace(/^\/|\/$/g, "");
    if (slug) {
      if (!applyCategoriesFromPath(slug)) {
        openProjectBySlug(slug);
      }
    }
  } catch (error) {
    console.error("Portfolio data load failed:", error);
    showLoadError();
  }
}

init();
