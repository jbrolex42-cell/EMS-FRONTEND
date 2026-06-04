import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { EmergencyProvider } from './context/EmergencyContext';
import AppRoutes from './routes/AppRoutes';
import 'leaflet/dist/leaflet.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <EmergencyProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1A1A1A',
                color: '#F5F5F5',
                border: '1px solid #2A2A2A',
                borderRadius: '12px',
                fontSize: '14px'
              },
              success: { iconTheme: { primary: '#22C55E', secondary: '#fff' } },
              error: { iconTheme: { primary: '#FF3B30', secondary: '#fff' } }
            }}
          />
        </EmergencyProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
