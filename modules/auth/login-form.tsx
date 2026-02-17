'use client';

import z from 'zod';
import { useForm } from 'react-hook-form';
import { LoginSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { OAuthForm } from './oauth-form';
import { FieldDescription, FieldGroup } from '@/components/ui/field';
import { FormInputGroup } from '@/components/form';
import { AtSignIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { Route } from 'next';

type FormValue = z.infer<typeof LoginSchema>;

export const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackURL') ?? '/';
  const [googlePending, startGoogleTransition] = useTransition();
  const [githubPending, startGithubTransition] = useTransition();
  const [emailPending, startEmailTransition] = useTransition();

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    await authClient.signIn.social({
      provider,
      callbackURL: callbackUrl,
      errorCallbackURL: '/banned',
      fetchOptions: {
        onError: (ctx) => {
          if (ctx.error?.message?.toLowerCase().includes('banned')) {
            toast.error('Your account has been suspended');
          } else {
            toast.error('Authentication failed. Please try again.');
          }
        },
      },
    });
  };

  const handleGoogleLogin = async () => {
    startGoogleTransition(async () => {
      await handleSocialLogin('google');
    });
  };

  const handleGithubLogin = async () => {
    startGithubTransition(async () => {
      await handleSocialLogin('github');
    });
  };

  const form = useForm<FormValue>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleLogin = async (data: FormValue) => {
    startEmailTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email: data.email,
        type: 'sign-in',
        fetchOptions: {
          onSuccess: () => {
            toast.success('Success', {
              description: 'Sign-in code sent! Please check your email.',
            });
            form.reset();
            router.push(
              `/verify-email?email=${encodeURIComponent(data.email)}&callbackURL=${encodeURIComponent(callbackUrl)}` as Route
            );
          },
          onError: () => {
            toast.error('Error sending sign-in code');
          },
        },
      });
    });
  };

  const loginPending =
    emailPending || googlePending || githubPending || !form.formState.isDirty;

  return (
    <FieldGroup className="gap-4">
      <div className="flex flex-col space-y-1">
        <h1 className="text-2xl font-bold tracking-wide">Welcome back</h1>
        <p className="text-muted-foreground text-base">
          Sign in to your account to continue
        </p>
      </div>

      <OAuthForm
        googlePending={googlePending}
        githubPending={githubPending}
        googleLogin={handleGoogleLogin}
        githubLogin={handleGithubLogin}
      />

      <div className="flex w-full items-center justify-center">
        <div className="bg-border h-px w-full" />
        <span className="text-muted-foreground px-2 text-xs">OR</span>
        <div className="bg-border h-px w-full" />
      </div>

      <form onSubmit={form.handleSubmit(handleLogin)}>
        <FieldGroup className="gap-4">
          <FormInputGroup
            name="email"
            control={form.control}
            placeholder="your.email@example.com"
            description="Enter your email to receive a sign-in code"
            leftAddon={<AtSignIcon />}
          />

          <Button
            type="submit"
            className="w-full gap-2"
            disabled={loginPending}
          >
            {emailPending ? (
              <>
                <Loader />
                <span>Sending...</span>
              </>
            ) : (
              'Continue With Email'
            )}
          </Button>
        </FieldGroup>
      </form>

      <FieldDescription className="w-full">
        By clicking continue, you agree to our{' '}
        <span className="hover:text-foreground cursor-pointer p-0 underline-offset-4 hover:underline">
          Terms of Service
        </span>{' '}
        and{' '}
        <span className="hover:text-foreground cursor-pointer p-0 underline-offset-4 hover:underline">
          Privacy Policy
        </span>
        .
      </FieldDescription>
    </FieldGroup>
  );
};
