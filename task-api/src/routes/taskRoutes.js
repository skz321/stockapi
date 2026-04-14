// Routes layer: maps HTTP requests to controller functions

const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const { validateCompletedParam } = require("../middleware/validateCompletedParam");

// GET /tasks - with optional ?completed=true|false
router.get("/", validateCompletedParam, taskController.getTasks);

module.exports = router;
