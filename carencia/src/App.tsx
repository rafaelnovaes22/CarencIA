import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthContext, useAuthProvider } from './hooks/useAuth';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardBuyer from './pages/DashboardBuyer';
import DashboardDealership from './pages/DashboardDealership';
import SocialDataConsent from './pages/SocialDataConsent';
import OnboardingPage from './pages/OnboardingPage';
import { Loader2 } from 'lucide-react';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const auth = useAuthProvider();

  if (auth.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary-500" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={auth}>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                auth.user ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <LandingPage
                    onGetStarted={(userType) => window.location.href = `/register?type=${userType}`}
                    onLogin={() => window.location.href = '/login'}
                  />
                )
              }
            />

            <Route
              path="/login"
              element={
                auth.user ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <LoginPage />
                )
              }
            />

            <Route
              path="/register"
              element={
                auth.user ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <RegisterPage />
                )
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                auth.user ? (
                  auth.user.userType === 'buyer' ? (
                    <DashboardBuyer />
                  ) : (
                    <DashboardDealership />
                  )
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/onboarding"
              element={
                auth.user ? (
                  <OnboardingPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/social-data-consent"
              element={
                auth.user ? (
                  <SocialDataConsent />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'white',
            color: '#374151',
            border: '1px solid #e5e7eb',
          },
        }}
      />
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
