import { useState } from 'react';
// import { Screen } from '../App';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createListing } from './listingsSlice';
import { fetchHomeFeed } from '../home/homeFeedSlice';

export const CreateListing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const creating = useSelector((s) => s.listings.creating);

  const [formData, setFormData] = useState({
    type: '',
    category: '',
    title: '',
    description: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(createListing(formData));

    if (createListing.fulfilled.match(result)) {
      alert('Listing created successfully!');
      dispatch(fetchHomeFeed());

      navigate('/home/feed');
    }
  };

  console.log('Form Data:', formData);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate('/home/feed')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2>Create Listing</h2>
        </div>
      </header>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Selection */}
          <div>
            <label className="block mb-3 text-gray-700">
              What would you like to do?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'offer' })}
                className={`p-6 rounded-xl border-2 transition-colors ${
                  formData.type === 'offer'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <div className="text-3xl mb-2">🤝</div>
                <div className="mb-1">Offer Something</div>
                <p className="text-sm text-gray-600">
                  Share skills, goods, or services
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'need' })}
                className={`p-6 rounded-xl border-2 transition-colors ${
                  formData.type === 'need'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <div className="text-3xl mb-2">🙋</div>
                <div className="mb-1">Ask for Help</div>
                <p className="text-sm text-gray-600">
                  Find what you're looking for
                </p>
              </button>
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block mb-2 text-gray-700">
              Category
            </label>
            <select
              id="category"
              value={formData.category ?? ''}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select category
              </option>
              <option value="skills">💡 Skills</option>
              <option value="goods">📦 Goods</option>
              <option value="services">🛠️ Services</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block mb-2 text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Give your listing a clear title"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block mb-2 text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Provide more details..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={creating}
            className="w-full bg-blue-600 text-white py-4 rounded-full hover:bg-blue-700 transition-colors"
          >
            {creating ? 'Creating...' : 'Create Listing'}
            Create Listing
          </button>
        </form>
      </div>
    </div>
  );
};
