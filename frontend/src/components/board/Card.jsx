import React from 'react';
import { Draggable } from '@hello-pangea/dnd';

const Card = ({ card, index, onClick }) => {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`bg-white p-3 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:border-blue-400 group mb-3 transition-all ${
            snapshot.isDragging ? "shadow-lg ring-2 ring-blue-400 rotate-2" : ""
          }`}
          style={{
            ...provided.draggableProps.style,
          }}
        >
          {/* Labels */}
          {card.labels && card.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {card.labels.map((label, idx) => (
                <div 
                  key={idx}
                  className="h-2 w-8 rounded-full"
                  style={{ backgroundColor: label.color }}
                />
              ))}
            </div>
          )}

          {/* Tên Task */}
          <p className="text-sm font-medium text-gray-800">{card.title}</p>
        </div>
      )}
    </Draggable>
  );
};

export default Card;