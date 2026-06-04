import Sidebar from '../components/Sidebar';
import { FiBell } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout({ children, title = '' }) {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-ems-black flex">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-ems-dark border-b border-ems-border flex items-center justify-between px-6 flex-shrink-0">
          <h1 className="text-ems-white font-semibold text-lg">{title}</h1>
          <div className="flex items-center gap-4">
            <button className="relative w-9 h-9 bg-ems-card border border-ems-border rounded-xl flex items-center justify-center text-ems-muted hover:text-white transition-colors">
              <FiBell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emergency-red rounded-full" />
            </button>
            <div className="text-right">
              <div className="text-ems-white text-sm font-medium">{user?.firstName} {user?.lastName}</div>
              <div className="text-ems-muted text-xs capitalize">{user?.role}</div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
