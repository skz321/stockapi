// Service layer: contains business logic

const taskRepository = require("../repositories/taskRepository");

function getTasks(completedFilter) {
  // completedFilter is either true, false, or undefined
  return taskRepository.findAll(completedFilter);
}

module.exports = { getTasks };
