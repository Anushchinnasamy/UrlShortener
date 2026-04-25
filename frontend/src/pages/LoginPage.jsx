import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PageTransition from '../components/motion/PageTransition.jsx';
import Card from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { getApiErrorMessage } from '../services/apiClient.js';

function validate({ usernameOrEmail, password }) {
  const errors = {};
  if (!usernameOrEmail.trim()) errors.usernameOrEmail = 'Username or email is required';
  if (!password) errors.password = 'Password is required';
  return errors;
}

export default function LoginPage() {
  const { login, isAuthed } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = React.useState({ usernameOrEmail: '', password: '' });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [serverError, setServerError] = React.useState('');

  const redirectTo = location.state?.from || '/dashboard';

  React.useEffect(() => {
    if (isAuthed) navigate('/dashboard', { replace: true });
  }, [isAuthed, navigate]);

  async function onSubmit(e) {
    e.preventDefault();
    setServerError('');

    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      await login(form);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setServerError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageTransition>
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
            Welcome back.
          </h1>
          <p className="mt-3 text-slate-300">
            Sign in to shorten URLs and view analytics in your dashboard.
          </p>
          <div className="mt-6 text-sm text-slate-400">
            No account?{' '}
            <Link to="/register" className="font-semibold text-sky-200 hover:text-sky-100">
              Create one
            </Link>
            .
          </div>
        </div>

        <Card>
          <div className="text-sm font-semibold text-white">Login</div>
          <div className="mt-1 text-xs text-slate-400">Uses `POST /auth/login`</div>

          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            <Input
              label="Username or Email"
              value={form.usernameOrEmail}
              onChange={(e) => setForm((f) => ({ ...f, usernameOrEmail: e.target.value }))}
              error={errors.usernameOrEmail}
              autoComplete="username"
              placeholder="Enter username or email"
            />
            <div>
              <Input
                label="Password"
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                error={errors.password}
                autoComplete="current-password"
              />
              <div className="mt-2 text-right">
                <Link
                  to="/forgot-password"
                  className="text-xs text-slate-400 hover:text-sky-200 transition"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {serverError ? (
              <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {serverError}
              </div>
            ) : null}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Spinner />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>
        </Card>
      </div>
    </PageTransition>
  );
}

