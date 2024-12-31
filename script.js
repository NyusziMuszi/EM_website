"use strict";
//////////////////////////////////////////////////
//// SELECTOR /////

///none interactive
const contentSection = document.getElementById("contentSection");
const foodSection = document.getElementById("foodSection");
const table = document.getElementById("table");
const body = document.querySelector("body");
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

class Project {
  constructor(
    title,
    date,
    engagement,
    client,
    blurb,
    folderName,
    imgURL,
    shape
  ) {
    this.title = title;
    this.meta = { date: date, engagement: engagement, client: client };
    this.blurb = blurb;
    this.folderName = folderName;
    this.imgURL = imgURL;
    this.shape = shape;
  }
}

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
        projects[i].imgURL.forEach((url) => {
          imageURLS.push(
            `<img class="projectMedia" src="${url}" alt="Eszter Muray ${projects[i].title}" />`
          );
        });

        let div = document.createElement("article"); //construct DOM for project

        div.setAttribute("id", "content");
        div.setAttribute("class", "centered");
        div.setAttribute("class", "xx");

        div.innerHTML = `<h2 class="head" style ="color: hsl(${
          this.hueChooseOrig
        }, 50%, 50%)
  ">${projects[i].title}</h2>
           <article class="meta">
            <p class="date">${projects[i].meta.date}</p>
            <p class="engagement">@ ${projects[i].meta.engagement}</p>
            <p class="client">For ${projects[i].meta.client}</p>
           </article>
           <p class="blurb">${projects[i].blurb}</p>${imageURLS.join(" ")}`;
        contentSection.appendChild(div);
      }
    }
  }
  removeShape() {
    if ((this.beenViewed = true)) {
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
//// DATABASE /////

const Insula = new Project(
  "Insula Lutherana and the Lutheran Museum",
  "2013-2015",
  "Freelance",
  "Lutheran Complex / Potzner Ádám (architech)",
  "Making the Lutheran Complex (situated on the main square of Budapest) visible, by initiating a dialogue with the city it serves, as well as rebranding the Lutheran Museum in the heart of Budapest.",
  "insula",
  [
    "img/insula/insula_1.jpg",
    "img/insula/insula_2.jpg",
    "img/insula/insula_3.jpg",
    "img/insula/insula_4.jpg",
    "img/insula/insula_5.jpg",
    "img/insula/insula_6.jpg",
    "img/insula/insula_8.jpg",
    "img/insula/insula_9.jpg",
  ],
  "parallelogram"
);

const Plex = new Project(
  "Plexopolis",
  "2017",
  "Designer at Uniform",
  "University College London",
  "Creating an engaging and affordable game for high school students on the topic of urban planning.",
  "insula",
  [
    "img/plexopolis/Uniform_plexopolis_H2OH_gif-crop-rotate.gif",
    "img/plexopolis/Uniform-plexopolis-0.jpg",
    "img/plexopolis/Uniform-plexopolis-2.jpg",
    "img/plexopolis/Uniform-plexopolis-11.jpg",
    "img/plexopolis/Uniform-plexopolis-13.jpg",
    "img/plexopolis/Uniform-plexopolis-15.jpg",
  ],
  "circle"
);

const River = new Project(
  "All my rivers",
  "2020",
  "Artist in Residence",
  "Donumenta",
  "2020 Artist in residence, in Regensburg. On its 2,850km journey the Danube evolves in its shape, size and flow, growing from insignificant to dramatic, oscillating between a slow meander and a harsh rapid. The river behaves like a mobile sculpture, ever changing with the day, season and the weather. It is in fact a mirror in itself, reflecting the shores and the sky above it. It connects several countries, landscapes, and people all with different histories. These multitudes of rivers and connections are hard to observe unless one has the privilege of traveling along its length.<br> The river between Regensburg splits into several streams. The 13m wide island of the Am Beschlächt provides a unique opportunity to observe two very different Danubes simultaneusly. “All my rivers” is interested in highlighting the beauty of the ever evolving river, and contrasting the stagnant  northern stream with the rapid southern, and projecting these two visions of the city and its river into each other.",
  "river",
  [
    "img/rivers/Eszter-Muray-All-my-rivers-1.jpg",
    "img/rivers/Eszter-Muray-All-my-rivers-2.jpg",
    "img/rivers/Eszter-Muray-All-my-rivers-3.jpg",
    "img/rivers/Eszter-Muray-All-my-rivers-4.jpg",
    "img/rivers/Eszter-Muray-All-my-rivers-5.jpg",
    "img/rivers/Eszter-Muray-All-my-rivers-6.jpg",
    "img/rivers/Eszter-Muray-All-my-rivers-7.jpg",
    "img/rivers/Eszter-Muray-All-my-rivers-8.jpg",
    "img/rivers/Eszter-Muray-All-my-rivers-9.jpg",
    "img/rivers/Eszter-Muray-All-my-rivers-10.jpg",
    "img/rivers/Eszter-Muray-All-my-rivers-11.jpg",
    "img/rivers/Eszter-Muray-All-my-rivers-12.jpg",
  ],
  "hex"
);
const Veszprem = new Project(
  "Petofi Szinhaz",
  "2021",
  "Freelance",
  "Potzner Ádám (architech)",
  "Concept and design for the Petofi theatre's refurbishment.",
  "veszprem",
  [
    "img/veszprem/web_hd_220912_em--0811.jpeg",
    "img/veszprem/Screenshot 2024-08-09 at 11.23.07 am.jpg",
    "img/veszprem/Screenshot 2024-08-09 at 11.23.18 am.jpg",
    "img/veszprem/Screenshot 2024-08-09 at 11.23.30 am.jpg",
    "img/veszprem/Screenshot 2024-08-09 at 11.24.16 am.jpg",
    "img/veszprem/Screenshot 2024-08-09 at 11.24.26 am.jpg",
  ],
  "flower"
);

const Cine = new Project(
  "Cinemachines",
  "2019",
  "ArtEZ University",
  "-",
  "Games for children using projectors.",
  "cine",
  [
    "img/cinemachines/DSC_9139.JPG",
    "img/cinemachines/IMG_0334.jpg",
    "img/cinemachines/IMG_0442.jpg",
    "img/cinemachines/IMG_0540.jpg",
    "img/cinemachines/IMG_0543.jpg",
    "img/cinemachines/IMG_0546.jpg",
  ],
  "star"
);
const Animorph = new Project(
  "Animorph",
  "2021-now",
  "Freelance, subsequently in-house",
  "Animorph co-operative",
  "Brand, website and outreach gifts.",
  "animorph",
  [
    "img/animorph/ani-1.jpg",
    "img/animorph/ani-2.jpg",
    "img/animorph/ani-3.jpg",
    "img/animorph/ani-4.jpg",
    "img/animorph/ani-5.jpg",
    "img/animorph/kaleido/ani-2b.jpg",
    "img/animorph/kaleido/ani-13.jpg",
    "img/animorph/kaleido/ani-14.jpg",

    "img/animorph/gifts/ani-7.jpg",
    "img/animorph/gifts/ani-10.jpg",

    "img/animorph/gifts/ani-43.jpeg",
  ],
  "scallop"
);
const projects = [Insula, Plex, River, Veszprem, Cine, Animorph];

const para = new Shape("parallelogram", 236);
const circle = new Shape("circle", 0);
const flower = new Shape("flower", 58);
const hex = new Shape("hex", 149);
const star = new Shape("star", 279);
const scallop = new Shape("scallop", 236);

const shapeInstances = [para, circle, flower, hex, star, scallop];

//////////////////////////////////////////////////
//// EVENT LISTENERS /////

reloadBtn.addEventListener("click", function () {
  location.reload();
});

shuffleBtn.addEventListener("click", function () {
  for (let i = 0; i < shapeInstances.length; i++) {
    shapeInstances[i].randomPosition();
    shapeInstances[i].randomScale();
  }
});

chefBtn.addEventListener("click", function () {
  about.classList.remove("hidden");
  for (let i = 0; i < shapeInstances.length; i++) {
    shapeInstances[i].removeContent();
  }
  intro.classList.add("hidden");
  content.classList.add("hidden");

  // overlay.classList.remove("hidden");
});
