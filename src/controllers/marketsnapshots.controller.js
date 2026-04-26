const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function validateSnapshotBody(body) {
  const errors = [];
  const { symbol, price, timestamp } = body;

  if (!symbol || typeof symbol !== 'string' || symbol.trim() === '') {
    errors.push('symbol is required');
  }
  if (price === undefined || price === null || isNaN(Number(price)) || Number(price) <= 0) {
    errors.push('price must be a positive number');
  }
  if (!timestamp || isNaN(Date.parse(timestamp))) {
    errors.push('timestamp must be a valid ISO date string');
  }

  return errors;
}

async function createSnapshot(req, res) {
  const errors = validateSnapshotBody(req.body);
  if (errors.length > 0) return res.status(400).json({ errors });

  const { symbol, price, ema, timestamp } = req.body;

  const snapshot = await prisma.marketSnapshot.create({
    data: {
      symbol: symbol.trim().toUpperCase(),
      price: Number(price),
      ema: ema !== undefined && ema !== null ? Number(ema) : null,
      timestamp: new Date(timestamp),
    },
  });

  return res.status(201).json(snapshot);
}

async function getAllSnapshots(req, res) {
  const { symbol } = req.query;
  const where = symbol ? { symbol: symbol.trim().toUpperCase() } : {};

  const snapshots = await prisma.marketSnapshot.findMany({
    where,
    orderBy: { timestamp: 'desc' },
  });

  return res.status(200).json(snapshots);
}

async function getSnapshotById(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'ID must be a positive integer' });
  }

  const snapshot = await prisma.marketSnapshot.findUnique({ where: { id } });
  if (!snapshot) return res.status(404).json({ error: 'Market snapshot not found' });

  return res.status(200).json(snapshot);
}

async function updateSnapshot(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'ID must be a positive integer' });
  }

  const snapshot = await prisma.marketSnapshot.findUnique({ where: { id } });
  if (!snapshot) return res.status(404).json({ error: 'Market snapshot not found' });

  const errors = validateSnapshotBody(req.body);
  if (errors.length > 0) return res.status(400).json({ errors });

  const { symbol, price, ema, timestamp } = req.body;

  const updated = await prisma.marketSnapshot.update({
    where: { id },
    data: {
      symbol: symbol.trim().toUpperCase(),
      price: Number(price),
      ema: ema !== undefined && ema !== null ? Number(ema) : null,
      timestamp: new Date(timestamp),
    },
  });

  return res.status(200).json(updated);
}

async function deleteSnapshot(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'ID must be a positive integer' });
  }

  const snapshot = await prisma.marketSnapshot.findUnique({ where: { id } });
  if (!snapshot) return res.status(404).json({ error: 'Market snapshot not found' });

  await prisma.marketSnapshot.delete({ where: { id } });
  return res.status(204).send();
}

module.exports = { createSnapshot, getAllSnapshots, getSnapshotById, updateSnapshot, deleteSnapshot };
