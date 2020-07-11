// Pretpostavljamo da svako kino ima samo jednu dvoranu, pa prema tome ne kreiramo i modele za dvorane za prikazivanje itd.
const mongoose = require('mongoose');


const cinemaSchema = {
  name: {
    type: String,
    required: true,
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

module.exports = mongoose.Model('Cinema', cinemaSchema)
