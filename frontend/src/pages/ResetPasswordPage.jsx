import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageTransition from '../components/motion/PageTransition.jsx';
import Card from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import Toast from '../components/ui/Toast.jsx';
import { api, getApiErrorMessage } from '../services/apiClient.js';

function validate({ password, confirmPassword }) {
  const errors = {};
  if (!password) errors.password = 'Password is required';
  if (password && password.length < 6) errors.password = 'Password must be at least 6 characters';
  if (confirmPassword !== password) errors.confirmPassword = 'Passwords do not match';
  return errors;
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [form, setForm] = React.useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [serverError, setServerError] = React.useState('');
  const [toast, setToast] = React.useState({ show: false, tone: 'success', title: '', message: '' });

  React.useEffect(() => {
    if (!token) {
      setServerError('Invalid reset link. Please request a new password reset.');
    }
  }, [token]);

  async function onSubmit(e) {
    e.preventDefault();
    setServerError('');

    if (!token) {
      setServerError('Invalid reset link');
      return;
    }

    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        newPassword: form.password
      });
      setToast({
        show: true,
        tone: 'success',
        title: 'Success',
        message: response.data?.message || 'Password reset successfully!'
      });
      window.setTimeout(() => navigate('/login', { replace: true }), 1500);
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

      <div className="mx-auto max-w-2xl">
        <Card>
          <div className="text-center">
            <h1 className="text-2xl font-black tracking-tight text-white">
              Reset Your Password
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Enter your new password below
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <Input
              label="New Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              error={errors.password}
              autoComplete="new-password"
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />

            {serverError ? (
              <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {serverError}
              </div>
            ) : null}

            <Button type="submit" className="w-full" disabled={loading || !token}>
              {loading ? (
                <>
                  <Spinner />
                  Resetting…
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>
        </Card>
      </div>
    </PageTransition>
  );
}
