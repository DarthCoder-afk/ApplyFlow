import Link from 'next/link';
import RegisterForm from '@/src/app/(auth)/register-form';
import AuthWelcomePanel from '@/src/app/(auth)/welcome-panel';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';

export default function RegisterPage() {
  return (
    <div className="grid flex-1 items-center gap-12 pb-8 lg:grid-cols-2 lg:gap-16">
      <AuthWelcomePanel mode="register" />

      <Card className="w-full rounded-3xl border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>It&apos;s free — start tracking in minutes.</CardDescription>
        </CardHeader>

        <CardContent>
          <RegisterForm />

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-cyan-700 hover:text-cyan-600">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
