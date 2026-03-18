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
const content = document.getElementById("content");
const intro = document.getElementById("intro");

///shapes
const shapes = document.getElementsByClassName("shape");

///tooltip
const tooltip = document.getElementById("tooltip");

///button
const reloadBtn = document.getElementById("reloadBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const chefBtn = document.getElementById("chefBtn");
// const slider = document.getElementById("hueRange");
let projects = [];
let shapeInstances = [];
let selectedCategories = new Set();
let contentExpanded = false;
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

//////////////////////////////////////////////////
////  Initialising Color array /////

// const shift = slider.oninput;
const shift = 105;

// const shift = 80;
// const sessionHues = [];
// const seed = getRandomNumber(20, 340 - shift);

// for (let i = 0; i < 6; i++) {
//   sessionHues.push(getRandomNumber(seed, seed + shift));
// }
// sessionHues.sort(function (a, b) {
//   return a - b;
// });

// for (let i = 0; i < 6; i++) {
//   if (i % 2 == 0) {
//     sessionHues[i] /= 10;
//   }
// }

//////////////////////////////////////////////////
////  CONSTRUCTOR /////

class Shape {
  constructor(id, hueChoose) {
    this.shapeSelect = document.getElementById(id);
    this.shapeName = id;
    this.beenViewed = false;
    this.hueChooseOrig = hueChoose;
    this.hueChoose = getRandomNumber(hueChoose - shift, hueChoose + shift);

    this.hue;
    this.saturation;
    this.light;
    this.hover = 3;

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

  handleEnter(event) {
    this.shapeSelect.style.backgroundColor = `hsl(${this.hueChoose}, ${
      this.saturation + this.hover
    }%, ${this.light + this.hover}%)`;

    const project = projects.find((p) => p.shape === this.shapeName);
    if (project) {
      tooltip.textContent = project.title;
      tooltip.style.opacity = "1";
    }
  }

  handleLeave(event) {
    this.shapeSelect.style.backgroundColor = `hsl(${this.hueChoose}, ${
      this.saturation - this.hover
    }%, ${this.light - this.hover}%)`;

    tooltip.style.opacity = "0";
  }

  handleMove(event) {
    tooltip.style.left = `${event.clientX + 16}px`;
    tooltip.style.top = `${event.clientY + 16}px`;
  }

  handleClick(event) {
    if (!contentExpanded) {
      contentExpanded = true;
      table.classList.add("content-expanded");
      // console.log(
      //   "content-expanded added:",
      //   table.classList.contains("content-expanded"),
      // );
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
    let numberViewed = 0;
    for (let i = 0; i < shapeInstances.length; i++) {
      if (shapeInstances[i].beenViewed == true) {
        numberViewed++;
      } else {
      }
      if (numberViewed == shapeInstances.length) {
        shuffleBtn.classList.add("hidden");
        reloadBtn.classList.remove("hidden");
        reloadBtn.classList.add("highlight");
      }
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
    for (let i = 0; i < projects.length; i++) {
      //match with the projects
      if (this.shapeName == projects[i].shape) {
        // this.shapeSelect.style.backgroundColor = `hsl(${sessionHues[i]}, ${saturation}%, ${lightness}%)`;
        this.shapeSelect.style.backgroundColor = `hsl(${this.hueChoose}, ${saturation}%, ${lightness}%)`;
        // this.hue = sessionHues[i];
        this.saturation = saturation;
        this.light = lightness;
      }
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
    this.removeContent();
    const project = projects.find((p) => p.shape === this.shapeName);
    if (!project) return;

    let div = document.createElement("article");
    div.setAttribute("id", "content");
    div.setAttribute("class", "xx");

    const header = `<h2 class="head" style="color: ${project.titleColor}">${project.title}</h2>
       <article class="meta">
        <p class="date">${project.date}</p>
        <p class="engagement">@ ${project.engagement}</p>
        <p class="client">For ${project.client}</p>
       </article>
       <p class="blurb">${project.blurb}</p>`;

    let gridHTML = "";
    if (Array.isArray(project.content) && project.content.length > 0) {
      const items = project.content.map((block) =>
        renderContentBlock(block, project.title),
      );
      gridHTML = `<div class="projectGrid">${items.join("")}</div>`;
    } else if (Array.isArray(project.images) && project.images.length > 0) {
      const items = project.images.map(
        (url) => `<figure class="gridItem" style="--cols: 6">
          <img class="projectMedia" src="${url}" loading="lazy" decoding="async" alt="Eszter Muray ${project.title}" />
        </figure>`,
      );
      gridHTML = `<div class="projectGrid">${items.join("")}</div>`;
    }

    div.innerHTML = header + gridHTML;
    contentSection.appendChild(div);
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

  removeContent() {
    let element;
    if ((element = document.getElementById("content"))) {
      element.remove();
    }
    // let about;
    // if ((about = document.getElementById("about"))) {
    //   about.remove();
    // }
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
  let element;
  if ((element = document.getElementById("content"))) {
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

function renderContentBlock(block, projectTitle) {
  // standalone media at the top level
  if (block.type === "image" || block.type === "video") {
    return renderMediaItem(block, projectTitle);
  }

  // section block
  let html = "";
  if (block.title) {
    html += `<h3 class="gridSection">${block.title}</h3>`;
  }
  if (Array.isArray(block.content)) {
    html += block.content
      .map((item) => renderSectionItem(item, projectTitle))
      .join("");
  }
  return html;
}

function renderSectionItem(item, projectTitle) {
  if (item.type === "text") {
    const style = item.cols ? ` style="grid-column: span ${item.cols}"` : "";
    return `<p class="gridBody"${style}>${item.text}</p>`;
  }
  if (item.type === "subtitle") {
    const style = item.cols ? ` style="grid-column: span ${item.cols}"` : "";
    return `<h4 class="gridSubtitle"${style}>${item.text}</h4>`;
  }
  return renderMediaItem(item, projectTitle);
}

function renderMediaItem(item, projectTitle) {
  const cols = item.cols || 6;
  const captionSide = item.captionSide || "bottom";
  const captionHTML = item.caption
    ? `<figcaption class="mediaCaption">${item.caption}</figcaption>`
    : "";

  if (item.type === "image") {
    if (captionSide === "left" && item.caption) {
      return `<figure class="gridItem gridItem--caption-left" style="--cols: ${cols}">
        ${captionHTML}
        <img class="projectMedia" src="${item.src}" loading="lazy" decoding="async" alt="Eszter Muray ${projectTitle}" />
      </figure>`;
    }
    return `<figure class="gridItem" style="--cols: ${cols}">
      <img class="projectMedia" src="${item.src}" loading="lazy" decoding="async" alt="Eszter Muray ${projectTitle}" />
      ${captionHTML}
    </figure>`;
  }

  if (item.type === "video") {
    const poster = item.poster ? `poster="${item.poster}"` : "";
    if (captionSide === "left" && item.caption) {
      return `<figure class="gridItem gridItem--caption-left" style="--cols: ${cols}">
        ${captionHTML}
        <video class="projectMedia" ${poster} controls preload="none">
          <source src="${item.src}" />
        </video>
      </figure>`;
    }
    return `<figure class="gridItem" style="--cols: ${cols}">
      <video class="projectMedia" ${poster} controls preload="none">
        <source src="${item.src}" />
      </video>
      ${captionHTML}
    </figure>`;
  }

  return "";
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
  document
    .querySelectorAll(".categoryBtn")
    .forEach((btn) => btn.classList.remove("active"));

  matched.forEach((cat) => {
    selectedCategories.add(cat);
    const btn = document.querySelector(`.categoryBtn[data-category="${cat}"]`);
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

  document.querySelectorAll(".categoryBtn").forEach(function (btn) {
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
      document
        .querySelectorAll(".categoryBtn")
        .forEach((btn) => btn.classList.remove("active"));
      filterShapes();
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
