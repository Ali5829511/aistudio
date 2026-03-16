import express from 'express';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { db, mapTenant, mapContract, mapMaintenance } from './db.js';

const app = express();
const PORT = Number(process.env.API_PORT ?? 3001);

app.use(express.json());

// ── CORS (allow Vite dev server) ──────────────────────────────────────────
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.options('*', (_req, res) => res.sendStatus(204));

// ── Rate limiting ─────────────────────────────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // max 10 attempts per window per IP
  message: { error: 'عدد كبير من محاولات الدخول، يرجى المحاولة بعد 15 دقيقة' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Auth ──────────────────────────────────────────────────────────────────
app.post('/api/auth/login', loginLimiter, (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password)
    return res.status(400).json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' });

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as
    { id: string; email: string; name: string; role: string; password_hash: string } | undefined;

  if (!user || !bcrypt.compareSync(password, user.password_hash))
    return res.status(401).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });

  res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
});

// ── Health ────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Properties ───────────────────────────────────────────────────────────
app.get('/api/properties', (_req, res) => {
  const rows = db.prepare('SELECT * FROM properties ORDER BY id').all();
  res.json(rows);
});

app.post('/api/properties', (req, res) => {
  const { id, name, location, units, type } = req.body as {
    id: string; name: string; location: string; units: number; type: string;
  };
  if (!id || !name || !location) return res.status(400).json({ error: 'id, name, location required' });
  db.prepare(
    'INSERT INTO properties (id, name, location, units, type) VALUES (?, ?, ?, ?, ?)'
  ).run(id, name, location, units ?? 0, type ?? 'سكني');
  res.status(201).json(db.prepare('SELECT * FROM properties WHERE id = ?').get(id));
});

// ── Maintenance Requests ──────────────────────────────────────────────────
app.get('/api/maintenance', (_req, res) => {
  const rows = db.prepare('SELECT * FROM maintenance_requests ORDER BY date DESC').all();
  res.json(rows.map(mapMaintenance));
});

app.post('/api/maintenance', (req, res) => {
  const { property, unit, date, type, technician, description, priority } = req.body as {
    property: string; unit: string; date: string; type: string;
    technician: string; description: string; priority: string;
  };
  if (!property || !unit || !type) return res.status(400).json({ error: 'property, unit, type required' });
  const id = String(Date.now());
  db.prepare(
    `INSERT INTO maintenance_requests
       (id, property, unit, date, type, technician, status, description, priority)
     VALUES (?, ?, ?, ?, ?, ?, 'new', ?, ?)`
  ).run(id, property, unit, date ?? new Date().toISOString().slice(0, 10),
    type, technician ?? '', description ?? '', priority ?? 'medium');
  const row = db.prepare('SELECT * FROM maintenance_requests WHERE id = ?').get(id);
  res.status(201).json(mapMaintenance(row as Record<string, unknown>));
});

app.patch('/api/maintenance/:id', (req, res) => {
  const { id } = req.params;
  const { status, technician } = req.body as { status?: string; technician?: string };
  const validStatuses = ['new', 'in_progress', 'completed'];
  if (status && !validStatuses.includes(status))
    return res.status(400).json({ error: 'Invalid status' });
  if (status) db.prepare('UPDATE maintenance_requests SET status = ? WHERE id = ?').run(status, id);
  if (technician) db.prepare('UPDATE maintenance_requests SET technician = ? WHERE id = ?').run(technician, id);
  const row = db.prepare('SELECT * FROM maintenance_requests WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(mapMaintenance(row as Record<string, unknown>));
});

// ── Units ─────────────────────────────────────────────────────────────────
app.get('/api/units', (_req, res) => {
  const rows = db.prepare('SELECT * FROM units ORDER BY id').all();
  res.json(rows);
});

app.patch('/api/units/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body as { status: string };
  db.prepare('UPDATE units SET status = ? WHERE id = ?').run(status, id);
  const row = db.prepare('SELECT * FROM units WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
});

// ── Tenants ───────────────────────────────────────────────────────────────
app.get('/api/tenants', (_req, res) => {
  const rows = db.prepare('SELECT * FROM tenants ORDER BY id').all();
  res.json(rows.map(mapTenant));
});

app.post('/api/tenants/:id/payment', (req, res) => {
  const { id } = req.params;
  db.prepare('UPDATE tenants SET paid = 1 WHERE id = ?').run(id);
  const row = db.prepare('SELECT * FROM tenants WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(mapTenant(row as Record<string, unknown>));
});

// ── Owners ────────────────────────────────────────────────────────────────
app.get('/api/owners', (_req, res) => {
  const rows = db.prepare('SELECT * FROM owners ORDER BY id').all();
  res.json(rows.map(row => ({
    id:           String((row as Record<string, unknown>).id),
    name:         String((row as Record<string, unknown>).name),
    properties:   Number((row as Record<string, unknown>).properties),
    phone:        String((row as Record<string, unknown>).phone),
    status:       String((row as Record<string, unknown>).status),
    totalRevenue: String((row as Record<string, unknown>).total_revenue),
    email:        String((row as Record<string, unknown>).email),
  })));
});

// ── Contracts ─────────────────────────────────────────────────────────────
app.get('/api/contracts', (_req, res) => {
  const rows = db.prepare('SELECT * FROM contracts ORDER BY id').all();
  res.json(rows.map(mapContract));
});

app.post('/api/contracts', (req, res) => {
  const { tenant, unit, property, start, end, rent, status } = req.body as {
    tenant: string; unit: string; property: string;
    start: string; end: string; rent: string; status: string;
  };
  if (!tenant || !unit || !property) return res.status(400).json({ error: 'tenant, unit, property required' });
  const id = String(Date.now());
  db.prepare(
    `INSERT INTO contracts (id, tenant, unit, property, start_date, end_date, rent, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, tenant, unit, property, start, end, rent ?? '0', status ?? 'ساري');
  const row = db.prepare('SELECT * FROM contracts WHERE id = ?').get(id);
  res.status(201).json(mapContract(row as Record<string, unknown>));
});

app.patch('/api/contracts/:id', (req, res) => {
  const { id } = req.params;
  const { status, end } = req.body as { status?: string; end?: string };
  if (status) db.prepare('UPDATE contracts SET status = ? WHERE id = ?').run(status, id);
  if (end)    db.prepare('UPDATE contracts SET end_date = ? WHERE id = ?').run(end, id);
  const row = db.prepare('SELECT * FROM contracts WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(mapContract(row as Record<string, unknown>));
});

// ── Vendors ───────────────────────────────────────────────────────────────
app.get('/api/vendors', (_req, res) => {
  const rows = db.prepare('SELECT * FROM vendors ORDER BY id').all();
  res.json(rows.map(row => {
    const r = row as Record<string, unknown>;
    return {
      id:      String(r.id),
      name:    String(r.name),
      service: String(r.service),
      type:    String(r.type),
      rating:  Number(r.rating),
      status:  String(r.status),
      phone:   String(r.phone),
      jobs:    Number(r.jobs),
      city:    String(r.city),
    };
  }));
});

// ── Invoices (computed from tenants) ─────────────────────────────────────
app.get('/api/invoices', (_req, res) => {
  const tenants = db.prepare('SELECT * FROM tenants ORDER BY id').all();
  const invoices = tenants.map((row, i) => {
    const t = mapTenant(row as Record<string, unknown>);
    return {
      id:       `#INV-2024-${String(i + 1).padStart(3, '0')}`,
      tenant:   t.name,
      property: t.property,
      unit:     t.unit,
      amount:   t.rent,
      status:   t.paid ? 'مدفوعة' : (t.status === 'late' ? 'متأخرة' : 'غير مدفوعة'),
      date:     t.contractEnd.slice(0, 7),
    };
  });
  res.json(invoices);
});

// ── Start ─────────────────────────────────────────────────────────────────

// In production, serve the Vite-built frontend from dist/
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  const distPath = path.resolve(__dirname, '../dist');
  // Rate-limit the SPA fallback (hardcoded path — guards against request flooding)
  const staticLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(express.static(distPath));
  // SPA fallback — must come after all API routes
  app.get('*', staticLimiter, (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[API] Server running on http://localhost:${PORT}`);
  if (isProduction) {
    console.log(`[API] Serving frontend from dist/ — open http://localhost:${PORT}`);
  }
});

export default app;
