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
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ems-black flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col w-1/2 bg-ems-dark border-r border-ems-border p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `linear-gradient(rgba(255,59,48,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,59,48,1) 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emergency-red/10 rounded-full blur-3xl" />

        <Link to="/" className="relative flex items-center gap-3 mb-auto">
          <div className="w-10 h-10 bg-emergency-red rounded-xl flex items-center justify-center">
            <span className="text-white font-display text-lg">EMS</span>
          </div>
          <div>
            <div className="text-white font-semibold text-sm">EMS Kenya</div>
            <div className="text-ems-muted text-xs">Emergency Response System</div>
          </div>
        </Link>

        <div className="relative space-y-8">
          <h2 className="text-5xl font-display text-ems-white leading-none">
            EVERY SECOND<br /><span className="text-emergency-red">MATTERS.</span>
          </h2>
          <p className="text-ems-muted leading-relaxed">
            Sign in to access Kenya's fastest emergency dispatch network. Your membership, history, and responders — one tap away.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '<13 min', label: 'Urban ETA' },
              { value: '47', label: 'Counties' },
              { value: '2M+', label: 'Members' },
              { value: '24/7', label: 'Active' }
            ].map(({ value, label }) => (
              <div key={label} className="bg-ems-card border border-ems-border rounded-xl p-4">
                <div className="text-emergency-red font-display text-2xl">{value}</div>
                <div className="text-ems-muted text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-auto pt-8 border-t border-ems-border">
          <p className="text-ems-muted text-xs">Regulated by KMPDC · SHA Integrated · ODPC Certified</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-9 h-9 bg-emergency-red rounded-lg flex items-center justify-center">
              <span className="text-white font-display">EMS</span>
            </div>
            <span className="text-ems-white font-semibold">EMS Kenya</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-display text-ems-white mb-2">WELCOME BACK</h1>
            <p className="text-ems-muted text-sm">Sign in to your emergency account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="text-ems-light text-sm font-medium mb-2 block">Email Address</label>
              <div className="relative">
                <FiMail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ems-muted" />
                <input
                  {...register('email', { required: 'Email required', pattern: { value: /^\S+@\S+$/, message: 'Invalid email' } })}
                  type="email"
                  placeholder="you@example.com"
                  className="ems-input pl-11"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-ems-light text-sm font-medium mb-2 block">Password</label>
              <div className="relative">
                <FiLock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ems-muted" />
                <input
                  {...register('password', { required: 'Password required' })}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Your password"
                  className="ems-input pl-11 pr-11"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ems-muted hover:text-white transition-colors">
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-emergency-red text-sm hover:underline">
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loading} className="btn-emergency w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <Loader size="sm" /> : <><span>Sign In</span><FiArrowRight size={16} /></>}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-ems-muted text-sm">
              No account?{' '}
              <Link to="/register" className="text-emergency-red hover:underline font-medium">Create one free</Link>
            </p>
          </div>

          <div className="mt-6 p-4 bg-emergency-red/5 border border-emergency-red/20 rounded-xl text-center">
            <p className="text-ems-muted text-xs mb-1">Emergency? Don't wait — call now</p>
            <a href="tel:1514" className="text-emergency-red font-bold text-lg flex items-center justify-center gap-2">
              <FiPhone size={16} /> 1514 (Toll Free)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
