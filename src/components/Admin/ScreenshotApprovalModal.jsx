import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '../../services/api'; // Adjust the path as needed

const ScreenshotApprovalModal = ({ isOpen, onClose }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchSubmittedTasks();
    }
  }, [isOpen]);

  const fetchSubmittedTasks = async () => {
    try {
      const response = await api.get('apps/tasks/submitted/');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch submitted tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await api.patch(`apps/tasks/${taskId}/update-status/`, {
        status: newStatus
      });
      toast.success(`Task ${newStatus.toLowerCase()} successfully`);
      fetchSubmittedTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task status');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200">Screenshot Approvals</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-700 dark:text-gray-200 py-4">Loading...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center text-gray-700 dark:text-gray-200 py-4">No tasks pending approval</div>
        ) : (
          <div className="space-y-6">
            {tasks.map((task) => (
              <div key={task.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-gray-900 dark:text-gray-200 font-semibold">{task.app.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">User: {task.user_first_name}</p>
                    <p className="text-gray-600 dark:text-gray-400">Submitted: {new Date(task.submitted_at).toLocaleString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusUpdate(task.id, 'APPROVED')}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(task.id, 'REJECTED')}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                    >
                      Reject
                    </button>
                  </div>
                </div>
                {task.screenshot && (
                  <div className="mt-4">
                    <img
                      src={task.screenshot}
                      alt="Task Screenshot"
                      className="w-64 h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScreenshotApprovalModal;