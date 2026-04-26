const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data in dependency order
  await prisma.trade.deleteMany();
  await prisma.strategy.deleteMany();
  await prisma.marketSnapshot.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const traderPassword = await bcrypt.hash('Trader123!', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const trader = await prisma.user.create({
    data: {
      email: 'trader@example.com',
      password: traderPassword,
      role: 'USER',
    },
  });

  console.log(`Created users: ${admin.email}, ${trader.email}`);

  const strategy1 = await prisma.strategy.create({
    data: {
      userId: trader.id,
      name: 'EMA Bounce',
      description: '50 EMA support entries on high-volume days',
    },
  });

  const strategy2 = await prisma.strategy.create({
    data: {
      userId: trader.id,
      name: 'Earnings Play',
      description: 'Options plays around earnings announcements',
    },
  });

  const adminStrategy = await prisma.strategy.create({
    data: {
      userId: admin.id,
      name: 'Admin Iron Condor',
      description: 'Neutral range-bound strategy using iron condors',
    },
  });

  console.log(`Created strategies: ${strategy1.name}, ${strategy2.name}, ${adminStrategy.name}`);

  await prisma.trade.createMany({
    data: [
      {
        userId: trader.id,
        strategyId: strategy1.id,
        symbol: 'SPY',
        type: 'CALL',
        entryPrice: 2.50,
        exitPrice: 4.80,
        quantity: 10,
        entryDate: new Date('2025-01-10T09:30:00Z'),
        exitDate: new Date('2025-01-12T15:00:00Z'),
        notes: 'Clean bounce off 50 EMA',
      },
      {
        userId: trader.id,
        strategyId: strategy1.id,
        symbol: 'QQQ',
        type: 'PUT',
        entryPrice: 3.20,
        exitPrice: 1.10,
        quantity: 5,
        entryDate: new Date('2025-01-15T10:00:00Z'),
        exitDate: new Date('2025-01-17T14:30:00Z'),
        notes: 'Stopped out below support',
      },
      {
        userId: trader.id,
        strategyId: strategy2.id,
        symbol: 'AAPL',
        type: 'CALL',
        entryPrice: 5.00,
        exitPrice: null,
        quantity: 2,
        entryDate: new Date('2025-02-01T09:45:00Z'),
        exitDate: null,
        notes: 'Open position ahead of earnings',
      },
      {
        userId: trader.id,
        strategyId: null,
        symbol: 'TSLA',
        type: 'STOCK',
        entryPrice: 245.00,
        exitPrice: 268.50,
        quantity: 100,
        entryDate: new Date('2025-01-20T09:30:00Z'),
        exitDate: new Date('2025-01-25T15:45:00Z'),
        notes: null,
      },
      {
        userId: admin.id,
        strategyId: adminStrategy.id,
        symbol: 'SPX',
        type: 'CALL',
        entryPrice: 8.50,
        exitPrice: 0.10,
        quantity: 1,
        entryDate: new Date('2025-01-05T09:30:00Z'),
        exitDate: new Date('2025-01-19T15:00:00Z'),
        notes: 'Upper strike expired worthless - profit',
      },
    ],
  });

  console.log('Created sample trades');

  await prisma.marketSnapshot.createMany({
    data: [
      {
        symbol: 'SPY',
        price: 480.25,
        ema: 475.10,
        timestamp: new Date('2025-01-10T09:30:00Z'),
      },
      {
        symbol: 'SPY',
        price: 483.10,
        ema: 476.20,
        timestamp: new Date('2025-01-11T09:30:00Z'),
      },
      {
        symbol: 'QQQ',
        price: 415.50,
        ema: 410.80,
        timestamp: new Date('2025-01-10T09:30:00Z'),
      },
      {
        symbol: 'QQQ',
        price: 418.75,
        ema: 411.90,
        timestamp: new Date('2025-01-11T09:30:00Z'),
      },
      {
        symbol: 'AAPL',
        price: 185.20,
        ema: 182.50,
        timestamp: new Date('2025-02-01T09:30:00Z'),
      },
      {
        symbol: 'TSLA',
        price: 250.00,
        ema: 240.00,
        timestamp: new Date('2025-01-20T09:30:00Z'),
      },
    ],
  });

  console.log('Created sample market snapshots');
  console.log('Seeding complete!');
  console.log('');
  console.log('Login credentials:');
  console.log('  Admin  → email: admin@example.com   | password: Admin123!');
  console.log('  Trader → email: trader@example.com  | password: Trader123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
