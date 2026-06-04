import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import Loader from '../components/Loader';
import { KENYAN_COUNTIES } from '../utils/constants';

export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
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
    'One-tap SOS from anywhere in Kenya',
    'Live ambulance tracking with real-time ETA',
    'SHA ECCIF cost coverage integration',
    'AI triage in Swahili and English',
    'KMPDC-certified responders only'
  ];

  return (
    <div className="min-h-screen bg-ems-black flex">
      {/* Left */}
      <div className="hidden lg:flex flex-col w-5/12 bg-ems-dark border-r border-ems-border p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `linear-gradient(rgba(255,59,48,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,59,48,1) 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />
        <div className="absolute top-1/3 left-0 w-64 h-64 bg-emergency-red/10 rounded-full blur-3xl" />

        <Link to="/" className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-emergency-red rounded-xl flex items-center justify-center">
            <span className="text-white font-display text-lg">EMS</span>
          </div>
          <div>
            <div className="text-white font-semibold text-sm">EMS Kenya</div>
            <div className="text-ems-muted text-xs">Emergency Medical System</div>
          </div>
        </Link>

        <div className="relative mt-16 space-y-6">
          <h2 className="text-4xl font-display text-ems-white">
            JOIN KENYA'S<br /><span className="text-emergency-red">EMERGENCY</span><br />NETWORK
          </h2>
          <p className="text-ems-muted text-sm leading-relaxed">
            Free account. Emergency cover from KES 4,000/year. No payment required at the scene.
          </p>
          <ul className="space-y-3">
            {perks.map(p => (
              <li key={p} className="flex items-start gap-3 text-sm">
                <FiCheckCircle size={15} className="text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-ems-muted">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mt-auto pt-8 border-t border-ems-border">
          <p className="text-ems-muted text-xs">Already a member? <Link to="/login" className="text-emergency-red">Sign in here</Link></p>
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-start justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-lg py-6">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-emergency-red rounded-lg flex items-center justify-center">
              <span className="text-white font-display">EMS</span>
            </div>
            <span className="text-ems-white font-semibold">EMS Kenya</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-display text-ems-white mb-2">CREATE ACCOUNT</h1>
            <p className="text-ems-muted text-sm">Free to register. Emergency cover activated instantly.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-ems-light text-sm font-medium mb-2 block">First Name</label>
                <div className="relative">
                  <FiUser size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ems-muted" />
                  <input {...register('firstName', { required: 'Required' })} placeholder="first name" className="ems-input pl-10" />
                </div>
                {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="text-ems-light text-sm font-medium mb-2 block">Last Name</label>
                <div className="relative">
                  <FiUser size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ems-muted" />
                  <input {...register('lastName', { required: 'Required' })} placeholder="last name" className="ems-input pl-10" />
                </div>
                {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="text-ems-light text-sm font-medium mb-2 block">Email Address</label>
              <div className="relative">
                <FiMail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ems-muted" />
                <input {...register('email', { required: 'Required', pattern: { value: /^\S+@\S+$/, message: 'Invalid email' } })} type="email" placeholder="jane@example.com" className="ems-input pl-10" />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-ems-light text-sm font-medium mb-2 block">Phone Number</label>
              <div className="relative">
                <FiPhone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ems-muted" />
                <input {...register('phone', { required: 'Required', pattern: { value: /^0[0-9]{9}$/, message: 'Enter valid Kenyan number' } })} type="tel" placeholder="0712345678" className="ems-input pl-10" />
              </div>
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="text-ems-light text-sm font-medium mb-2 block">County</label>
              <select {...register('address.county')} className="ems-input">
                <option value="">Select county</option>
                {KENYAN_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="text-ems-light text-sm font-medium mb-2 block">Password</label>
              <div className="relative">
                <FiLock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ems-muted" />
                <input
                  {...register('password', { required: 'Required', minLength: { value: 8, message: 'Min 8 characters' } })}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min 8 characters"
                  className="ems-input pl-10 pr-11"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-ems-muted hover:text-white">
                  {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="text-ems-light text-sm font-medium mb-2 block">Confirm Password</label>
              <div className="relative">
                <FiLock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ems-muted" />
                <input
                  {...register('confirmPassword', { required: 'Required', validate: v => v === password || 'Passwords do not match' })}
                  type="password"
                  placeholder="Repeat password"
                  className="ems-input pl-10"
                />
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <div className="flex items-start gap-3">
              <input {...register('terms', { required: 'You must agree to continue' })} type="checkbox" id="terms" className="mt-1 accent-emergency-red" />
              <label htmlFor="terms" className="text-ems-muted text-xs leading-relaxed">
                I agree to the <Link to="#" className="text-emergency-red hover:underline">Terms of Service</Link> and <Link to="#" className="text-emergency-red hover:underline">Privacy Policy</Link>. I understand my health data is processed under the Data Protection Act 2019 and ODPC compliance.
              </label>
            </div>
            {errors.terms && <p className="text-red-400 text-xs">{errors.terms.message}</p>}

            <button type="submit" disabled={loading} className="btn-emergency w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <Loader size="sm" /> : <><span>Create My Account</span><FiArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center text-ems-muted text-sm mt-6">
            Already have an account? <Link to="/login" className="text-emergency-red hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
