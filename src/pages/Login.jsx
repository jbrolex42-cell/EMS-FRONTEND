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

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await login(data);
      toast.success(`Welcome back, ${res.user.firstName}!`);

      const redirectMap = {
        admin: '/admin',
        superadmin: '/admin',
        emt: '/emt'
      };

      navigate(redirectMap[res.user.role] || from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ems-black flex">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col w-1/2 bg-ems-dark border-r border-ems-border p-12 relative overflow-hidden">

        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              `linear-gradient(rgba(255,59,48,1) 1px, transparent 1px),
               linear-gradient(90deg, rgba(255,59,48,1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

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
          <h2 className="text-5xl font-display text-white leading-none">
            EVERY SECOND<br />
            <span className="text-emergency-red">MATTERS.</span>
          </h2>

          <p className="text-ems-muted leading-relaxed">
            Sign in to access Kenya's emergency response network.
          </p>
        </div>

        <div className="relative mt-auto pt-8 border-t border-ems-border">
          <p className="text-ems-muted text-xs">
            Regulated by KMPDC · 24/7 Emergency System
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">

        <div className="w-full max-w-md">

          <h1 className="text-3xl font-display text-white mb-2">
            WELCOME BACK
          </h1>
          <p className="text-ems-muted text-sm mb-8">
            Sign in to your account
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* EMAIL */}
            <div>
              <label className="text-sm text-white mb-2 block">
                Email Address
              </label>

              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-ems-muted" size={16} />

                <input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...register('email', {
                    required: 'Email required',
                    pattern: {
                      value: /^\S+@\S+$/,
                      message: 'Invalid email'
                    }
                  })}
                  className="ems-input pl-11"
                />
              </div>

              {errors.email && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm text-white mb-2 block">
                Password
              </label>

              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-ems-muted" size={16} />

                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Your password"
                  autoComplete="current-password"
                  {...register('password', {
                    required: 'Password required'
                  })}
                  className="ems-input pl-11 pr-11"
                />

                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ems-muted"
                >
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* FORGOT PASSWORD */}
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-emergency-red text-sm">
                Forgot password?
              </Link>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="btn-emergency w-full py-3 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader size="sm" />
              ) : (
                <>
                  Sign In <FiArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* REGISTER */}
          <p className="text-center text-sm text-ems-muted mt-8">
            No account?{' '}
            <Link to="/register" className="text-emergency-red">
              Create one
            </Link>
          </p>

          {/* EMERGENCY */}
          <div className="mt-6 p-4 border border-emergency-red/20 rounded-xl text-center">
            <p className="text-xs text-ems-muted mb-1">
              Emergency line
            </p>
            <a
              href="tel:1514"
              className="text-emergency-red font-bold flex justify-center items-center gap-2"
            >
              <FiPhone size={16} /> 1514
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}