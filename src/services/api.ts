import { emergencyDB } from './db';
import type { Emergency911Call } from '../types';

const API_URL = 'https://hc911server.com/api/calls';

export async function fetchEmergencyCalls() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const activeCalls: Emergency911Call[] = await response.json();
    
    // Get all current calls from IndexedDB
    const currentCalls = await emergencyDB.getAllCalls();
    
    // Find calls that are no longer in the API response
    const closedCalls = currentCalls.filter(currentCall => 
      currentCall.status.toLowerCase() !== 'closed' && 
      !activeCalls.some(activeCall => 
        activeCall.master_incident_id === currentCall.master_incident_id
      )
    ).map(call => ({
      ...call,
      status: 'Closed',
      statusdatetime: new Date().toISOString()
    }));

    // Store both active and newly closed calls
    await emergencyDB.upsertCalls([...activeCalls, ...closedCalls]);
    
    return activeCalls;
  } catch (error) {
    console.error('Error fetching emergency calls:', error);
    throw error;
  }
}