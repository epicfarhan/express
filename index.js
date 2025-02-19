const express = require("express");
const app = express();
const path = require("path");
const methodOver = require("method-override");
const mongoose = require("mongoose");

// product model
const Product = require("./models/product");

mongoose
  .connect("mongodb://localhost:27017/farmstand")
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err);
    console("error encountered");
  });

// set views directory
app.set("views", path.join(__dirname, "/views"));
// set template engine to ejs
app.set("view engine", "ejs");

// serve static files
app.use(express.static("public"));

// parse data coming from url
app.use(express.urlencoded({ extended: true }));

// use http methods like put and delete where its not allowed

app.use(methodOver("_method"));

// fetch all products on products page

//category types
const category = ["fruit", "vegetable"];

app.get("/products", async (req, res) => {
  const { category } = req.query;
  if (category) {
    const product = await Product.find({ category: category });
    res.render("products", { product, category });
  } else {
    const product = await Product.find({});
    res.render("products", { product, category: "Groceries" });
  }
});

// create a new product

app.get("/products/create", (req, res) => {
  res.render("create", { category });
});

//get data from create page

app.post("/create", async (req, res) => {
  const create = await Product.create(req.body);
  console.log(create);
  res.redirect("/products");
});

// fetch a single product and render its page

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const single = await Product.findById(id);
  res.render("details", { single });
});

// edit a single product

app.get("/products/:id/edit", async (req, res) => {
  const { id } = req.params;
  const found = await Product.findById(id);
  res.render("edit", { found, category });
});

// update after editing
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const update = await Product.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });
  res.redirect(`/products/${id}`);
});

// delete a product

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const result = await Product.findByIdAndDelete(id);
  res.redirect("/products");
});
app.listen(7000, () => {
  console.log("server is running...");
});
