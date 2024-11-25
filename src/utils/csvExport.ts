import type { Emergency911Call } from '../types';
import { formatToEST } from './dateUtils';

export const exportToCSV = (calls: Emergency911Call[]) => {
  const headers = [
    'ID',
    'Sequence Number',
    'Status',
    'Creation Time (EST)',
    'Zone',
    'Location',
    'Type',
    'Priority',
    'Jurisdiction',
    'Cross Streets',
    'Agency Type',
    'Type Description',
    'Premise'
  ];

  const rows = calls.map(call => [
    call.id,
    call.sequencenumber,
    call.status,
    formatToEST(call.creation),
    call.zone,
    call.location,
    call.type,
    call.priority,
    call.jurisdiction,
    call.crossstreets,
    call.agency_type,
    call.type_description,
    call.premise
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell || ''}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `911_calls_${formatToEST(new Date().toISOString(), 'yyyy-MM-dd_HH-mm')}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};