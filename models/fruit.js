const mongoose = require("mongoose");

// Define the fruit Schema
// For our fruit model, we want to keep it simple. We’ll have two properties: name, which will be a string, and isReadyToEat, which will be a boolean
const fruitSchema = new mongoose.Schema({
  // Schema is a class
  name: String,
  isReadyToEat: Boolean,
});

// To create a model, we use the mongoose.model method. This method takes two arguments: the name of the model and the schema to apply to that model.
// A model in Mongoose serves as a constructor for creating new documents, and it also enforces the structure defined in the schema.
const Fruit = mongoose.model("Fruit", fruitSchema); // create Fruit model

// export the Fruit model
module.exports = Fruit;
