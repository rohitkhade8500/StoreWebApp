import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './pages/auth/SignupPage';
import LoginPage from './pages/auth/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserDashboard from './pages/user/UserDashboard';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import UserStoreList from './pages/user/UserStoreList';
import UserChangePassword from './pages/user/UserChangePassword';
import UpdatePassword from './pages/owner/UpdatePassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/stores" element={<UserStoreList />} />
        <Route path="/user/change-password" element={<UserChangePassword />} />
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/owner/update-password" element={<UpdatePassword />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
