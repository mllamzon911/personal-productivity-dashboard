import { useState, useEffect } from "react";

const getTodayKey = () => {
  return new Date().toISOString().split("T")[0];
};

function PomodoroTimer({ selectedDate }) {
  const todayKey = selectedDate || getTodayKey();

  const [focusTime, setFocusTime] = useState(25 * 60); // 25 minutes by default
  const [isActive, setIsActive] = useState(false);
  const [timerType, setTimerType] = useState("focus"); // 'focus', 'shortBreak', 'longBreak'
  const [sessions, setSessions] = useState(0);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const startTimer = () => {
    setIsActive(true);
  };

  const stopTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setFocusTime(25 * 60); // Reset to default time
  };

  useEffect(() => {
    let interval;

    if (isActive) {
      interval = setInterval(() => {
        setFocusTime((prevTime) => {
          if (prevTime === 0) {
            handleTimerEnd();
            return prevTime;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  const handleTimerEnd = () => {
    if (timerType === "focus") {
      setSessions(sessions + 1);
      setTimerType("shortBreak");
      setFocusTime(5 * 60); // Short break time (5 minutes)
    } else if (timerType === "shortBreak") {
      setTimerType("focus");
      setFocusTime(25 * 60); // Focus time (25 minutes)
    } else if (timerType === "longBreak") {
      setTimerType("focus");
      setFocusTime(25 * 60); // Focus time again after long break
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4">Focus Time</h2>

      {/* Timer display */}
      <div className="flex justify-center items-center mb-6">
        <span className="text-5xl font-bold">{formatTime(focusTime)}</span>
      </div>

      {/* Timer buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={startTimer}
          disabled={isActive}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg disabled:opacity-50 cursor-pointer"
        >
          Start
        </button>
        <button
          onClick={stopTimer}
          disabled={!isActive}
          className="bg-red-500 text-white px-6 py-2 rounded-lg disabled:opacity-50 cursor-pointer"
        >
          Stop
        </button>
        <button
          onClick={resetTimer}
          className="bg-gray-400 text-white px-6 py-2 rounded-lg cursor-pointer"
        >
          Reset
        </button>
      </div>

      {/* Session Info */}
      <div className="mt-6 text-center">
        <p className="text-lg font-semibold">Sessions: {sessions}</p>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => {
              setTimerType("shortBreak");
              setFocusTime(5 * 60);
            }}
            className="bg-green-300 text-white px-4 py-2 rounded-lg text-xs"
          >
            Short Break
          </button>
          <button
            onClick={() => {
              setTimerType("longBreak");
              setFocusTime(15 * 60);
            }}
            className="bg-purple-300 text-white px-4 py-2 rounded-lg text-xs"
          >
            Long Break
          </button>
        </div>
      </div>
    </div>
  );
}

export default PomodoroTimer;
