/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Chemicals from './pages/Chemicals';
import Equipment from './pages/Equipment';
import Safety from './pages/Safety';
import Reports from './pages/Reports';
import Archive from './pages/Archive';
import Teachers from './pages/Teachers';
import DailyReport from './pages/DailyReport';
import Settings from './pages/Settings';
import InventoryDashboard from './pages/InventoryDashboard';
import Maintenance from './pages/Maintenance';
import PrivacyPolicy from './pages/PrivacyPolicy';
import DataDeletion from './pages/DataDeletion';
import TermsOfService from './pages/TermsOfService';
import TechInventory from './pages/TechInventory';
import GlasswareBreakage from './pages/GlasswareBreakage';
import SmartForms from './pages/SmartForms';
import ChemicalWaste from './pages/ChemicalWaste';
import EducationalMap from './pages/EducationalMap';
import ConsumablesSDS from './pages/ConsumablesSDS';
import BackupCenter from './pages/BackupCenter';
import Layout from './components/Layout';
import FirebaseSetup from './components/FirebaseSetup';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcf9f3] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-[#2b3d22] rounded-2xl"></div>
          <div className="h-4 w-32 bg-[#2b3d22]/20 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      {user && <FirebaseSetup />}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/data-deletion" element={<DataDeletion />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route
          path="/"
          element={user ? <Layout /> : <Navigate to="/login" />}
        >
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<InventoryDashboard />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="chemicals" element={<Chemicals />} />
          <Route path="equipment" element={<Equipment />} />
          <Route path="tech-inventory" element={<TechInventory />} />
          <Route path="glassware-breakage" element={<GlasswareBreakage />} />
          <Route path="smart-forms" element={<SmartForms />} />
          <Route path="chemical-waste" element={<ChemicalWaste />} />
          <Route path="educational-map" element={<EducationalMap />} />
          <Route path="consumables-sds" element={<ConsumablesSDS />} />
          <Route path="backup" element={<BackupCenter />} />
          <Route path="safety" element={<Safety />} />
          <Route path="reports" element={<Reports />} />
          <Route path="archive" element={<Archive />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="daily-report" element={<DailyReport />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}


