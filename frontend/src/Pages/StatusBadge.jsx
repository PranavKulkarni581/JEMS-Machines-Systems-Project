import React from 'react';

const STATUS_CONFIG = {
  NOT_STARTED: {
    label: 'Not Started',
    className: 'bg-slate-100 text-slate-600 border-slate-200'
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: 'bg-yellow-100 text-yellow-700 border-yellow-200'
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-green-100 text-green-700 border-green-200'
  },
  ON_HOLD: {
    label: 'On Hold',
    className: 'bg-red-100 text-red-700 border-red-200'
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-gray-200 text-gray-700 border-gray-300'
  },
  DELIVERED: {
    label: 'Delivered',
    className: 'bg-blue-100 text-blue-700 border-blue-200'
  }
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || {
    label: status?.replace('_', ' ') || 'Unknown',
    className: 'bg-slate-100 text-slate-600 border-slate-200'
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center
        px-3
        py-1
        rounded-full
        text-xs
        font-semibold
        border
        whitespace-nowrap
        ${config.className}
      `}
    >
      {config.label}
    </span>
  );
}
