import React from 'react';

const BoardHeader = ({ board, onCloseBoard }) => {
  return (
    <div className="flex items-center justify-between px-6 py-3 bg-black/20 backdrop-blur-md text-white">
      <div className="flex items-center gap-4">
        <img src="/logo.png" alt="Board Logo"  className='w-10 h-auto'/>
        <h1 className="text-xl font-bold font-sans tracking-wide">
          {board?.name || 'Loading Board...'}
        </h1>
        <span className="text-xs px-2 py-1 bg-white/20 rounded-md text-blue-100">
            {board?.visibility || 'Private'}
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Member Avatar Fake */}
        <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-xs">A</div>
            <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-xs">B</div>
        </div>
        
        <button className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded text-sm transition font-medium">
            Invite
        </button>
        
        <button 
          onClick={onCloseBoard}
          className="bg-red-500/80 hover:bg-red-600 px-3 py-1.5 rounded text-sm transition font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default BoardHeader;