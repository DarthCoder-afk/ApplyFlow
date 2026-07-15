import Link from 'next/link';
import { LogIn } from 'lucide-react';
import LoginForm from '@/src/app/(auth)/login-form';
import AuthWelcomePanel from '@/src/app/(auth)/welcome-panel';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';

export default function LoginPage() {
  return (
    <div className="grid w-full flex-1 items-center gap-12 pb-8 lg:grid-cols-2 lg:gap-20">
      <AuthWelcomePanel />

      <Card className="mx-auto w-full max-w-md self-center rounded-[2rem] border-white/70 bg-white/90 py-2 shadow-2xl shadow-slate-900/10 backdrop-blur-sm lg:justify-self-center">
        <CardHeader className="px-7 pt-7 sm:px-8 sm:pt-8">
          <div className="mb-2 grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
            <LogIn className="h-4 w-4" />
          </div>
          <CardTitle className="text-2xl tracking-tight">Welcome back</CardTitle>
          <CardDescription className="text-slate-500">
            Enter your details to pick up where you left off.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-7 pb-7 sm:px-8 sm:pb-8">
          <LoginForm />

          <p className="mt-6 text-center text-sm text-slate-600">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-violet-700 hover:text-violet-600">
              Sign up free
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
