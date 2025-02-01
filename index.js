const express = require("express");
const app = express();
const port = 3000;
const { v4: uuid } = require("uuid");

app.use(express.urlencoded({ extended: true })); //to parse data coming from url
app.use(express.json()); // to parse data come as json

const path = require("path"); // path module
const methodOveride = require("method-override");
app.use(methodOveride("_method"));
app.use(express.static(path.join(__dirname, "/public"))); // static asset location
//template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views")); // views folder

// comments data

var comments = [
  {
    id: uuid(),
    username: "Farhan",
    comment: "love the music",
  },
  {
    id: uuid(),
    username: "Dipto",
    comment: "10/10 animation",
  },
  {
    id: uuid(),
    username: "Nishan",
    comment: "anime of the year",
  },
];

// routes
//all comments
app.get("/comments", (req, res) => {
  res.render("comments/index", { comments });
});

// post comment page
app.get("/comments/new", (req, res) => {
  res.render("comments/new");
});

// recieve data send in url and push in array

app.post("/comments", (req, res) => {
  const { username, comment } = req.body;
  comments.push({ username, comment, id: uuid() });
  res.redirect("/comments");
});

// view single comment
app.get("/comments/:id", (req, res) => {
  const { id } = req.params;
  const found = comments.find((e) => e.id === id);
  res.render("comments/single", { ...found });
});

//update single comment

app.patch("/comments/:id", (req, res) => {
  const { id } = req.params;
  const updated = req.body.comment;
  const index = comments.find(function (e) {
    if (e.id === id) {
      return e;
    }
  });
  index.comment = updated;
  res.redirect(303, "/comments");
});

// edit comment

app.get("/comments/:id/edit", (req, res) => {
  const { id } = req.params;
  const found = comments.find((e) => e.id === id);
  res.render("comments/edit", { ...found });
});

// delete a comment

app.delete("/comments/:id", (req, res) => {
  const { id } = req.params;
  comments = comments.filter((e) => e.id !== id);
  res.redirect("/comments");
});

app.get("*", (req, res) => {
  res.send("error 404 : not found");
});

app.listen(port, () => console.log("server is running..."));
