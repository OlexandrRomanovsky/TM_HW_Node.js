const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 2000;
let todoList = require('./data');

app.use(bodyParser.json());

app.get("/todos", getTodos);
app.post("/todos", addTodo);
app.delete("/todos/:id", removeTodo);
app.patch("/todos/:id/markDone", markDone);
app.patch("/todos/:id/markUndone", markUndone);

function getTodos(req, res) {
  res.json(todoList);
}

function addTodo(req, res) {
  const newTodo = req.body;
  res.json(newTodo);
  todoList.push(newTodo);
}

function removeTodo(req, res) {
  const id = req.params.id;
  todoList = todoList.filter(todo => todo.id !== id);
}

function markDone(req, res) {
  const id = req.params.id;
  todoList.forEach(todo => {
    if (todo.id === id) {
      todo.done = true;
    }
  });
  res.send(`Updated task id: ${id}`);
}

function markUndone(req, res) {
  const id = req.params.id;
  todoList.forEach(todo => {
    if (todo.id === id) {
      todo.done = false;
    }
  });
  res.send(`Updated task id: ${id}`);
}

app.listen(PORT, function() {
  console.log("Listen port", PORT);
});
