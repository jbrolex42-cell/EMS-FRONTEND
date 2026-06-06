import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiPhone } from 'react-icons/fi';
import Loader from '../components/Loader';

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await login(data);
      toast.success(`Welcome back, ${res.user.firstName}!`);
      const redirectMap = { admin: '/admin', superadmin: '/admin', emt: '/emt' };
      navigate(redirectMap[res.user.role] || from, { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ems-black flex">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex flex-col w-1/2 bg-ems-dark border-r border-ems-border p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `linear-gradient(rgba(255,59,48,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,59,48,1) 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emergency-red/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emergency-red/5 rounded-full blur-2xl pointer-events-none" />

        <Link to="/" className="relative flex items-center gap-3 mb-auto w-fit">
          <div className="w-10 h-10 bg-emergency-red rounded-xl flex items-center justify-center shadow-lg shadow-emergency-red/30">
            <span className="text-white font-display font-bold text-sm tracking-wider">EMS</span>
          </div>
          <div>
            <div className="text-white font-semibold text-sm leading-tight">EMS Kenya</div>
            <div className="text-ems-muted text-xs">Emergency Response System</div>
          </div>
        </Link>

        <div className="relative space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emergency-red/30 bg-emergency-red/10 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emergency-red animate-pulse" />
            <span className="text-emergency-red text-xs font-medium tracking-wider uppercase">Live System</span>
          </div>
          <h2 className="text-5xl font-display text-white leading-[1.05] tracking-tight">
            EVERY SECOND<br /><span className="text-emergency-red">MATTERS.</span>
          </h2>
          <p className="text-ems-muted leading-relaxed max-w-xs">
            Sign in to access Kenya's emergency response network and coordinate life-saving operations.
          </p>
        </div>

        <div className="relative mt-auto pt-8 border-t border-ems-border flex items-center justify-between">
          <p className="text-ems-muted text-xs">Regulated by KMPDC</p>
          <p className="text-ems-muted text-xs">24/7 Emergency System</p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-emergency-red rounded-xl flex items-center justify-center shadow-lg shadow-emergency-red/30">
              <span className="text-white font-bold text-xs tracking-wider">EMS</span>
            </div>
            <div>
              <div className="text-white font-semibold text-sm">EMS Kenya</div>
              <div className="text-ems-muted text-xs">Emergency Response System</div>
            </div>
          </div>

          <h1 className="text-3xl font-display text-white tracking-tight mb-1">WELCOME BACK</h1>
          <p className="text-ems-muted text-sm mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* EMAIL */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white block">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-ems-muted" size={15} />
                <input type="email" autoComplete="email"
                  {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' } })}
                  className={`ems-input pl-11 transition-colors ${errors.email ? 'border-red-500/70 focus:border-red-500' : ''}`} />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* PASSWORD */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white">Password</label>
                <Link to="/forgot-password" className="text-emergency-red text-xs hover:text-emergency-red/80 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-ems-muted" size={15} />
                <input type={showPass ? 'text' : 'password'} placeholder="Your password" autoComplete="current-password"
                  {...register('password', { required: 'Password is required' })}
                  className={`ems-input pl-11 pr-11 transition-colors ${errors.password ? 'border-red-500/70 focus:border-red-500' : ''}`} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ems-muted hover:text-white transition-colors">
                  {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="btn-emergency w-full py-3 flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity">
              {loading ? <Loader size="sm" /> : <><span>Sign In</span><FiArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-ems-muted mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-emergency-red hover:text-emergency-red/80 font-medium transition-colors">
              Create one
            </Link>
          </p>

          <div className="mt-6 p-4 border border-emergency-red/20 rounded-xl bg-emergency-red/[0.04] text-center">
            <p className="text-xs text-ems-muted mb-2">In an emergency? Call now</p>
            <a href="tel:1514" className="text-emergency-red font-bold flex justify-center items-center gap-2 hover:text-emergency-red/80 transition-colors text-lg">
              <FiPhone size={16} /> 1514
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
