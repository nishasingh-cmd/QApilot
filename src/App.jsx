import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { GitHubProvider } from './context/GitHubContext';
import { ScanProvider } from './context/ScanContext';
import { FindingsProvider } from './context/FindingsContext';

function App() {
  return (
    <BrowserRouter>
      <GitHubProvider>
        <ScanProvider>
          <FindingsProvider>
            <AppRoutes />
          </FindingsProvider>
        </ScanProvider>
      </GitHubProvider>
    </BrowserRouter>
  );
}

export default App;
