const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/bugs", (req, res) => {
  const { titre, description, severite } = req.body;

  if (!titre) {
    return res.status(400).json({ erreur: "Le titre est obligatoire" });
  }

  if (!description) {
    return res.status(400).json({ erreur: "La description est obligatoire" });
  }

  const severitesValides = ["basse", "moyenne", "haute"];
  if (!severitesValides.includes(severite)) {
    return res.status(400).json({ erreur: "Sévérité invalide" });
  }

  const stmt = db.prepare(
    "INSERT INTO bugs (titre, description, severite) VALUES (?, ?, ?)",
  );
  const resultat = stmt.run(titre, description, severite);

  const nouveauBug = db
    .prepare("SELECT * FROM bugs WHERE id = ?")
    .get(resultat.lastInsertRowid);

  res.status(201).json(nouveauBug);
});

router.get("/bugs/:id", (req, res) => {
  const id = req.params.id;
  const bug = db.prepare("SELECT * FROM bugs WHERE id = ?").get(id);

  if (!bug) {
    return res.status(404).json({ erreur: "Ressource non trouvée" });
  }

  res.status(200).json(bug);
});

router.delete("/bugs/:id", (req, res) => {
  const id = req.params.id;
  const bug = db.prepare("SELECT * FROM bugs WHERE id = ?").get(id);

  if (!bug) {
    return res.status(404).json({ erreur: "Ressource non trouvée" });
  }

  db.prepare("DELETE FROM bugs WHERE id = ?").run(id);

  res.status(204).send();
});

router.get("/bugs", (req, res) => {
  const statut = req.query.statut;
  let bugs;

  if (statut) {
    bugs = db.prepare("SELECT * FROM bugs WHERE statut = ?").all(statut);
  } else {
    bugs = db.prepare("SELECT * FROM bugs").all();
  }

  res.status(200).json(bugs);
});

router.patch("/bugs/:id", (req, res) => {
  const id = req.params.id;
  const { statut } = req.body;

  const bug = db.prepare("SELECT * FROM bugs WHERE id = ?").get(id);
  if (!bug) {
    return res.status(404).json({ erreur: "Ressource non trouvée" });
  }

  const statutsValides = ["ouvert", "en_cours", "resolu"];
  if (!statutsValides.includes(statut)) {
    return res.status(400).json({ erreur: "Statut invalide" });
  }

  db.prepare("UPDATE bugs SET statut = ? WHERE id = ?").run(statut, id);

  const bugMisAJour = db.prepare("SELECT * FROM bugs WHERE id = ?").get(id);
  res.status(200).json(bugMisAJour);
});

module.exports = router;
