import React, { useState } from 'react';
import { PlusIcon, TrashIcon, EditIcon } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

interface NotesProps {
  notes: Note[];
  onAddNote: (note: Note) => void;
  onEditNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
}

const Notes: React.FC<NotesProps> = ({ notes, onAddNote, onEditNote, onDeleteNote }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    const note: Note = {
      id: editingNote?.id || `note_${Date.now()}`,
      title: formData.title,
      content: formData.content,
      date: new Date().toISOString().split('T')[0],
    };

    if (editingNote) {
      onEditNote(note);
    } else {
      onAddNote(note);
    }

    setFormData({ title: '', content: '' });
    setShowForm(false);
    setEditingNote(null);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setFormData({ title: note.title, content: note.content });
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData({ title: '', content: '' });
    setShowForm(false);
    setEditingNote(null);
  };

  return (
    <div className="px-2 pt-2 pb-3 space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Notlar</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-2.5 py-1.5 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-1 text-xs min-h-[32px] whitespace-nowrap"
        >
          <PlusIcon className="h-3.5 w-3.5" />
          <span>Not Ekle</span>
        </button>
      </div>

      {/* Add/Edit Note Form */}
      {showForm && (
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2.5">
          <h3 className="text-xs font-medium text-gray-900 mb-2">
            {editingNote ? 'Not Düzenle' : 'Yeni Not'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="text"
              placeholder="Not başlığı..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-2.5 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs min-h-[36px]"
              required
            />
            <textarea
              placeholder="Not içeriği..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={2}
              className="w-full px-2.5 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs resize-none min-h-[60px]"
              required
            />
            <div className="flex space-x-1.5 pt-1">
              <button
                type="submit"
                className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-xs min-h-[32px] flex items-center justify-center"
              >
                {editingNote ? 'Güncelle' : 'Kaydet'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-xs min-h-[32px] flex items-center justify-center"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notes List */}
      <div className="space-y-2 pb-3">
        {notes.map((note) => (
          <div key={note.id} className="bg-white rounded-md shadow-sm border border-gray-200 p-2.5">
            <div className="flex items-start justify-between mb-1.5">
              <h3 className="font-medium text-gray-900 text-xs break-words flex-1 mr-2">{note.title}</h3>
              <div className="flex items-center space-x-1 flex-shrink-0">
                <button
                  onClick={() => handleEdit(note)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors min-w-[26px] min-h-[26px] flex items-center justify-center"
                >
                  <EditIcon className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onDeleteNote(note.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 transition-colors min-w-[26px] min-h-[26px] flex items-center justify-center"
                >
                  <TrashIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <p className="text-gray-700 text-xs mb-1.5 break-words whitespace-pre-wrap leading-snug">{note.content}</p>
            <p className="text-xs text-gray-500">{new Date(note.date).toLocaleDateString('tr-TR')}</p>
          </div>
        ))}
        
        {notes.length === 0 && !showForm && (
          <div className="text-center py-6 text-gray-500 text-xs px-3">
            Henüz not bulunmuyor. İlk notunuzu eklemek için "Not Ekle" butonuna tıklayın.
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;