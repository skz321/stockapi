const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  createStrategy,
  getAllStrategies,
  getStrategyById,
  updateStrategy,
  deleteStrategy,
} = require('../controllers/strategies.controller');

router.use(authenticate);

router.post('/', createStrategy);
router.get('/', getAllStrategies);
router.get('/:id', getStrategyById);
router.put('/:id', updateStrategy);
router.delete('/:id', deleteStrategy);

module.exports = router;
