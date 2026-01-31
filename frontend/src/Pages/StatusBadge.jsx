import React from 'react';

// Status Badge Component
export default function StatusBadge({ status }) {
  const config = {
    'On Track': 'bg-green-100 text-green-700 border-green-200',
    'Delayed': 'bg-red-100 text-red-700 border-red-200',
    'Completed': 'bg-blue-100 text-blue-700 border-blue-200',
    'In Progress': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Not Started': 'bg-slate-100 text-slate-600 border-slate-200'
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
        ${config[status] || config['Not Started']}
      `}
    >
      {status}
    </span>
  );
}
