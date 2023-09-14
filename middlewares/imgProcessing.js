const sharp = require("sharp");

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

module.exports = { resizeUserPhoto };
