import React from 'react';
import { ArrowLeft, MoreVertical } from 'lucide-react';

export const ChatHeader = ({ onBack, contact, conversation }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          {contact && (
            <>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white">
                {conversation?.partner?.name
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('') || '?'}
              </div>
              <div>
                <div>{conversation?.partner?.name || 'Unknown User'}</div>
                <div className="text-sm text-gray-600">
                  Re: {conversation?.listing?.title || 'Unknown Listing'}
                </div>
              </div>
            </>
          )}
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};