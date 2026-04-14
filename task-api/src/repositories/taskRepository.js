// Repository layer: handles data access (in-memory store)

const tasks = [
  { id: 1, title: "Buy groceries", completed: false },
  { id: 2, title: "Walk the dog", completed: true },
  { id: 3, title: "Read a book", completed: false },
  { id: 4, title: "Do laundry", completed: true },
];

function findAll(filter) {
  if (filter === undefined) {
    return tasks;
  }
  return tasks.filter((task) => task.completed === filter);
}

module.exports = { findAll };
