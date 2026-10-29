import express from "express";

const app = express();
const PORT = 3000;

const AUTHOR = "7c540331-e84d-451a-bd11-4b1c367bb66d";

// Глобальные HTTP-заголовки
app.use((req, res, next) => {
  res.setHeader("X-Author", AUTHOR);
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// GET /
app.get("/", (req, res) => {
  res.type("text/plain");
  res.status(200).send(AUTHOR);
});

// GET /login/
app.get("/login/", (req, res) => {
  res.type("text/plain");
  res.status(200).send(AUTHOR);
});

// GET /sample/
app.get("/sample/", (req, res) => {
  res.type("text/plain");
  res.status(200).send("function task(x) {return x ** x}");
});

// GET /promise/
app.get("/promise/", (req, res) => {
  res.type("text/plain");
  res.setHeader("Content-Disposition", "inline");
  res.status(200).send(
    'function task(x) {\n' +
        '\treturn new Promise((res, rej) => (x < 18 ? rej("no") : res("yes")));\n' +
    '}',
  );
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
