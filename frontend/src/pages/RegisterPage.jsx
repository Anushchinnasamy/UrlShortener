import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageTransition from '../components/motion/PageTransition.jsx';
import Card from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import Toast from '../components/ui/Toast.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { getApiErrorMessage } from '../services/apiClient.js';

function validate({ username, email, password, confirm }) {
  const errors = {};
  if (!username.trim()) errors.username = 'Username is required';
  if (!email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = 'Please enter a valid email';
  if (!password) errors.password = 'Password is required';
  if (password && password.length < 6) errors.password = 'Password must be at least 6 characters';
  if (confirm !== password) errors.confirm = 'Passwords do not match';
  return errors;
}

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = React.useState({ username: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [serverError, setServerError] = React.useState('');
  const [toast, setToast] = React.useState({ show: false, tone: 'success', title: '', message: '' });

  async function onSubmit(e) {
    e.preventDefault();
    setServerError('');

    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      const res = await register({ username: form.username, email: form.email, password: form.password });
      setToast({
        show: true,
        tone: 'success',
        title: 'Account created',
        message: res?.message || 'You can now login.'
      });
      window.setTimeout(() => navigate('/login', { replace: true }), 900);
    } catch (err) {
      setServerError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageTransition>
      <Toast
        show={toast.show}
        tone={toast.tone}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />

      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
            Create your account.
          </h1>
          <p className="mt-3 text-slate-300">
            Register to generate short links and keep analytics behind JWT auth.
          </p>
          <div className="mt-6 text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-sky-200 hover:text-sky-100">
              Login
            </Link>
            .
          </div>
        </div>

        <Card>
          <div className="text-sm font-semibold text-white">Register</div>
          <div className="mt-1 text-xs text-slate-400">Uses `POST /auth/register`</div>

          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            <Input
              label="Username"
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              error={errors.username}
              autoComplete="username"
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              error={errors.email}
              autoComplete="email"
              placeholder="your.email@example.com"
            />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              error={errors.password}
              autoComplete="new-password"
            />
            <Input
              label="Confirm password"
              type="password"
              value={form.confirm}
              onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
              error={errors.confirm}
              autoComplete="new-password"
            />

            {serverError ? (
              <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {serverError}
              </div>
            ) : null}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Spinner />
                  Creating…
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </form>
        </Card>
      </div>
    </PageTransition>
  );
}

