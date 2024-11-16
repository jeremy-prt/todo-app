const express = require("express");
const router = express.Router();
const sql = require("../config/db");

/// Route sans rien, avec option de filtrage par titre et pagination
router.get("/", (req, res) => {
  const { titre, page = 1, limit = 3, done } = req.query;
  const offset = (page - 1) * limit;

  let countQuery = "SELECT COUNT(*) AS total FROM task";
  if (titre) {
    countQuery += ` WHERE title LIKE "%${titre}%"`;
  }

  sql(countQuery)
    .then((totalResult) => {
      const totalTasks = totalResult[0].total;
      const maxPages = Math.ceil(totalTasks / limit);

      let query = "SELECT * FROM task";

      if (done) {
        query += ` WHERE done = ${done}`;
      }

      if (titre) {
        query += ` WHERE title LIKE "%${titre}%"`;
      }
      if (limit) {
        query += ` LIMIT ${limit} OFFSET ${offset}`;
      }

      // Exécution de la requête pour récupérer les tâches
      return sql(query).then((tasks) => {
        res.json({
          tasks,
          totalTasks,
          maxPages,
          currentPage: parseInt(page),
        });
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Erreur lors de la récupération des tâches");
    });
});

// Route avec ID
router.get("/:id", (req, res) => {
  const taskId = req.params.id;
  sql(`SELECT * FROM task WHERE id = ${taskId}`)
    .then((task) => {
      if (task.length === 0) {
        res.status(404).send("Tâche non trouvée");
      } else {
        res.json(task[0]);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Erreur lors de la récupération de la tâche");
    });
});

// Route pour ajouter une tâche
router.post("/", (req, res) => {
  const { title, description, due_date, type_id } = req.body;
  const query = `INSERT INTO task (title, description, due_date, type_id) VALUES ("${title}", "${description}", "${due_date}", ${type_id})`;

  sql(query)
    .then((result) => {
      const newTaskId = result.insertId;
      const selectQuery = `SELECT * FROM task WHERE id = ${newTaskId}`;
      return sql(selectQuery);
    })
    .then((newTask) => {
      res.status(201).json(newTask);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Erreur lors de la création de la tâche");
    });
});
module.exports = router;
