const mongoose = require("mongoose");
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

Product.create({
  name: "Cabbage",
  price: "4.00",
  category: "vegetable",
})
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
