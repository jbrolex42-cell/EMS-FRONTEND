import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiAlertTriangle } from 'react-icons/fi';

export default function EmergencyButton({ size = 'lg', className = '' }) {
  const [pressed, setPressed] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handlePress = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setPressed(true);
    setTimeout(() => { setPressed(false); navigate('/emergency'); }, 200);
  };

  const sizes = {
    sm: 'w-20 h-20 text-2xl',
    md: 'w-28 h-28 text-3xl',
    lg: 'w-40 h-40 text-5xl'
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Pulse rings */}
      <div className="absolute inset-0 rounded-full bg-emergency-red/20 animate-ping" style={{ animationDuration: '2s' }} />
      <div className="absolute inset-0 rounded-full bg-emergency-red/10 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />

      <button
        onMouseDown={() => setPressed(true)}
        onMouseUp={handlePress}
        onTouchStart={() => setPressed(true)}
        onTouchEnd={handlePress}
        className={`relative ${sizes[size]} bg-emergency-red rounded-full flex flex-col items-center justify-center gap-1 text-white font-bold shadow-[0_0_40px_rgba(255,59,48,0.5)] hover:shadow-[0_0_60px_rgba(255,59,48,0.7)] transition-all duration-150 select-none ${pressed ? 'scale-95 shadow-[0_0_20px_rgba(255,59,48,0.3)]' : 'scale-100'}`}
      >
        <FiAlertTriangle size={size === 'lg' ? 36 : size === 'md' ? 28 : 20} />
        {size === 'lg' && <span className="font-display text-sm tracking-widest">SOS</span>}
      </button>
    </div>
  );
}
