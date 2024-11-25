import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Loader2, History, Activity } from 'lucide-react';
import { DataTable } from './components/DataTable';
import { SearchBar, type SearchFilters } from './components/SearchBar';
import { HistoricalDataModal } from './components/HistoricalDataModal';
import { Statistics } from './components/Statistics';
import { fetchEmergencyCalls } from './services/api';
import type { Emergency911Call } from './types';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    status: '',
    priority: '',
    agencyType: '',
  });
  const [isHistoricalModalOpen, setIsHistoricalModalOpen] = useState(false);

  const { data: calls, isLoading, error } = useQuery<Emergency911Call[]>({
    queryKey: ['emergencyCalls'],
    queryFn: fetchEmergencyCalls,
    refetchInterval: 15000, // Fetch every 15 seconds
  });

  const filteredCalls = calls?.filter((call) => {
    const matchesSearch =
      searchQuery === '' ||
      call.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.type_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.sequencenumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filters.status === '' || call.status.toLowerCase() === filters.status.toLowerCase();

    const matchesPriority =
      filters.priority === '' || call.priority === filters.priority;

    const matchesAgencyType =
      filters.agencyType === '' || call.agency_type === filters.agencyType;

    return matchesSearch && matchesStatus && matchesPriority && matchesAgencyType;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Activity className="w-8 h-8 text-white" />
              <h1 className="text-3xl font-bold text-white tracking-tight">Chattawatch</h1>
            </div>
            <button
              onClick={() => setIsHistoricalModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <History className="w-4 h-4 mr-2" />
              Historical Data
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {calls && <Statistics calls={calls} />}
        
        <SearchBar onSearch={setSearchQuery} onFilterChange={setFilters} />

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 text-red-500">
            <AlertCircle className="w-6 h-6 mr-2" />
            <span>Error loading emergency calls</span>
          </div>
        ) : (
          <DataTable calls={filteredCalls || []} />
        )}
      </main>

      <HistoricalDataModal
        isOpen={isHistoricalModalOpen}
        onClose={() => setIsHistoricalModalOpen(false)}
      />
    </div>
  );
}