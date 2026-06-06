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
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/verify/${token}`
        );
        setStatus('success');
        setMessage(res.data.message);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed. The link may have expired.');
      }
    };
    if (token) verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-ems-black flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-emergency-red rounded-xl flex items-center justify-center shadow-lg shadow-emergency-red/30">
            <span className="text-white font-bold text-sm tracking-wider">EMS</span>
          </div>
          <div className="text-left">
            <div className="text-white font-semibold text-sm">EMS Kenya</div>
            <div className="text-ems-muted text-xs">Emergency Response System</div>
          </div>
        </div>

        <div className="ems-card">
          {status === 'loading' && (
            <div className="py-8 space-y-4">
              <div className="w-14 h-14 rounded-full border-2 border-emergency-red border-t-transparent animate-spin mx-auto" />
              <p className="text-ems-muted">Verifying your account...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="py-8 space-y-4">
              <FiCheckCircle size={52} className="text-green-400 mx-auto" />
              <h2 className="text-ems-white text-xl font-display">Account Verified!</h2>
              <p className="text-ems-muted text-sm">{message}</p>
              <Link to="/login"
                className="btn-emergency inline-flex items-center gap-2 px-8 py-3 mt-2">
                Sign In Now
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="py-8 space-y-4">
              <FiXCircle size={52} className="text-red-400 mx-auto" />
              <h2 className="text-ems-white text-xl font-display">Verification Failed</h2>
              <p className="text-ems-muted text-sm">{message}</p>
              <ResendForm />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResendForm() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/resend-verification`, { email });
      setSent(true);
    } catch (e) {
      setSent(true); // always show success to prevent enumeration
    } finally {
      setLoading(false);
    }
  };

  if (sent) return (
    <p className="text-green-400 text-sm mt-4">
      ✅ If that email exists and is unverified, a new link has been sent.
    </p>
  );

  return (
    <div className="mt-4 space-y-3">
      <p className="text-ems-muted text-xs">Need a new verification link?</p>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="ems-input w-full"
      />
      <button onClick={handleResend} disabled={loading || !email}
        className="btn-emergency w-full py-2.5 disabled:opacity-60">
        {loading ? 'Sending...' : 'Resend Verification Email'}
      </button>
    </div>
  );
}
