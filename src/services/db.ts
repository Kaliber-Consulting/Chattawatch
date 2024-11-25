import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { Emergency911Call } from '../types';

interface Emergency911DB extends DBSchema {
  calls: {
    key: number;
    value: Emergency911Call;
    indexes: {
      'by-master-id': number;
      'by-creation': string;
      'by-status': string;
    };
  };
}

const DB_NAME = 'emergency911db';
const STORE_NAME = 'calls';

class EmergencyCallsDB {
  private db: Promise<IDBPDatabase<Emergency911DB>>;

  constructor() {
    this.db = this.initDB();
  }

  private async initDB() {
    return openDB<Emergency911DB>(DB_NAME, 1, {
      upgrade(db) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
        });
        store.createIndex('by-master-id', 'master_incident_id');
        store.createIndex('by-creation', 'creation');
        store.createIndex('by-status', 'status');
      },
    });
  }

  async getAllCalls(): Promise<Emergency911Call[]> {
    const db = await this.db;
    return db.getAll(STORE_NAME);
  }

  async upsertCalls(calls: Emergency911Call[]) {
    const db = await this.db;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    
    for (const call of calls) {
      const existingCall = await tx.store.index('by-master-id').get(call.master_incident_id);
      
      if (!existingCall || new Date(existingCall.statusdatetime) < new Date(call.statusdatetime)) {
        await tx.store.put(call);
      }
    }
    
    await tx.done;
  }

  async getHistoricalCalls(options: {
    startDate?: Date;
    endDate?: Date;
    searchQuery?: string;
    limit?: number;
  } = {}) {
    const db = await this.db;
    const tx = db.transaction(STORE_NAME, 'readonly');
    let calls = await tx.store.index('by-creation').getAll();
    
    // Filter out active calls (keep only closed ones)
    calls = calls.filter(call => call.status.toLowerCase() === 'closed');
    
    // Apply date range filter
    if (options.startDate || options.endDate) {
      calls = calls.filter((call) => {
        const callDate = new Date(call.creation);
        return (!options.startDate || callDate >= options.startDate) &&
               (!options.endDate || callDate <= options.endDate);
      });
    }
    
    // Apply search query
    if (options.searchQuery) {
      const query = options.searchQuery.toLowerCase();
      calls = calls.filter(call => 
        call.location.toLowerCase().includes(query) ||
        call.type_description.toLowerCase().includes(query) ||
        call.premise?.toLowerCase().includes(query) ||
        call.sequencenumber.toLowerCase().includes(query)
      );
    }
    
    // Sort by creation date (newest first)
    calls.sort((a, b) => new Date(b.creation).getTime() - new Date(a.creation).getTime());
    
    // Apply limit
    if (options.limit) {
      calls = calls.slice(0, options.limit);
    }
    
    return calls;
  }
}

export const emergencyDB = new EmergencyCallsDB();