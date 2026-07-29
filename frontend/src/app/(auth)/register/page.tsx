import Link from 'next/link';
import RegisterForm from '@/src/app/(auth)/register-form';
import AuthPageShell from '@/src/components/auth/auth-page-shell';

export default function RegisterPage() {
  return (
    <AuthPageShell mode="register">
      <div data-auth="form-heading">
        <p className="text-xs font-semibold uppercase tracking-[.15em] text-[#6657d9]">Start with clarity</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-.04em] text-slate-950">Start organizing your job search.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Create your ApplyFlow account and keep every opportunity in one place.</p>
      </div>
      <div className="mt-7">
          <RegisterForm />
          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-[#6657d9] hover:text-[#5145bb]">
              Log in
            </Link>
          </p>
      </div>
    </AuthPageShell>
  );
}
