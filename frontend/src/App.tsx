import React, { useState, useEffect } from 'react';
import { authService } from './services/auth';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import './styles/App.css';
 
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
 
  useEffect(() => {
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);
    
    if (authenticated) {
      const user = authService.getUser();
      setUserRole(user?.role || null);
    }
  }, []);
 
  const handleLogin = () => {
    setIsAuthenticated(true);
    const user = authService.getUser();
    setUserRole(user?.role || null);
  };
 
  if (!isAuthenticated) {
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onLogin={handleLogin} onSwitchToRegister={() => setShowRegister(true)} />
    );
  }
 
  return userRole === 'admin' ? <AdminDashboard /> : <UserDashboard />;
}
 
export default App;
 