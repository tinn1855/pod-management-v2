import { Route, Routes } from 'react-router-dom';
import { LoginPage } from '@/pages/login';
import { AuthGuard, GuestGuard } from './guards';
import { DashboardPage } from '@/pages/dashboard';
import { NotFoundPage } from '@/pages/not-found';

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestGuard>
            <LoginPage />
          </GuestGuard>
        }
      />
      <Route
        path="/"
        element={
          <AuthGuard>
            <DashboardPage />
          </AuthGuard>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
