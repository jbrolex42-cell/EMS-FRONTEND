import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-ems-card border border-ems-border rounded-2xl w-full ${sizes[size]} shadow-2xl animate-slide-up`}>
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-ems-border">
            <h2 className="text-ems-white font-semibold text-lg">{title}</h2>
            <button onClick={onClose} className="text-ems-muted hover:text-white transition-colors">
              <FiX size={20} />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
