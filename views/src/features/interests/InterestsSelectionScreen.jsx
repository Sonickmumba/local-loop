import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const interests = [
  { id: 'gardening', label: 'Gardening', emoji: '🌱' },
  { id: 'cooking', label: 'Cooking', emoji: '🍳' },
  { id: 'music', label: 'Music', emoji: '🎵' },
  { id: 'sports', label: 'Sports', emoji: '⚽' },
  { id: 'arts', label: 'Arts & Crafts', emoji: '🎨' },
  { id: 'tech', label: 'Technology', emoji: '💻' },
  { id: 'pets', label: 'Pets', emoji: '🐕' },
  { id: 'fitness', label: 'Fitness', emoji: '🏃' },
  { id: 'reading', label: 'Reading', emoji: '📚' },
  { id: 'photography', label: 'Photography', emoji: '📷' },
  { id: 'diy', label: 'DIY Projects', emoji: '🔨' },
  { id: 'language', label: 'Languages', emoji: '🗣️' },
];

export const InterestsSelectionScreen = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  const toggleInterest = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen flex flex-col p-6 bg-gray-50">
      <div className="flex-1 w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="mb-3">What are you interested in?</h1>
          <p className="text-lg text-gray-600">
            Select your interests to personalize your feed
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Choose at least 3 interests
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          {interests.map((interest) => (
            <button
              key={interest.id}
              onClick={() => toggleInterest(interest.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selected.includes(interest.id)
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            >
              <div className="text-3xl mb-2">{interest.emoji}</div>
              <div className="text-sm">{interest.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/signup')}
          disabled={selected.length < 3}
          className={`w-full py-4 rounded-full transition-colors ${
            selected.length >= 3
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue {selected.length > 0 && `(${selected.length} selected)`}
        </button>
      </div>
    </div>
  );
};
