
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
            reverseOrder={false}
            gutter={10}
            toastOptions={{
              duration: 3500,

              style: {
                background: '#FFFFFF',
                color: '#1F2937',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                padding: '14px 18px',
                fontSize: '14px',
                fontWeight: '500',
                lineHeight: '1.5',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                maxWidth: '380px'
              },

              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#16A34A',
                  secondary: '#FFFFFF'
                },
                style: {
                  borderLeft: '4px solid #16A34A'
                }
              },

              error: {
                duration: 4500,
                iconTheme: {
                  primary: '#DC2626',
                  secondary: '#FFFFFF'
                },
                style: {
                  borderLeft: '4px solid #DC2626'
                }
              },

              loading: {
                iconTheme: {
                  primary: '#2563EB',
                  secondary: '#FFFFFF'
                }
              }
            }}
          />
        </EmergencyProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}