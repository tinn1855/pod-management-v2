import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Mail, Loader2 } from 'lucide-react';
import { useVerifyEmail } from '@/hooks/use-verify-email';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ROUTES } from '@/lib/constants';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const { verifyEmail, resendVerificationEmail, isLoading, error, isVerified } =
    useVerifyEmail();
  const [hasAttempted, setHasAttempted] = useState(false);

  useEffect(() => {
    if (token && !hasAttempted) {
      setHasAttempted(true);
      verifyEmail(token);
    }
  }, [token, hasAttempted, verifyEmail]);

  const handleResend = async () => {
    await resendVerificationEmail();
  };

  const handleGoToLogin = () => {
    navigate(ROUTES.LOGIN);
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <XCircle className="mx-auto h-12 w-12 text-destructive" />
            <CardTitle className="text-2xl font-bold">Invalid Verification Link</CardTitle>
            <CardDescription>
              The verification link is invalid or missing a token.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleResend} className="w-full" variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Resend Verification Email
            </Button>
            <Button onClick={handleGoToLogin} className="w-full" variant="ghost">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <CardTitle className="text-2xl font-bold">Verifying Email</CardTitle>
            <CardDescription>Please wait while we verify your email...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isVerified) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <CardTitle className="text-2xl font-bold">Email Verified!</CardTitle>
            <CardDescription>
              Your email has been successfully verified. You can now log in to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGoToLogin} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <XCircle className="mx-auto h-12 w-12 text-destructive" />
            <CardTitle className="text-2xl font-bold">Verification Failed</CardTitle>
            <CardDescription className="text-destructive">{error}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => verifyEmail(token)}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Retrying...
                </>
              ) : (
                'Try Again'
              )}
            </Button>
            <Button onClick={handleResend} className="w-full" variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Resend Verification Email
            </Button>
            <Button onClick={handleGoToLogin} className="w-full" variant="ghost">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}

