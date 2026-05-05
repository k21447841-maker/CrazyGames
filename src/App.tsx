/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdProvider } from './context/AdContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { GamePlay } from './pages/GamePlay';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { Store } from './pages/Store';
import { SocialBarAd } from './components/SocialBarAd';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AdProvider>
          <div className="flex flex-col min-h-screen">
            <SocialBarAd />
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/game/:id" element={<GamePlay />} />
              <Route path="/store" element={<Store />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
            <Footer />
          </div>
        </AdProvider>
      </AuthProvider>
    </Router>
  );
}
