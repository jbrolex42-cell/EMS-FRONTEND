import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/verify/${token}`);
        setStatus('success');
        setMessage(res.data.message || 'Email verified successfully!');
      } catch (err) {
        setStatus('error');
        setMessage(
          err.response?.data?.message || 'Verification failed. The link may be invalid or expired.'
        );
      }
    };

    if (token) {
      verify();
    } else {
      setStatus('error');
      setMessage('No verification token found.');
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-ems-black flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">

        {/* Loading */}
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 bg-emergency-red/10 border border-emergency-red/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <FiLoader size={28} className="text-emergency-red animate-spin" />
            </div>
            <h1 className="text-2xl font-display text-white tracking-tight mb-2">VERIFYING YOUR EMAIL</h1>
            <p className="text-ems-muted text-sm">Please wait a moment...</p>
          </>
        )}

        {/* Success */}
        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle size={28} className="text-green-400" />
            </div>
            <h1 className="text-2xl font-display text-white tracking-tight mb-2">EMAIL VERIFIED ✅</h1>
            <p className="text-ems-muted text-sm mb-8">{message}</p>
            <Link
              to="/login"
              className="btn-emergency inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold"
            >
              Sign In Now →
            </Link>
          </>
        )}

        {/* Error */}
        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiXCircle size={28} className="text-red-400" />
            </div>
            <h1 className="text-2xl font-display text-white tracking-tight mb-2">VERIFICATION FAILED</h1>
            <p className="text-ems-muted text-sm mb-8">{message}</p>
            <div className="space-y-3">
              <Link
                to="/login"
                className="btn-emergency inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold w-full"
              >
                Back to Sign In
              </Link>
              <p className="text-ems-muted text-xs">
                Need a new link?{' '}
                <Link to="/login" className="text-emergency-red hover:text-emergency-red/80 underline">
                  Sign in and request a resend
                </Link>
              </p>
            </div>
          </>
        )}

        {/* EMS branding */}
        <div className="mt-12 flex items-center justify-center gap-3">
          <div className="w-8 h-8 bg-emergency-red rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">EMS</span>
          </div>
          <span className="text-ems-muted text-xs">EMS Kenya — Emergency Response System</span>
        </div>

      </div>
    </div>
  );
}
