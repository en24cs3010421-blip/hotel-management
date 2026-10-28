import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // In-memory backend data stores initialized with realistic data
  let inMemoryBookings: any[] = [];
  let inMemoryHotels: any[] = [];

  // REST API Routes
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'HotelPro MERN Backend', timestamp: new Date().toISOString() });
  });

  // Authentication endpoints
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    // Demo authentication accepting test logins
    const role = email.includes('admin') ? 'admin' : email.includes('staff') ? 'staff' : 'customer';
    const user = {
      _id: `usr-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role,
      loyaltyTier: 'Platinum',
      loyaltyPoints: 12500,
      createdAt: new Date().toISOString(),
    };
    return res.json({
      success: true,
      token: `jwt_token_sample_${user._id}`,
      user,
    });
  });

  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, phone, role } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    const user = {
      _id: `usr-${Date.now()}`,
      name,
      email,
      phone,
      role: role || 'customer',
      loyaltyTier: 'Silver',
      loyaltyPoints: 1000,
      createdAt: new Date().toISOString(),
    };
    return res.status(201).json({
      success: true,
      token: `jwt_token_${user._id}`,
      user,
    });
  });

  // Mock payment processing endpoint
  app.post('/api/payments/process', (req: Request, res: Response) => {
    const { amount, currency = 'USD', cardDetails, bookingId } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid payment amount is required' });
    }

    // Simulate 200ms gateway authorization latency
    setTimeout(() => {
      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      res.json({
        success: true,
        transactionId,
        amount,
        currency,
        status: 'succeeded',
        cardBrand: cardDetails?.cardNumber?.startsWith('4') ? 'Visa' : 'Mastercard',
        last4: cardDetails?.cardNumber ? cardDetails.cardNumber.slice(-4) : '4242',
        receiptUrl: `/receipts/${transactionId}`,
        timestamp: new Date().toISOString(),
      });
    }, 250);
  });

  // Admin stats endpoint
  app.get('/api/admin/metrics', (req: Request, res: Response) => {
    res.json({
      occupancyRate: 84.5,
      averageDailyRate: 745,
      revPAR: 629,
      monthlyRevenueUSD: 362100,
      activeReservations: 42,
      totalRooms: 120,
    });
  });

  // Setup Vite dev server or static files
  const isDev = process.env.NODE_ENV !== 'production';
  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HotelPro Express Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
