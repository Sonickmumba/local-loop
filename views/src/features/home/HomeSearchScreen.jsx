import { useState, useEffect } from 'react';
import { ArrowLeft, Search, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const HomeSearchScreen = () => {
  const navigate = useNavigate();

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'offer', 'need'
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all', 'skills', 'goods', 'services'

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch listings when filters or debouncedQuery change
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);

        let url = `http://localhost:3000/api/listings?`;

        if (debouncedQuery)
          url += `search=${encodeURIComponent(debouncedQuery)}&`;
        if (typeFilter === 'offer' || typeFilter === 'need')
          url += `type=${typeFilter}&`;
        if (['skills', 'goods', 'services'].includes(categoryFilter))
          url += `category=${categoryFilter}&`;

        url = url.replace(/&$/, '');
        const { data } = await axios.get(url, { withCredentials: true });
        if (data.success) setResults(data.data);
      } catch (err) {
        console.error('Error fetching listings:', err);
        if (err.response?.status === 401) {
          navigate('/auth/signin');
          return;
        }
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [debouncedQuery, typeFilter, categoryFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate('/home/feed')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2>Search</h2>
          </div>

          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search listings..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-2 text-gray-700">Type</label>
                <div className="flex gap-2">
                  {['all', 'offer', 'need'].map((t) => (
                    <button
                      key={t}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                        typeFilter === t
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setTypeFilter(t)}
                    >
                      {t === 'all' ? 'All' : t === 'offer' ? 'Offers' : 'Needs'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-700">
                  Category
                </label>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">All Categories</option>
                  <option value="skills">Skills</option>
                  <option value="goods">Goods</option>
                  <option value="services">Services</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Results */}
      <div className="px-4 py-4 space-y-3">
        <div className="text-sm text-gray-600 mb-4">
          {loading ? 'Loading...' : `${results.length} results found`}
        </div>

        {results.map((result) => (
          <div
            key={result.id}
            onClick={() => navigate(`/listing-details/${result.id}`)}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  result.type === 'offer'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-orange-100 text-orange-700'
                }`}
              >
                {result.type === 'offer' ? 'Offering' : 'Looking for'}
              </span>
              <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                {result.category}
              </span>
            </div>
            <div className="mb-2">{result.title}</div>
            <div className="text-sm text-gray-600">
              {result.author} • {result.neighborhood} • {result.distance}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
