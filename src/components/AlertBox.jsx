import { FiAlertTriangle, FiCheckCircle, FiInfo, FiXCircle } from 'react-icons/fi';

const types = {
  error:   { icon: FiXCircle,       bg: 'bg-red-500/10',    border: 'border-red-500/30',    text: 'text-red-400' },
  success: { icon: FiCheckCircle,   bg: 'bg-green-500/10',  border: 'border-green-500/30',  text: 'text-green-400' },
  warning: { icon: FiAlertTriangle, bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400' },
  info:    { icon: FiInfo,          bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   text: 'text-blue-400' }
};

export default function AlertBox({ type = 'info', message, className = '' }) {
  const { icon: Icon, bg, border, text } = types[type];
  return (
    <div className={`${bg} border ${border} rounded-xl px-4 py-3 flex items-start gap-3 ${className}`}>
      <Icon size={16} className={`${text} mt-0.5 flex-shrink-0`} />
      <p className={`${text} text-sm`}>{message}</p>
    </div>
  );
}
