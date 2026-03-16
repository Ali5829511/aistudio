import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH ?? path.resolve(__dirname, '../data/aistudio.db');

export const db = new Database(DB_PATH);

// ── Schema ─────────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS properties (
    id       TEXT PRIMARY KEY,
    name     TEXT NOT NULL,
    location TEXT NOT NULL,
    units    INTEGER NOT NULL DEFAULT 0,
    type     TEXT NOT NULL DEFAULT 'سكني'
  );

  CREATE TABLE IF NOT EXISTS maintenance_requests (
    id          TEXT PRIMARY KEY,
    property    TEXT NOT NULL,
    unit        TEXT NOT NULL,
    date        TEXT NOT NULL,
    type        TEXT NOT NULL,
    technician  TEXT NOT NULL,
    status      TEXT NOT NULL DEFAULT 'new',
    description TEXT NOT NULL DEFAULT '',
    priority    TEXT NOT NULL DEFAULT 'medium'
  );

  CREATE TABLE IF NOT EXISTS units (
    id       TEXT PRIMARY KEY,
    type     TEXT NOT NULL,
    property TEXT NOT NULL,
    rent     TEXT NOT NULL,
    status   TEXT NOT NULL DEFAULT 'شاغرة'
  );

  CREATE TABLE IF NOT EXISTS tenants (
    id            TEXT PRIMARY KEY,
    name          TEXT NOT NULL,
    unit          TEXT NOT NULL,
    property      TEXT NOT NULL,
    phone         TEXT NOT NULL DEFAULT '',
    paid          INTEGER NOT NULL DEFAULT 0,
    status        TEXT NOT NULL DEFAULT 'active',
    rent          TEXT NOT NULL DEFAULT '0',
    contract_end  TEXT NOT NULL DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS owners (
    id            TEXT PRIMARY KEY,
    name          TEXT NOT NULL,
    properties    INTEGER NOT NULL DEFAULT 0,
    phone         TEXT NOT NULL DEFAULT '',
    status        TEXT NOT NULL DEFAULT 'نشط',
    total_revenue TEXT NOT NULL DEFAULT '0',
    email         TEXT NOT NULL DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS contracts (
    id         TEXT PRIMARY KEY,
    tenant     TEXT NOT NULL,
    unit       TEXT NOT NULL,
    property   TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date   TEXT NOT NULL,
    rent       TEXT NOT NULL DEFAULT '0',
    status     TEXT NOT NULL DEFAULT 'ساري'
  );

  CREATE TABLE IF NOT EXISTS vendors (
    id      TEXT PRIMARY KEY,
    name    TEXT NOT NULL,
    service TEXT NOT NULL,
    type    TEXT NOT NULL,
    rating  REAL NOT NULL DEFAULT 0,
    status  TEXT NOT NULL DEFAULT 'available',
    phone   TEXT NOT NULL DEFAULT '',
    jobs    INTEGER NOT NULL DEFAULT 0,
    city    TEXT NOT NULL DEFAULT ''
  );
`);

// ── Seed data (only inserts when tables are empty) ─────────────────────────

function seed() {
  const seedProperties = db.prepare(`
    INSERT OR IGNORE INTO properties (id, name, location, units, type) VALUES (?, ?, ?, ?, ?)
  `);

  const properties = [
    ['1',  'عمارة النخيل',    'الرياض، حي الصحافة',      24, 'سكني'],
    ['2',  'برج الياسمين',    'الرياض، حي الملقا',        36, 'سكني'],
    ['3',  'مجمع الروضة',     'الرياض، حي الروضة',        12, 'سكني'],
    ['4',  'برج بيان',        'الرياض، شارع الملك فهد',   48, 'سكني تجاري'],
    ['5',  'برج النخيل',      'الرياض، حي العليا',        30, 'تجاري'],
    ['6',  'مجمع الياسمين',   'الرياض، حي الياسمين',      15, 'تجاري'],
    ['7',  'حي النرجس',       'الرياض، حي النرجس',         1, 'سكني'],
    ['8',  'أبراج النخيل',    'الرياض، حي النخيل',        60, 'سكني'],
    ['9',  'فيلا السعادة',    'جدة، حي الشاطئ',             1, 'سكني'],
    ['10', 'برج المجد',       'الرياض، حي السليمانية',    40, 'تجاري'],
    ['11', 'مجمع الواحة',     'الرياض، حي الواحة',        20, 'سكني'],
    ['12', 'فيلا الياسمين',   'الرياض، حي الياسمين',       1, 'سكني'],
    ['13', 'عمارة السلام',    'الرياض، حي السلام',        18, 'سكني'],
    ['14', 'برج الجوهرة',     'جدة، الكورنيش',             55, 'سكني تجاري'],
    ['15', 'مجمع الفهد',      'الدمام، حي الشاطئ',        25, 'سكني'],
  ];
  const insertProperties = db.transaction(() => {
    for (const row of properties) seedProperties.run(...row);
  });
  insertProperties();

  const seedMaintenance = db.prepare(`
    INSERT OR IGNORE INTO maintenance_requests
      (id, property, unit, date, type, technician, status, description, priority)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const maintenanceRows = [
    ['1', 'عمارة النخيل',  'شقة ٥٠٢', '2024-05-24', 'سباكة',   'أحمد محمود', 'in_progress', 'صنبور يسرب الماء في الحمام الرئيسي',         'high'],
    ['2', 'برج الياسمين', 'شقة ٣٠١', '2024-05-20', 'كهرباء',  'خالد علي',   'completed',   'إصلاح مفتاح الإنارة في الصالة',               'medium'],
    ['3', 'مجمع الروضة',  'فيلا ١٢', '2024-05-25', 'تكييف',   'ياسين حسن',  'new',         'المكيف لا يبرد بشكل جيد',                      'medium'],
    ['4', 'عمارة النخيل',  'شقة ١٠٢', '2024-05-15', 'دهانات',  'سعيد محمد',  'completed',   'إعادة دهان جدار الغرفة الرئيسية',              'low'],
    ['5', 'برج بيان',     'شقة ٤٠٤', '2024-05-10', 'سباكة',   'أحمد محمود', 'completed',   'تسليك مجاري المطبخ',                            'high'],
    ['6', 'برج المجد',    'مكتب ٢٠١','2024-05-26', 'كهرباء',  'خالد علي',   'new',         'عطل في لوحة التوزيع الرئيسية',                 'high'],
  ];
  const insertMaintenance = db.transaction(() => {
    for (const row of maintenanceRows) seedMaintenance.run(...row);
  });
  insertMaintenance();

  const seedUnit = db.prepare(`
    INSERT OR IGNORE INTO units (id, type, property, rent, status) VALUES (?, ?, ?, ?, ?)
  `);
  const unitRows = [
    ['101', 'شقة',  'برج النخيل',    '4,500',  'مؤجرة'],
    ['402', 'مكتب', 'مجمع الياسمين', '12,000', 'شاغرة'],
    ['7',   'فيلا', 'حي النرجس',     '8,000',  'تحت الصيانة'],
    ['205', 'شقة',  'مجمع الواحة',   '3,800',  'مؤجرة'],
    ['301', 'مكتب', 'برج المجد',     '15,000', 'شاغرة'],
    ['15',  'فيلا', 'فيلا الياسمين', '9,500',  'مؤجرة'],
    ['502', 'شقة',  'عمارة النخيل',  '5,200',  'شاغرة'],
    ['104', 'شقة',  'برج الياسمين',  '4,800',  'مؤجرة'],
  ];
  const insertUnits = db.transaction(() => {
    for (const row of unitRows) seedUnit.run(...row);
  });
  insertUnits();

  const seedTenant = db.prepare(`
    INSERT OR IGNORE INTO tenants
      (id, name, unit, property, phone, paid, status, rent, contract_end)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const tenantRows = [
    ['1', 'محمد العتيبي',       'شقة ٤٠٢',  'برج الياسمين', '٠٥٠١٢٣٤٥٦٧', 1, 'active',   '4,800',  '٢٠٢٤/١٢/٣١'],
    ['2', 'سارة القحطاني',      'فيلا ٧',    'حي النرجس',    '٠٥٥٩٨٧٦٥٤٣', 0, 'active',   '8,000',  '٢٠٢٥/٠٣/٢٠'],
    ['3', 'عبدالله الشمري',     'مكتب ١٠١',  'برج النخيل',   '٠٥٤٣٢١٠٩٨٧', 1, 'expiring', '4,500',  '٢٠٢٤/٠٦/٣٠'],
    ['4', 'فاطمة الزهراني',     'شقة ٢٠٥',  'مجمع الواحة',  '٠٥٦٧٨٩٠١٢٣', 0, 'late',     '3,800',  '٢٠٢٤/٠٩/١٥'],
    ['5', 'خالد حسن المالكي',   'شقة ١٠٤',  'برج الياسمين', '٠٥٠٠١١٢٢٣٣', 1, 'active',   '4,800',  '٢٠٢٥/٠١/٠١'],
    ['6', 'نورة الدوسري',       'فيلا ١٥',   'فيلا الياسمين','٠٥٣٤٥٦٧٨٩٠', 1, 'active',   '9,500',  '٢٠٢٥/٠٢/١٠'],
    ['7', 'أحمد سالم البلوي',   'شقة ١٠٢',  'عمارة النخيل', '٠٥٦٦٧٧٨٨٩٩', 0, 'late',     '5,200',  '٢٠٢٤/٠٨/٠١'],
    ['8', 'ريم الحربي',         'مكتب ٣٠١',  'برج المجد',    '٠٥١٢٣٤٥٦٧٨', 1, 'active',   '15,000', '٢٠٢٤/١١/٣٠'],
  ];
  const insertTenants = db.transaction(() => {
    for (const row of tenantRows) seedTenant.run(...row);
  });
  insertTenants();

  const seedOwner = db.prepare(`
    INSERT OR IGNORE INTO owners
      (id, name, properties, phone, status, total_revenue, email)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const ownerRows = [
    ['1', 'عبد الرحمن السديري',      5,  '٠٥٠١٢٣٤٥٦٧', 'نشط',      '٤٥,٠٠٠',  'sidirey@example.com'],
    ['2', 'شركة نجد للاستثمار',      12, '٠١١٤٥٦٧٨٩٠', 'نشط',      '١٢٠,٠٠٠', 'najd@invest.com'],
    ['3', 'فهد بن سلطان',            3,  '٠٥٥٩٨٧٦٥٤٣', 'غير نشط',  '١٨,٠٠٠',  'fahad@example.com'],
    ['4', 'مريم الخليفة',            2,  '٠٥٤٤٣٣٢٢١١', 'نشط',      '٢٢,٠٠٠',  'mariam@example.com'],
    ['5', 'مجموعة الفهد العقارية',   8,  '٠١١٢٢٣٣٤٤٥', 'نشط',      '٩٥,٠٠٠',  'alfahd@group.com'],
  ];
  const insertOwners = db.transaction(() => {
    for (const row of ownerRows) seedOwner.run(...row);
  });
  insertOwners();

  const seedContract = db.prepare(`
    INSERT OR IGNORE INTO contracts
      (id, tenant, unit, property, start_date, end_date, rent, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const contractRows = [
    ['1', 'محمد العتيبي',   'شقة ٤٠٢',  'برج الياسمين', '٢٠٢٤/٠١/٠١', '٢٠٢٤/١٢/٣١', '4,800',  'ساري'],
    ['2', 'شركة الأفق',    'مكتب ٥',    'برج النخيل',   '٢٠٢٣/٠٧/١',  '٢٠٢٤/٠٦/١٥', '12,000', 'ينتهي قريباً'],
    ['3', 'سارة العمري',   'فيلا ١٢',   'حي النرجس',    '٢٠٢٤/٠١/٢٠', '٢٠٢٥/٠١/٢٠', '8,000',  'ساري'],
    ['4', 'فاطمة الزهراني','شقة ٢٠٥',  'مجمع الواحة',  '٢٠٢٣/١٠/١',  '٢٠٢٤/٠٩/١٥', '3,800',  'منتهي'],
    ['5', 'خالد المالكي',  'شقة ١٠٤',  'برج الياسمين', '٢٠٢٤/٠١/٠١', '٢٠٢٥/٠١/٠١', '4,800',  'ساري'],
    ['6', 'نورة الدوسري',  'فيلا ١٥',   'فيلا الياسمين','٢٠٢٤/٠٢/١٠', '٢٠٢٥/٠٢/١٠', '9,500',  'ساري'],
  ];
  const insertContracts = db.transaction(() => {
    for (const row of contractRows) seedContract.run(...row);
  });
  insertContracts();

  const seedVendor = db.prepare(`
    INSERT OR IGNORE INTO vendors
      (id, name, service, type, rating, status, phone, jobs, city)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const vendorRows = [
    ['1', 'شركة التكييف المتقدمة', 'صيانة تكييف',    'تكييف',   4.8, 'available', '966500000001', 32, 'الرياض'],
    ['2', 'الكهربائي المتميز',      'أعمال كهرباء',   'كهرباء',  4.5, 'busy',      '966500000002', 18, 'الرياض'],
    ['3', 'سباكة الخليج',           'سباكة وعزل',     'سباكة',   4.2, 'available', '966500000003', 24, 'الرياض'],
    ['4', 'شركة الدهانات الذهبية', 'دهانات وديكور',  'دهانات',  4.6, 'available', '966500000004', 15, 'جدة'],
    ['5', 'مكافحة الآفات السريعة', 'مكافحة آفات',    'مكافحة',  4.3, 'busy',      '966500000005',  9, 'الدمام'],
    ['6', 'صيانة مصاعد الخليج',    'صيانة مصاعد',    'مصاعد',   4.9, 'available', '966500000006', 41, 'الرياض'],
  ];
  const insertVendors = db.transaction(() => {
    for (const row of vendorRows) seedVendor.run(...row);
  });
  insertVendors();
}

seed();

// ── Row mappers (DB columns → JS shape used by the frontend) ───────────────

export function mapTenant(row: Record<string, unknown>) {
  return {
    id:          String(row.id),
    name:        String(row.name),
    unit:        String(row.unit),
    property:    String(row.property),
    phone:       String(row.phone),
    paid:        Boolean(row.paid),
    status:      String(row.status),
    rent:        String(row.rent),
    contractEnd: String(row.contract_end),
  };
}

export function mapContract(row: Record<string, unknown>) {
  return {
    id:       String(row.id),
    tenant:   String(row.tenant),
    unit:     String(row.unit),
    property: String(row.property),
    start:    String(row.start_date),
    end:      String(row.end_date),
    rent:     String(row.rent),
    status:   String(row.status),
  };
}

export function mapMaintenance(row: Record<string, unknown>) {
  return {
    id:          String(row.id),
    property:    String(row.property),
    unit:        String(row.unit),
    date:        String(row.date),
    type:        String(row.type),
    technician:  String(row.technician),
    status:      String(row.status),
    description: String(row.description),
    priority:    String(row.priority),
  };
}

export default db;
