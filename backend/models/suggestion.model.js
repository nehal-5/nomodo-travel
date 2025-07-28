const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const suggestionSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  image: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
});

const Suggestion = mongoose.model('Suggestion', suggestionSchema);

module.exports = Suggestion;
