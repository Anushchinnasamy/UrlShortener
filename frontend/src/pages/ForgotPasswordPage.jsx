import React from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/motion/PageTransition.jsx';
import Card from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import Toast from '../components/ui/Toast.jsx';
import { api, getApiErrorMessage } from '../services/apiClient.js';

function validateEmail(email) {
  const errors = {};
  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Please enter a valid email address';
  }
  return errors;
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('');
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [serverError, setServerError] = React.useState('');
  const [toast, setToast] = React.useState({ show: false, tone: 'success', title: '', message: '' });

  async function onSubmit(e) {
    e.preventDefault();
    setServerError('');

    const nextErrors = validateEmail(email);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', { email: email.trim() });
      setToast({
        show: true,
        tone: 'success',
        title: 'Success',
        message: response.data?.message || 'Password reset link sent to your email.'
      });
      setEmail('');
      setErrors({});
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
            Forgot your password?
          </h1>
          <p className="mt-3 text-slate-300">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </p>
          <div className="mt-6 text-sm text-slate-400">
            Remember your password?{' '}
            <Link to="/login" className="font-semibold text-sky-200 hover:text-sky-100">
              Sign in
            </Link>
            .
          </div>
        </div>

        <Card>
          <div className="text-sm font-semibold text-white">Reset Password</div>
          <div className="mt-1 text-xs text-slate-400">Uses `POST /auth/forgot-password`</div>

          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="your.email@example.com"
              autoComplete="email"
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
                  Sending…
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-slate-400 hover:text-slate-300 transition"
              >
                ← Back to login
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </PageTransition>
  );
}
