"use strict";

//////////////////////////////////////////////////
//// SELECTOR /////

///none interactive
const contentSection = document.getElementById("contentSection");
const body = document.querySelector("body");

//text
const about = document.getElementById("about");
const intro = document.getElementById("intro");

///button
const reloadBtn = document.getElementById("reloadBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const chefBtn = document.getElementById("chefBtn");

//////////////////////////////////////////////////
////  DATA /////

const shift = 105;
const hueByShape = {
  parallelogram: 236,
  circle: 0,
  flower: 58,
  hex: 149,
  star: 279,
  scallop: 236
};

const shapeInstances = [];
const preloadCache = new Set();
let projects = [];

//////////////////////////////////////////////////
////  CLASSES /////

class Shape {
  constructor(id) {
    this.shapeSelect = document.getElementById(id);
    this.shapeName = id;
    this.beenViewed = false;
    this.hueChooseOrig = hueByShape[id];
    this.hueChoose = getRandomNumber(
      this.hueChooseOrig - shift,
      this.hueChooseOrig + shift
    );

    this.saturation = 50;
    this.light = 50;
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
      this.handleEnter.bind(this)
    );
    this.shapeSelect.addEventListener(
      "mouseleave",
      this.handleLeave.bind(this)
    );
  }

  handleEnter() {
    this.shapeSelect.style.backgroundColor = `hsl(${this.hueChoose}, ${
      this.saturation + this.hover
    }%, ${this.light + this.hover}%)`;
  }

  handleLeave() {
    this.shapeSelect.style.backgroundColor = `hsl(${this.hueChoose}, ${
      this.saturation - this.hover
    }%, ${this.light - this.hover}%)`;
  }

  handleClick() {
    this.beenViewed = true;
    this.matchColor();
    this.loadContent();
    this.removeShape();
    intro.classList.add("hidden");
    about.classList.add("hidden");
    this.checkEnd();
  }

  checkEnd() {
    const viewedCount = shapeInstances.filter((shape) => shape.beenViewed).length;
    if (viewedCount === shapeInstances.length) {
      shuffleBtn.classList.add("hidden");
      reloadBtn.classList.add("highlight");
    }
  }

  randomScale() {
    this.shapeSelect.style.scale = `${getRandomNumber(70, 100)}%`;
  }

  randomPosition() {
    this.shapeSelect.style.left = `${getRandomNumber(0, 100)}px`;
    this.shapeSelect.style.top = `${getRandomNumber(0, 200)}px`;
  }

  randomColor() {
    const lightness = getRandomNumber(38, 90);
    let saturation = 80;

    if (lightness > 85) {
      saturation = getRandomNumber(80, 100);
    } else if (lightness > 65) {
      saturation = getRandomNumber(40, 60);
    } else {
      saturation = getRandomNumber(28, 50);
    }

    if (projects.some((project) => project.shape === this.shapeName)) {
      this.shapeSelect.style.backgroundColor = `hsl(${this.hueChoose}, ${saturation}%, ${lightness}%)`;
      this.saturation = saturation;
      this.light = lightness;
    }
  }

  matchColor() {
    const saturation = getRandomNumber(5, 25);
    const lightness = getRandomNumber(70, 95);
    body.style.backgroundColor = `hsl(${this.hueChoose}, ${saturation}%, ${lightness}%)`;
  }

  loadContent() {
    this.removeContent();

    const project = projects.find((p) => p.shape === this.shapeName);
    if (!project) {
      return;
    }

    const article = document.createElement("article");
    article.id = "content";
    article.className = "xx";

    const heading = document.createElement("h2");
    heading.className = "head";
    heading.style.color = `hsl(${this.hueChooseOrig}, 50%, 50%)`;
    heading.textContent = project.title;

    const meta = document.createElement("article");
    meta.className = "meta";
    meta.innerHTML = `
      <p class="date">${project.meta.date}</p>
      <p class="engagement">@ ${project.meta.engagement}</p>
      <p class="client">For ${project.meta.client}</p>
    `;

    const blurb = document.createElement("p");
    blurb.className = "blurb";
    blurb.innerHTML = project.blurb;

    article.append(heading, meta, blurb);

    project.imgURL.forEach((url, idx) => {
      const image = buildProjectImage(url, project.title, idx === 0);
      article.appendChild(image);
      primeImage(url);
    });

    contentSection.appendChild(article);
  }

  removeShape() {
    if (this.beenViewed) {
      this.shapeSelect.style.display = "none";
    }
  }

  removeContent() {
    const element = document.getElementById("content");
    if (element) {
      element.remove();
    }
  }
}

//////////////////////////////////////////////////
//// FUNCTION /////

function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function primeImage(url) {
  if (preloadCache.has(url)) {
    return;
  }
  preloadCache.add(url);

  const img = new Image();
  img.decoding = "async";
  img.loading = "eager";
  img.src = url;
}

function buildProjectImage(url, title, isFirstImage) {
  const image = document.createElement("img");
  image.className = "projectMedia";
  image.src = url;
  image.alt = `Eszter Muray ${title}`;
  image.loading = isFirstImage ? "eager" : "lazy";
  image.decoding = "async";
  image.fetchPriority = isFirstImage ? "high" : "low";

  if (image.complete) {
    image.classList.add("loaded");
  } else {
    image.addEventListener(
      "load",
      () => {
        image.classList.add("loaded");
      },
      { once: true }
    );
  }

  return image;
}

function buildShapes() {
  const shapeIds = ["parallelogram", "circle", "flower", "hex", "star", "scallop"];
  shapeIds.forEach((id) => {
    shapeInstances.push(new Shape(id));
  });
}

function setupEventListeners() {
  reloadBtn.addEventListener("click", () => {
    location.reload();
  });

  shuffleBtn.addEventListener("click", () => {
    shapeInstances.forEach((shape) => {
      shape.randomPosition();
      shape.randomScale();
    });
  });

  chefBtn.addEventListener("click", () => {
    about.classList.remove("hidden");
    shapeInstances.forEach((shape) => shape.removeContent());
    intro.classList.add("hidden");

    const content = document.getElementById("content");
    if (content) {
      content.classList.add("hidden");
    }
  });
}

async function loadProjects() {
  const response = await fetch("/api/projects", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load projects: ${response.status}`);
  }

  const payload = await response.json();
  return payload.projects || [];
}

function renderDataError() {
  const article = document.createElement("article");
  article.id = "content";
  article.className = "xx";
  article.innerHTML = `
    <h2 class="head">Could not load portfolio data</h2>
    <p class="body">Please run this site via the local server so the database API is available.</p>
  `;

  intro.classList.add("hidden");
  contentSection.appendChild(article);
}

async function init() {
  setupEventListeners();

  try {
    projects = await loadProjects();
    projects.forEach((project) => {
      if (project.imgURL && project.imgURL[0]) {
        primeImage(project.imgURL[0]);
      }
    });
  } catch (error) {
    console.error(error);
    renderDataError();
    return;
  }

  buildShapes();
}

init();
