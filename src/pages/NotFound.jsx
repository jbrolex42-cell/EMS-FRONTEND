import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

export default function NotFound() {
  return (
    <MainLayout>
      <div className="min-h-[80vh] flex items-center justify-center text-center px-4">
        <div className="space-y-6">
          <div className="text-emergency-red font-display text-8xl sm:text-9xl opacity-20">404</div>
          <h1 className="text-3xl font-display text-ems-white -mt-8">PAGE NOT FOUND</h1>
          <p className="text-ems-muted max-w-sm mx-auto">The page you're looking for doesn't exist. If you're having an emergency, please call 1514 immediately.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/" className="btn-emergency py-3 px-6">← Back to Home</Link>
            <a href="tel:1514" className="btn-ghost py-3 px-6">📞 Call 1514</a>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
