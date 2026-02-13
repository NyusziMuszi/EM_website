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

///button
const reloadBtn = document.getElementById("reloadBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const chefBtn = document.getElementById("chefBtn");
// const slider = document.getElementById("hueRange");
let projects = [];
let shapeInstances = [];

const shapeConfig = [
  { id: "parallelogram", hue: 236 },
  { id: "circle", hue: 0 },
  { id: "flower", hue: 58 },
  { id: "hex", hue: 149 },
  { id: "star", hue: 279 },
  { id: "scallop", hue: 236 },
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
      this.handleEnter.bind(this)
    );
    this.shapeSelect.addEventListener(
      "mouseleave",
      this.handleLeave.bind(this)
    );
  }

  handleEnter(event) {
    this.shapeSelect.style.backgroundColor = `hsl(${this.hueChoose}, ${
      this.saturation + this.hover
    }%, ${this.light + this.hover}%)`;
  }

  handleLeave(event) {
    this.shapeSelect.style.backgroundColor = `hsl(${this.hueChoose}, ${
      this.saturation - this.hover
    }%, ${this.light - this.hover}%)`;
  }

  handleClick(event) {
    this.beenViewed = true;
    this.matchColor();
    this.loadContent();
    this.removeShape();
    intro.classList.add("hidden");
    about.classList.add("hidden");
    this.checkEnd();
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
    const { saturation, lightness, alpha } = {
      saturation: getRandomNumber(5, 25),
      lightness: getRandomNumber(70, 95),
    };

    const colorBg = `hsl(${this.hueChoose}, ${saturation}%, ${lightness}%)`;
    body.style.backgroundColor = colorBg;
  }

  loadContent() {
    this.removeContent();
    for (let i = 0; i < projects.length; i++) {
      //match with the projects

      if (this.shapeName == projects[i].shape) {
        const imageURLS = []; //load in images
        projects[i].images.forEach((url) => {
          imageURLS.push(
            `<img class="projectMedia" src="${url}" loading="lazy" decoding="async" alt="Eszter Muray ${projects[i].title}" />`
          );
        });

        let div = document.createElement("article"); //construct DOM for project

        div.setAttribute("id", "content");
        div.setAttribute("class", "xx");
        // div.setAttribute("class", "xx");

        div.innerHTML = `<h2 class="head" style ="color: hsl(${
          this.hueChooseOrig
        }, 50%, 50%)
  ">${projects[i].title}</h2>
           <article class="meta">
            <p class="date">${projects[i].date}</p>
            <p class="engagement">@ ${projects[i].engagement}</p>
            <p class="client">For ${projects[i].client}</p>
           </article>
           <p class="blurb">${projects[i].blurb}</p>${imageURLS.join(" ")}`;
        contentSection.appendChild(div);
      }
    }
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

async function loadProjects() {
  const response = await fetch("data/projects.json");
  if (!response.ok) {
    throw new Error("Failed to fetch project data");
  }
  const data = await response.json();
  if (!Array.isArray(data.projects)) {
    throw new Error("Invalid project data format");
  }
  return data.projects;
}

function createShapes() {
  shapeInstances = shapeConfig.map(
    (shapeSetting) => new Shape(shapeSetting.id, shapeSetting.hue)
  );
}

//////////////////////////////////////////////////
//// EVENT LISTENERS /////

function addEventListeners() {
  reloadBtn.addEventListener("click", function () {
    location.reload();
  });

  shuffleBtn.addEventListener("click", function () {
    for (let i = 0; i < shapeInstances.length; i++) {
      shapeInstances[i].randomPosition();
      shapeInstances[i].randomScale();
    }
  });
}

async function init() {
  addEventListeners();
  try {
    projects = await loadProjects();
    createShapes();
  } catch (error) {
    console.error("Portfolio data load failed:", error);
    showLoadError();
  }
}

init();

// chefBtn.addEventListener("click", function () {
//   about.classList.remove("hidden");
//   for (let i = 0; i < shapeInstances.length; i++) {
//     shapeInstances[i].removeContent();
//   }
//   intro.classList.add("hidden");
//   content.classList.add("hidden");

//   // overlay.classList.remove("hidden");
// });
