/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
// Pretpostavljamo da svako kino ima samo jednu dvoranu, pa prema tome ne kreiramo i modele za dvorane za prikazivanje itd.
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const cinemaSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  city: {
    type: String,
    required: true,
  },
  postalCode: {
    type: Number,
    required: false,
  },
  image: {
    type: String,
    required: true,
  },
});

cinemaSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
})

cinemaSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Cinema', cinemaSchema);
