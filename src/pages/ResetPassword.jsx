import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { FiLock, FiEye, FiEyeOff, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import Loader from '../components/Loader';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSubmit = async ({ password }) => {
    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      setSuccess(true);
      toast.success('Password reset! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset link is invalid or expired');
    } finally {
      setLoading(false);
    }
  };

  const requirements = [
    { label: 'At least 8 characters', test: (p) => p?.length >= 8 },
    { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p || '') },
    { label: 'One number', test: (p) => /[0-9]/.test(p || '') },
  ];

  return (
    <div className="min-h-screen bg-ems-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link to="/login" className="flex items-center gap-2 text-ems-muted hover:text-white text-sm mb-10 transition-colors">
          <FiArrowLeft size={16} /> Back to Sign In
        </Link>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-emergency-red rounded-xl flex items-center justify-center">
            <span className="text-white font-display text-lg">EMS</span>
          </div>
          <div>
            <div className="text-white font-semibold text-sm">EMS Kenya</div>
            <div className="text-ems-muted text-xs">Emergency Response System</div>
          </div>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
              <FiCheckCircle size={36} className="text-green-400" />
            </div>
            <h1 className="text-2xl font-display text-ems-white">PASSWORD RESET!</h1>
            <p className="text-ems-muted text-sm">Your password has been updated. Redirecting you to login...</p>
            <Loader size="sm" />
          </div>
        ) : (
          <>
            <div className="w-14 h-14 bg-emergency-red/10 border border-emergency-red/20 rounded-2xl flex items-center justify-center mb-6">
              <FiLock size={24} className="text-emergency-red" />
            </div>

            <h1 className="text-3xl font-display text-ems-white mb-2">SET NEW PASSWORD</h1>
            <p className="text-ems-muted text-sm mb-8">Choose a strong password for your EMS Kenya account.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="text-ems-light text-sm font-medium mb-2 block">New Password</label>
                <div className="relative">
                  <FiLock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ems-muted" />
                  <input
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 8, message: 'Min 8 characters' }
                    })}
                    type={showPass ? 'text' : 'password'}
                    placeholder="Min 8 characters"
                    className="ems-input pl-10 pr-11"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ems-muted hover:text-white transition-colors">
                    {showPass ? <FiEye size={15} /> : <FiEyeOff size={15} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
              </div>

              {/* Password requirements */}
              {password && (
                <div className="space-y-1.5 p-3 bg-ems-dark rounded-xl border border-ems-border">
                  {requirements.map(({ label, test }) => (
                    <div key={label} className={`flex items-center gap-2 text-xs transition-colors ${test(password) ? 'text-green-400' : 'text-ems-muted'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${test(password) ? 'bg-green-400' : 'bg-ems-muted'}`} />
                      {label}
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="text-ems-light text-sm font-medium mb-2 block">Confirm New Password</label>
                <div className="relative">
                  <FiLock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ems-muted" />
                  <input
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: v => v === password || 'Passwords do not match'
                    })}
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Repeat new password"
                    className="ems-input pl-10 pr-11"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ems-muted hover:text-white transition-colors">
                    {showConfirm ? <FiEye size={15} /> : <FiEyeOff size={15} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-emergency w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <Loader size="sm" /> : 'Reset Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
