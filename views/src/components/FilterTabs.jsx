import React from 'react';

export const FilterTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex gap-2">
        {['all', 'offers', 'needs'].map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-4 py-2 rounded-full transition-colors ${
              activeTab === tab
                ? tab === 'offers'
                  ? 'bg-green-600 text-white'
                  : tab === 'needs'
                  ? 'bg-orange-600 text-white'
                  : 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};