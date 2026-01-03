import { Outlet, Route, Routes } from 'react-router-dom';
import { LoginPage } from '@/pages/login';
import { ChangePasswordPage } from '@/pages/change-password';
import { VerifyEmailPage } from '@/pages/verify-email';
import { AuthGuard, GuestGuard } from './guards';
import { DashboardPage } from '@/pages/dashboard';
import { RolesPage } from '@/pages/roles';
import { PermissionsPage } from '@/pages/permissions';
import { TeamsPage } from '@/pages/teams';
import { UsersPage } from '@/pages/users';
import { BoardsPage } from '@/pages/boards';
import { PlatformsPage } from '@/pages/platforms';
import { ShopsPage } from '@/pages/shops';
import { NotFoundPage } from '@/pages/not-found';
import DefaultLayout from '@/layout/default';

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
        path="/change-password"
        element={
          <AuthGuard>
            <ChangePasswordPage />
          </AuthGuard>
        }
      />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route
        path="/"
        element={
          <DefaultLayout>
            <Outlet />
          </DefaultLayout>
        }
      >
        <Route
          path="/"
          element={
            <AuthGuard>
              <DashboardPage />
            </AuthGuard>
          }
        />
        <Route
          path="/roles"
          element={
            <AuthGuard>
              <RolesPage />
            </AuthGuard>
          }
        />
        <Route
          path="/permissions"
          element={
            <AuthGuard>
              <PermissionsPage />
            </AuthGuard>
          }
        />
        <Route
          path="/teams"
          element={
            <AuthGuard>
              <TeamsPage />
            </AuthGuard>
          }
        />
        <Route
          path="/users"
          element={
            <AuthGuard>
              <UsersPage />
            </AuthGuard>
          }
        />
        <Route
          path="/boards"
          element={
            <AuthGuard>
              <BoardsPage />
            </AuthGuard>
          }
        />
        <Route
          path="/platforms"
          element={
            <AuthGuard>
              <PlatformsPage />
            </AuthGuard>
          }
        />
        <Route
          path="/shops"
          element={
            <AuthGuard>
              <ShopsPage />
            </AuthGuard>
          }
        />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
