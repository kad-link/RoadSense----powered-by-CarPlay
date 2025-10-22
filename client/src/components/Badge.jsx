import React from 'react';

function Badge({ children, color = "bg-blue-500" }) {
  return (
    <span className={`inline-block ${color} text-white text-xs px-2 py-1 rounded-full`}>
      {children}
    </span>
  );
}

export default Badge