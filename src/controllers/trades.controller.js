const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const VALID_TYPES = ['CALL', 'PUT', 'STOCK'];

function validateTradeBody(body) {
  const errors = [];
  const { symbol, type, entryPrice, quantity, entryDate } = body;

  if (!symbol || typeof symbol !== 'string' || symbol.trim() === '') {
    errors.push('symbol is required');
  }
  if (!type || !VALID_TYPES.includes(type)) {
    errors.push('type must be one of: CALL, PUT, STOCK');
  }
  if (entryPrice === undefined || entryPrice === null || isNaN(Number(entryPrice)) || Number(entryPrice) <= 0) {
    errors.push('entryPrice must be a positive number');
  }
  if (quantity === undefined || quantity === null || !Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
    errors.push('quantity must be a positive integer');
  }
  if (!entryDate || isNaN(Date.parse(entryDate))) {
    errors.push('entryDate must be a valid ISO date string');
  }

  return errors;
}

async function createTrade(req, res) {
  const errors = validateTradeBody(req.body);
  if (errors.length > 0) return res.status(400).json({ errors });

  const { symbol, type, entryPrice, exitPrice, quantity, entryDate, exitDate, notes, strategyId } = req.body;

  if (strategyId !== undefined && strategyId !== null) {
    const strategy = await prisma.strategy.findUnique({ where: { id: Number(strategyId) } });
    if (!strategy) return res.status(404).json({ error: 'Strategy not found' });
    if (strategy.userId !== req.user.id) return res.status(403).json({ error: 'Cannot use a strategy you do not own' });
  }

  const trade = await prisma.trade.create({
    data: {
      userId: req.user.id,
      strategyId: strategyId ? Number(strategyId) : null,
      symbol: symbol.trim().toUpperCase(),
      type,
      entryPrice: Number(entryPrice),
      exitPrice: exitPrice !== undefined && exitPrice !== null ? Number(exitPrice) : null,
      quantity: Number(quantity),
      entryDate: new Date(entryDate),
      exitDate: exitDate ? new Date(exitDate) : null,
      notes: notes || null,
    },
  });

  return res.status(201).json(trade);
}

async function getAllTrades(req, res) {
  const trades = await prisma.trade.findMany({
    where: { userId: req.user.id },
    orderBy: { entryDate: 'desc' },
  });
  return res.status(200).json(trades);
}

async function getTradeById(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'ID must be a positive integer' });
  }

  const trade = await prisma.trade.findUnique({ where: { id } });
  if (!trade) return res.status(404).json({ error: 'Trade not found' });
  if (trade.userId !== req.user.id) return res.status(403).json({ error: 'Access denied' });

  return res.status(200).json(trade);
}

async function updateTrade(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'ID must be a positive integer' });
  }

  const trade = await prisma.trade.findUnique({ where: { id } });
  if (!trade) return res.status(404).json({ error: 'Trade not found' });
  if (trade.userId !== req.user.id) return res.status(403).json({ error: 'Access denied' });

  const errors = validateTradeBody(req.body);
  if (errors.length > 0) return res.status(400).json({ errors });

  const { symbol, type, entryPrice, exitPrice, quantity, entryDate, exitDate, notes, strategyId } = req.body;

  if (strategyId !== undefined && strategyId !== null) {
    const strategy = await prisma.strategy.findUnique({ where: { id: Number(strategyId) } });
    if (!strategy) return res.status(404).json({ error: 'Strategy not found' });
    if (strategy.userId !== req.user.id) return res.status(403).json({ error: 'Cannot use a strategy you do not own' });
  }

  const updated = await prisma.trade.update({
    where: { id },
    data: {
      strategyId: strategyId !== undefined ? (strategyId ? Number(strategyId) : null) : trade.strategyId,
      symbol: symbol.trim().toUpperCase(),
      type,
      entryPrice: Number(entryPrice),
      exitPrice: exitPrice !== undefined && exitPrice !== null ? Number(exitPrice) : null,
      quantity: Number(quantity),
      entryDate: new Date(entryDate),
      exitDate: exitDate ? new Date(exitDate) : null,
      notes: notes || null,
    },
  });

  return res.status(200).json(updated);
}

async function deleteTrade(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'ID must be a positive integer' });
  }

  const trade = await prisma.trade.findUnique({ where: { id } });
  if (!trade) return res.status(404).json({ error: 'Trade not found' });
  if (trade.userId !== req.user.id) return res.status(403).json({ error: 'Access denied' });

  await prisma.trade.delete({ where: { id } });
  return res.status(204).send();
}

module.exports = { createTrade, getAllTrades, getTradeById, updateTrade, deleteTrade };
