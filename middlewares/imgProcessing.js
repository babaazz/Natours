const sharp = require("sharp");
const catchAsync = require("../utils/catchAsync");

const resizeUserPhoto = (req, res, next) => {
  if (!req.file) next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};

const resizeTourPhotos = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  //For Image cover
  req.body.imageCover = `tour-${req.params.id}-${Date.now}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .toFile(`public/img/tours/${req.body.imageCover}`);

  //For Images
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}-jpeg`;
      await sharp(req.files.images[i].buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    })
  );
  next();
});

module.exports = { resizeUserPhoto, resizeTourPhotos };
