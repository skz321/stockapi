const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { createTrade, getAllTrades, getTradeById, updateTrade, deleteTrade } = require('../controllers/trades.controller');

router.use(authenticate);

router.post('/', createTrade);
router.get('/', getAllTrades);
router.get('/:id', getTradeById);
router.put('/:id', updateTrade);
router.delete('/:id', deleteTrade);

module.exports = router;
