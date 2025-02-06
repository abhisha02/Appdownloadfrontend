import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Edit2, Trash2, Plus, Camera } from 'lucide-react';
import api from '../../services/api';
import AddAppModal from './AddAppModal';
import ScreenshotApprovalModal from './ScreenshotApprovalModal';


const Dashboard = () => {
  const navigate = useNavigate();
  const firstName = useSelector((state) => state.auth.first_name);
  
  const [apps, setApps] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isScreenshotModalOpen, setIsScreenshotModalOpen] = useState(false);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const response = await api.get('apps/');
      setApps(response.data);
    } catch (error) {
      console.error('Error fetching apps:', error);
      toast.error('Failed to fetch apps');
    }
  };

  const handleEdit = (app) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  const handleDelete = async (appId) => {
    if (window.confirm('Are you sure you want to delete this app?')) {
      try {
        await api.delete(`apps/${appId}/delete/`);
        toast.success('App deleted successfully');
        fetchApps();
      } catch (error) {
        console.error('Error deleting app:', error);
        toast.error('Failed to delete app');
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 shadow-lg border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-gray-900 dark:text-gray-200 font-bold text-2xl">
            Android App Management Portal
          </h1>
          <div className="flex items-center space-x-4 ml-auto">
            <h1 className="text-gray-700 dark:text-gray-300 text-lg">Welcome, {firstName}</h1>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition duration-300"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto mt-6 px-6">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200">Existing Apps</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setIsScreenshotModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-blue-700 transition duration-300"
            >
              <Camera size={20} />
              <span>Screenshot Approvals</span>
            </button>
            <button
              onClick={() => {
                setSelectedApp(null);
                setIsModalOpen(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-blue-700 transition duration-300"
            >
              <Plus size={20} />
              <span>Add New App</span>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Points</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((app) => (
                <tr key={app.id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-200">{app.name}</td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-200">{app.category}</td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-200">{app.points_value}</td>
                  <td className="px-4 py-2 flex space-x-2 justify-center">
                    <button
                      onClick={() => handleEdit(app)}
                      className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-300"
                      title="Edit"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(app.id)}
                      className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-300"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AddAppModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={selectedApp}
          onAppAdded={fetchApps}
        />

        <ScreenshotApprovalModal
          isOpen={isScreenshotModalOpen}
          onClose={() => setIsScreenshotModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default Dashboard;