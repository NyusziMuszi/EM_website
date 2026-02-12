"use strict";

const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
const { PROJECTS } = require("./seed-data");

const dbDir = __dirname;
const dbPath = path.join(dbDir, "portfolio.sqlite");

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      engagement TEXT NOT NULL,
      client TEXT NOT NULL,
      blurb TEXT NOT NULL,
      shape TEXT NOT NULL UNIQUE,
      sort_order INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS project_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      image_url TEXT NOT NULL,
      sort_order INTEGER NOT NULL,
      FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
    );
  `);

  const projectCount =
    db.prepare("SELECT COUNT(*) AS count FROM projects").get().count || 0;

  if (projectCount > 0) {
    return;
  }

  const insertProject = db.prepare(`
    INSERT INTO projects (title, date, engagement, client, blurb, shape, sort_order)
    VALUES (@title, @date, @engagement, @client, @blurb, @shape, @sortOrder)
  `);
  const insertImage = db.prepare(`
    INSERT INTO project_images (project_id, image_url, sort_order)
    VALUES (?, ?, ?)
  `);

  const seed = db.transaction(() => {
    for (const project of PROJECTS) {
      const info = insertProject.run(project);
      const projectId = info.lastInsertRowid;
      project.images.forEach((image, idx) => {
        insertImage.run(projectId, image, idx + 1);
      });
    }
  });

  seed();
}

function getProjects() {
  const projectRows = db
    .prepare(
      `
      SELECT id, title, date, engagement, client, blurb, shape
      FROM projects
      ORDER BY sort_order
    `
    )
    .all();

  const imageRows = db
    .prepare(
      `
      SELECT project_id, image_url
      FROM project_images
      ORDER BY sort_order
    `
    )
    .all();

  const imagesByProject = new Map();
  for (const row of imageRows) {
    const current = imagesByProject.get(row.project_id) || [];
    current.push(row.image_url);
    imagesByProject.set(row.project_id, current);
  }

  return projectRows.map((project) => ({
    title: project.title,
    meta: {
      date: project.date,
      engagement: project.engagement,
      client: project.client
    },
    blurb: project.blurb,
    shape: project.shape,
    imgURL: imagesByProject.get(project.id) || []
  }));
}

module.exports = { initDb, getProjects };
