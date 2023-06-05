const { Schema, model } = require("mongoose");

const bookSchema = new Schema(
  {
    title: String,
    description: String,
    author: String,
    rating: Number,
  },
  {
    timestamps: true,//to store when the document is created
  }
);
//const Pizza = mongoose.model("Pizza", pizzaSchema);
//module.exports = Pizza;
module.exports = model("Book", bookSchema);
