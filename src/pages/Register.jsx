import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiCheckCircle
} from 'react-icons/fi';
import Loader from '../components/Loader';
import { KENYAN_COUNTIES } from '../utils/constants';

export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      const res = await registerUser(data);
      toast.success(`Welcome to EMS Kenya, ${res.user.firstName}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    'One-tap SOS anywhere in Kenya',
    'Live ambulance tracking',
    'AI triage support',
    '24/7 emergency response'
  ];

  return (
    <div className="min-h-screen bg-ems-black flex">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col w-5/12 bg-ems-dark border-r border-ems-border p-12">

        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emergency-red rounded-xl flex items-center justify-center text-white">
            EMS
          </div>
          <div>
            <div className="text-white font-semibold text-sm">EMS Kenya</div>
            <div className="text-ems-muted text-xs">Emergency System</div>
          </div>
        </Link>

        <div className="mt-16 space-y-4">
          <h2 className="text-4xl font-display text-white">
            JOIN <span className="text-emergency-red">EMS KENYA</span>
          </h2>

          <p className="text-ems-muted text-sm">
            Create your emergency profile in seconds.
          </p>

          <ul className="space-y-2">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm text-ems-muted">
                <FiCheckCircle className="text-green-400" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex justify-center items-start p-6 lg:p-12">

        <div className="w-full max-w-lg">

          <h1 className="text-3xl text-white font-bold mb-6">
            CREATE ACCOUNT
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* FIRST NAME */}
            <div>
              <label className="text-sm text-white">First Name</label>

              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />

                <input
                  type="text"
                  autoComplete="given-name"
                  placeholder="First name"
                  {...register('firstName', { required: 'Required' })}
                  className="ems-input pl-10"
                />
              </div>

              {errors.firstName && (
                <p className="text-red-400 text-xs">{errors.firstName.message}</p>
              )}
            </div>

            {/* LAST NAME */}
            <div>
              <label className="text-sm text-white">Last Name</label>

              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />

                <input
                  type="text"
                  autoComplete="family-name"
                  placeholder="Last name"
                  {...register('lastName', { required: 'Required' })}
                  className="ems-input pl-10"
                />
              </div>

              {errors.lastName && (
                <p className="text-red-400 text-xs">{errors.lastName.message}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm text-white">Email</label>

              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />

                <input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...register('email', {
                    required: 'Required',
                    pattern: {
                      value: /^\S+@\S+$/,
                      message: 'Invalid email'
                    }
                  })}
                  className="ems-input pl-10"
                />
              </div>

              {errors.email && (
                <p className="text-red-400 text-xs">{errors.email.message}</p>
              )}
            </div>

            {/* PHONE */}
            <div>
              <label className="text-sm text-white">Phone</label>

              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />

                <input
                  type="tel"
                  autoComplete="tel"
                  placeholder="0712345678"
                  {...register('phone', {
                    required: 'Required',
                    pattern: {
                      value: /^0[0-9]{9}$/,
                      message: 'Invalid number'
                    }
                  })}
                  className="ems-input pl-10"
                />
              </div>

              {errors.phone && (
                <p className="text-red-400 text-xs">{errors.phone.message}</p>
              )}
            </div>

            {/* COUNTY */}
            <div>
              <label className="text-sm text-white">County</label>

              <select
                {...register('address.county')}
                autoComplete="address-level1"
                className="ems-input"
              >
                <option value="">Select county</option>
                {KENYAN_COUNTIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm text-white">Password</label>

              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />

                <input
                  type={showPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Min 8 characters"
                  {...register('password', {
                    required: 'Required',
                    minLength: { value: 8, message: 'Min 8 characters' }
                  })}
                  className="ems-input pl-10 pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPass ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-400 text-xs">{errors.password.message}</p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="text-sm text-white">Confirm Password</label>

              <input
                type="password"
                autoComplete="new-password"
                {...register('confirmPassword', {
                  required: 'Required',
                  validate: (v) => v === password || 'Passwords do not match'
                })}
                className="ems-input"
              />

              {errors.confirmPassword && (
                <p className="text-red-400 text-xs">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="btn-emergency w-full flex justify-center items-center gap-2"
            >
              {loading ? <Loader size="sm" /> : (
                <>
                  Create Account <FiArrowRight />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-emergency-red">
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}