import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import Loader from '../components/Loader';

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async ({ email }) => {
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
      toast.success('Reset email sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ems-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link to="/login" className="flex items-center gap-2 text-ems-muted hover:text-white text-sm mb-10 transition-colors">
          <FiArrowLeft size={16} /> Back to Sign In
        </Link>

        <div className="w-14 h-14 bg-emergency-red/10 border border-emergency-red/20 rounded-2xl flex items-center justify-center mb-6">
          <FiMail size={24} className="text-emergency-red" />
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
              <FiCheckCircle size={32} className="text-green-400" />
            </div>
            <h1 className="text-2xl font-display text-ems-white">CHECK YOUR EMAIL</h1>
            <p className="text-ems-muted text-sm leading-relaxed">
              We've sent a password reset link to <strong className="text-ems-white">{watch('email')}</strong>. 
              The link expires in 30 minutes.
            </p>
            <Link to="/login" className="btn-emergency inline-block mt-4 px-8 py-3">
              Return to Login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-display text-ems-white mb-2">RESET PASSWORD</h1>
            <p className="text-ems-muted text-sm mb-8">Enter your email and we'll send a secure reset link.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="text-ems-light text-sm font-medium mb-2 block">Email Address</label>
                <div className="relative">
                  <FiMail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ems-muted" />
                  <input
                    {...register('email', { required: 'Email required', pattern: { value: /^\S+@\S+$/, message: 'Invalid email' } })}
                    type="email"
                    placeholder="your@email.com"
                    className="ems-input pl-10"
                  />
                </div>
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <button type="submit" disabled={loading} className="btn-emergency w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <Loader size="sm" /> : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
