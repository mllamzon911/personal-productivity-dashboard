import { useState } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';

const getTodayKey = () => {
  return new Date().toISOString().split('T')[0];
};

function HabitTracker() {
  const todayKey = getTodayKey();
  const [allHabits, setAllHabits] = useLocalStorage('habits', {});
  const todayHabits = allHabits[todayKey] || [
    { id: 1, name: 'Read', streak: 0 },
    { id: 2, name: 'Exercise', streak: 0 },
  ];

  const saveTodayHabits = (newHabits) => {
    setAllHabits({
      ...allHabits,
      [todayKey]: newHabits,
    });
  };

  const incrementStreak = (id) => {
    const updated = todayHabits.map(habit =>
      habit.id === id ? { ...habit, streak: habit.streak + 1 } : habit
    );
    saveTodayHabits(updated);
  };

  const decrementStreak = (id) => {
    const updated = todayHabits.map(habit =>
      habit.id === id ? { ...habit, streak: Math.max(habit.streak - 1, 0) } : habit
    );
    saveTodayHabits(updated);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow h-full">
      <h2 className="text-xl font-semibold mb-4">Habit Tracker - {todayKey}</h2>
      <ul>
        {todayHabits.map(habit => (
          <li key={habit.id} className="flex justify-between items-center p-2 border-b">
            <span>{habit.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">{habit.streak}🔥</span>
              <button
                onClick={() => incrementStreak(habit.id)}
                className="bg-green-500 text-white px-2 py-1 rounded"
              >
                ➕
              </button>
              <button
                onClick={() => decrementStreak(habit.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                ➖
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HabitTracker;
