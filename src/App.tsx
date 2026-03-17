import React, { useState, useEffect } from "react";
import {
  auth,
  db,
  handleFirestoreError,
  OperationType,
} from "./firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

import { View } from "./types";
import { AppLayout } from "./components/shared";
import {
  WelcomeScreen, ManagerDashboard, AccountingScreen, InvoicesScreen,
  MaintenanceScreen, PropertyDetailsScreen, NewMaintenanceRequestScreen,
  TenantDashboard, SettingsScreen, ReportsScreen, AddPropertyScreen,
  OwnersManagementScreen, UnitsManagementScreen, ContractsManagementScreen,
  TechnicalDocsScreen, NotificationsScreen, FinancialReportScreen,
  ZakatTaxScreen, EjarIntegrationScreen, TechPerformanceScreen,
  DeveloperCenterScreen, ArchiveScreen, TenantSatisfactionReportScreen,
  TenantsManagementScreen, VendorsManagementScreen, AssetManagementScreen,
  PropertyReportScreen, OfficialPrintScreen, PublishingScreen,
  AIAssistantScreen, PaymentScreen, OwnerDashboard, TechPortal,
  MessageTemplatesScreen, PropertyFormsScreen, SupportScreen,
} from "./pages";

// Views that use their own full-page layout (no sidebar)
const STANDALONE_VIEWS: View[] = [
  "welcome", "tenant_dashboard", "owner_dashboard", "tech_portal",
];

// Page titles for the top header
const PAGE_TITLES: Partial<Record<View, { title: string; subtitle?: string }>> = {
  manager_dashboard:    { title: "لوحة التحكم",               subtitle: "نظرة عامة على أداء محفظتك العقارية" },
  accounting:           { title: "المحاسبة والمالية",          subtitle: "إدارة الحسابات والتدفقات المالية" },
  invoices:             { title: "الفواتير",                    subtitle: "إدارة وتتبع الفواتير والمدفوعات" },
  maintenance:          { title: "الصيانة",                    subtitle: "تتبع ومتابعة طلبات الصيانة" },
  property_details:     { title: "العقارات",                   subtitle: "إدارة وعرض تفاصيل العقارات" },
  new_maintenance:      { title: "طلب صيانة جديد",             subtitle: "رفع طلب صيانة وإسناده للفنيين" },
  settings:             { title: "الإعدادات",                  subtitle: "ضبط إعدادات النظام والحساب" },
  reports:              { title: "التقارير",                   subtitle: "تقارير تحليلية وإحصائية شاملة" },
  add_property:         { title: "إضافة عقار",                 subtitle: "تسجيل عقار جديد في المنظومة" },
  owners:               { title: "الملاك",                     subtitle: "إدارة بيانات الملاك والمالكين" },
  units:                { title: "الوحدات",                    subtitle: "إدارة الوحدات السكنية والتجارية" },
  contracts:            { title: "العقود",                     subtitle: "إدارة عقود الإيجار والتجديد" },
  support:              { title: "الدعم الفني",                subtitle: "التواصل مع فريق الدعم والمساعدة" },
  docs:                 { title: "التوثيق الفني",               subtitle: "دليل المستخدم والمرجع التقني" },
  notifications:        { title: "الإشعارات",                  subtitle: "متابعة آخر التنبيهات والتحديثات" },
  financial_report:     { title: "التقارير المالية",           subtitle: "تقارير الإيرادات والمصروفات" },
  zakat_tax:            { title: "الزكاة والضريبة",            subtitle: "متطلبات هيئة الزكاة والضريبة والدخل" },
  ejar_integration:     { title: "منصة إيجار",                 subtitle: "التكامل مع منصة إيجار الحكومية" },
  tech_performance:     { title: "أداء النظام",                subtitle: "مؤشرات أداء المنصة التقنية" },
  dev_center:           { title: "مركز التطوير",               subtitle: "أدوات ومرجع المطورين" },
  archive:              { title: "الأرشيف",                    subtitle: "الوثائق والملفات المؤرشفة" },
  tenant_satisfaction:  { title: "رضا المستأجرين",             subtitle: "قياس وتحليل رضا المستأجرين" },
  tenants_management:   { title: "المستأجرون",                 subtitle: "إدارة بيانات المستأجرين" },
  vendors_management:   { title: "المقاولون والموردون",        subtitle: "إدارة المقاولين ومقدمي الخدمات" },
  asset_management:     { title: "إدارة الأصول",               subtitle: "تتبع وصيانة أصول العقارات" },
  property_report:      { title: "تقرير العقار",               subtitle: "تقرير تفصيلي لأداء العقار" },
  official_print:       { title: "الطباعة الرسمية",            subtitle: "إصدار وطباعة المستندات الرسمية" },
  publish:              { title: "النشر والتوزيع",             subtitle: "نشر التطبيق على الاستضافات المختلفة" },
  ai_assistant:         { title: "المساعد الذكي",              subtitle: "مساعد ذكاء اصطناعي لإدارة الأملاك" },
  payment:              { title: "المدفوعات",                  subtitle: "إدارة وتتبع المدفوعات" },
  msg_templates:        { title: "قوالب الرسائل",              subtitle: "إنشاء وإدارة قوالب الرسائل النصية" },
  property_forms:       { title: "نماذج العقارات",             subtitle: "نماذج وقوالب وثائق العقارات" },
};

export default function App() {
  const [currentView, setCurrentView] = useState<View>("welcome");
  const [propertyFormsCategory, setPropertyFormsCategory] = useState<string>("الكل");
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (window as any).selectProperty = setSelectedProperty;
    return () => { delete (window as any).selectProperty; };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      if (currentUser?.email === "aliayashi522@gmail.com") {
        setCurrentView("manager_dashboard");
      } else {
        setCurrentView("welcome");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user?.email === "aliayashi522@gmail.com") {
      const unsubscribe = onSnapshot(
        collection(db, "properties"),
        (snapshot) => {
          const propsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setProperties(propsData);
          if (propsData.length > 0 && !selectedProperty) {
            setSelectedProperty(propsData[0]);
          }
        },
        (error) => { handleFirestoreError(error, OperationType.GET, "properties"); },
      );
      return () => unsubscribe();
    }
  }, [user]);

  const handleSelectProperty = (view: View, property: any) => {
    setSelectedProperty(property);
    setCurrentView(view);
  };

  useEffect(() => {
    (window as any).selectProperty = (p: any) => setSelectedProperty(p);
    return () => { delete (window as any).selectProperty; };
  }, []);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center gap-4">
        <div className="size-14 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm font-medium">جاري التحميل...</p>
      </div>
    );
  }

  const renderPageContent = () => {
    switch (currentView) {
      case "welcome":
        return <WelcomeScreen onSelect={setCurrentView} />;
      case "manager_dashboard":
        return (
          <ManagerDashboard
            onSelect={setCurrentView}
            onSelectProperty={handleSelectProperty}
            properties={properties}
          />
        );
      case "accounting":           return <AccountingScreen onSelect={setCurrentView} />;
      case "invoices":             return <InvoicesScreen onSelect={setCurrentView} />;
      case "maintenance":          return <MaintenanceScreen onSelect={setCurrentView} />;
      case "property_details":
        return <PropertyDetailsScreen onSelect={setCurrentView} property={selectedProperty} />;
      case "new_maintenance":      return <NewMaintenanceRequestScreen onSelect={setCurrentView} />;
      case "tenant_dashboard":     return <TenantDashboard onSelect={setCurrentView} />;
      case "settings":             return <SettingsScreen onSelect={setCurrentView} />;
      case "reports":              return <ReportsScreen onSelect={setCurrentView} />;
      case "add_property":
        return <AddPropertyScreen onSelect={setCurrentView} properties={properties} />;
      case "owners":               return <OwnersManagementScreen onSelect={setCurrentView} />;
      case "units":                return <UnitsManagementScreen onSelect={setCurrentView} />;
      case "contracts":            return <ContractsManagementScreen onSelect={setCurrentView} />;
      case "support":              return <SupportScreen onSelect={setCurrentView} />;
      case "docs":                 return <TechnicalDocsScreen onSelect={setCurrentView} />;
      case "notifications":        return <NotificationsScreen onSelect={setCurrentView} />;
      case "financial_report":     return <FinancialReportScreen onSelect={setCurrentView} />;
      case "property_report":
        return (
          <PropertyReportScreen
            onSelect={setCurrentView}
            property={selectedProperty}
            properties={properties}
          />
        );
      case "official_print":
        return <OfficialPrintScreen onSelect={setCurrentView} property={selectedProperty} />;
      case "publish":              return <PublishingScreen onSelect={setCurrentView} />;
      case "ai_assistant":         return <AIAssistantScreen onSelect={setCurrentView} />;
      case "payment":              return <PaymentScreen onSelect={setCurrentView} />;
      case "owner_dashboard":      return <OwnerDashboard onSelect={setCurrentView} />;
      case "tech_portal":          return <TechPortal onSelect={setCurrentView} />;
      case "msg_templates":        return <MessageTemplatesScreen onSelect={setCurrentView} />;
      case "property_forms":
        return <PropertyFormsScreen onSelect={setCurrentView} initialCategory={propertyFormsCategory} />;
      case "zakat_tax":            return <ZakatTaxScreen onSelect={setCurrentView} />;
      case "ejar_integration":     return <EjarIntegrationScreen onSelect={setCurrentView} />;
      case "tech_performance":     return <TechPerformanceScreen onSelect={setCurrentView} />;
      case "dev_center":           return <DeveloperCenterScreen onSelect={setCurrentView} />;
      case "archive":              return <ArchiveScreen onSelect={setCurrentView} />;
      case "tenant_satisfaction":  return <TenantSatisfactionReportScreen onSelect={setCurrentView} />;
      case "tenants_management":   return <TenantsManagementScreen onSelect={setCurrentView} />;
      case "vendors_management":   return <VendorsManagementScreen onSelect={setCurrentView} />;
      case "asset_management":     return <AssetManagementScreen onSelect={setCurrentView} />;
      default:                     return <WelcomeScreen onSelect={setCurrentView} />;
    }
  };

  // Standalone views (full-page, no sidebar)
  if (STANDALONE_VIEWS.includes(currentView)) {
    return <div className="min-h-screen font-sans">{renderPageContent()}</div>;
  }

  // Authenticated manager views — wrapped in AppLayout with sidebar
  const pageInfo = PAGE_TITLES[currentView];
  return (
    <AppLayout
      activeView={currentView}
      onSelect={setCurrentView}
      title={pageInfo?.title}
      subtitle={pageInfo?.subtitle}
    >
      {renderPageContent()}
    </AppLayout>
  );
}
