import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../../services/api';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md relative shadow-2xl ring-1 ring-gray-200 dark:ring-gray-700">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
};

const ClaimModal = ({ isOpen, onClose }) => {
    const [pendingTasks, setPendingTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [screenshot, setScreenshot] = useState(null);
    const [submitting, setSubmitting] = useState(false);
  
    useEffect(() => {
      const fetchPendingTasks = async () => {
        try {
          const response = await api.get('/apps/available/');
          setPendingTasks(response.data);
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch pending tasks');
          setLoading(false);
        }
      };
  
      if (isOpen) {
        fetchPendingTasks();
      }
    }, [isOpen]);
  
    const handleTaskSelect = (task) => {
      setSelectedTask(task);
      setScreenshot(null);
      setError(null);
    };
  
    const handleScreenshotChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          setError('Screenshot size should be less than 5MB');
          return;
        }
        setScreenshot(file);
        setError(null);
      }
    };
  
    const handleSubmit = async () => {
      if (!selectedTask || !screenshot) {
        setError('Please select a task and upload a screenshot');
        return;
      }
  
      setSubmitting(true);
      const formData = new FormData();
      formData.append('app', selectedTask.id);
      formData.append('screenshot', screenshot);
  
      try {
        await api.post('apps/tasks/submit/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setPendingTasks(pendingTasks.filter(task => task.id !== selectedTask.id));
        setSelectedTask(null);
        setScreenshot(null);
        setError('Task submitted successfully!');
        setTimeout(() => setError(null), 3000);
      } catch (err) {
        setError('Failed to submit task. Please try again.');
      } finally {
        setSubmitting(false);
      }
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Select the App and upload screenshot to Claim Your Points">
        <div>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
  
          {loading ? (
            <div className="text-center py-4 text-gray-600 dark:text-gray-400">Loading tasks...</div>
          ) : pendingTasks.length === 0 ? (
            <div className="text-gray-600 dark:text-gray-400 text-center py-4">
              No pending tasks available.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 rounded-lg cursor-pointer transition ${
                      selectedTask?.id === task.id
                        ? 'bg-blue-50 border-2 border-blue-600'
                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                    onClick={() => handleTaskSelect(task)}
                  >
                    {task.app_icon && (
                      <img
                        src={task.app_icon}
                        alt={task.name}
                        className="w-full h-20 object-contain mb-2"
                      />
                    )}
                    <p className="text-gray-900 dark:text-white text-center text-sm">{task.name}</p>
                    <p className="text-blue-600 dark:text-blue-400 text-center text-sm font-medium">
                      {task.points_value} Points
                    </p>
                  </div>
                ))}
              </div>
  
              {selectedTask && (
                <div className="space-y-3">
                  <p className="text-gray-900 dark:text-white">Selected: {selectedTask.name}</p>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Upload Screenshot</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotChange}
                      className="w-full text-gray-900 dark:text-white"
                    />
                  </div>
  
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !screenshot}
                    className={`w-full py-2.5 rounded-lg transition ${
                      submitting || !screenshot
                        ? 'bg-gray-300 cursor-not-allowed text-gray-600'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {submitting ? 'Submitting...' : 'Submit Task'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>
    );
};

export default ClaimModal;