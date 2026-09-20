import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2, Edit2, Calendar } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: ''
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await axios.put(`${API_URL}/api/tasks/${editingTask.id}`, formData);
      } else {
        await axios.post(`${API_URL}/api/tasks`, formData);
      }
      setFormData({ title: '', description: '', priority: 'medium', due_date: '' });
      setShowAddForm(false);
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const toggleComplete = async (task) => {
    try {
      await axios.put(`${API_URL}/api/tasks/${task.id}`, {
        ...task,
        completed: !task.completed
      });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const startEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      due_date: task.due_date ? task.due_date.split('T')[0] : ''
    });
    setShowAddForm(true);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-300';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300';
      case 'low': return 'bg-green-500/20 text-green-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="flex flex-col h-[500px] md:h-[600px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-3 md:mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">Tasks</h2>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingTask(null);
            setFormData({ title: '', description: '', priority: 'medium', due_date: '' });
          }}
          className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs md:text-sm"
        >
          <Plus size={16} className="md:hidden" />
          <Plus size={18} className="hidden md:block" />
          <span className="hidden md:inline">{showAddForm ? 'Cancel' : 'Add Task'}</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white/10 rounded-xl p-3 md:p-4 mb-3 md:mb-4">
          <input
            type="text"
            placeholder="Task title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-white/20 text-white placeholder-purple-200 rounded-lg px-3 md:px-4 py-2 mb-2 md:mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm md:text-base"
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-white/20 text-white placeholder-purple-200 rounded-lg px-3 md:px-4 py-2 mb-2 md:mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm md:text-base"
            rows="2"
          />
          <div className="flex gap-2 md:gap-3 mb-2 md:mb-3">
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="flex-1 bg-white/20 text-white rounded-lg px-3 md:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm md:text-base"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              className="flex-1 bg-white/20 text-white rounded-lg px-3 md:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm md:text-base"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm md:text-base"
          >
            {editingTask ? 'Update Task' : 'Create Task'}
          </button>
        </form>
      )}

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto space-y-2 md:space-y-3 scrollbar-hide">
        {tasks.length === 0 ? (
          <div className="text-center text-purple-200 py-10 md:py-20">
            <p className="text-sm md:text-lg">No tasks yet</p>
            <p className="text-xs md:text-sm mt-2">Click "Add Task" to create your first task!</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white/10 rounded-xl p-3 md:p-4 transition-all ${
                task.completed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start gap-2 md:gap-3">
                <button
                  onClick={() => toggleComplete(task)}
                  className={`mt-0 md:mt-1 p-1 md:p-2 rounded-lg transition-colors ${
                    task.completed
                      ? 'bg-green-500 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <Check size={16} className="md:hidden" />
                  <Check size={18} className="hidden md:block" />
                </button>

                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-sm md:text-lg font-semibold ${
                      task.completed ? 'line-through text-purple-300' : 'text-white'
                    }`}
                  >
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-purple-200 text-xs md:text-sm mt-1">{task.description}</p>
                  )}
                  <div className="flex gap-1 md:gap-2 mt-1 md:mt-2 flex-wrap">
                    <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    {task.due_date && (
                      <span className="flex items-center gap-1 text-purple-200 text-xs">
                        <Calendar size={10} className="md:hidden" />
                        <Calendar size={12} className="hidden md:block" />
                        {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-1 md:gap-2">
                  <button
                    onClick={() => startEdit(task)}
                    className="p-1 md:p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <Edit2 size={14} className="md:hidden" />
                    <Edit2 size={16} className="hidden md:block" />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1 md:p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 size={14} className="md:hidden" />
                    <Trash2 size={16} className="hidden md:block" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Tasks;
