import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { formatToEST } from '../utils/dateUtils';
import type { Emergency911Call } from '../types';

type SortField = keyof Emergency911Call | null;
type SortDirection = 'asc' | 'desc';

interface DataTableProps {
  calls: Emergency911Call[];
}

export function DataTable({ calls }: DataTableProps) {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: keyof Emergency911Call) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCalls = [...calls].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      return sortDirection === 'asc'
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }

    return 0;
  });

  const priorityColor = {
    'PRI 1': 'bg-red-100 text-red-800',
    'PRI 2': 'bg-orange-100 text-orange-800',
    'PRI 3': 'bg-yellow-100 text-yellow-800',
    'PRI 4': 'bg-blue-100 text-blue-800',
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'queued') return 'bg-gray-100 text-gray-800';
    if (statusLower === 'enroute' || statusLower === 'transporting') return 'bg-yellow-100 text-yellow-800';
    if (statusLower === 'at hospital' || statusLower === 'on scene') return 'bg-green-100 text-green-800';
    if (statusLower === 'closed') return 'bg-gray-100 text-gray-800';
    return 'bg-gray-100 text-gray-800';
  };

  const SortIcon = ({ field }: { field: keyof Emergency911Call }) => {
    if (sortField !== field) return <ChevronUp className="w-4 h-4 text-gray-400" />;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-blue-600" />
    );
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('priority')}
            >
              <div className="flex items-center gap-1">
                Priority
                <SortIcon field="priority" />
              </div>
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('type_description')}
            >
              <div className="flex items-center gap-1">
                Type
                <SortIcon field="type_description" />
              </div>
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('location')}
            >
              <div className="flex items-center gap-1">
                Location
                <SortIcon field="location" />
              </div>
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('agency_type')}
            >
              <div className="flex items-center gap-1">
                Agency
                <SortIcon field="agency_type" />
              </div>
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('creation')}
            >
              <div className="flex items-center gap-1">
                Time
                <SortIcon field="creation" />
              </div>
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('status')}
            >
              <div className="flex items-center gap-1">
                Status
                <SortIcon field="status" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedCalls.map((call) => (
            <tr
              key={call.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColor[call.priority as keyof typeof priorityColor] || 'bg-gray-100 text-gray-800'}`}>
                  {call.priority}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{call.type_description}</div>
                {call.premise && (
                  <div className="text-xs text-gray-500">{call.premise}</div>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{call.location}</div>
                {call.crossstreets && (
                  <div className="text-xs text-gray-500">Near: {call.crossstreets}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{call.agency_type}</div>
                <div className="text-xs text-gray-500">{call.jurisdiction}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {formatToEST(call.creation)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(call.status)}`}>
                  {call.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}