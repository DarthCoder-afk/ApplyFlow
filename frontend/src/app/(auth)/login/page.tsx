import Link from 'next/link';
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
    <div className="grid flex-1 items-center gap-12 pb-8 lg:grid-cols-2 lg:gap-16">
      <AuthWelcomePanel />

      <Card className="w-full rounded-3xl border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Log in</CardTitle>
          <CardDescription>Enter your email and password to continue.</CardDescription>
        </CardHeader>

        <CardContent>
          <LoginForm />

          <p className="mt-6 text-center text-sm text-slate-600">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium text-cyan-700 hover:text-cyan-600">
              Sign up free
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}