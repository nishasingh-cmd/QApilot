import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { GitHubProvider } from './context/GitHubContext';
import { ScanProvider } from './context/ScanContext';
import { FindingsProvider } from './context/FindingsContext';
import { AnalyticsProvider } from './context/AnalyticsContext';
import { ReportsProvider } from './context/ReportsContext';
import { NotificationsProvider } from './context/NotificationsContext';
import { ToastContainer } from './components/ui/ToastContainer';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GitHubProvider>
          <ScanProvider>
            <FindingsProvider>
              <AnalyticsProvider>
                <ReportsProvider>
                  <NotificationsProvider>
                    <AppRoutes />
                    <ToastContainer />
                  </NotificationsProvider>
                </ReportsProvider>
              </AnalyticsProvider>
            </FindingsProvider>
          </ScanProvider>
        </GitHubProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
