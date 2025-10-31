import React, { useMemo } from 'react';
import { Folder } from 'lucide-react';

export default function DocCard(props) {
  const gradients = [
    'from-purple-500 to-purple-600',
    'from-blue-500 to-blue-600',
    'from-green-500 to-green-600',
    'from-orange-500 to-orange-600',
    'from-pink-500 to-pink-600',
    'from-red-500 to-red-600',
    'from-indigo-500 to-indigo-600',
    'from-teal-500 to-teal-600'
  ];

  const randomGradient = useMemo(() => {
    return gradients[Math.floor(Math.random() * gradients.length)];
  }, []);

  return (
    <div className="w-[50vh] max-w-md ">
      <div className={`bg-gradient-to-br ${randomGradient} rounded-t-2xl p-6 text-white`}>
        <div className="flex items-start justify-between mb-6">
          <div className="bg-white rounded-xl p-3 ">
            <Folder className="text-purple-600" size={24} />
          </div>
          <div className="bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
            {props.date}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-2 break-words">{props.name}</h2>
          <p className="text-white/90 text-sm leading-relaxed">
             {props.description}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-b-2xl p-4 border border-t-0 border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-medium">{props.size}</span>
        </div>
      </div>
    </div>
  );
}