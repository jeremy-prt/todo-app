var express = require("express");
var router = express.Router();
const { Task, Type } = require("../models");
const { Op } = require("sequelize");

// ALL tâches avec filtrage par titre, done, page
router.get("/", async (req, res) => {
  const { titre, page = 1, limit = 3, done } = req.query;
  const offset = (page - 1) * limit;

  try {
    let where = {};
    if (titre) {
      where.title = { [Op.like]: `%${titre}%` };
    }
    if (done !== undefined) {
      where.done = done === "true";
    }

    const totalTasks = await Task.count({ where });
    const maxPages = Math.ceil(totalTasks / limit);

    const tasks = await Task.findAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      tasks,
      totalTasks,
      maxPages,
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la récupération des tâches");
  }
});

// Route with ID
router.get("/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findByPk(taskId, {
      include: {
        model: Type,
      },
    });
    if (task) {
      res.json(task);
    } else {
      res.status(404).send("Tâche non trouvée");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la récupération de la tâche");
  }
});

// Route pour new task
router.post("/", async (req, res) => {
  try {
    const { title, description, due_date, type_id } = req.body;
    const newTask = await Task.create({
      title,
      description,
      due_date,
      type_id,
    });
    console.log(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la création de la tâche");
  }
});

// Route pour maj avec ID
router.put("/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, description, due_date, type_id, done } = req.body;
    const task = await Task.findByPk(taskId);
    if (task) {
      task.title = title;
      task.description = description;
      task.due_date = due_date;
      task.type_id = type_id;
      task.done = done;
      await task.save();
      res.status(200).json(task);
    } else {
      res.status(404).send("Tâche non trouvée");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la mise à jour de la tâche");
  }
});

// Route pour del avec ID
router.delete("/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findByPk(taskId);
    if (task) {
      await task.destroy();
      res.status(200).json({ message: `Tâche ${taskId} détruite` });
    } else {
      res.status(404).send("Tâche non trouvée");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la suppression de la tâche");
  }
});

module.exports = router;
