import { useState } from 'react';
import { X, Search, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { emergencyDB } from '../services/db';
import { DataTable } from './DataTable';
import { formatToEST } from '../utils/dateUtils';
import { exportToCSV } from '../utils/csvExport';
import type { Emergency911Call } from '../types';

interface HistoricalDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HistoricalDataModal({ isOpen, onClose }: HistoricalDataModalProps) {
  const [dateRange, setDateRange] = useState({
    startDate: formatToEST(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), 'yyyy-MM-dd'),
    endDate: formatToEST(new Date().toISOString(), 'yyyy-MM-dd'),
  });
  const [searchQuery, setSearchQuery] = useState('');

  const { data: historicalCalls, isLoading } = useQuery<Emergency911Call[]>({
    queryKey: ['historicalCalls', dateRange, searchQuery],
    queryFn: async () => {
      return emergencyDB.getHistoricalCalls({
        startDate: new Date(dateRange.startDate),
        endDate: new Date(dateRange.endDate),
        searchQuery: searchQuery,
        limit: 100,
      });
    },
    enabled: isOpen,
  });

  const handleExport = () => {
    if (historicalCalls && historicalCalls.length > 0) {
      exportToCSV(historicalCalls);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-[1200px] h-[800px] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Historical Emergency Calls</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleExport}
                disabled={!historicalCalls || historicalCalls.length === 0}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4 mr-2" />
                Export to CSV
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search historical calls..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          ) : historicalCalls?.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No historical calls found for the selected criteria
            </div>
          ) : (
            <DataTable calls={historicalCalls || []} />
          )}
        </div>
      </div>
    </div>
  );
}