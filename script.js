"use strict";

//// SELECTOR /////

///none interactive
const contentSection = document.getElementById("contentSection");
const foodSection = document.getElementById("foodSection");
const table = document.getElementById("table");
const body = document.querySelector("body");
const scrollBar = document.querySelector(".scrollBar");
const contentContainer = document.getElementById("content");
const about = document.getElementById("chef");

///shapes
const shapes = document.getElementsByClassName("shape");

///button
const reloadBtn = document.getElementById("reloadBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const chefBtn = document.getElementById("chefBtn");
const slider = document.getElementById("hueRange");

///modal

////  Initialising arrays /////

////  load hues /////

const shift = slider.oninput;

const sessionHues = [];
const seed = getRandomNumber(0, 360 - shift);

for (let i = 0; i < 6; i++) {
  sessionHues.push(getRandomNumber(seed, seed + shift));
}
sessionHues.sort(function (a, b) {
  return a - b;
});
console.log("initial", sessionHues);

for (let i = 0; i < 6; i++) {
  if (i % 2 == 0) {
    sessionHues[i] /= 10;
  }
}

console.log("second", sessionHues);

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
  constructor(id) {
    this.shapeSelect = document.getElementById(id);
    this.shapeName = id;

    this.beenViewed = false;

    // this.loadContent();
    this.randomScale();
    this.randomPosition();
    this.randomColor();
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
    const [hue, saturation, lightness, alpha] = getRandomHslaColor();
    for (let i = 0; i < projects.length; i++) {
      //match with the projects
      if (this.shapeName == projects[i].shape) {
        this.shapeSelect.style.backgroundColor = `hsla(${sessionHues[i]}, ${saturation}%, ${lightness}%, ${alpha} )`;
      }
    }
  }

  // matchColor() {
  //   const [hue, saturation, lightness, alpha] = getRandomHslaColor(hueLimit);
  //   const colorBg = `hsla(${hue}, ${saturation - 30}%, ${
  //     lightness + 30
  //   }%, ${alpha} )`;
  //   body.style.backgroundColor = colorBg;
  // }

  // loadContent() {
  //   document.getElementById(this.id).addEventListener("click", (e) => {
  //     //set boolean to true
  //     this.beenViewed = true;
  //     for (let i = 0; i < projects.length; i++) {
  //       //match with the projects
  //       if (this.id == projects[i].shape) {
  //         //construct DOM for project
  //         //load in images
  //         const imageURLS = [];
  //         projects[i].imgURL.forEach((url) => {
  //           imageURLS.push(
  //             `<img class="projectMedia" src="${url}" alt="Eszter Muray ${projects[i].title}" />`
  //           );
  //         });

  //         let div = document.createElement("article");

  //         div.id = "content";

  //         div.innerHTML = `<h2 class="head">${projects[i].title}</h2>
  //          <article class="meta">
  //           <p class="date">${projects[i].meta.date}</p>
  //           <p class="engagement">${projects[i].meta.engagement}</p>
  //           <p class="client">For ${projects[i].meta.client}</p>
  //          </article>
  //          <p class="blurb">${projects[i].blurb}</p>${imageURLS.join(" ")}`;
  //         contentSection.appendChild(div);

  //         matchColor();
  //       }
  //     }
  //   });
  // }
}

//// FUNCTION /////

///generating random values

function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

///generate random color

function getRandomHslaColor() {
  const { hue, saturation, lightness, alpha } = {
    hue: getRandomNumber(0, 360),
    saturation: getRandomNumber(25, 80),
    lightness: getRandomNumber(30, 70),
    alpha: 1,
  };
  return [hue, saturation, lightness, alpha];
}

///Setting random values

function matchColor(hueLimit) {
  const [hue, saturation, lightness, alpha] = getRandomHslaColor(hueLimit);
  const colorBg = `hsla(${hue}, ${saturation - 30}%, ${
    lightness + 30
  }%, ${alpha} )`;
  body.style.backgroundColor = colorBg;

  const colorHead = `hsla(${hue}, ${saturation - 30}%, ${
    lightness - 30
  }%, ${alpha} )`;
  header.style.color = colorHead;
}

//////// FUNCTION: Shapes /////

function removeShape(e) {
  e.style.display = "none";
}

function removeContent() {
  let element;
  if ((element = document.getElementById("content"))) {
    element.remove();
  } else {
    console.log("not yet loaded");
  }
}

//// EVENT LISTENERS /////

let counter = 0;

for (let i = 0; i < shapes.length; i++) {
  shapes[i].addEventListener("click", function () {
    removeContent();
    setTimeout(() => {
      removeShape(shapes[i]);
    }, "1000");
    // matchColor(getRandomNumber(0, 150));
    // counter++;
    // console.log(counter);
    // if (counter >= shapes.length) {
    //   shuffleBtn.style.display = "none";
    // } else {
    //   shuffleBtn.style.display = "block";
    // }
  });
}

reloadBtn.addEventListener("click", function () {
  location.reload();
});

reloadBtn.addEventListener("click", function () {
  location.reload();
});

shuffleBtn.addEventListener("click", function () {
  setPosition();
  setColor(getRandomNumber(0, 150));
  setScale();
});

chefBtn.addEventListener("click", function () {
  chef.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

/////////////////////////
/////////////////////////
//// DATABASE /////

const Insula = new Project(
  "Insula Lutherana and the Lutheran Museum",
  "2013-2015",
  "Freelance",
  "me",
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
  "UCL",
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
  "Regensburg",
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
  "Potzner Adam, Veszpremi Petofi Szinhaz",
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
  "Freelance and then in house",
  "Animorph co-op",
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

const para = new Shape("parallelogram");
const circle = new Shape("circle");
const flower = new Shape("flower");
const hex = new Shape("hex");
const star = new Shape("star");
const scallop = new Shape("scallop");

const shapesJS = [para, circle, flower, hex, star, scallop];
