import React from 'react';
import type { DraggableAttributes } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

interface BlockToolbarProps {
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  dragHandleProps?: {
    attributes?: DraggableAttributes;
    listeners?: SyntheticListenerMap;
  };
}

const BlockToolbar: React.FC<BlockToolbarProps> = ({
  onMoveUp,
  onMoveDown,
  onDelete,
  canMoveUp = true,
  canMoveDown = true,
  dragHandleProps,
}) => {
  return (
    <div className="absolute right-2 top-2 flex items-center space-x-2 bg-white dark:bg-boxdark rounded-md shadow-sm border border-stroke dark:border-strokedark p-1">
      <button
        onClick={onMoveUp}
        disabled={!canMoveUp}
        className={`p-1 rounded hover:bg-gray-1 dark:hover:bg-meta-4 ${
          !canMoveUp && 'opacity-50 cursor-not-allowed'
        }`}
        title="Move up"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>

      <button
        onClick={onMoveDown}
        disabled={!canMoveDown}
        className={`p-1 rounded hover:bg-gray-1 dark:hover:bg-meta-4 ${
          !canMoveDown && 'opacity-50 cursor-not-allowed'
        }`}
        title="Move down"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div className="w-px h-4 bg-stroke dark:bg-strokedark" />

      <button
        {...dragHandleProps}
        className="p-1 rounded hover:bg-gray-1 dark:hover:bg-meta-4 cursor-move"
        title="Drag to reorder"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 8h16M4 16h16"
          />
        </svg>
      </button>

      <div className="w-px h-4 bg-stroke dark:bg-strokedark" />

      <button
        onClick={onDelete}
        className="p-1 rounded hover:bg-danger hover:text-white"
        title="Delete block"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
};

export default BlockToolbar;
