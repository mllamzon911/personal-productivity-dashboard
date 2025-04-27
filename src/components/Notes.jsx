import { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const getTodayKey = () => {
  return new Date().toISOString().split('T')[0];
};

const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

function Notes({ selectedDate }) {
  const todayKey = selectedDate || getTodayKey();
  const [allNotes, setAllNotes] = useLocalStorage('notes', {});
  const todayNotes = allNotes[todayKey] || [];

  const [noteInput, setNoteInput] = useState('');

  const saveTodayNotes = (newNotes) => {
    setAllNotes({
      ...allNotes,
      [todayKey]: newNotes,
    });
  };

  const addNote = () => {
    if (noteInput.trim() === '') return;

    const newNote = {
      id: Date.now(),
      content: noteInput,
      createdAt: new Date().toISOString(),
    };

    saveTodayNotes([newNote, ...todayNotes]);
    setNoteInput('');
  };

  const deleteNote = (id) => {
    const updatedNotes = todayNotes.filter(note => note.id !== id);
    saveTodayNotes(updatedNotes);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addNote();
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4">Notes - {todayKey}</h2>

      {/* Input Section */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          className="border border-gray-300 p-2 flex-1 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Write a note..."
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={addNote} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Add
        </button>
      </div>

      {/* Notes List */}
      <ul className="flex-1 overflow-y-auto">
        {todayNotes.length === 0 ? (
          <p className="text-gray-400 text-center mt-10">No notes for this day.</p>
        ) : (
          todayNotes.map(note => (
            <li key={note.id} className="flex flex-col border-b py-4">
              <div className="flex justify-between items-center">
                <p className="font-medium">{note.content}</p>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="text-red-400 text-sm ml-2"
                >
                  Delete
                </button>
              </div>

              {/* Created Date */}
              <div className="text-xs text-gray-400 ml-2 mt-2">
                <p>Added: {formatDateTime(note.createdAt)}</p>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Notes;
