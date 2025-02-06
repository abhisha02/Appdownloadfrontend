import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from '../../services/api';
import ClaimModal from './ClaimModal'
import ProfileModal from "./ProfileModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const firstName = useSelector((state) => state.auth.first_name);
 
  
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleDownload = (playstoreLink, appName) => {
    if (playstoreLink) {
      window.open(playstoreLink, '_blank');
    } else {
      setError(`Playstore link for ${appName} is not available`);
      setTimeout(() => setError(null), 3000);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsResponse] = await Promise.all([
          api.get('/apps/available/'),
        ]);
        setApps(appsResponse.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-gray-900 dark:text-white font-bold text-2xl">
            Android App Download Portal
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsClaimModalOpen(true)}
              className="bg-blue-600 px-4 py-2.5 rounded-lg text-white hover:bg-blue-700 transition duration-150 ease-in-out"
            >
              Claim Points
            </button>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="bg-blue-600 px-4 py-2.5 rounded-lg text-white hover:bg-blue-700 transition duration-150 ease-in-out"
            >
              Profile
            </button>
            <h1 className="text-gray-900 dark:text-white text-lg">Welcome, {firstName}</h1>
            <button
              className="bg-blue-600 px-4 py-2.5 rounded-lg text-white hover:bg-blue-700 transition duration-150 ease-in-out"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
          Available Apps
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 transition-opacity">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-gray-600 dark:text-gray-400 text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app) => (
              <div 
                key={app.id} 
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg ring-1 ring-gray-200 dark:ring-gray-700"
              >
                {app.app_icon && (
                  <img 
                    src={app.app_icon} 
                    alt={app.name} 
                    className="w-full h-32 object-contain"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{app.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{app.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">
                      {app.points_value} Points
                    </span>
                    <button
                      className={`px-4 py-2 rounded-lg transition ${
                        app.playstore_link 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-gray-300 cursor-not-allowed text-gray-600'
                      }`}
                      onClick={() => handleDownload(app.playstore_link, app.name)}
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ClaimModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;