import { useState, useEffect } from 'react';
import Todo from './Todo';
import KanbanBoard from './KanbanBoard';
import Notes from './Notes';
import PomodoroTimer from './PomodoroTimer';

const getTodayKey = () => {
  return new Date().toISOString().split('T')[0];
};

function Dashboard() {
  const todayKey = getTodayKey();
  const [selectedDate, setSelectedDate] = useState(todayKey);

  // Function to clear all localStorage data
  const clearLocalStorage = () => {
    const confirmClear = window.confirm("Are you sure you want to delete all your data?");
    if (confirmClear) {
      localStorage.clear();
      alert("All data has been cleared!");
      window.location.reload(); // Reload the page after clearing data
    }
  };

  // Read ALL LocalStorage data
  const allTasks = JSON.parse(localStorage.getItem('tasks')) || {};
  const allNotes = JSON.parse(localStorage.getItem('notes')) || {};
  const allPomodoros = JSON.parse(localStorage.getItem('pomodoros')) || {};
  const allProjects = JSON.parse(localStorage.getItem('projects')) || {};

  const rawDates = [
    ...Object.keys(allTasks || {}),
    ...Object.keys(allNotes || {}),
    ...Object.keys(allPomodoros || {}),
    ...Object.keys(allProjects || {}),
  ];

  const validDates = rawDates.filter(date => {
    if (!date) return false;
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
  });

  const uniqueDates = [...new Set(validDates)].sort().reverse();

  if (uniqueDates.length === 0) {
    uniqueDates.push(todayKey);
  }

  return (
    <div className="flex flex-col items-center p-4">
      {/* Clear LocalStorage Button */}
      <button
        onClick={clearLocalStorage}
        className="bg-red-500 text-white p-3 rounded-full mb-6"
      >
        Clear All Data
      </button>

      {/* Date Selector */}
      <div className="w-full max-w-md mb-8">
        <label className="block mb-2 font-semibold text-lg text-center">Select Date:</label>
        <select
          className="border rounded p-2 w-full text-center"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        >
          {uniqueDates.map(date => (
            <option key={date} value={date}>
              {date === todayKey ? `${date} 🌟 (Today)` : date}
            </option>
          ))}
        </select>
      </div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
        <Todo selectedDate={selectedDate} />
        <PomodoroTimer selectedDate={selectedDate} />
        <KanbanBoard selectedDate={selectedDate} />
        <Notes selectedDate={selectedDate} />
      </div>
    </div>
  );
}

export default Dashboard;
