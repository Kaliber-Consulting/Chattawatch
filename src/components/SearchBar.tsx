import { Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  status: string;
  priority: string;
  agencyType: string;
}

export function SearchBar({ onSearch, onFilterChange }: SearchBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    status: '',
    priority: '',
    agencyType: '',
  });

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="w-full mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search by location, type, or ID..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onChange={(e) => onSearch(e.target.value)}
        />
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <SlidersHorizontal className="h-5 w-5" />
        </button>
      </div>

      {isFilterOpen && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="queued">Queued</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
              >
                <option value="">All</option>
                <option value="PRI 1">Priority 1</option>
                <option value="PRI 2">Priority 2</option>
                <option value="PRI 3">Priority 3</option>
                <option value="PRI 4">Priority 4</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agency Type
              </label>
              <select
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={filters.agencyType}
                onChange={(e) => handleFilterChange('agencyType', e.target.value)}
              >
                <option value="">All</option>
                <option value="Law">Law</option>
                <option value="Fire">Fire</option>
                <option value="EMS">EMS</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}