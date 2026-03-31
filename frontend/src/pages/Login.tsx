import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../providers/AuthProvider';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      nav('/app', { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass w-full max-w-md rounded-3xl border border-white/40 p-8">
        <div className="mb-6 text-center">
          <motion.h1 layout className="text-2xl font-semibold text-gray-800">Welcome back</motion.h1>
          <p className="mt-1 text-sm text-gray-600">Use the default credentials or register a new account.</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-700">Email</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-700">Password</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <motion.button whileTap={{ scale: 0.98 }} whileHover={{ y: -1 }} disabled={loading} className="btn btn-primary w-full" type="submit">
            {loading ? 'Signing in…' : 'Sign in'}
          </motion.button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          No account? <Link className="underline" to="/register">Create one</Link>
        </div>
      </motion.div>
    </div>
  );
}
