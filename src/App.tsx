import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  auth,
  googleProvider,
  db,
  handleFirestoreError,
  OperationType,
} from "./firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { addDoc } from "firebase/firestore";
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
import { cn } from "./utils";
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

export default function App() {
  const [currentView, setCurrentView] = useState<View>("welcome");
  const [propertyFormsCategory, setPropertyFormsCategory] = useState<string>('الكل');
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (window as any).selectProperty = setSelectedProperty;
    return () => {
      delete (window as any).selectProperty;
    };
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
          const propsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProperties(propsData);
          if (propsData.length > 0 && !selectedProperty) {
            setSelectedProperty(propsData[0]);
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, "properties");
        },
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
    return () => {
      delete (window as any).selectProperty;
    };
  }, []);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="size-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const renderView = () => {
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
      case "accounting":
        return <AccountingScreen onSelect={setCurrentView} />;
      case "invoices":
        return <InvoicesScreen onSelect={setCurrentView} />;
      case "maintenance":
        return <MaintenanceScreen onSelect={setCurrentView} />;
      case "property_details":
        return (
          <PropertyDetailsScreen
            onSelect={setCurrentView}
            property={selectedProperty}
          />
        );
      case "new_maintenance":
        return <NewMaintenanceRequestScreen onSelect={setCurrentView} />;
      case "tenant_dashboard":
        return <TenantDashboard onSelect={setCurrentView} />;
      case "settings":
        return <SettingsScreen onSelect={setCurrentView} />;
      case "reports":
        return <ReportsScreen onSelect={setCurrentView} />;
      case "add_property":
        return (
          <AddPropertyScreen
            onSelect={setCurrentView}
            properties={properties}
          />
        );
      case "owners":
        return <OwnersManagementScreen onSelect={setCurrentView} />;
      case "units":
        return <UnitsManagementScreen onSelect={setCurrentView} />;
      case "contracts":
        return <ContractsManagementScreen onSelect={setCurrentView} />;
      case "support":
        return <SupportScreen onSelect={setCurrentView} />;
      case "docs":
        return <TechnicalDocsScreen onSelect={setCurrentView} />;
      case "notifications":
        return <NotificationsScreen onSelect={setCurrentView} />;
      case "financial_report":
        return <FinancialReportScreen onSelect={setCurrentView} />;
      case "property_report":
        return (
          <PropertyReportScreen
            onSelect={setCurrentView}
            property={selectedProperty}
            properties={properties}
          />
        );
      case "official_print":
        return (
          <OfficialPrintScreen
            onSelect={setCurrentView}
            property={selectedProperty}
          />
        );
      case "publish": return <PublishingScreen onSelect={setCurrentView} />;
      case "ai_assistant": return <AIAssistantScreen onSelect={setCurrentView} />;
      case "payment": return <PaymentScreen onSelect={setCurrentView} />;
      case "owner_dashboard": return <OwnerDashboard onSelect={setCurrentView} />;
      case "tech_portal": return <TechPortal onSelect={setCurrentView} />;
      case "msg_templates": return <MessageTemplatesScreen onSelect={setCurrentView} />;
      case "property_forms": return <PropertyFormsScreen onSelect={setCurrentView} initialCategory={propertyFormsCategory} />;
      case "zakat_tax":
        return <ZakatTaxScreen onSelect={setCurrentView} />;
      case "ejar_integration":
        return <EjarIntegrationScreen onSelect={setCurrentView} />;
      case "tech_performance":
        return <TechPerformanceScreen onSelect={setCurrentView} />;
      case "dev_center":
        return <DeveloperCenterScreen onSelect={setCurrentView} />;
      case "archive":
        return <ArchiveScreen onSelect={setCurrentView} />;
      case "tenant_satisfaction":
        return <TenantSatisfactionReportScreen onSelect={setCurrentView} />;
      case "tenants_management":
        return <TenantsManagementScreen onSelect={setCurrentView} />;
      case "vendors_management":
        return <VendorsManagementScreen onSelect={setCurrentView} />;
      case "asset_management":
        return <AssetManagementScreen onSelect={setCurrentView} />;
      default:
        return <WelcomeScreen onSelect={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen font-sans">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
