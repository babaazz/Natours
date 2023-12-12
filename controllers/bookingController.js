const stripe = require("stripe")(
  "sk_test_51O3D7WSCACbn52m3kRPEgRwKIyKjYEgtbu52ck09Z9KfYJ5MbBd9UKAUFBIW9foP0pZKXsrJdEt0kyJ4iaOqZDtc00mXvdvqkk"
);

const Tour = require("../models/Tour");
const catchAsync = require("../utils/catchAsync");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  //Get the tour to book
  const tour = await Tour.findById(req.params.tourId);

  //Create Session
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
    line_items: [
      {
        price: tour.price * 100,
        quantity: 1,
      },
    ],
  });

  //Send Session as response
  res.status(200).json({
    status: "Success",
    session,
  });
});
