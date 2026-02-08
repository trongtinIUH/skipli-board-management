import React, { useState, useEffect } from 'react';

const TaskModal = ({ task, onClose, onUpdate, onDelete }) => {
  const [taskTitle, setTaskTitle] = useState(task.title);
  const [taskDesc, setTaskDesc] = useState(task.description || '');
  const [githubUrl, setGithubUrl] = useState(task.githubPr || '');

  // sync với task mới khi chuyển đổi
  useEffect(() => {
    setTaskTitle(task.title);
    setTaskDesc(task.description || '');
    setGithubUrl(task.githubPr || '');
  }, [task]);

  const saveTask = () => {
    onUpdate({
      ...task,
      title: taskTitle,
      description: taskDesc,
      githubPr: githubUrl
    });
    onClose();
  };

  const deleteTask = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa task này không?")) {
      onDelete(task.id);
      onClose();
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center p-4" style={{zIndex: 999}}>
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-screen overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-start">
          <div className="flex-1 pr-4">
            <div className="text-xs text-gray-500 font-semibold uppercase mb-2">TASK TITLE</div>
            <input 
              type="text" 
              value={taskTitle}
              onChange={e => setTaskTitle(e.target.value)}
              className="text-2xl font-bold w-full border-none outline-none text-gray-800 bg-transparent border-b-2 border-transparent focus:border-blue-400"
              style={{fontFamily: 'inherit'}}
            />
            <div className="text-sm text-gray-400 mt-2">
              trong danh sách <span className="text-blue-500 underline">Danh sách hiện tại</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded-full p-2 hover:bg-gray-50"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 bg-gray-50 overflow-y-auto" style={{maxHeight: '70vh'}}>
          <div className="flex gap-6">
            
            {/* Left side - Description & GitHub */}
            <div className="flex-1">
              {/* Description */}
              <div className="mb-5">
                <div className="flex items-center mb-3">
                   <div className="w-5 h-5 mr-2">
                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-500">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                     </svg>
                   </div>
                   <h3 className="font-semibold text-gray-700 text-lg">Mô tả</h3>
                </div>
                <textarea 
                  placeholder="Thêm mô tả chi tiết hơn..."
                  value={taskDesc}
                  onChange={e => setTaskDesc(e.target.value)}
                  rows={5}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none bg-white"
                  style={{fontFamily: 'inherit'}}
                />
              </div>

              {/* GitHub Integration */}
              <div className="mb-4">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-2">🐱</span>
                  <h3 className="font-semibold text-gray-700 text-lg">GitHub Integration</h3>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <label className="block text-sm text-gray-600 mb-2">
                    Link Pull Request / Issue
                  </label>
                  <input 
                    type="url"
                    placeholder="https://github.com/user/repo/pull/123"
                    value={githubUrl}
                    onChange={e => setGithubUrl(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
                  />
                  {githubUrl && (
                    <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-sm text-green-700">Đã link GitHub</span>
                      <a 
                        href={githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm underline ml-auto"
                      >
                        Xem →
                      </a>
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Paste link GitHub PR hoặc Issue để liên kết với task này
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Actions */}
            <div style={{width: '200px'}}>
               <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">THAO TÁC</h4>
               
               <button 
                 onClick={saveTask}
                 className="w-full mb-3 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
               >
                 💾 Lưu thay đổi
               </button>
               
               <button 
                 onClick={deleteTask}
                 className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium py-3 px-4 rounded-lg border border-red-200 transition duration-200"
               >
                 🗑️ Xóa task
               </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TaskModal;