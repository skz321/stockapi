const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function validateStrategyBody(body) {
  const errors = [];
  const { name } = body;
  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('name is required');
  }
  return errors;
}

async function createStrategy(req, res) {
  const errors = validateStrategyBody(req.body);
  if (errors.length > 0) return res.status(400).json({ errors });

  const { name, description } = req.body;

  const strategy = await prisma.strategy.create({
    data: {
      userId: req.user.id,
      name: name.trim(),
      description: description || null,
    },
  });

  return res.status(201).json(strategy);
}

async function getAllStrategies(req, res) {
  const strategies = await prisma.strategy.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
  });
  return res.status(200).json(strategies);
}

async function getStrategyById(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'ID must be a positive integer' });
  }

  const strategy = await prisma.strategy.findUnique({ where: { id } });
  if (!strategy) return res.status(404).json({ error: 'Strategy not found' });
  if (strategy.userId !== req.user.id) return res.status(403).json({ error: 'Access denied' });

  return res.status(200).json(strategy);
}

async function updateStrategy(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'ID must be a positive integer' });
  }

  const strategy = await prisma.strategy.findUnique({ where: { id } });
  if (!strategy) return res.status(404).json({ error: 'Strategy not found' });
  if (strategy.userId !== req.user.id) return res.status(403).json({ error: 'Access denied' });

  const errors = validateStrategyBody(req.body);
  if (errors.length > 0) return res.status(400).json({ errors });

  const { name, description } = req.body;

  const updated = await prisma.strategy.update({
    where: { id },
    data: {
      name: name.trim(),
      description: description !== undefined ? description : strategy.description,
    },
  });

  return res.status(200).json(updated);
}

async function deleteStrategy(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'ID must be a positive integer' });
  }

  const strategy = await prisma.strategy.findUnique({ where: { id } });
  if (!strategy) return res.status(404).json({ error: 'Strategy not found' });
  if (strategy.userId !== req.user.id) return res.status(403).json({ error: 'Access denied' });

  await prisma.strategy.delete({ where: { id } });
  return res.status(204).send();
}

module.exports = { createStrategy, getAllStrategies, getStrategyById, updateStrategy, deleteStrategy };
