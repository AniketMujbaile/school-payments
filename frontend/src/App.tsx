import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import components
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import SchoolTransactions from './pages/SchoolTransactions';
import StatusCheck from './pages/StatusCheck';
import Layout from './components/Layout/Layout';
import PrivateRoute from './components/Auth/PrivateRoute';

// Import services
import { authService } from './services/api';

// Theme context
export const ThemeContext = React.createContext({
  isDarkMode: false,
  toggleTheme: () => {}
});

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      document.documentElement.classList.toggle('dark', newMode);
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <Router>
        <div className={`min-h-screen ${isDarkMode ? 'dark bg-dark-900 text-white' : 'bg-white'}`}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/transactions" 
              element={
                <PrivateRoute>
                  <Layout>
                    <Transactions />
                  </Layout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/school-transactions" 
              element={
                <PrivateRoute>
                  <Layout>
                    <SchoolTransactions />
                  </Layout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/status-check" 
              element={
                <PrivateRoute>
                  <Layout>
                    <StatusCheck />
                  </Layout>
                </PrivateRoute>
              } 
            />
            {/* Redirect to dashboard if no route matches */}
            <Route 
              path="*" 
              element={<Navigate to="/" replace />} 
            />
          </Routes>
          <ToastContainer 
            position="top-right" 
            autoClose={3000} 
            theme={isDarkMode ? 'dark' : 'light'} 
          />
        </div>
      </Router>
    </ThemeContext.Provider>
  );
};

export default App;