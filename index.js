const express = require("express");
const app = express();
const path = require("path");
const methodOver = require("method-override");
const mongoose = require("mongoose");
const appError = require("./error");
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

// error handle function

function fetchError(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((e) => next(e));
  };
}

app.get(
  "/products",
  fetchError(async (req, res) => {
    const { category } = req.query;
    if (category) {
      const product = await Product.find({ category: category });
      res.render("products", { product, category });
    } else {
      const product = await Product.find({});
      res.render("products", { product, category: "Groceries" });
    }
  })
);

// create a new product

app.get("/products/create", (req, res) => {
  res.render("create", { category });
});

//get data from create page

app.post(
  "/create",
  fetchError(async (req, res) => {
    const create = await Product.create(req.body);
    console.log(create);
    res.redirect("/products");
  })
);

// fetch a single product and render its page

app.get(
  "/products/:id",
  fetchError(async (req, res, next) => {
    const { id } = req.params;
    const single = await Product.findById(id);
    res.render("details", { single });
  })
);

// edit a single product

app.get(
  "/products/:id/edit",
  fetchError(async (req, res) => {
    const { id } = req.params;
    const found = await Product.findById(id);
    res.render("edit", { found, category });
  })
);

// update after editing
app.put(
  "/products/:id",
  fetchError(async (req, res) => {
    const { id } = req.params;
    const update = await Product.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    res.redirect(`/products/${id}`);
  })
);

// delete a product

app.delete(
  "/products/:id",
  fetchError(async (req, res) => {
    const { id } = req.params;
    const result = await Product.findByIdAndDelete(id);
    res.redirect("/products");
  })
);

//error handeling middleware

function handleValidationErr(geterr) {
  return new appError(`empty fields${geterr.message}`, 400);
}

app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    err = handleValidationErr(err);
  }
  next(err);
});

app.use((err, req, res, next) => {
  const { status = 500, message = "error something went wrong" } = err;
  res.status(status).send(message);
});

app.listen(7000, () => {
  console.log("server is running...");
});
