const express = require('express');
const router = express.Router();
const { authenticate, adminOnly } = require('../middleware/auth');
const {
  createSnapshot,
  getAllSnapshots,
  getSnapshotById,
  updateSnapshot,
  deleteSnapshot,
} = require('../controllers/marketsnapshots.controller');

// GET all and GET by ID are available to any authenticated user
router.get('/', authenticate, getAllSnapshots);
router.get('/:id', authenticate, getSnapshotById);

// POST, PUT, DELETE require admin role
router.post('/', authenticate, adminOnly, createSnapshot);
router.put('/:id', authenticate, adminOnly, updateSnapshot);
router.delete('/:id', authenticate, adminOnly, deleteSnapshot);

module.exports = router;
