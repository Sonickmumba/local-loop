import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ListingCard = ({ listing }) => {

  return (
    <Link
      to={`/listing-details/${listing.id}`}
      state={{ listing }}
      className="block no-underline text-inherit"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                listing.type === 'offer'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-orange-100 text-orange-700'
              }`}
            >
              {listing.type === 'offer' ? '🤝 Offering' : '🙋 Looking for'}
            </span>
            <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
              {listing.category}
            </span>
          </div>
        </div>

        <h3 className="mb-2">{listing.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{listing.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm">
              {listing.author_name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <div className="text-sm">{listing.author_name}</div>
              <div className="text-xs text-gray-500">
                {listing.neighborhood} • {listing.distance} km •{' '}
                {listing.timeAgo}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-gray-500">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm">{listing.responses_count}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
