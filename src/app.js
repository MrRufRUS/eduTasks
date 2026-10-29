import express from "express";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = 3000;

// const AUTHOR = "7c540331-e84d-451a-bd11-4b1c367bb66d";
const AUTHOR = "mrrufrus"

const fetchPath = fileURLToPath(
  new URL("../public/fetch.html", import.meta.url),
);

// Глобальные HTTP-заголовки
app.use((req, res, next) => {
  res.setHeader("X-Author", AUTHOR);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "x-test,ngrok-skip-browser-warning,Content-Type,Accept,Access-Control-Allow-Headers",
  );
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

app.get("/hour/", (req, res) => {
  const date = new Date();

  res.type("text/plain");
  res.status(200).send(
    new Intl.DateTimeFormat("en-GB", {
      timeStyle: "short",
      timeZone: "Europe/Moscow",
    })
      .format(date)
      .slice(0, 2),
  );
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
  res
    .status(200)
    .send(
      "function task(x) {\n" +
        '\treturn new Promise((res, rej) => (x < 18 ? res("yes") : rej("no")));\n' +
        "}",
    );
});

// GET /fetch/
app.get("/fetch/", (req, res) => {
  res.status(200).sendFile(fetchPath);
});

// Все методы /result4/: тело сохраняется как текст независимо от Content-Type.
app.all("/result4/", express.text({ type: () => true }), (req, res) => {
  const response = {
    message: AUTHOR,
    "x-result": req.get("x-test") ?? "",
    "x-body": req.body ?? "",
  };
  res.status(200).json(response);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
