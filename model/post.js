const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Animal = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  ordo: {
    type: String,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectID,
    ref: 'users',
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model('animals', Animal);
