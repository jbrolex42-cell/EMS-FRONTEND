import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth, ROLE_HOME } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiPhone, FiShield } from 'react-icons/fi';
import Loader from '../components/Loader';

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const { login }               = useAuth();
  const navigate                = useNavigate();
  const location                = useLocation();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const res = await login(formData);

      toast.success(`Welcome back, ${res.user.firstName}!`, {
        icon: '👋',
        duration: 3000,
      });

      // Redirect based on role — use the "from" state if it exists,
      // but NEVER let a patient land on /admin or an admin land on /dashboard
      const roleDefault = ROLE_HOME[res.user.role] || '/dashboard';
      const intendedPath = location.state?.from?.pathname;

      // Only honour "from" if it makes sense for this role
      const adminPaths   = ['/admin'];
      const isAdminRole  = ['admin','superadmin'].includes(res.user.role);
      const isAdminPath  = intendedPath?.startsWith('/admin');

      let destination = roleDefault;
      if (intendedPath && intendedPath !== '/login') {
        if (isAdminRole && isAdminPath)  destination = intendedPath;
        if (!isAdminRole && !isAdminPath) destination = intendedPath;
      }

      navigate(destination, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { value: '<13 min', label: 'Urban ETA' },
    { value: '47',      label: 'Counties'  },
    { value: '2M+',     label: 'Members'   },
    { value: '24/7',    label: 'Active'    },
  ];

  return (
    <div className="min-h-screen bg-ems-black flex">

      {/* ── LEFT PANEL (desktop only) ──────────────────── */}
      <div className="hidden lg:flex flex-col w-[45%] xl:w-1/2 bg-ems-dark border-r border-ems-border
                      p-10 xl:p-14 relative overflow-hidden">

        {/* Grid background */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              `linear-gradient(rgba(255,59,48,1) 1px,transparent 1px),
               linear-gradient(90deg,rgba(255,59,48,1) 1px,transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />
        {/* Glow */}
        <div className="absolute top-1/2 left-0 w-96 h-96 -translate-y-1/2 -translate-x-1/2
                        bg-emergency-red/10 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <Link to="/" className="relative flex items-center gap-3 mb-auto w-fit">
          <div className="w-11 h-11 bg-emergency-red rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-display text-lg tracking-wide">EMS</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm">EMS Kenya</p>
            <p className="text-ems-muted text-xs">Emergency Response System</p>
          </div>
        </Link>

        {/* Hero copy */}
        <div className="relative space-y-7 mt-16">
          <div>
            <p className="text-emergency-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">
              Kenya's #1 Emergency Platform
            </p>
            <h2 className="text-5xl xl:text-6xl font-display text-ems-white leading-[1.05]">
              EVERY SECOND<br />
              <span className="text-emergency-red">MATTERS.</span>
            </h2>
          </div>
          <p className="text-ems-muted text-base leading-relaxed max-w-sm">
            Sign in to access Kenya's fastest emergency dispatch network.
            Your membership, history, and responders — one tap away.
          </p>

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map(({ value, label }) => (
              <div key={label}
                className="bg-ems-card border border-ems-border rounded-2xl p-4
                           hover:border-emergency-red/30 transition-colors">
                <p className="text-emergency-red font-display text-2xl">{value}</p>
                <p className="text-ems-muted text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            {['KMPDC Regulated', 'SHA Integrated', 'ODPC Certified'].map(b => (
              <span key={b}
                className="flex items-center gap-1.5 text-xs text-ems-muted
                           bg-ems-card border border-ems-border px-3 py-1.5 rounded-full">
                <FiShield size={11} className="text-emergency-red" />
                {b}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mt-auto pt-6 border-t border-ems-border">
          <p className="text-ems-muted text-xs">
            © 2026 EMS Kenya · A Kenya Red Cross subsidiary
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL (form) ──────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-12">
        <div className="w-full max-w-[420px]">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-emergency-red rounded-xl flex items-center justify-center">
              <span className="text-white font-display">EMS</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm">EMS Kenya</p>
              <p className="text-ems-muted text-xs">Emergency Response System</p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-display text-ems-white mb-2 tracking-wide">
              WELCOME BACK
            </h1>
            <p className="text-ems-muted text-sm">Sign in to your emergency account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-ems-light text-sm font-medium block">
                Email Address
              </label>
              <div className="relative">
                <FiMail size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ems-muted pointer-events-none" />
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' }
                  })}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={`ems-input pl-11 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs flex items-center gap-1">
                  <span>⚠</span> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-ems-light text-sm font-medium">Password</label>
                <Link to="/forgot-password"
                  className="text-emergency-red text-xs hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <FiLock size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ems-muted pointer-events-none" />
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Your password"
                  className={`ems-input pl-11 pr-11 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2
                             text-ems-muted hover:text-white transition-colors"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs flex items-center gap-1">
                  <span>⚠</span> {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-emergency w-full py-3.5 flex items-center justify-center gap-2
                         text-base font-semibold disabled:opacity-60 disabled:cursor-not-allowed
                         mt-2"
            >
              {loading
                ? <><Loader size="sm" /><span>Signing in...</span></>
                : <><span>Sign In</span><FiArrowRight size={17} /></>
              }
            </button>
          </form>

          {/* Register link */}
          <p className="mt-7 text-center text-ems-muted text-sm">
            No account?{' '}
            <Link to="/register"
              className="text-emergency-red hover:underline font-semibold">
              Create one free
            </Link>
          </p>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-ems-border" />
            <span className="text-ems-muted text-xs uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-ems-border" />
          </div>

          {/* Emergency callout */}
          <div className="p-4 bg-emergency-red/5 border border-emergency-red/20 rounded-2xl">
            <p className="text-ems-muted text-xs text-center mb-3">
              🚨 Medical emergency? Don't wait — call now
            </p>
            <div className="grid grid-cols-2 gap-2">
              <a href="tel:1514"
                className="flex items-center justify-center gap-1.5
                           bg-emergency-red text-white text-sm font-bold
                           py-2.5 rounded-xl hover:bg-emergency-dark transition-colors
                           active:scale-95">
                <FiPhone size={14} /> 1514
              </a>
              <a href="tel:0700395395"
                className="flex items-center justify-center gap-1.5
                           border border-emergency-red/40 text-emergency-red text-sm font-medium
                           py-2.5 rounded-xl hover:bg-emergency-red/10 transition-colors
                           active:scale-95">
                <FiPhone size={14} /> 0700 395 395
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
