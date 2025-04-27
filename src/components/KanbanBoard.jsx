import { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const getTodayKey = () => {
  return new Date().toISOString().split('T')[0];
};

function KanbanBoard({ selectedDate }) {
  const todayKey = selectedDate || getTodayKey();
  const [allProjects, setAllProjects] = useLocalStorage('projects', {});
  const todayProjects = allProjects[todayKey] || [];

  const [input, setInput] = useState('');

  const saveTodayProjects = (newProjects) => {
    setAllProjects({
      ...allProjects,
      [todayKey]: newProjects,
    });
  };

  const addProject = () => {
    if (input.trim() === '') return;
    const newProject = {
      id: Date.now(),
      title: input,
      status: 'todo',
      createdAt: new Date().toISOString(),
    };
    saveTodayProjects([...todayProjects, newProject]);
    setInput('');
  };

  const moveProject = (id, newStatus) => {
    const updatedProjects = todayProjects.map(project =>
      project.id === id ? { ...project, status: newStatus } : project
    );
    saveTodayProjects(updatedProjects);
  };

  const deleteProject = (id) => {
    const updatedProjects = todayProjects.filter(project => project.id !== id);
    saveTodayProjects(updatedProjects);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addProject();
    }
  };

  const columns = [
    { key: 'todo', label: 'To Do' },
    { key: 'inprogress', label: 'In Progress' },
    { key: 'done', label: 'Done' },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4">Projects - {todayKey}</h2>

      {/* Add Project Input */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          className="border border-gray-300 p-2 flex-1 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          placeholder="New project title..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={addProject} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Add
        </button>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(col => (
          <div key={col.key} className="bg-gray-50 rounded-xl p-4 flex flex-col">
            <h3 className="text-lg font-semibold text-center mb-4">{col.label}</h3>
            <div className="flex flex-col gap-4">
              {todayProjects
                .filter(project => project.status === col.key)
                .map(project => (
                  <div
                    key={project.id}
                    className="bg-white p-4 rounded-xl shadow-sm flex flex-col justify-between h-full"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{project.title}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Added: {new Date(project.createdAt).toLocaleString('en-US', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3 justify-center mt-3">
                      {col.key !== 'todo' && (
                        <button
                          onClick={() => moveProject(project.id, 'todo')}
                          className="bg-blue-400 text-white px-3 py-1 rounded-lg text-xs"
                        >
                          To Do
                        </button>
                      )}
                      {col.key !== 'inprogress' && (
                        <button
                          onClick={() => moveProject(project.id, 'inprogress')}
                          className="bg-yellow-300 text-white px-3 py-1 rounded-lg text-xs"
                        >
                          In Progress
                        </button>
                      )}
                      {col.key !== 'done' && (
                        <button
                          onClick={() => moveProject(project.id, 'done')}
                          className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs"
                        >
                          Done
                        </button>
                      )}
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="bg-red-400 text-white px-3 py-1 rounded-lg text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default KanbanBoard;
