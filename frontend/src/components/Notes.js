import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Search } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function Notes() {
  const [notes, setNotes] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/notes`);
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNote) {
        await axios.put(`${API_URL}/api/notes/${editingNote.id}`, formData);
      } else {
        await axios.post(`${API_URL}/api/notes`, formData);
      }
      setFormData({ title: '', content: '' });
      setShowAddForm(false);
      setEditingNote(null);
      fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/notes/${id}`);
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const startEdit = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content || ''
    });
    setShowAddForm(true);
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-[500px] md:h-[600px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-3 md:mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">Notes</h2>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingNote(null);
            setFormData({ title: '', content: '' });
          }}
          className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs md:text-sm"
        >
          <Plus size={16} className="md:hidden" />
          <Plus size={18} className="hidden md:block" />
          <span className="hidden md:inline">{showAddForm ? 'Cancel' : 'Add Note'}</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-3 md:mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300" size={16} className="md:hidden" />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300" size={18} className="hidden md:block" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/20 text-white placeholder-purple-200 rounded-lg pl-9 md:pl-10 pr-3 md:pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm md:text-base"
          />
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white/10 rounded-xl p-3 md:p-4 mb-3 md:mb-4">
          <input
            type="text"
            placeholder="Note title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-white/20 text-white placeholder-purple-200 rounded-lg px-3 md:px-4 py-2 mb-2 md:mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm md:text-base"
            required
          />
          <textarea
            placeholder="Note content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full bg-white/20 text-white placeholder-purple-200 rounded-lg px-3 md:px-4 py-2 mb-2 md:mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm md:text-base"
            rows="4"
          />
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm md:text-base"
          >
            {editingNote ? 'Update Note' : 'Create Note'}
          </button>
        </form>
      )}

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto space-y-2 md:space-y-3 scrollbar-hide">
        {filteredNotes.length === 0 ? (
          <div className="text-center text-purple-200 py-10 md:py-20">
            <p className="text-sm md:text-lg">{notes.length === 0 ? 'No notes yet' : 'No notes match your search'}</p>
            <p className="text-xs md:text-sm mt-2">
              {notes.length === 0 ? 'Click "Add Note" to create your first note!' : 'Try a different search term'}
            </p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div key={note.id} className="bg-white/10 rounded-xl p-3 md:p-4 hover:bg-white/15 transition-colors">
              <div className="flex justify-between items-start gap-2 md:gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm md:text-lg font-semibold text-white">{note.title}</h3>
                  {note.content && (
                    <p className="text-purple-200 text-xs md:text-sm mt-1 md:mt-2 whitespace-pre-wrap line-clamp-3 md:line-clamp-none">{note.content}</p>
                  )}
                  <p className="text-purple-300 text-xs mt-2 md:mt-3">
                    {new Date(note.created_at).toLocaleDateString()} at {new Date(note.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>

                <div className="flex gap-1 md:gap-2">
                  <button
                    onClick={() => startEdit(note)}
                    className="p-1 md:p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <Edit2 size={14} className="md:hidden" />
                    <Edit2 size={16} className="hidden md:block" />
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
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

export default Notes;
