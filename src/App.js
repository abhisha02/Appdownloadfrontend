
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/pages/user/Register';
import Login from './components/pages/common/Login';
import PrivateRoute from './utils/Routes/PrivateRoute';
import Dashboard from './components/User/Dashboard';
import AdminHome from './components/Admin/AdminHome';
import PublicRoute from './utils/Routes/PublicRoute';
import {Helmet} from "react-helmet";
import { Toaster } from 'sonner';




function App() {
  return (
    <Router>
       <Helmet>
        <meta charSet="utf-8" />
        <title>Appdownload</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <Toaster 
        position="top-center" 
        richColors 
        duration={2000} 
      />
            <Routes>
            <Route path="/register" element={<PublicRoute><Register/></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login/></PublicRoute>}/>
            <Route path="/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>}/> 
            <Route path="/admin/home" element={<PrivateRoute><AdminHome/></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/login" />} />
            
       </Routes>
  </Router>
  );
}

export default App;
