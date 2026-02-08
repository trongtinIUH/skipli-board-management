import React, { useState, useEffect } from 'react';

const TaskModal = ({ task, onClose, onUpdate, onDelete }) => {
  const [taskTitle, setTaskTitle] = useState(task.title);
  const [taskDesc, setTaskDesc] = useState(task.description || '');
  const [newGhLink, setNewGhLink] = useState('');
  const [ghLinks, setGhLinks] = useState(task.githubLinks || []);

  //sync state khi task thay đổi
  useEffect(() => {
    setTaskTitle(task.title);
    setTaskDesc(task.description || '');
    setGhLinks(task.githubLinks || []);
  }, [task]);

  //hàm parse link github ra type
  function parseGhLink(url) {
    if (!url || url.trim() === '') return null;
    
    let type = 'link';
    let num = '';
    
    if (url.indexOf('/pull/') > -1) {
      type = 'pr';
      let parts = url.split('/pull/');
      num = parts[1] ? parts[1].split('/')[0].split('?')[0] : '';
    } else if (url.indexOf('/issues/') > -1) {
      type = 'issue';
      let parts = url.split('/issues/');
      num = parts[1] ? parts[1].split('/')[0].split('?')[0] : '';
    } else if (url.indexOf('/commit/') > -1) {
      type = 'commit';
      let parts = url.split('/commit/');
      num = parts[1] ? parts[1].substring(0,7) : '';
    }
    
    return { type, num, url };
  }

  //thêm github link mới
  function addGithubLink() {
    if (!newGhLink.trim()) {
      alert('Nhập link GitHub đi!');
      return;
    }
    
    //check có phải link github ko
    if (newGhLink.indexOf('github.com') === -1) {
      alert('Link không phải GitHub!');
      return;
    }
    
    //check trùng
    for (let i = 0; i < ghLinks.length; i++) {
      if (ghLinks[i].url === newGhLink) {
        alert('Link này đã có rồi!');
        return;
      }
    }
    
    let parsed = parseGhLink(newGhLink);
    if (parsed) {
      setGhLinks([...ghLinks, parsed]);
      setNewGhLink('');
    }
  }

  //xóa 1 link
  function removeLink(idx) {
    let arr = [];
    for (let i = 0; i < ghLinks.length; i++) {
      if (i !== idx) arr.push(ghLinks[i]);
    }
    setGhLinks(arr);
  }

  //lưu task
  function saveTask() {
    if (!taskTitle.trim()) {
      alert('Tiêu đề không được trống!');
      return;
    }
    
    onUpdate({
      ...task,
      title: taskTitle,
      description: taskDesc,
      githubLinks: ghLinks
    });
    onClose();
  }

  //xóa task
  function deleteTask() {
    let ok = window.confirm("Xóa task này?");
    if (ok) {
      onDelete(task.id);
      onClose();
    }
  }

  //enter để thêm link
  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addGithubLink();
    }
  }

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
            
            {/* Left side */}
            <div className="flex-1">
              {/* Description */}
              <div className="mb-5">
                <div className="flex items-center mb-3">
                   <span className="mr-2 text-gray-500">≡</span>
                   <h3 className="font-semibold text-gray-700 text-lg">Mô tả</h3>
                </div>
                <textarea 
                  placeholder="Thêm mô tả chi tiết hơn..."
                  value={taskDesc}
                  onChange={e => setTaskDesc(e.target.value)}
                  rows={4}
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
                <div className="bg-white border border-blue-200 rounded-lg p-4" style={{backgroundColor: '#f0f9ff'}}>
                  <label className="block text-sm text-gray-600 mb-2">
                    Thêm link Pull Request / Issue / Commit
                  </label>
                  <div style={{display: 'flex', gap: '8px'}}>
                    <input 
                      type="url"
                      placeholder="https://github.com/user/repo/pull/123"
                      value={newGhLink}
                      onChange={e => setNewGhLink(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
                    />
                    <button 
                      onClick={addGithubLink}
                      className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
                    >
                      + Thêm
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Paste link rồi nhấn Enter hoặc bấm Thêm</p>
                  
                  {/* danh sách link đã thêm */}
                  {ghLinks.length > 0 && (
                    <div style={{marginTop: '12px'}}>
                      <p className="text-sm font-medium text-gray-600 mb-2">Đã liên kết ({ghLinks.length}):</p>
                      {ghLinks.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-white rounded border mb-2" style={{borderColor: '#e5e7eb'}}>
                          <div className="flex items-center gap-2" style={{minWidth: 0, flex: 1}}>
                            <span>
                              {item.type === 'pr' && '🔀'}
                              {item.type === 'issue' && '🐛'}
                              {item.type === 'commit' && '📝'}
                              {item.type === 'link' && '🔗'}
                            </span>
                            <span className="text-xs px-2 py-1 rounded font-medium" style={{backgroundColor: '#dcfce7', color: '#166534'}}>
                              {item.type === 'pr' && 'PR'}
                              {item.type === 'issue' && 'Issue'}
                              {item.type === 'commit' && 'Commit'}
                              {item.type === 'link' && 'Link'}
                              {item.num && ` #${item.num}`}
                            </span>
                            <span className="text-xs text-gray-400 truncate" style={{maxWidth: '150px'}}>{item.url}</span>
                          </div>
                          <div className="flex items-center gap-2" style={{flexShrink: 0}}>
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-xs hover:underline">
                              Xem →
                            </a>
                            <button onClick={() => removeLink(idx)} className="text-red-400 hover:text-red-600 text-sm">
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {ghLinks.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-3" style={{marginTop: '12px'}}>
                      Chưa có link GitHub nào được liên kết
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right side - Actions */}
            <div style={{width: '180px'}}>
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