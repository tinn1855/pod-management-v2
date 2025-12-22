import { useState } from 'react';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { authService } from '@/services/auth.service';
import { userService } from '@/services/user.service';
import { authUtils } from '@/lib/auth';

export function useVerifyEmail() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  const verifyEmail = async (token: string) => {
    setIsLoading(true);
    setError(null);
    setIsVerified(false);

    try {
      await authService.verifyEmail({ token });

      // Fetch updated user data to get the latest email verification status
      try {
        const updatedUser = await userService.getCurrentUser();
        const accessToken = authUtils.getAccessToken();
        const refreshToken = authUtils.getRefreshToken();
        if (accessToken && refreshToken) {
          authUtils.setAuth(accessToken, refreshToken, updatedUser);
        }
      } catch (err) {
        // If fetching user fails, continue anyway
        console.error('Failed to fetch updated user data:', err);
      }

      setIsVerified(true);
      toast.success('Email verified successfully!');
    } catch (err: unknown) {
      let errorMessage = 'Failed to verify email. Please try again.';

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
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.resendVerificationEmail();
      toast.success('Verification email sent successfully!');
    } catch (err: unknown) {
      let errorMessage = 'Failed to resend verification email. Please try again.';

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
    } finally {
      setIsLoading(false);
    }
  };

  return { verifyEmail, resendVerificationEmail, isLoading, error, isVerified };
}

