import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '../../services/api';

const AddAppModal = ({ 
  isOpen, 
  onClose, 
  initialData = null, 
  onAppAdded 
}) => {
  const CATEGORY_CHOICES = [
    { value: 'GAMES', label: 'Games' },
    { value: 'PRODUCTIVITY', label: 'Productivity' },
    { value: 'SOCIAL', label: 'Social Media' },
    { value: 'UTILITY', label: 'Utility' },
    { value: 'OTHER', label: 'Other' }
  ];

  const getInitialFormData = () => ({
    name: '',
    description: '',
    package_name: '',
    points_value: 10,
    category: 'OTHER',
    app_icon: null,
    playstore_link: '',
    is_active: true
  });

  const [formData, setFormData] = useState(getInitialFormData());
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setIsEditing(true);
    } else {
      setFormData(getInitialFormData());
      setIsEditing(false);
    }
    setSelectedFile(null);
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setFormData(prev => ({
      ...prev,
      app_icon: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const appData = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== '') {
        if (key === 'app_icon') {
          if (selectedFile) {
            appData.append(key, formData[key]);
          }
        } else {
          appData.append(key, formData[key]);
        }
      }
    });

    try {
      if (isEditing) {
        await api.put(`apps/${formData.id}/update/`, appData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('App updated successfully');
      } else {
        await api.post('apps/upload/', appData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('App added successfully');
      }
      
      onAppAdded();
      onClose();
    } catch (error) {
      console.error('Error submitting app:', error);
      
      if (error.response) {
        toast.error(error.response.data.message || 'Submission failed');
      } else if (error.request) {
        toast.error('No response received from server');
      } else {
        toast.error('Error: ' + error.message);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto ring-1 ring-gray-200 dark:ring-gray-700">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-200">
          {isEditing ? 'Edit App' : 'Add New App'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="appearance-none block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="appearance-none block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
          </div>

          <div>
            <label htmlFor="package_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Package Name
            </label>
            <input
              type="text"
              id="package_name"
              name="package_name"
              value={formData.package_name}
              onChange={handleChange}
              required
              className="appearance-none block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
          </div>

          <div>
            <label htmlFor="points_value" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Points
            </label>
            <input
              type="number"
              id="points_value"
              name="points_value"
              value={formData.points_value}
              onChange={handleChange}
              min="1"
              className="appearance-none block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              {CATEGORY_CHOICES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="app_icon" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              App Icon
            </label>
            <input
              type="file"
              id="app_icon"
              name="app_icon"
              onChange={handleFileChange}
              accept="image/*"
              className="appearance-none block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
            {selectedFile && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="playstore_link" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Play Store Link
            </label>
            <input
              type="url"
              id="playstore_link"
              name="playstore_link"
              value={formData.playstore_link}
              onChange={handleChange}
              placeholder="https://play.google.com/store/apps/details?id=..."
              className="appearance-none block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({
                  ...prev, 
                  is_active: e.target.checked
                }))}
                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mr-2"
              />
              Active App
            </label>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              {isEditing ? 'Update App' : 'Add App'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAppModal;