const Joi = require("joi");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
let todoList = require("./data");
let uniqid = require("uniqid");
var jwt = require("jsonwebtoken");

const todo = {
  id: uniqid(),
  text: "",
  done: false
};

app.use(bodyParser.json());

app.get("/", getTodos);
app.post("/todos", addTodo);
app.delete("/todos/:id", removeTodo);
app.patch("/todos/:id/done", markDone);
app.patch("/todos/:id/undone", markUndone);

;function getTodos(req, res) {
  if (todoList.length === 0) return res.status(404).send("Data base is void");
  res.json(todoList);
}

function addTodo(req, res) {
  const schema = {
    text: Joi.string()
      .min(1)
      .required()
  };
  const result = Joi.validate(req.body, schema);
  console.log("result =>", result);
  result.error && res.status(400).send(result.error.details[0].message);

  const newTodo = Object.assign({}, todo, req.body);
  res.json(newTodo);
  todoList.push(newTodo);
  res.send(`Updated task`);
}

function removeTodo(req, res) {
  const id = req.params.id;
  const schema = {
    id: Joi.string()
      .min(1)
      .required()
  };
  const result = Joi.validate(req.params, schema);
  result.error && res.status(400).send(result.error.details[0].message);
  let bool = todoList.findIndex(todo => +todo.id === +id);
  if (bool === -1) return res.status(400).send("Try another id");
  todoList = todoList.filter(todo => todo.id !== id);
  res.send(`Removed task id: ${id}`);
}

function markDone(req, res) {
  const id = req.params.id;
  todoList.forEach(todo => {
    if (todo.id === id) {
      todo.done = true;
    }
  });
  let markExists = todoList.filter(todo => todo.id === id);
  if (markExists.length === 0) return res.status(400).send("Try another id");
  res.send(`Done task id: ${id}`);
}

function markUndone(req, res) {
  const id = req.params.id;
  todoList.forEach(todo => {
    if (todo.id === id) {
      todo.done = false;
    }
  });
  let markExists = todoList.filter(todo => todo.id === id);
  if (markExists.length === 0) return res.status(400).send("Try another id");
  res.send(`Undone task id: ${id}`);
}

app.post('/api/posts', verifyToken, (req, res) => {  
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: 'Post created...',
        authData
      });
    }
  });
});

app.post("/api/login", (req, res) => {
  const user = {
    id: 10,
    name: "Tom",
    email: "tom@mail.com"
  }

  jwt.sign({user}, "sekretkey", (err, token) => {
    res.json({
      token
    })
  }) 
})

function verifyToken (req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if(typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403)
  }
}


const port = process.env.Port || 2000;

app.listen(port, function() {
  console.log("Listen port", port);
});
