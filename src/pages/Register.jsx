import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { ROLE_HOME } from '../context/AuthContext';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiCheckCircle,
  FiMapPin,
  FiShield,
  FiActivity,
  FiHeart
} from 'react-icons/fi';
import Loader from '../components/Loader';
import { KENYAN_COUNTIES } from '../utils/constants';

export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    if (!selectedRole) {
      toast.error('Please select your account type to continue.');
      return;
    }
    setLoading(true);
    try {
      const res = await registerUser({ ...data, role: selectedRole });
      toast.success(`Welcome to EMS Kenya, ${res.user.firstName}!`);
      navigate(ROLE_HOME[res.user.role] || '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    { icon: '🆘', text: 'One-tap SOS anywhere in Kenya' },
    { icon: '🚑', text: 'Live ambulance tracking' },
    { icon: '🤖', text: 'AI triage support' },
    { icon: '🕐', text: '24/7 emergency response' }
  ];

  return (
    <div className="min-h-screen bg-ems-black flex">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex flex-col w-5/12 bg-ems-dark border-r border-ems-border p-12 relative overflow-hidden">

        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              `linear-gradient(rgba(255,59,48,1) 1px, transparent 1px),
               linear-gradient(90deg, rgba(255,59,48,1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Ambient glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emergency-red/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-12 right-0 w-48 h-48 bg-emergency-red/5 rounded-full blur-2xl pointer-events-none" />

        {/* Logo */}
        <Link to="/" className="relative flex items-center gap-3 w-fit">
          <div className="w-10 h-10 bg-emergency-red rounded-xl flex items-center justify-center shadow-lg shadow-emergency-red/30">
            <span className="text-white font-bold text-sm tracking-wider">EMS</span>
          </div>
          <div>
            <div className="text-white font-semibold text-sm leading-tight">EMS Kenya</div>
            <div className="text-ems-muted text-xs">Emergency System</div>
          </div>
        </Link>

        {/* Hero copy */}
        <div className="relative mt-14 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emergency-red/30 bg-emergency-red/10 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emergency-red animate-pulse" />
            <span className="text-emergency-red text-xs font-medium tracking-wider uppercase">Join the Network</span>
          </div>

          <h2 className="text-4xl font-display text-white leading-[1.05] tracking-tight">
            JOIN{' '}
            <span className="text-emergency-red">EMS KENYA</span>
          </h2>

          <p className="text-ems-muted text-sm leading-relaxed">
            Create your emergency profile in seconds and get instant access to life-saving services.
          </p>

          <ul className="space-y-3 pt-2">
            {perks.map(({ icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-ems-muted">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-ems-black/50 border border-ems-border text-base shrink-0">
                  {icon}
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="relative mt-auto pt-8 border-t border-ems-border flex items-center justify-between">
          <p className="text-ems-muted text-xs">Regulated by KMPDC</p>
          <p className="text-ems-muted text-xs">24/7 Emergency System</p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex justify-center items-start overflow-y-auto p-6 lg:p-12">
        <div className="w-full max-w-lg py-4">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-emergency-red rounded-xl flex items-center justify-center shadow-lg shadow-emergency-red/30">
              <span className="text-white font-bold text-xs tracking-wider">EMS</span>
            </div>
            <div>
              <div className="text-white font-semibold text-sm">EMS Kenya</div>
              <div className="text-ems-muted text-xs">Emergency System</div>
            </div>
          </div>

          <h1 className="text-3xl font-display text-white tracking-tight mb-1">
            CREATE ACCOUNT
          </h1>
          <p className="text-ems-muted text-sm mb-8">
            Fill in your details to get started
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

            {/* NAME ROW */}
            <div className="grid grid-cols-2 gap-4">

              {/* FIRST NAME */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white block">
                  First Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ems-muted" size={14} />
                  <input
                    type="text"
                    autoComplete="given-name"

                    {...register('firstName', { required: 'Required' })}
                    className={`ems-input pl-10 transition-colors ${
                      errors.firstName ? 'border-red-500/70 focus:border-red-500' : ''
                    }`}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>
                )}
              </div>

              {/* LAST NAME */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white block">
                  Last Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ems-muted" size={14} />
                  <input
                    type="text"
                    autoComplete="family-name"

                    {...register('lastName', { required: 'Required' })}
                    className={`ems-input pl-10 transition-colors ${
                      errors.lastName ? 'border-red-500/70 focus:border-red-500' : ''
                    }`}
                  />
                </div>
                {errors.lastName && (
                  <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* EMAIL */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white block">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-ems-muted" size={14} />
                <input
                  type="email"
                  autoComplete="email"

                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: 'Enter a valid email address'
                    }
                  })}
                  className={`ems-input pl-11 transition-colors ${
                    errors.email ? 'border-red-500/70 focus:border-red-500' : ''
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* PHONE */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white block">
                Phone Number
              </label>
              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-ems-muted" size={14} />
                <input
                  type="tel"
                  autoComplete="tel"

                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^0[0-9]{9}$/,
                      message: 'Enter a valid Kenyan number (e.g. 0712345678)'
                    }
                  })}
                  className={`ems-input pl-11 transition-colors ${
                    errors.phone ? 'border-red-500/70 focus:border-red-500' : ''
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>

            {/* COUNTY */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white block">
                County
              </label>
              <div className="relative">
                <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-ems-muted pointer-events-none" size={14} />
                <select
                  {...register('address.county')}
                  autoComplete="address-level1"
                  className="ems-input pl-11 appearance-none cursor-pointer"
                >
                  <option value="">Select your county</option>
                  {KENYAN_COUNTIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ROLE SELECTION */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white block">
                Account Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    value: 'patient',
                    icon: <FiHeart size={20} />,
                    label: 'Patient',
                    desc: 'Request emergency services'
                  },
                  {
                    value: 'emt',
                    icon: <FiActivity size={20} />,
                    label: 'EMT',
                    desc: 'Respond to emergencies'
                  },
                  {
                    value: 'admin',
                    icon: <FiShield size={20} />,
                    label: 'Admin',
                    desc: 'Manage the system'
                  }
                ].map(({ value, icon, label, desc }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSelectedRole(value)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all duration-150 ${
                      selectedRole === value
                        ? 'border-emergency-red bg-emergency-red/10 text-white'
                        : 'border-ems-border bg-ems-dark text-ems-muted hover:border-emergency-red/40 hover:text-white'
                    }`}
                  >
                    <span className={selectedRole === value ? 'text-emergency-red' : ''}>{icon}</span>
                    <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
                    <span className="text-xs leading-tight opacity-70 hidden sm:block">{desc}</span>
                  </button>
                ))}
              </div>
              {!selectedRole && (
                <p className="text-ems-muted text-xs mt-1">Select the role that best describes you</p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white block">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-ems-muted" size={14} />
                <input
                  type={showPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Password must be at least 8 characters' }
                  })}
                  className={`ems-input pl-11 pr-11 transition-colors ${
                    errors.password ? 'border-red-500/70 focus:border-red-500' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ems-muted hover:text-white transition-colors"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white block">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-ems-muted" size={14} />
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (v) => v === password || 'Passwords do not match'
                  })}
                  className={`ems-input pl-11 pr-11 transition-colors ${
                    errors.confirmPassword ? 'border-red-500/70 focus:border-red-500' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ems-muted hover:text-white transition-colors"
                  aria-label={showConfirmPass ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPass ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="btn-emergency w-full py-3 flex justify-center items-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
            >
              {loading ? (
                <Loader size="sm" />
              ) : (
                <>
                  Create Account
                  <FiArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-ems-muted mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-emergency-red hover:text-emergency-red/80 font-medium transition-colors">
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
