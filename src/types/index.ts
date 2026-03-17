export type View =
  | "welcome"
  | "manager_dashboard"
  | "accounting"
  | "invoices"
  | "maintenance"
  | "property_details"
  | "new_maintenance"
  | "tenant_dashboard"
  | "settings"
  | "reports"
  | "add_property"
  | "owners"
  | "units"
  | "contracts"
  | "notifications"
  | "support"
  | "docs"
  | "financial_report"
  | "zakat_tax"
  | "ejar_integration"
  | "tech_performance"
  | "dev_center"
  | "archive"
  | "tenant_satisfaction"
  | "tenants_management"
  | "vendors_management"
  | "asset_management"
  | "property_report"
  | "official_print"
  | "publish"
  | "ai_assistant"
  | "payment"
  | "owner_dashboard"
  | "tech_portal"
  | "msg_templates"
  | "property_forms";


export interface AppData {
  PROPERTIES:           any[];
  MAINTENANCE_REQUESTS: any[];
  UNITS:                any[];
  TENANTS:              any[];
  OWNERS:               any[];
  CONTRACTS:            any[];
  VENDORS:              any[];
  INVOICES:             any[];
  updateMaintenanceStatus: (id: string, status: string) => Promise<void>;
  createMaintenanceRequest: (data: {
    property: string; unit: string; date: string; type: string;
    technician?: string; description?: string; priority?: string;
  }) => Promise<void>;
  recordPayment: (tenantId: string) => Promise<void>;
  addProperty: (data: any) => Promise<void>;
  renewContract: (id: string, newEnd: string) => Promise<void>;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isError?: boolean;
}
