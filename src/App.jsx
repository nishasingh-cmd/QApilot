import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { GitHubProvider } from './context/GitHubContext';
import { ScanProvider } from './context/ScanContext';
import { FindingsProvider } from './context/FindingsContext';
import { AnalyticsProvider } from './context/AnalyticsContext';

function App() {
  return (
    <BrowserRouter>
      <GitHubProvider>
        <ScanProvider>
          <FindingsProvider>
            <AnalyticsProvider>
              <AppRoutes />
            </AnalyticsProvider>
          </FindingsProvider>
        </ScanProvider>
      </GitHubProvider>
    </BrowserRouter>
  );
}

export default App;
