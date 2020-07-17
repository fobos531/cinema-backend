const cinemasRouter = require('express').Router();
const multer = require('multer');
const cloudinary = require('cloudinary');
const Cinema = require('../models/cinema');

const storage = multer.diskStorage({
  filename(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});
const imageFilter = function (req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};
const upload = multer({ storage, fileFilter: imageFilter });

cloudinary.config({
  cloud_name: 'cinemaapp',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

cinemasRouter.post('/', upload.single('image'), (req, res) => {
  console.log(req.body);
  cloudinary.uploader.upload(req.file.path, async (result) => {
    console.log(req.file.path);
    console.log(result);
    const newCinema = new Cinema({
      name: req.body.cinemaName,
      city: req.body.city,
      postalCode: req.body.postalCode,
      image: result.url,
    });
    await newCinema.save();
  });
});

// Get all cinemas
cinemasRouter.get('/', async (req, res) => {
  const allCinemas = await Cinema.find({});
  res.json(allCinemas.map((cinema) => cinema.toJSON()));
});


// Delete cinema
cinemasRouter.delete('/:id', async (request, response) => {
  await Cinema.findOneAndDelete({ _id: request.params.id });
  response.status(204).send({ info: 'cinema deleted' });
});

module.exports = cinemasRouter;
