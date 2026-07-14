import Link from 'next/link';
import { Sparkles } from 'lucide-react';
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
    <div className="grid w-full flex-1 items-center gap-12 pb-8 lg:grid-cols-2 lg:gap-20">
      <AuthWelcomePanel mode="register" />

      <Card className="mx-auto w-full max-w-md self-center rounded-[2rem] border-white/70 bg-white/90 py-2 shadow-2xl shadow-slate-900/10 backdrop-blur-sm lg:justify-self-center">
        <CardHeader className="px-7 pt-7 sm:px-8 sm:pt-8">
          <div className="mb-2 grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
            <Sparkles className="h-4 w-4" />
          </div>
          <CardTitle className="text-2xl tracking-tight">Create your account</CardTitle>
          <CardDescription className="text-slate-500">It&apos;s free—start tracking your progress in minutes.</CardDescription>
        </CardHeader>

        <CardContent className="px-7 pb-7 sm:px-8 sm:pb-8">
          <RegisterForm />

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-violet-700 hover:text-violet-600">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
