import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { GitHubProvider } from './context/GitHubContext';

function App() {
  return (
    <BrowserRouter>
      <GitHubProvider>
        <AppRoutes />
      </GitHubProvider>
    </BrowserRouter>
  );
}

export default App;
