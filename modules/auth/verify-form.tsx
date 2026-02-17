'use client';

import z from 'zod';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { Route } from 'next';
import { zodResolver } from '@hookform/resolvers/zod';
import { OTPSchema } from '@/lib/validations';
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { authClient } from '@/lib/auth-client';
import { FormInputOTP } from '@/components/form';
import { Button } from '@/components/ui/button';
import { AlertCircleIcon, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Loader } from '@/components/ui/loader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const RESEND_COOLDOWN = 60;

type FormValue = z.infer<typeof OTPSchema>;

export const VerifyForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') as string;
  const callbackUrl = searchParams.get('callbackURL') ?? '/';
  const [verifyPending, startVerifyTransition] = useTransition();
  const [resendPending, startResendTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const form = useForm<FormValue>({
    resolver: zodResolver(OTPSchema),
    defaultValues: {
      otp: '',
    },
  });

  const handleVerify = async (data: FormValue) => {
    startVerifyTransition(async () => {
      await authClient.signIn.emailOtp({
        email,
        otp: data.otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success('Success', {
              description: 'You have been successfully signed in!',
            });
            form.reset();
            router.push(callbackUrl as Route);
          },
          onError: (error) => {
            setError(error.error?.message || 'Login failed. Please try again.');
          },
        },
      });
    });
  };

  const handleResend = async () => {
    startResendTransition(async () => {
      if (!email) {
        toast.error('Error', {
          description: 'Email address not found. Please try again.',
        });
        return;
      }

      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: 'sign-in',
        fetchOptions: {
          onSuccess: () => {
            toast.success('Success', {
              description: 'Sign in code sent! Please check your email.',
            });
          },
          onError: () => {
            toast.error('Failed to send code');
          },
        },
      });

      setCountdown(RESEND_COOLDOWN);
    });
  };

  return (
    <FieldSet>
      <FieldLegend>Verify your login</FieldLegend>
      <FieldDescription>
        Enter the verification code we sent to your email address:{' '}
        <span className="text-foreground">{email}</span>.
      </FieldDescription>
      <form onSubmit={form.handleSubmit(handleVerify)}>
        <FieldGroup>
          <FormInputOTP
            name="otp"
            control={form.control}
            label="Verification Code"
            fieldClassName=""
            labelAction={
              <Button
                variant="outline"
                size="xs"
                disabled={resendPending || countdown > 0 || verifyPending}
                onClick={handleResend}
              >
                {resendPending ? (
                  <>
                    <Loader />
                    <span>Resending...</span>
                  </>
                ) : (
                  <>
                    <RefreshCcw />
                    <span>Resend code</span>
                  </>
                )}
              </Button>
            }
          >
            <FieldDescription className="-ml-5 flex w-full items-center justify-start">
              <Button variant="link" className="text-muted-foreground">
                Use a different email address
              </Button>
            </FieldDescription>
          </FormInputOTP>

          {!!error && (
            <Alert
              variant="destructive"
              className="bg-destructive/10 border-destructive/20 border"
            >
              <AlertCircleIcon />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col items-center gap-2">
            <Button
              type="submit"
              className="w-full"
              disabled={verifyPending || resendPending}
            >
              {verifyPending ? (
                <>
                  <Loader />
                  <span>Verifying...</span>
                </>
              ) : (
                'Verify Email'
              )}
            </Button>
            <div className="text-muted-foreground">
              Having trouble signing in?{' '}
              <Button
                type="button"
                variant="link"
                className="text-muted-foreground px-0"
              >
                Contact support
              </Button>
            </div>
          </div>
        </FieldGroup>
      </form>
    </FieldSet>
  );
};
