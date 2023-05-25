const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const deletedDoc = await Model.findByIdAndDelete(id);

    if (!deletedDoc) {
      throw new AppError(`No document found with id ${id}!!`, 404);
    }

    res.status(204).json({
      status: "Success",
      message: `tour has been deleted`,
    });
  });

const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const updatedDoc = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedDoc) {
      throw new AppError(`No document found with id ${id}!!`, 404);
    }

    res.status(200).json({
      status: "success",
      data: {
        data: updatedDoc,
      },
      message: "Document has been updated",
    });
  });

const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create({
      ...req.body,
    });
    res.status(201).json({
      status: "success",
      data: {
        data: newDoc,
      },
      message: "New document has been created",
    });
  });

const getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    let query = Model.findById(id);

    if (populateOptions) {
      query.populate(populateOptions);
    }

    const doc = await query.exec();
    if (!doc) {
      throw new AppError(`No document found with id ${id}!!`, 404);
    }
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const query = Model.find();
    const features = new APIFeatures(query, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query.exec();

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });

module.exports = { deleteOne, updateOne, createOne, getOne, getAll };
