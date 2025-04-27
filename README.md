# Personal Productivity Dashboard

This **Personal Productivity Dashboard** is a modern web application to help users manage their daily tasks, track focus time with a Pomodoro timer, organize their projects in a Kanban board, and take notes. The application is built using React.js and Tailwind CSS for styling.

---

## Features

- **To-Do List**: Add, mark as complete, delete tasks, and track their estimated durations.
- **Pomodoro Timer**: A customizable Pomodoro timer to help you focus, with short and long breaks.
- **Kanban Board**: Manage tasks in a Kanban board with 3 columns: "To Do", "In Progress", and "Done".
- **Notes**: Create, store, and delete notes.

---

## Tech Stack

- **React.js**: For building the user interface.
- **Tailwind CSS**: For fast and responsive styling.
- **LocalStorage**: For saving user data.

```vbnet
personal-productivity-dashboard/
├── public/ 
│   └── (assets like icons, favicon)
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── Todo.jsx
│   │   ├── KanbanBoard.jsx
│   │   ├── Notes.jsx
│   │   ├── PomodoroTimer.jsx
│   ├── App.jsx
│   ├── index.js
│   ├── styles/
│   │   └── App.css (optional custom styles)
├── package.json
├── .gitignore
└── README.md
```

---

## LocalStorage Data

The app uses localStorage to persist the following data (All data is saved in the browser's localStorage, so the data persists across sessions.):
- To-Do List: Tasks, their status, and duration.
- Pomodoro Timer: The number of sessions completed.
- Kanban Board: Projects and their status.
- Notes: The notes created for each day.

---

## Getting Started

Follow the steps below to get this app running on your local machine.

### 1. Clone the Repository

First, clone the repository to your local machine.

```bash
git clone https://github.com/mllamzon911/personal-productivity-dashboard.git
