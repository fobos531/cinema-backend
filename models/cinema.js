/* eslint-disable max-len */
// Pretpostavljamo da svako kino ima samo jednu dvoranu, pa prema tome ne kreiramo i modele za dvorane za prikazivanje itd.
const mongoose = require('mongoose');
const uniqueValdiator = require('mongoose-unique-validator');

const cinemaSchema = {
  name: {
    type: String,
    required: true,
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
};

cinemaSchema.plugin(uniqueValdiator);

module.exports = mongoose.Model('Cinema', cinemaSchema);
