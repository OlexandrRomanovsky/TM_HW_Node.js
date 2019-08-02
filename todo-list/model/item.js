const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const todoSchema = new Schema({
  id: Number,
  text: String,
  done: {type: Boolean, default: false}
});

module.exports = mongoose.model('Todo', todoSchema);