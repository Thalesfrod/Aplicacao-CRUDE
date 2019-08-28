const express = require("express");
const server = express();

server.use(express.json());

const projects = [{ id: "1", title: "Novo projeto" }];

//Middleware local
//Verifica a existencia do id
function checkIdExsist(req, res, next) {
  const { id } = req.params;
  let idExist = false;
  for (let i = 0; i < projects.length; i++) {
    if (projects[i].id === id) {
      idExist = true;
      return next();
    }
  }
  if (!idExist) {
    return res.status(400).json({ error: "informed Id doesn't exist" });
  }
}
//Middleware Global
//Conta e exibe a quantidade de requisições
let contUse = 0;
server.use((req, res, next) => {
  contUse++;
  console.log(`${contUse} requests have been made.`);
  next();
});

//lista todos os projetos
server.get("/projects", (req, res) => {
  return res.json(projects);
});

//cria um novo projeto
server.post("/projects", (req, res) => {
  const { project } = req.body;
  const { id } = req.body;
  let doubleId = false;
  //verifica se o id já existe
  for (let i = 0; i < projects.length; i++) {
    if (projects[i].id === id) {
      return res.status(400).json({ error: "Id already exist." });
    }
  }
  projects.push(req.body);
  return res.json(projects);
});

//altera o nome do projeto
server.put("/projects/:id", checkIdExsist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  //percorre todos os objetos do array projeto procurando o id
  for (let i = 0; i < projects.length; i++) {
    if (projects[i].id === id) {
      projects[i].title = title;
    }
  }
  return res.json(projects);
});

//deleta o projeto
server.delete("/projects/:id", checkIdExsist, (req, res) => {
  const { id } = req.params;
  //percorre todos os objetos do array projeto procurando o id
  for (let i = 0; i < projects.length; i++) {
    if (projects[i].id === id) {
      projects.splice(i, 1);
    }
  }
  return res.json(projects);
});

//cria uma nova tarefa em um projeto existente
server.post("/projects/:id/tasks", checkIdExsist, (req, res) => {
  const { id } = req.params;
  const { tasks } = req.body;
  for (let i = 0; i < projects.length; i++) {
    if (projects[i].id === id) {
      //verifica se já existe o vetor tasks, caso contário cria um
      if (projects[i].tasks == undefined) {
        projects[i].tasks = [tasks];
      } else {
        projects[i].tasks.push(tasks);
      }
    }
  }
  return res.json(projects);
});

server.listen(3000);
