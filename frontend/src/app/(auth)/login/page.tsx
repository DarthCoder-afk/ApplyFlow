import Link from 'next/link';
import LoginForm from '@/src/app/(auth)/login-form';
import AuthPageShell from '@/src/components/auth/auth-page-shell';

export default function LoginPage() {
  return (
    <AuthPageShell mode="login">
      <div data-auth="form-heading">
        <p className="text-xs font-semibold uppercase tracking-[.15em] text-[#6657d9]">Welcome back</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-.04em] text-slate-950">Pick up where you left off.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Continue managing your applications, interviews, and next steps.</p>
      </div>
      <div className="mt-8">
          <LoginForm />
          <p className="mt-6 text-center text-sm text-slate-600">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-[#6657d9] hover:text-[#5145bb]">
              Sign up free
            </Link>
          </p>
      </div>
    </AuthPageShell>
  );
}
