import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { authService } from '@/services/auth.service';
import { authUtils } from '@/lib/auth';
import { ROUTES } from '@/lib/constants';
import type { ChangePasswordFormData } from '@/lib/change-password.schema';
import type { User } from '@/types/auth.types';

export function useChangePassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changePassword = async (data: ChangePasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.changePassword({
        newPassword: data.newPassword,
      });

      // Update auth with tempToken and user from response
      // After successful password change, mustChangePassword should be false
      if (response.tempToken && response.user) {
        const user: User = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          status: response.user.status,
          mustChangePassword: false, // Always set to false after successful password change
          role: {
            id: response.user.role.id,
            name: response.user.role.name,
          },
          team: response.user.team
            ? {
                id: response.user.team.id,
                name: response.user.team.name,
              }
            : null,
        };
        // Update user in localStorage immediately
        authUtils.setTempToken(response.tempToken, user);
      } else {
        // If no response data, update existing user to set mustChangePassword = false
        const currentUser = authUtils.getUser();
        if (currentUser) {
          const updatedUser: User = {
            ...currentUser,
            mustChangePassword: false,
          };
          const tempToken = authUtils.getTempToken() || authUtils.getAccessToken();
          if (tempToken) {
            authUtils.setTempToken(tempToken, updatedUser);
          }
        }
      }

      // Success: show toast
      toast.success(response.message || 'Password changed successfully!');
      
      // Force redirect to dashboard using window.location to bypass any guards
      // Use a small delay to ensure localStorage is updated
      setTimeout(() => {
        window.location.href = ROUTES.HOME;
      }, 200);
    } catch (err: unknown) {
      // Failure: only show toast error, don't redirect
      let errorMessage = 'Failed to change password. Please try again.';

      if (err instanceof AxiosError) {
        errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message || errorMessage;
      }

      setError(errorMessage);
      toast.error(errorMessage);
      // Don't navigate on error - stay on change password page
    } finally {
      setIsLoading(false);
    }
  };

  return { changePassword, isLoading, error };
}

