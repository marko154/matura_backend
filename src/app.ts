import express from "express";
const app = express();
const port = 3000;

app.get("/", (_, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  // tslint:disable-next-line no-console
  return console.log(`Express is listening at http://localhost:${port}`);
});
