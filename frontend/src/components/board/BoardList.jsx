import React, { useEffect, useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import Card from './Card';
import { fetchTasks, createTask } from '../../services/taskService';
import { toast } from 'react-toastify';

const BoardList = ({ boardId, list, onTaskClick }) => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  
  useEffect(() => {
    if (list.tasks) {
      setTasks(list.tasks);
    } else {
      loadTasks();
    }
  }, [list.tasks]); 

  const loadTasks = async () => {
    if (!list.id) return;
    const data = await fetchTasks(boardId, list.id);
    setTasks(data || []);
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    try {
      const newTask = await createTask(boardId, list.id, newTaskTitle);
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setIsAdding(false);
    } catch (error) {
      toast.error("Lỗi tạo task");
    }
  };

  return (
    <div className="w-72 flex-shrink-0">
      <div className="bg-gray-100 rounded-xl p-3 shadow-inner max-h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="font-bold text-gray-700 text-sm">{list.name}</h3>
            <span className="text-xs text-gray-400">{tasks.length} tasks</span>
        </div>

        {/* Khu vực thả */}
        <Droppable droppableId={list.id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`overflow-y-auto pr-1 custom-scrollbar min-h-[10px] transition-colors ${
                snapshot.isDraggingOver ? "bg-blue-100 rounded-lg" : ""
              }`}
              style={{ maxHeight: 'calc(100vh - 220px)' }}
            >
              {tasks.map((task, index) => (
                <Card key={task.id} card={task} index={index} onClick={() => onTaskClick(task)} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* Form Add Task */}
        {isAdding ? (
          <div className="mt-2">
            <textarea 
              autoFocus
              className="w-full p-2 rounded border border-blue-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              rows="2"
              placeholder="Enter task title..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            ></textarea>
            <div className="flex gap-2 mt-1">
              <button onClick={handleAddTask} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Add</button>
              <button onClick={() => setIsAdding(false)} className="text-gray-500 px-2 py-1 text-sm">Cancel</button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsAdding(true)}
            className="w-full mt-2 py-2 text-gray-500 hover:bg-gray-200 rounded-lg text-sm text-left px-2 flex items-center gap-2"
          >
              <span className="text-xl leading-none">+</span> Add a card
          </button>
        )}
      </div>
    </div>
  );
};

export default BoardList;