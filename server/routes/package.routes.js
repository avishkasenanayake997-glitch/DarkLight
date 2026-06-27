const express = require('express');
const router = express.Router();
const { getPackages, getPackage, createPackage, updatePackage, deletePackage } = require('../controllers/packageController');
const { protect, requireAdmin } = require('../middleware/auth');

router.get('/', getPackages);
router.get('/:id', getPackage);
router.post('/', protect, requireAdmin, createPackage);
router.put('/:id', protect, requireAdmin, updatePackage);
router.delete('/:id', protect, requireAdmin, deletePackage);

module.exports = router;
