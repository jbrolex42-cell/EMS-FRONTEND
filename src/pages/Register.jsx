
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';

import { useAuth } from '../context/AuthContext';

import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiMapPin,
  FiActivity,
  FiHeart,
} from 'react-icons/fi';

import Loader from '../components/Loader';
import { KENYAN_COUNTIES } from '../utils/constants';

export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [registered, setRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  // =========================================================
  // REGISTRATION SUBMISSION
  // =========================================================

  const onSubmit = async (data) => {
    if (!selectedRole) {
      toast.error('Please select your account type to continue.');
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        ...data,
        role: selectedRole,
      });

      setRegisteredEmail(data.email);
      setRegistered(true);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RESEND VERIFICATION EMAIL
  // =========================================================

  const handleResend = async () => {
    if (resending || resent) return;

    setResending(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/resend-verification`,
        { email: registeredEmail }
      );

      setResent(true);

      toast.success(
        'Verification email resent! Check your inbox.'
      );
    } catch {
      toast.error('Failed to resend. Please try again.');
    } finally {
      setResending(false);
    }
  };

  // =========================================================
  // REGISTRATION BENEFITS
  // =========================================================

  const perks = [
    { icon: '🆘', text: 'One-tap SOS anywhere in Kenya' },
    { icon: '🚑', text: 'Live ambulance tracking' },
    { icon: '🤖', text: 'AI triage support' },
    { icon: '🕐', text: '24/7 emergency response' },
  ];

  // =========================================================
  // ACCOUNT TYPE OPTIONS
  // =========================================================

  const roles = [
    {
      value: 'patient',
      icon: FiHeart,
      label: 'Patient',
      description: 'Request emergency services',
    },
    {
      value: 'emt',
      icon: FiActivity,
      label: 'EMT',
      description: 'Respond to emergencies',
    },
  ];

  // =========================================================
  // EMAIL VERIFICATION SCREEN
  // =========================================================

  if (registered) {
    return (
      <div className="
        flex min-h-screen w-full
        items-center justify-center
        bg-white px-5 py-12
      ">
        <div className="w-full max-w-md text-center">

          {/* Verification icon */}

          <div className="
            mx-auto mb-6 flex h-20 w-20
            items-center justify-center
            rounded-full border border-red-200
            bg-red-50
          ">
            <FiMail
              size={30}
              className="text-red-600"
            />
          </div>

          {/* Heading */}

          <h1 className="
            mb-3 font-display
            text-4xl tracking-tight
            text-slate-950 sm:text-5xl
          ">
            CHECK YOUR EMAIL
          </h1>

          <p className="
            mb-2 text-sm text-slate-500
          ">
            We sent a verification link to
          </p>

          <p className="
            mb-6 break-all text-sm
            font-bold text-slate-900
          ">
            {registeredEmail}
          </p>

          <p className="
            mb-8 text-sm leading-relaxed
            text-slate-600
          ">
            Click the link in the email to verify your
            account and access the dashboard. The link
            expires in{' '}
            <span className="font-bold text-slate-900">
              24 hours
            </span>.
          </p>

          {/* Resend verification */}

          <div className="
            mb-7 space-y-3
            rounded-2xl border border-slate-200
            bg-slate-50 p-5 text-left
          ">
            <p className="
              text-sm font-bold text-slate-900
            ">
              Didn't get the email?
            </p>

            <p className="
              text-xs leading-relaxed
              text-slate-500
            ">
              Check your spam/junk folder first.
            </p>

            {resent ? (
              <p className="
                flex items-center gap-2
                text-xs font-semibold text-green-700
              ">
                <span aria-hidden="true">✓</span>
                New link sent — check your inbox.
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="
                  text-xs font-bold
                  text-red-600 underline
                  transition-colors
                  hover:text-red-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {resending
                  ? 'Sending...'
                  : 'Resend verification email'}
              </button>
            )}
          </div>

          {/* Back to login */}

          <Link
            to="/login"
            className="
              inline-flex items-center
              justify-center gap-2
              text-sm font-semibold
              text-slate-500
              transition-colors
              hover:text-red-600
            "
          >
            <span aria-hidden="true">←</span>
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  // =========================================================
  // REGISTRATION PAGE
  // =========================================================

  return (
    <div className="
      flex min-h-screen w-full
      overflow-hidden bg-white
      text-slate-800
    ">

      {/* =====================================================
          LEFT PANEL — DESKTOP
      ===================================================== */}

      <div className="
        relative hidden w-5/12
        flex-col overflow-hidden
        border-r border-slate-200
        bg-slate-50 p-10
        lg:flex xl:p-12
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
            left-1/2 top-1/3
            h-80 w-80
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
            bottom-12 right-0
            h-48 w-48
            rounded-full bg-red-100
            opacity-60 blur-3xl
          "
        />

        {/* =================================================
            BRAND
        ================================================= */}

        <Link
          to="/"
          className="
            relative flex w-fit
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
              Emergency System
            </div>
          </div>
        </Link>

        {/* =================================================
            HERO CONTENT
        ================================================= */}

        <div className="
          relative mt-14 space-y-7
        ">

          {/* Network badge */}

          <div className="
            inline-flex w-fit items-center
            gap-2 rounded-full
            border border-red-200
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
              Join the Network
            </span>
          </div>

          {/* Heading */}

          <h2 className="
            font-display text-4xl
            leading-[1.05] tracking-tight
            text-slate-950
            xl:text-5xl
          ">
            JOIN{' '}
            <span className="text-red-600">
              EMS KENYA
            </span>
          </h2>

          {/* Description */}

          <p className="
            max-w-sm text-sm
            leading-relaxed text-slate-600
          ">
            Create your emergency profile in seconds
            and get instant access to life-saving services.
          </p>

          {/* Benefits */}

          <ul className="space-y-4 pt-2">
            {perks.map(({ icon, text }) => (
              <li
                key={text}
                className="
                  flex items-center gap-3
                  text-sm text-slate-600
                "
              >
                <span className="
                  flex h-9 w-9 shrink-0
                  items-center justify-center
                  rounded-xl border border-slate-200
                  bg-white text-base shadow-sm
                ">
                  {icon}
                </span>

                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* =================================================
            LEFT PANEL FOOTER
        ================================================= */}

        <div className="
          relative mt-auto flex
          items-center justify-between
          gap-3 border-t border-slate-200
          pt-8
        ">
          <p className="
            text-xs text-slate-500
          ">
            Regulated by KMPDC
          </p>

          <p className="
            text-xs text-slate-500
          ">
            24/7 Emergency System
          </p>
        </div>
      </div>

      {/* =====================================================
          RIGHT PANEL — REGISTRATION FORM
      ===================================================== */}

      <div className="
        flex flex-1 items-start
        justify-center overflow-y-auto
        bg-white px-5 py-8
        sm:px-8 sm:py-10
        lg:px-10 lg:py-12
      ">

        <div className="
          w-full max-w-lg
        ">

          {/* =================================================
              MOBILE BRAND
          ================================================= */}

          <Link
            to="/"
            className="
              mb-9 flex w-fit
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
                Emergency System
              </div>
            </div>
          </Link>

          {/* =================================================
              FORM HEADING
          ================================================= */}

          <div className="mb-8">
            <h1 className="
              mb-2 font-display
              text-4xl tracking-tight
              text-slate-950 sm:text-5xl
            ">
              CREATE ACCOUNT
            </h1>

            <p className="
              text-sm text-slate-500
            ">
              Fill in your details to get started
            </p>
          </div>

          {/* =================================================
              REGISTRATION FORM
          ================================================= */}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >

            {/* =================================================
                NAME ROW
            ================================================= */}

            <div className="
              grid grid-cols-1 gap-4
              sm:grid-cols-2
            ">

              {/* FIRST NAME */}

              <div className="space-y-2">
                <label
                  htmlFor="firstName"
                  className="
                    block text-sm font-bold
                    text-slate-800
                  "
                >
                  First Name
                </label>

                <div className="relative">
                  <FiUser
                    aria-hidden="true"
                    className="
                      absolute left-3.5 top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                    size={16}
                  />

                  <input
                    id="firstName"
                    type="text"
                    autoComplete="given-name"
                    placeholder="First name"
                    aria-invalid={Boolean(errors.firstName)}
                    {...register('firstName', {
                      required: 'First name is required',
                    })}
                    className={`
                      ems-input w-full pl-10
                      transition-colors
                      ${
                        errors.firstName
                          ? 'border-red-500 focus:border-red-600'
                          : ''
                      }
                    `}
                  />
                </div>

                {errors.firstName && (
                  <p
                    role="alert"
                    className="text-xs text-red-600"
                  >
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* LAST NAME */}

              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="
                    block text-sm font-bold
                    text-slate-800
                  "
                >
                  Last Name
                </label>

                <div className="relative">
                  <FiUser
                    aria-hidden="true"
                    className="
                      absolute left-3.5 top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                    size={16}
                  />

                  <input
                    id="lastName"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Last name"
                    aria-invalid={Boolean(errors.lastName)}
                    {...register('lastName', {
                      required: 'Last name is required',
                    })}
                    className={`
                      ems-input w-full pl-10
                      transition-colors
                      ${
                        errors.lastName
                          ? 'border-red-500 focus:border-red-600'
                          : ''
                      }
                    `}
                  />
                </div>

                {errors.lastName && (
                  <p
                    role="alert"
                    className="text-xs text-red-600"
                  >
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* =================================================
                EMAIL
            ================================================= */}

            <div className="space-y-2">
              <label
                htmlFor="register-email"
                className="
                  block text-sm font-bold
                  text-slate-800
                "
              >
                Email Address
              </label>

              <div className="relative">
                <FiMail
                  aria-hidden="true"
                  className="
                    absolute left-4 top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                  size={16}
                />

                <input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.email)}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: 'Enter a valid email address',
                    },
                  })}
                  className={`
                    ems-input w-full pl-11
                    transition-colors
                    ${
                      errors.email
                        ? 'border-red-500 focus:border-red-600'
                        : ''
                    }
                  `}
                />
              </div>

              {errors.email && (
                <p
                  role="alert"
                  className="text-xs text-red-600"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* =================================================
                PHONE NUMBER
            ================================================= */}

            <div className="space-y-2">
              <label
                htmlFor="register-phone"
                className="
                  block text-sm font-bold
                  text-slate-800
                "
              >
                Phone Number
              </label>

              <div className="relative">
                <FiPhone
                  aria-hidden="true"
                  className="
                    absolute left-4 top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                  size={16}
                />

                <input
                  id="register-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="0712345678"
                  aria-invalid={Boolean(errors.phone)}
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^0[0-9]{9}$/,
                      message:
                        'Enter a valid Kenyan number (e.g. 0712345678)',
                    },
                  })}
                  className={`
                    ems-input w-full pl-11
                    transition-colors
                    ${
                      errors.phone
                        ? 'border-red-500 focus:border-red-600'
                        : ''
                    }
                  `}
                />
              </div>

              {errors.phone && (
                <p
                  role="alert"
                  className="text-xs text-red-600"
                >
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* =================================================
                COUNTY
            ================================================= */}

            <div className="space-y-2">
              <label
                htmlFor="register-county"
                className="
                  block text-sm font-bold
                  text-slate-800
                "
              >
                County
              </label>

              <div className="relative">
                <FiMapPin
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute left-4 top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                  size={16}
                />

                <select
                  id="register-county"
                  autoComplete="address-level1"
                  {...register('address.county')}
                  className="
                    ems-input w-full
                    cursor-pointer appearance-none
                    pl-11 pr-4
                  "
                >
                  <option value="">
                    Select your county
                  </option>

                  {KENYAN_COUNTIES.map((county) => (
                    <option
                      key={county}
                      value={county}
                    >
                      {county}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* =================================================
                ACCOUNT TYPE
            ================================================= */}

            <div className="space-y-3">
              <label className="
                block text-sm font-bold
                text-slate-800
              ">
                Account Type
              </label>

              <div className="
                grid grid-cols-2 gap-3
              ">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isSelected =
                    selectedRole === role.value;

                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setSelectedRole(role.value)}
                      aria-pressed={isSelected}
                      className={`
                        flex min-w-0
                        flex-col items-center
                        gap-2 rounded-xl
                        border p-4 text-center
                        transition-all duration-200
                        focus:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-red-500
                        focus-visible:ring-offset-2
                        ${
                          isSelected
                            ? 'border-red-500 bg-red-50 text-red-700 shadow-sm'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-red-300 hover:bg-red-50/50'
                        }
                      `}
                    >
                      <Icon
                        size={22}
                        className={
                          isSelected
                            ? 'text-red-600'
                            : 'text-slate-500'
                        }
                      />

                      <span className="
                        text-xs font-extrabold
                        uppercase tracking-wide
                      ">
                        {role.label}
                      </span>

                      <span className="
                        text-xs leading-relaxed
                        text-slate-500
                      ">
                        {role.description}
                      </span>
                    </button>
                  );
                })}
              </div>

              {!selectedRole && (
                <p className="
                  text-xs text-slate-500
                ">
                  Select the role that best describes you.
                </p>
              )}
            </div>

            {/* =================================================
                PASSWORD
            ================================================= */}

            <div className="space-y-2">
              <label
                htmlFor="register-password"
                className="
                  block text-sm font-bold
                  text-slate-800
                "
              >
                Password
              </label>

              <div className="relative">
                <FiLock
                  aria-hidden="true"
                  className="
                    absolute left-4 top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                  size={16}
                />

                <input
                  id="register-password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  aria-invalid={Boolean(errors.password)}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message:
                        'Password must be at least 8 characters',
                    },
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
                  onClick={() =>
                    setShowPass((previous) => !previous)
                  }
                  aria-label={
                    showPass ? 'Hide password' : 'Show password'
                  }
                  className="
                    absolute right-4 top-1/2
                    -translate-y-1/2
                    rounded text-slate-400
                    transition-colors
                    hover:text-slate-800
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-red-500
                  "
                >
                  {showPass ? (
                    <FiEyeOff size={16} />
                  ) : (
                    <FiEye size={16} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p
                  role="alert"
                  className="text-xs text-red-600"
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* =================================================
                CONFIRM PASSWORD
            ================================================= */}

            <div className="space-y-2">
              <label
                htmlFor="register-confirm-password"
                className="
                  block text-sm font-bold
                  text-slate-800
                "
              >
                Confirm Password
              </label>

              <div className="relative">
                <FiLock
                  aria-hidden="true"
                  className="
                    absolute left-4 top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                  size={16}
                />

                <input
                  id="register-confirm-password"
                  type={
                    showConfirmPass ? 'text' : 'password'
                  }
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  aria-invalid={Boolean(errors.confirmPassword)}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === password ||
                      'Passwords do not match',
                  })}
                  className={`
                    ems-input w-full
                    pl-11 pr-12
                    transition-colors
                    ${
                      errors.confirmPassword
                        ? 'border-red-500 focus:border-red-600'
                        : ''
                    }
                  `}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPass((previous) => !previous)
                  }
                  aria-label={
                    showConfirmPass
                      ? 'Hide password'
                      : 'Show password'
                  }
                  className="
                    absolute right-4 top-1/2
                    -translate-y-1/2
                    rounded text-slate-400
                    transition-colors
                    hover:text-slate-800
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-red-500
                  "
                >
                  {showConfirmPass ? (
                    <FiEyeOff size={16} />
                  ) : (
                    <FiEye size={16} />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p
                  role="alert"
                  className="text-xs text-red-600"
                >
                  {errors.confirmPassword.message}
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
                  <span>Create Account</span>
                  <FiArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* =================================================
              LOGIN LINK
          ================================================= */}

          <p className="
            mt-8 text-center
            text-sm text-slate-500
          ">
            Already have an account?{' '}

            <Link
              to="/login"
              className="
                font-bold text-red-600
                transition-colors
                hover:text-red-700
              "
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}