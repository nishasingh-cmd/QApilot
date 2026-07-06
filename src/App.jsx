import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { GitHubProvider } from './context/GitHubContext';
import { ScanProvider } from './context/ScanContext';

function App() {
  return (
    <BrowserRouter>
      <GitHubProvider>
        <ScanProvider>
          <AppRoutes />
        </ScanProvider>
      </GitHubProvider>
    </BrowserRouter>
  );
}

export default App;
