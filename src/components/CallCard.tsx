import { format } from 'date-fns';
import { MapPin, Clock, Building2, AlertTriangle } from 'lucide-react';
import type { Emergency911Call } from '../types';

interface CallCardProps {
  call: Emergency911Call;
}

export function CallCard({ call }: CallCardProps) {
  const priorityColor = {
    'PRI 1': 'bg-red-100 text-red-800',
    'PRI 2': 'bg-orange-100 text-orange-800',
    'PRI 3': 'bg-yellow-100 text-yellow-800',
    'PRI 4': 'bg-blue-100 text-blue-800',
  }[call.priority] || 'bg-gray-100 text-gray-800';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${priorityColor}`}>
            {call.priority}
          </span>
          <h3 className="text-lg font-semibold mt-2">{call.type_description}</h3>
        </div>
        <span className="text-sm text-gray-500">
          ID: {call.sequencenumber}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
          <div>
            <p className="text-gray-700">{call.location}</p>
            {call.crossstreets && (
              <p className="text-sm text-gray-500">Near: {call.crossstreets}</p>
            )}
          </div>
        </div>

        {call.premise && (
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-gray-400" />
            <p className="text-gray-700">{call.premise}</p>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-400" />
          <p className="text-sm text-gray-600">
            {format(new Date(call.creation), 'MMM d, yyyy h:mm a')}
          </p>
        </div>

        {call.stacked && (
          <div className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-medium">Stacked Call</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-gray-100 rounded-md text-sm text-gray-600">
            {call.jurisdiction}
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded-md text-sm text-gray-600">
            {call.agency_type}
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded-md text-sm text-gray-600">
            {call.zone}
          </span>
        </div>
      </div>
    </div>
  );
}