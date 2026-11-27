
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';

import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiPhone,
} from 'react-icons/fi';

import Loader from '../components/Loader';

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginMode, setLoginMode] = useState('email');

  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // =========================================================
  // SWITCH LOGIN MODE
  // =========================================================

  const switchMode = (mode) => {
    setLoginMode(mode);
    reset();
  };

  // =========================================================
  // LOGIN SUBMISSION
  // =========================================================

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const payload =
        loginMode === 'phone'
          ? {
              phone: data.identifier,
              password: data.password,
            }
          : {
              email: data.identifier,
              password: data.password,
            };

      const res = await login(payload);

      toast.success(`Welcome back, ${res.user.firstName}!`);

      const redirectMap = {
        admin: '/admin',
        superadmin: '/admin',
        emt: '/emt',
      };

      navigate(
        redirectMap[res.user.role] || from,
        { replace: true }
      );
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Login failed. Please try again.';

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // COMPONENT
  // =========================================================

  return (
    <div className="
      relative flex min-h-screen
      w-full overflow-hidden
      bg-white text-slate-800
    ">

      {/* =====================================================
          LEFT PANEL — DESKTOP
      ===================================================== */}

      <div className="
        relative hidden w-1/2
        flex-col overflow-hidden
        border-r border-slate-200
        bg-slate-50 p-12
        lg:flex
      ">

        {/* Background grid */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute inset-0
            opacity-[0.035]
          "
          style={{
            backgroundImage: `
              linear-gradient(rgba(220,38,38,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(220,38,38,1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Decorative glow */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute
            left-1/2 top-1/2
            h-96 w-96
            -translate-x-1/2
            -translate-y-1/2
            rounded-full bg-red-100
            opacity-70 blur-3xl
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute
            bottom-0 left-0
            h-64 w-64
            rounded-full bg-red-100
            opacity-60 blur-3xl
          "
        />

        {/* Brand */}

        <Link
          to="/"
          className="
            relative mb-auto flex w-fit
            items-center gap-3
          "
        >
          <div className="
            flex h-11 w-11
            items-center justify-center
            rounded-xl bg-red-600
            shadow-lg shadow-red-600/20
          ">
            <span className="
              font-display text-sm
              font-bold tracking-wider text-white
            ">
              EMS
            </span>
          </div>

          <div>
            <div className="
              text-sm font-bold leading-tight
              text-slate-900
            ">
              EMS Kenya
            </div>

            <div className="
              mt-0.5 text-xs text-slate-500
            ">
              Emergency Response System
            </div>
          </div>
        </Link>

        {/* Promotional content */}

        <div className="
          relative space-y-7
        ">

          <div className="
            inline-flex w-fit
            items-center gap-2
            rounded-full border border-red-200
            bg-red-50 px-3 py-2
          ">
            <span className="
              h-2 w-2 rounded-full
              bg-red-600 animate-pulse
            " />

            <span className="
              text-xs font-bold uppercase
              tracking-wider text-red-700
            ">
              Live System
            </span>
          </div>

          <h2 className="
            font-display text-5xl
            leading-[1.05] tracking-tight
            text-slate-950
            xl:text-6xl
          ">
            EVERY SECOND
            <br />

            <span className="text-red-600">
              MATTERS.
            </span>
          </h2>

          <p className="
            max-w-sm text-base
            leading-relaxed text-slate-600
          ">
            Sign in to access Kenya's emergency response
            network and coordinate life-saving operations.
          </p>
        </div>

        {/* Footer */}

        <div className="
          relative mt-auto flex
          items-center justify-between
          border-t border-slate-200
          pt-8
        ">
          <p className="text-xs text-slate-500">
            Regulated by KMPDC
          </p>

          <p className="text-xs text-slate-500">
            24/7 Emergency System
          </p>
        </div>
      </div>

      {/* =====================================================
          RIGHT PANEL — LOGIN FORM
      ===================================================== */}

      <div className="
        flex flex-1 items-center
        justify-center bg-white
        px-5 py-12 sm:px-8
        lg:px-12
      ">

        <div className="w-full max-w-md">

          {/* =================================================
              MOBILE BRAND
          ================================================= */}

          <Link
            to="/"
            className="
              mb-10 flex w-fit
              items-center gap-3 lg:hidden
            "
          >
            <div className="
              flex h-10 w-10
              items-center justify-center
              rounded-xl bg-red-600
              shadow-md shadow-red-600/20
            ">
              <span className="
                font-display text-xs
                font-bold tracking-wider text-white
              ">
                EMS
              </span>
            </div>

            <div>
              <div className="
                text-sm font-bold text-slate-900
              ">
                EMS Kenya
              </div>

              <div className="
                text-xs text-slate-500
              ">
                Emergency Response System
              </div>
            </div>
          </Link>

          {/* =================================================
              HEADING
          ================================================= */}

          <div className="mb-7">
            <h1 className="
              mb-2 font-display
              text-4xl tracking-tight
              text-slate-950 sm:text-5xl
            ">
              WELCOME BACK
            </h1>

            <p className="
              text-sm leading-relaxed
              text-slate-500
            ">
              Sign in to your account to continue
            </p>
          </div>

          {/* =================================================
              LOGIN MODE TOGGLE
          ================================================= */}

          <div className="
            mb-7 flex gap-1
            rounded-xl border border-slate-200
            bg-slate-100 p-1
          ">
            <button
              type="button"
              onClick={() => switchMode('email')}
              aria-pressed={loginMode === 'email'}
              className={`
                flex flex-1 items-center
                justify-center gap-2
                rounded-lg py-2.5
                text-sm font-bold
                transition-all duration-200
                ${
                  loginMode === 'email'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900'
                }
              `}
            >
              <FiMail size={15} />
              Email
            </button>

            <button
              type="button"
              onClick={() => switchMode('phone')}
              aria-pressed={loginMode === 'phone'}
              className={`
                flex flex-1 items-center
                justify-center gap-2
                rounded-lg py-2.5
                text-sm font-bold
                transition-all duration-200
                ${
                  loginMode === 'phone'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900'
                }
              `}
            >
              <FiPhone size={15} />
              Phone
            </button>
          </div>

          {/* =================================================
              LOGIN FORM
          ================================================= */}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >

            {/* EMAIL OR PHONE */}

            <div className="space-y-2">
              <label
                htmlFor="login-identifier"
                className="
                  block text-sm font-bold
                  text-slate-800
                "
              >
                {loginMode === 'phone'
                  ? 'Phone Number'
                  : 'Email Address'}
              </label>

              <div className="relative">

                {loginMode === 'phone' ? (
                  <FiPhone
                    aria-hidden="true"
                    className="
                      absolute left-4 top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                    size={17}
                  />
                ) : (
                  <FiMail
                    aria-hidden="true"
                    className="
                      absolute left-4 top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                    size={17}
                  />
                )}

                <input
                  id="login-identifier"
                  key={loginMode}
                  type={loginMode === 'phone' ? 'tel' : 'email'}
                  autoComplete={
                    loginMode === 'phone' ? 'tel' : 'email'
                  }
                  placeholder={
                    loginMode === 'phone'
                      ? '0712345678'
                      : 'you@example.com'
                  }
                  aria-invalid={Boolean(errors.identifier)}
                  aria-describedby={
                    errors.identifier
                      ? 'identifier-error'
                      : undefined
                  }
                  {...register(
                    'identifier',
                    loginMode === 'phone'
                      ? {
                          required: 'Phone number is required',
                          pattern: {
                            value: /^0[0-9]{9}$/,
                            message:
                              'Enter a valid Kenyan number (e.g. 0712345678)',
                          },
                        }
                      : {
                          required: 'Email is required',
                          pattern: {
                            value: /^\S+@\S+\.\S+$/,
                            message: 'Enter a valid email address',
                          },
                        }
                  )}
                  className={`
                    ems-input w-full pl-11
                    transition-colors
                    ${
                      errors.identifier
                        ? 'border-red-500 focus:border-red-600'
                        : ''
                    }
                  `}
                />
              </div>

              {errors.identifier && (
                <p
                  id="identifier-error"
                  role="alert"
                  className="text-xs text-red-600"
                >
                  {errors.identifier.message}
                </p>
              )}
            </div>

            {/* =================================================
                PASSWORD
            ================================================= */}

            <div className="space-y-2">

              <div className="
                flex items-center justify-between gap-3
              ">
                <label
                  htmlFor="login-password"
                  className="
                    text-sm font-bold
                    text-slate-800
                  "
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="
                    text-xs font-semibold
                    text-red-600
                    transition-colors
                    hover:text-red-700
                  "
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">

                <FiLock
                  aria-hidden="true"
                  className="
                    absolute left-4 top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                  size={17}
                />

                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password
                      ? 'password-error'
                      : undefined
                  }
                  {...register('password', {
                    required: 'Password is required',
                  })}
                  className={`
                    ems-input w-full
                    pl-11 pr-12
                    transition-colors
                    ${
                      errors.password
                        ? 'border-red-500 focus:border-red-600'
                        : ''
                    }
                  `}
                />

                <button
                  type="button"
                  onClick={() => setShowPass((previous) => !previous)}
                  aria-label={
                    showPass ? 'Hide password' : 'Show password'
                  }
                  aria-pressed={showPass}
                  className="
                    absolute right-4 top-1/2
                    -translate-y-1/2
                    text-slate-400
                    transition-colors
                    hover:text-slate-800
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-red-500
                    rounded
                  "
                >
                  {showPass ? (
                    <FiEyeOff size={17} />
                  ) : (
                    <FiEye size={17} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p
                  id="password-error"
                  role="alert"
                  className="text-xs text-red-600"
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* =================================================
                SUBMIT BUTTON
            ================================================= */}

            <button
              type="submit"
              disabled={loading}
              className="
                btn-emergency mt-2
                flex w-full items-center
                justify-center gap-2
                py-3.5
                transition-all
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? (
                <Loader size="sm" />
              ) : (
                <>
                  <span>Sign In</span>
                  <FiArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* =================================================
              REGISTER LINK
          ================================================= */}

          <p className="
            mt-8 text-center
            text-sm text-slate-500
          ">
            Don't have an account?{' '}

            <Link
              to="/register"
              className="
                font-bold text-red-600
                transition-colors
                hover:text-red-700
              "
            >
              Create one
            </Link>
          </p>

          {/* =================================================
              EMERGENCY CONTACT
          ================================================= */}

          <div className="
            mt-7 rounded-xl
            border border-red-200
            bg-red-50/70 p-5
            text-center
          ">
            <p className="
              mb-2 text-xs font-medium
              text-slate-600
            ">
              In an emergency? Call now
            </p>

            <a
              href="tel:1514"
              className="
                inline-flex items-center
                justify-center gap-2
                text-xl font-extrabold
                text-red-600
                transition-colors
                hover:text-red-700
              "
            >
              <FiPhone size={18} />
              1514
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}