"use strict";

//// SELECTORS /////

const contentSection = document.getElementById("contentSection");
const foodSection = document.getElementById("foodSection");
const table = document.getElementById("table");
const body = document.querySelector("body");
const scrollBar = document.querySelector(".scrollBar");

const header = document.getElementById("head");
const contentContainer = document.getElementById("content");

const shapes = document.getElementsByClassName("shape");

const reloadBtn = document.getElementById("reloadBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const chefBtn = document.getElementById("chefBtn");
const modal = document.getElementById("chef");
const overlay = document.querySelector(".overlay");

//// FUNCTIONS /////

//////// FUNCTION: Generating random values /////

function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}
function getRandomHslaColor(hueLimit) {
  const getRandomNumberAlpha = (min, max) =>
    (Math.random() * (max - min) + min).toFixed(1);
  const { hue, saturation, lightness, alpha } = {
    hue: getRandomNumber(0, 250),
    saturation: getRandomNumber(25, 80),
    lightness: getRandomNumber(30, 70),
    alpha: getRandomNumberAlpha(1, 1),
  };
  return [hue, saturation, lightness, alpha];
}

function getRandomPosition() {
  const position = [
    `${getRandomNumber(0, 100)}px`,
    `${getRandomNumber(0, 200)}px`,
  ];
  return position;
}

function getRandomScale() {
  const scale = `${getRandomNumber(70, 100)}%`;
  return scale;
}

//////// FUNCTION: Setting random values /////
function setColor(hueLimit) {
  const shapes = document.getElementsByClassName("shape");
  for (let i = 0; i < shapes.length; i++) {
    const [hue, saturation, lightness, alpha] = getRandomHslaColor(hueLimit);
    shapes[i].style.backgroundColor = `hsla(${
      hue + hueLimit
    }, ${saturation}%, ${lightness}%, ${alpha} )`;
  }
}
function matchColor(hueLimit) {
  const [hue, saturation, lightness, alpha] = getRandomHslaColor(hueLimit);
  const colorBg = `hsla(${hue}, ${saturation - 30}%, ${
    lightness + 30
  }%, ${alpha} )`;
  const colorHead = `hsla(${hue}, ${saturation - 30}%, ${
    lightness - 30
  }%, ${alpha} )`;

  body.style.backgroundColor = colorBg;
  header.style.color = colorHead;
  scrollBar.style.scrollbarColor = "red";

  // `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha} )`;
}

function setScale() {
  const shapes = document.getElementsByClassName("shape");
  for (let i = 0; i < shapes.length; i++) {
    const scale = getRandomScale();
    shapes[i].style.scale = scale;
  }
}

function setPosition() {
  const shapes = document.getElementsByClassName("shape");
  for (let i = 0; i < shapes.length; i++) {
    const position = getRandomPosition();
    shapes[i].style.left = position[0];
    shapes[i].style.top = position[1];
  }
}

//////// FUNCTION: Shapes /////

function removeShape(e) {
  e.style.display = "none";
}
function animateShape(e) {
  e.classList.add("clicked");
}

//////// FUNCTION: Content /////

function findID(e) {
  return e.id;
}

function loadContent(shapeId) {
  const imageURLS = [];
  work[shapeId].imgURL.forEach((url) => {
    imageURLS.push(
      `<img class="projectMedia" src="${url}" alt="Eszter Muray ${work[shapeId].title}" />`
    );
  });

  let div = document.createElement("article");

  div.id = "content";

  div.innerHTML = `<h2 id="head">${work[shapeId].title}</h2>
<article class="meta">
 <p class="date">${work[shapeId].meta.date}</p>
 <p class="engagement">${work[shapeId].meta.engagement}</p>
 <p class="client">For ${work[shapeId].meta.client}</p>
</article>
    <p class="blurb">${work[shapeId].blurb}</p>${imageURLS.join(" ")}`;
  contentSection.appendChild(div);
}

function removeContent() {
  let element;
  if ((element = document.getElementById("content"))) {
    element.remove();
  } else {
    console.log("not yet loaded");
  }
}

// function hideBtn() {
//   shuffleBtn.style.display = "none";
// }

//////// FUNCTION: Modal /////
function closeModal() {
  chef.style.display = "none";
}

//// EVENT LISTENERS /////

// table.addEventListener("click", function (e) {
//   if (e.target.classList.contains("shape")) {
//     matchColor(getRandomNumber(0, 150));
//   }
// });

for (let i = 0; i < shapes.length; i++) {
  shapes[i].addEventListener("click", function () {
    animateShape(shapes[i]);
    // removeShape(shapes[i]);
    findID(shapes[i]);
    removeContent();
    setTimeout(() => {
      removeShape(shapes[i]);
    }, "1000");
    loadContent(findID(shapes[i]));
    matchColor(getRandomNumber(0, 150));
    // console.log(i);
    // if (i == 0) {
    //   shuffleBtn.style.display = "none";
    // } else {
    //   shuffleBtn.style.display = "block";
    // }
  });
}

window.addEventListener("load", function () {
  setPosition();
  setColor(getRandomNumber(0, 150));
  setScale();
});

overlay.addEventListener("click", function () {
  chef.classList.add("hidden");
  overlay.classList.add("hidden");
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

//// DATABASE /////

const work = [
  {
    id: "0",
    title: "Insula Lutherana and the Lutheran Museum",
    meta: {
      date: "2013-2015",
      engagement: "Freelance",
      client: "Adam Potzner, Lutheran Museum",
    },
    blurb:
      "Making the Lutheran Complex (situated on the main square of Budapest) visible, by initiating a dialogue with the city it serves, as well as rebranding the Lutheran Museum in the heart of Budapest.",
    imgURL: [
      "img/insula/insula_1.jpg",
      "img/insula/insula_2.jpg",
      "img/insula/insula_3.jpg",
      "img/insula/insula_4.jpg",
      "img/insula/insula_5.jpg",
      "img/insula/insula_6.jpg",
      "img/insula/insula_8.jpg",
      "img/insula/insula_9.jpg",
    ],
  },
  {
    id: "1",
    title: "Plexopolis",
    meta: {
      date: "2017",
      engagement: "designer at Uniform",
      client: "UCL",
    },
    blurb:
      "Creating an engaging and affordable game for high school students on the topic of urban planning.",

    imgURL: [
      "img/Uniform_plexopolis_H2OH_gif-crop-rotate.gif",

      "img/Uniform-plexopolis-0.jpg",
      "img/Uniform-plexopolis-2.jpg",

      "img/Uniform-plexopolis-11.jpg",

      "img/Uniform-plexopolis-13.jpg",
      "img/Uniform-plexopolis-15.jpg",
    ],
  },
  {
    id: "2",
    title: "All my rivers",
    meta: {
      date: "2020",
      engagement: "Artist in Residence",
      client: "Regensburg",
    },
    blurb:
      "2020 Artist in residence, in Regensburg. On its 2,850km journey the Danube evolves in its shape, size and flow, growing from insignificant to dramatic, oscillating between a slow meander and a harsh rapid. The river behaves like a mobile sculpture, ever changing with the day, season and the weather. It is in fact a mirror in itself, reflecting the shores and the sky above it. It connects several countries, landscapes, and people all with different histories. These multitudes of rivers and connections are hard to observe unless one has the privilege of traveling along its length.<br> The river between Regensburg splits into several streams. The 13m wide island of the Am Beschlächt provides a unique opportunity to observe two very different Danubes simultaneusly. “All my rivers” is interested in highlighting the beauty of the ever evolving river, and contrasting the stagnant  northern stream with the rapid southern, and projecting these two visions of the city and its river into each other.",
    imgURL: [
      "img/Eszter-Muray-All-my-rivers-1.jpg",
      "img/Eszter-Muray-All-my-rivers-2.jpg",
      "img/Eszter-Muray-All-my-rivers-3.jpg",
      "img/Eszter-Muray-All-my-rivers-4.jpg",
      "img/Eszter-Muray-All-my-rivers-5.jpg",
      "img/Eszter-Muray-All-my-rivers-6.jpg",
      "img/Eszter-Muray-All-my-rivers-7.jpg",
      "img/Eszter-Muray-All-my-rivers-8.jpg",
      "img/Eszter-Muray-All-my-rivers-9.jpg",
      "img/Eszter-Muray-All-my-rivers-10.jpg",
      "img/Eszter-Muray-All-my-rivers-11.jpg",
      "img/Eszter-Muray-All-my-rivers-12.jpg",
    ],
  },
  {
    id: "3",
    title: "Petofi Szinhaz",
    meta: {
      date: "2021",
      engagement: "Freelance",
      client: "Potzner Adam, Veszpremi Petofi Szinhaz",
    },
    blurb: "Concept and design for the Petofi theatre's refurbishment.",
    imgURL: [
      "img/veszprem/web_hd_220912_em--0811.jpeg",
      "img/veszprem/Screenshot 2024-08-09 at 11.23.07 am.jpg",
      "img/veszprem/Screenshot 2024-08-09 at 11.23.18 am.jpg",
      "img/veszprem/Screenshot 2024-08-09 at 11.23.30 am.jpg",
      "img/veszprem/Screenshot 2024-08-09 at 11.24.16 am.jpg",
      "img/veszprem/Screenshot 2024-08-09 at 11.24.26 am.jpg",
    ],
  },
  {
    id: "4",
    title: "Cinemachines",
    meta: {
      date: "2019",
      engagement: "ArtEZ University",
      client: "-",
    },
    blurb: "Games for children using projectors.",
    imgURL: [
      "img/cinemachines/DSC_9139.JPG",
      "img/cinemachines/IMG_0334.jpg",
      "img/cinemachines/IMG_0442.jpg",
      "img/cinemachines/IMG_0540.jpg",
      "img/cinemachines/IMG_0543.jpg",
      "img/cinemachines/IMG_0546.jpg",
    ],
  },
  {
    id: "5",
    title: "Animorph",
    meta: {
      date: "2021-ongoing",
      engagement: "Member",
      client: "Animorph co-op",
    },
    blurb: "Brand, website and outreach gifts",
    imgURL: [
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
  },
];

// {
//     title: "",
//     blurb1: "",
//     imgName1: "",
//     imgName2: "",
//     imgName3: "",
//   }

// class Project {
//   constructor(title, meta, intro, imgs) {
//     this.values = [r, g, b];
//   }
//   get red() {
//     return this.values[0];
//   }
//   set red(value) {
//     this.values[0] = value;
//   }
// }

// const work2 = [
//   new Project(255, 0, 0),
//   new Project(255, 0, 0),
//   new Project(255, 0, 0),
// ];

// function preload_image(im_url) {
//   let img = new Image();
//   img.src = im_url;
// }

// preload_image("img/Eszter-Muray-All-my-rivers-1.JPG");
// preload_image("img/Eszter-Muray-All-my-rivers-2.JPG");
// preload_image("img/Eszter-Muray-All-my-rivers-3.JPG");
// preload_image("img/Eszter-Muray-All-my-rivers-4.JPG");


function Work(id, title, meta, eye) {
  this.id = id;
  this.title = title;
  this.meta = meta:{
    
  };
  this.eyeColor = eye;

  : "5",
    title: "Animorph",
    meta: {
      date: "2021-ongoing",
      engagement: "Member",
      client: "Animorph co-op",
    },
    blurb: "Brand, website and outreach gifts",
    imgURL: 
}