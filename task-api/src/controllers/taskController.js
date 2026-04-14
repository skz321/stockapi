// Controller layer: handles request/response logic

const taskService = require("../services/taskService");

function getTasks(req, res) {
  const { completed } = req.query;

  // Convert string to boolean if present, otherwise undefined
  let completedFilter;
  if (completed === "true") {
    completedFilter = true;
  } else if (completed === "false") {
    completedFilter = false;
  } else {
    completedFilter = undefined;
  }

  const tasks = taskService.getTasks(completedFilter);
  res.status(200).json(tasks);
}

module.exports = { getTasks };
