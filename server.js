"use strict";

const path = require("path");
const express = require("express");
const { initDb, getProjects } = require("./db/client");

const app = express();
const PORT = process.env.PORT || 3000;
const rootDir = __dirname;

initDb();

app.get("/api/projects", (req, res) => {
  res.json({ projects: getProjects() });
});

app.use(express.static(rootDir));

app.get("/", (req, res) => {
  res.sendFile(path.join(rootDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Portfolio running at http://localhost:${PORT}`);
});
