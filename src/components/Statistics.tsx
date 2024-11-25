import { Phone, Shield, Flame, Ambulance, Construction, AlertTriangle } from 'lucide-react';
import type { Emergency911Call } from '../types';

interface StatisticsProps {
  calls: Emergency911Call[];
}

export function Statistics({ calls }: StatisticsProps) {
  const stats = {
    active: calls.length,
    police: calls.filter(call => call.agency_type === 'Law').length,
    fire: calls.filter(call => call.agency_type === 'Fire').length,
    ems: calls.filter(call => call.agency_type === 'EMS').length,
    burns: calls.filter(call => call.type_description.toLowerCase().includes('burn')).length,
    roadClosures: calls.filter(call => call.type_description === 'ROAD CLOSURE').length,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Active Calls</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.active}</p>
          </div>
          <Phone className="w-8 h-8 text-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Police</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.police}</p>
          </div>
          <Shield className="w-8 h-8 text-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Fire</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.fire}</p>
          </div>
          <Flame className="w-8 h-8 text-red-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">EMS</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.ems}</p>
          </div>
          <Ambulance className="w-8 h-8 text-green-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Permit Burns</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.burns}</p>
          </div>
          <Flame className="w-8 h-8 text-orange-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Road Closures</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.roadClosures}</p>
          </div>
          <Construction className="w-8 h-8 text-yellow-500" />
        </div>
      </div>
    </div>
  );
}