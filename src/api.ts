// Typed API client — all calls go to /api (proxied by Vite to the Express server)

const BASE = '/api';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`POST ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

async function patch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PATCH ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

// ── Types ─────────────────────────────────────────────────────────────────

export interface Property {
  id: string; name: string; location: string; units: number; type: string;
}

export interface MaintenanceRequest {
  id: string; property: string; unit: string; date: string; type: string;
  technician: string; status: string; description: string; priority: string;
}

export interface Unit {
  id: string; type: string; property: string; rent: string; status: string;
}

export interface Tenant {
  id: string; name: string; unit: string; property: string; phone: string;
  paid: boolean; status: string; rent: string; contractEnd: string;
}

export interface Owner {
  id: string; name: string; properties: number; phone: string;
  status: string; totalRevenue: string; email: string;
}

export interface Contract {
  id: string; tenant: string; unit: string; property: string;
  start: string; end: string; rent: string; status: string;
}

export interface Vendor {
  id: string; name: string; service: string; type: string;
  rating: number; status: string; phone: string; jobs: number; city: string;
}

export interface Invoice {
  id: string; tenant: string; property: string; unit: string;
  amount: string; status: string; date: string;
}

// ── Read endpoints ────────────────────────────────────────────────────────

export const apiGetProperties   = ()  => get<Property[]>('/properties');
export const apiGetMaintenance  = ()  => get<MaintenanceRequest[]>('/maintenance');
export const apiGetUnits        = ()  => get<Unit[]>('/units');
export const apiGetTenants      = ()  => get<Tenant[]>('/tenants');
export const apiGetOwners       = ()  => get<Owner[]>('/owners');
export const apiGetContracts    = ()  => get<Contract[]>('/contracts');
export const apiGetVendors      = ()  => get<Vendor[]>('/vendors');
export const apiGetInvoices     = ()  => get<Invoice[]>('/invoices');
export const apiHealth          = ()  => get<{ status: string }>('/health');

// ── Mutation endpoints ────────────────────────────────────────────────────

/** Update a maintenance request status ('new' | 'in_progress' | 'completed') */
export const apiUpdateMaintenanceStatus = (id: string, status: string) =>
  patch<MaintenanceRequest>(`/maintenance/${id}`, { status });

/** Create a new maintenance request */
export const apiCreateMaintenance = (data: {
  property: string; unit: string; date: string; type: string;
  technician?: string; description?: string; priority?: string;
}) => post<MaintenanceRequest>('/maintenance', data);

/** Mark tenant payment as paid */
export const apiRecordPayment = (tenantId: string) =>
  post<Tenant>(`/tenants/${tenantId}/payment`);

/** Add a new property */
export const apiAddProperty = (data: {
  id: string; name: string; location: string; units: number; type: string;
}) => post<Property>('/properties', data);

/** Create a new contract */
export const apiCreateContract = (data: {
  tenant: string; unit: string; property: string;
  start: string; end: string; rent: string; status?: string;
}) => post<Contract>('/contracts', data);

/** Update contract status or end date */
export const apiUpdateContract = (id: string, updates: { status?: string; end?: string }) =>
  patch<Contract>(`/contracts/${id}`, updates);

/** Update unit status */
export const apiUpdateUnitStatus = (id: string, status: string) =>
  patch<Unit>(`/units/${id}`, { status });

// ── Auth ──────────────────────────────────────────────────────────────────
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

/** Login with email + password — returns user info or throws */
export const apiLogin = (email: string, password: string) =>
  post<AdminUser>('/auth/login', { email, password });
