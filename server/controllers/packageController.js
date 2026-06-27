const Package = require('../models/Package');

// @desc   Get all packages (public)
// @route  GET /api/packages
// @access Public
const getPackages = async (req, res, next) => {
  try {
    const { active_only } = req.query;
    const query = {};
    if (active_only !== 'false') query.is_active = true;

    const packages = await Package.find(query).sort({ sort_order: 1, price: 1 });
    res.status(200).json({ success: true, packages });
  } catch (error) {
    next(error);
  }
};

// @desc   Get single package
// @route  GET /api/packages/:id
// @access Public
const getPackage = async (req, res, next) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.status(200).json({ success: true, package: pkg });
  } catch (error) {
    next(error);
  }
};

// @desc   Create package
// @route  POST /api/packages
// @access Admin
const createPackage = async (req, res, next) => {
  try {
    const pkg = await Package.create(req.body);
    res.status(201).json({ success: true, package: pkg });
  } catch (error) {
    next(error);
  }
};

// @desc   Update package
// @route  PUT /api/packages/:id
// @access Admin
const updatePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.status(200).json({ success: true, package: pkg });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete package
// @route  DELETE /api/packages/:id
// @access Admin
const deletePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.status(200).json({ success: true, message: 'Package deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPackages, getPackage, createPackage, updatePackage, deletePackage };
