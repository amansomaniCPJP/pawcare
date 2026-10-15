import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/features/auth/AuthContext';
import { ToastProvider } from '@/features/notifications/ToastContext';
import { LoadingSpinner } from '@/components/ui/Skeleton';
import PublicLayout from '@/layouts/PublicLayout';
import AuthLayout from '@/layouts/AuthLayout';
import UserDashboardLayout from '@/layouts/UserDashboardLayout';
import AdminLayout from '@/layouts/AdminLayout';

const HomePage = lazy(() => import('@/pages/public/HomePage'));
const PetsPage = lazy(() => import('@/pages/public/PetsPage'));
const PetDetailPage = lazy(() => import('@/pages/public/PetDetailPage'));
const CareGuidePage = lazy(() => import('@/pages/public/CareGuidePage'));
const AboutPage = lazy(() => import('@/pages/public/AboutPage'));
const ContactPage = lazy(() => import('@/pages/public/ContactPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const AdoptPage = lazy(() => import('@/pages/public/AdoptPage'));
const DashboardOverview = lazy(() => import('@/pages/user/DashboardOverview'));
const MyPetsPage = lazy(() => import('@/pages/user/MyPetsPage'));
const MyApplicationsPage = lazy(() => import('@/pages/user/MyApplicationsPage'));
const FavouritesPage = lazy(() => import('@/pages/user/FavouritesPage'));
const CarePage = lazy(() => import('@/pages/user/CarePage'));
const SettingsPage = lazy(() => import('@/pages/user/SettingsPage'));
const HealthRecordsPage = lazy(() => import('@/pages/user/HealthRecordsPage'));
const AdminOverview = lazy(() => import('@/pages/admin/AdminOverview'));
const AdminPetsPage = lazy(() => import('@/pages/admin/AdminPetsPage'));
const AdminApplicationsPage = lazy(() => import('@/pages/admin/AdminApplicationsPage'));
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage'));
const AdminReportsPage = lazy(() => import('@/pages/admin/AdminReportsPage'));
const AdminRecordsPage = lazy(() => import('@/pages/admin/AdminRecordsPage'));
const NotFoundPage = lazy(() => import('@/pages/public/NotFoundPage'));

const SuspenseWrap = ({ children }) => (
  <Suspense
    fallback={
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size={40} />
      </div>
    }
  >
    {children}
  </Suspense>
);

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function RequireAdmin({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/app" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicLayout>
            <SuspenseWrap>
              <HomePage />
            </SuspenseWrap>
          </PublicLayout>
        }
      />
      <Route
        path="/pets"
        element={
          <PublicLayout>
            <SuspenseWrap>
              <PetsPage />
            </SuspenseWrap>
          </PublicLayout>
        }
      />
      <Route
        path="/pets/:petId"
        element={
          <PublicLayout>
            <SuspenseWrap>
              <PetDetailPage />
            </SuspenseWrap>
          </PublicLayout>
        }
      />
      <Route
        path="/care-guide"
        element={
          <PublicLayout>
            <SuspenseWrap>
              <CareGuidePage />
            </SuspenseWrap>
          </PublicLayout>
        }
      />
      <Route
        path="/about"
        element={
          <PublicLayout>
            <SuspenseWrap>
              <AboutPage />
            </SuspenseWrap>
          </PublicLayout>
        }
      />
      <Route
        path="/contact"
        element={
          <PublicLayout>
            <SuspenseWrap>
              <ContactPage />
            </SuspenseWrap>
          </PublicLayout>
        }
      />
      <Route
        path="/adopt/:petId"
        element={
          <RequireAuth>
            <PublicLayout>
              <SuspenseWrap>
                <AdoptPage />
              </SuspenseWrap>
            </PublicLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/login"
        element={
          <AuthLayout>
            <SuspenseWrap>
              <LoginPage />
            </SuspenseWrap>
          </AuthLayout>
        }
      />
      <Route
        path="/register"
        element={
          <AuthLayout>
            <SuspenseWrap>
              <RegisterPage />
            </SuspenseWrap>
          </AuthLayout>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <AuthLayout>
            <SuspenseWrap>
              <ForgotPasswordPage />
            </SuspenseWrap>
          </AuthLayout>
        }
      />
      <Route
        path="/app"
        element={
          <RequireAuth>
            <UserDashboardLayout>
              <SuspenseWrap>
                <DashboardOverview />
              </SuspenseWrap>
            </UserDashboardLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/app/pets"
        element={
          <RequireAuth>
            <UserDashboardLayout>
              <SuspenseWrap>
                <MyPetsPage />
              </SuspenseWrap>
            </UserDashboardLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/app/pets/:petId/health"
        element={
          <RequireAuth>
            <UserDashboardLayout>
              <SuspenseWrap>
                <HealthRecordsPage />
              </SuspenseWrap>
            </UserDashboardLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/app/applications"
        element={
          <RequireAuth>
            <UserDashboardLayout>
              <SuspenseWrap>
                <MyApplicationsPage />
              </SuspenseWrap>
            </UserDashboardLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/app/favourites"
        element={
          <RequireAuth>
            <UserDashboardLayout>
              <SuspenseWrap>
                <FavouritesPage />
              </SuspenseWrap>
            </UserDashboardLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/app/care"
        element={
          <RequireAuth>
            <UserDashboardLayout>
              <SuspenseWrap>
                <CarePage />
              </SuspenseWrap>
            </UserDashboardLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/app/settings"
        element={
          <RequireAuth>
            <UserDashboardLayout>
              <SuspenseWrap>
                <SettingsPage />
              </SuspenseWrap>
            </UserDashboardLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout>
              <SuspenseWrap>
                <AdminOverview />
              </SuspenseWrap>
            </AdminLayout>
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/pets"
        element={
          <RequireAdmin>
            <AdminLayout>
              <SuspenseWrap>
                <AdminPetsPage />
              </SuspenseWrap>
            </AdminLayout>
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/applications"
        element={
          <RequireAdmin>
            <AdminLayout>
              <SuspenseWrap>
                <AdminApplicationsPage />
              </SuspenseWrap>
            </AdminLayout>
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/users"
        element={
          <RequireAdmin>
            <AdminLayout>
              <SuspenseWrap>
                <AdminUsersPage />
              </SuspenseWrap>
            </AdminLayout>
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/records"
        element={
          <RequireAdmin>
            <AdminLayout>
              <SuspenseWrap>
                <AdminRecordsPage />
              </SuspenseWrap>
            </AdminLayout>
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <RequireAdmin>
            <AdminLayout>
              <SuspenseWrap>
                <AdminReportsPage />
              </SuspenseWrap>
            </AdminLayout>
          </RequireAdmin>
        }
      />
      <Route
        path="*"
        element={
          <PublicLayout>
            <SuspenseWrap>
              <NotFoundPage />
            </SuspenseWrap>
          </PublicLayout>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
