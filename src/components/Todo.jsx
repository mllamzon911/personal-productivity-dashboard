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

const formatDuration = (mins) => {
  const hours = Math.floor(mins / 60).toString().padStart(2, '0');
  const minutes = (mins % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

function Todo({ selectedDate }) {
  const todayKey = selectedDate || getTodayKey();
  const [allTasks, setAllTasks] = useLocalStorage('tasks', {});
  const todayTasks = allTasks[todayKey] || [];

  const [input, setInput] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(0);

  const saveTodayTasks = (newTasks) => {
    setAllTasks({
      ...allTasks,
      [todayKey]: newTasks,
    });
  };

  const addTask = () => {
    if (input.trim() === '' || durationMinutes === 0) return;
    const newTask = {
      id: Date.now(),
      title: input,
      durationMinutes,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    saveTodayTasks([newTask, ...todayTasks]);
    setInput('');
    setDurationMinutes(0);
  };

  const toggleTask = (id) => {
    const updatedTodayTasks = todayTasks.map(task =>
      task.id === id
        ? {
            ...task,
            completed: !task.completed,
            completedAt: !task.completed ? new Date().toISOString() : null,
          }
        : task
    );
    saveTodayTasks(updatedTodayTasks);
  };

  const deleteTask = (id) => {
    const updatedTodayTasks = todayTasks.filter(task => task.id !== id);
    saveTodayTasks(updatedTodayTasks);
  };

  const increaseDuration = () => setDurationMinutes(prev => prev + 30);
  const decreaseDuration = () => setDurationMinutes(prev => Math.max(prev - 30, 0));

  const handleDurationChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) setDurationMinutes(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addTask();
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4">To-Do List - {todayKey}</h2>

      {/* Input Section */}
      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <input
          type="text"
          className="border border-gray-300 p-2 flex-1 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          placeholder="New task title..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* Duration input */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <button
              onClick={increaseDuration}
              className="bg-blue-400 text-white px-2 py-1 rounded-t w-8"
            >
              ▲
            </button>
            <button
              onClick={decreaseDuration}
              className="bg-blue-400 text-white px-2 py-1 rounded-b w-8"
            >
              ▼
            </button>
          </div>

          <div className="flex flex-col items-center">
            <input
              type="number"
              value={durationMinutes}
              onChange={handleDurationChange}
              className="border border-gray-300 w-16 text-center rounded-lg"
              min="0"
              step="30"
            />
            <div className="text-xs text-gray-500 mt-1">
              {formatDuration(durationMinutes)}
            </div>
          </div>
        </div>

        <button onClick={addTask} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Add
        </button>
      </div>

      {/* Task List */}
      <ul className="flex-1 overflow-y-auto">
        {todayTasks.length === 0 ? (
          <p className="text-gray-400 text-center mt-10">No tasks for this day.</p>
        ) : (
          todayTasks.map(task => {
            const actualMinutes = task.completedAt && task.createdAt
              ? Math.max(0, Math.floor((new Date(task.completedAt) - new Date(task.createdAt)) / 60000))
              : null;

            return (
              <li key={task.id} className="flex flex-col border-b py-4">
                <div className="flex justify-between items-center">
                  <span
                    onClick={() => toggleTask(task.id)}
                    className={`cursor-pointer p-1 rounded ${
                      task.completed ? 'line-through text-gray-500' : 'hover:bg-gray-100'
                    }`}
                  >
                    {task.title} ({formatDuration(task.durationMinutes)})
                  </span>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-400 text-sm ml-2"
                  >
                    Delete
                  </button>
                </div>

                <div className="text-xs text-gray-400 ml-2 mt-2">
                  <p>Added: {formatDateTime(task.createdAt)}</p>
                  {task.completedAt && (
                    <>
                      <p>Completed: {formatDateTime(task.completedAt)}</p>
                      <p>
                        Predicted: {formatDuration(task.durationMinutes)} | Actual: {formatDuration(actualMinutes)}
                      </p>
                    </>
                  )}
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}

export default Todo;
