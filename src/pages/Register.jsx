import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth, ROLE_HOME } from '../context/AuthContext';
import {
  FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff,
  FiArrowRight, FiCheckCircle, FiShield
} from 'react-icons/fi';
import Loader from '../components/Loader';
import { KENYAN_COUNTIES } from '../utils/constants';

export default function Register() {
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading,     setLoading]     = useState(false);
  const { register: registerUser }    = useAuth();
  const navigate                      = useNavigate();

  const {
    register, handleSubmit, watch,
    formState: { errors }
  } = useForm({ mode: 'onBlur' });

  const password = watch('password', '');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await registerUser(data);
      toast.success(`Welcome to EMS Kenya, ${res.user.firstName}! 🚑`, { duration: 4000 });
      navigate(ROLE_HOME[res.user.role] || '/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    'One-tap SOS from anywhere in Kenya',
    'Live ambulance tracking & real-time ETA',
    'SHA ECCIF cost coverage integration',
    'AI triage in Swahili and English',
    'KMPDC-certified responders only',
    'Covers all 47 counties, 24 / 7',
  ];

  const strengthChecks = [
    { label: 'At least 8 characters',  test: (p) => p.length >= 8 },
    { label: 'One uppercase letter',   test: (p) => /[A-Z]/.test(p) },
    { label: 'One number',             test: (p) => /[0-9]/.test(p) },
  ];
  const passStrength = strengthChecks.filter(c => c.test(password)).length;
  const strengthColor = ['bg-red-500','bg-yellow-500','bg-green-500'][passStrength - 1] || 'bg-ems-border';

  return (
    <div className="min-h-screen bg-ems-black flex">

      {/* ── LEFT PANEL ─────────────────────────────────── */}
      <div className="hidden lg:flex flex-col w-[42%] xl:w-5/12 bg-ems-dark border-r border-ems-border
                      p-10 xl:p-14 relative overflow-hidden">

        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              `linear-gradient(rgba(255,59,48,1) 1px,transparent 1px),
               linear-gradient(90deg,rgba(255,59,48,1) 1px,transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />
        <div className="absolute top-1/3 -left-20 w-80 h-80
                        bg-emergency-red/10 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <Link to="/" className="relative flex items-center gap-3 w-fit">
          <div className="w-11 h-11 bg-emergency-red rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-display text-lg">EMS</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm">EMS Kenya</p>
            <p className="text-ems-muted text-xs">Emergency Response System</p>
          </div>
        </Link>

        {/* Copy */}
        <div className="relative mt-12 space-y-7 flex-1">
          <div>
            <p className="text-emergency-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">
              Free to join
            </p>
            <h2 className="text-4xl xl:text-5xl font-display text-ems-white leading-tight">
              JOIN KENYA'S<br />
              <span className="text-emergency-red">EMERGENCY</span><br />
              NETWORK
            </h2>
          </div>
          <p className="text-ems-muted text-sm leading-relaxed max-w-xs">
            Free account. Emergency cover from KES 4,000 / year.
            No payment required at the scene.
          </p>

          {/* Perks */}
          <ul className="space-y-2.5">
            {perks.map(p => (
              <li key={p} className="flex items-start gap-2.5 text-sm">
                <FiCheckCircle size={15} className="text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-ems-muted">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Trust badges */}
        <div className="relative pt-6 border-t border-ems-border space-y-3">
          <div className="flex flex-wrap gap-2">
            {['KMPDC Regulated', 'SHA Integrated', 'ODPC Certified'].map(b => (
              <span key={b}
                className="flex items-center gap-1.5 text-xs text-ems-muted
                           bg-ems-card border border-ems-border px-3 py-1.5 rounded-full">
                <FiShield size={11} className="text-emergency-red" />
                {b}
              </span>
            ))}
          </div>
          <p className="text-ems-muted text-xs">
            Already have an account?{' '}
            <Link to="/login" className="text-emergency-red hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ─────────────────────────────────── */}
      <div className="flex-1 flex items-start justify-center overflow-y-auto">
        <div className="w-full max-w-[480px] px-6 sm:px-10 py-10">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-emergency-red rounded-xl flex items-center justify-center">
              <span className="text-white font-display">EMS</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm">EMS Kenya</p>
              <p className="text-ems-muted text-xs">Emergency Response System</p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-3xl sm:text-4xl font-display text-ems-white mb-2 tracking-wide">
              CREATE ACCOUNT
            </h1>
            <p className="text-ems-muted text-sm">
              Free to register. Emergency cover activated instantly.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-ems-light text-sm font-medium block">First Name</label>
                <div className="relative">
                  <FiUser size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ems-muted pointer-events-none" />
                  <input
                    {...register('firstName', { required: 'Required' })}
                    placeholder="Jane"
                    autoComplete="given-name"
                    className={`ems-input pl-10 ${errors.firstName ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.firstName && <p className="text-red-400 text-xs">⚠ {errors.firstName.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-ems-light text-sm font-medium block">Last Name</label>
                <div className="relative">
                  <FiUser size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ems-muted pointer-events-none" />
                  <input
                    {...register('lastName', { required: 'Required' })}
                    placeholder="Doe"
                    autoComplete="family-name"
                    className={`ems-input pl-10 ${errors.lastName ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.lastName && <p className="text-red-400 text-xs">⚠ {errors.lastName.message}</p>}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-ems-light text-sm font-medium block">Email Address</label>
              <div className="relative">
                <FiMail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ems-muted pointer-events-none" />
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' }
                  })}
                  type="email"
                  placeholder="jane@example.com"
                  autoComplete="email"
                  className={`ems-input pl-10 ${errors.email ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs">⚠ {errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-ems-light text-sm font-medium block">Phone Number</label>
              <div className="relative">
                <FiPhone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ems-muted pointer-events-none" />
                <input
                  {...register('phone', {
                    required: 'Phone is required',
                    pattern: { value: /^0[0-9]{9}$/, message: 'Enter a valid Kenyan number (e.g. 0712345678)' }
                  })}
                  type="tel"
                  placeholder="0712 345 678"
                  autoComplete="tel"
                  className={`ems-input pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.phone && <p className="text-red-400 text-xs">⚠ {errors.phone.message}</p>}
            </div>

            {/* County */}
            <div className="space-y-1.5">
              <label className="text-ems-light text-sm font-medium block">County</label>
              <select
                {...register('address.county')}
                className="ems-input"
              >
                <option value="">Select your county</option>
                {KENYAN_COUNTIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-ems-light text-sm font-medium block">Password</label>
              <div className="relative">
                <FiLock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ems-muted pointer-events-none" />
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Minimum 8 characters' }
                  })}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min 8 characters"
                  autoComplete="new-password"
                  className={`ems-input pl-10 pr-11 ${errors.password ? 'border-red-500' : ''}`}
                />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ems-muted hover:text-white transition-colors">
                  {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs">⚠ {errors.password.message}</p>}

              {/* Strength bar */}
              {password.length > 0 && (
                <div className="space-y-1.5 mt-1">
                  <div className="flex gap-1">
                    {[0,1,2].map(i => (
                      <div key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i < passStrength ? strengthColor : 'bg-ems-border'
                        }`} />
                    ))}
                  </div>
                  <div className="flex gap-3">
                    {strengthChecks.map(({ label, test }) => (
                      <span key={label}
                        className={`text-xs flex items-center gap-1 transition-colors ${
                          test(password) ? 'text-green-400' : 'text-ems-muted'
                        }`}>
                        <span className={`w-1 h-1 rounded-full inline-block ${test(password) ? 'bg-green-400' : 'bg-ems-muted'}`} />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <label className="text-ems-light text-sm font-medium block">Confirm Password</label>
              <div className="relative">
                <FiLock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ems-muted pointer-events-none" />
                <input
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: v => v === password || 'Passwords do not match'
                  })}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  className={`ems-input pl-10 pr-11 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ems-muted hover:text-white transition-colors">
                  {showConfirm ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs">⚠ {errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 pt-1">
              <input
                {...register('terms', { required: 'You must agree to continue' })}
                type="checkbox"
                id="terms"
                className="mt-1 accent-emergency-red w-4 h-4 flex-shrink-0 cursor-pointer"
              />
              <label htmlFor="terms" className="text-ems-muted text-xs leading-relaxed cursor-pointer">
                I agree to the{' '}
                <Link to="#" className="text-emergency-red hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="#" className="text-emergency-red hover:underline">Privacy Policy</Link>.
                My health data is processed under Kenya's Data Protection Act 2019.
              </label>
            </div>
            {errors.terms && (
              <p className="text-red-400 text-xs">⚠ {errors.terms.message}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-emergency w-full py-3.5 flex items-center justify-center gap-2
                         text-base font-semibold disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading
                ? <><Loader size="sm" /><span>Creating account...</span></>
                : <><span>Create My Account</span><FiArrowRight size={17} /></>
              }
            </button>
          </form>

          {/* Sign in link */}
          <p className="mt-6 text-center text-ems-muted text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-emergency-red hover:underline font-semibold">
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
