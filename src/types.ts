export interface Emergency911Call {
  id: number;
  sequencenumber: string;
  status: string;
  creation: string;
  zone: string;
  location: string;
  type: string;
  latitude: number;
  longitude: number;
  priority: string;
  statusdatetime: string;
  jurisdiction: string;
  crossstreets: string;
  city: string;
  state: string;
  agency_type: string;
  type_description: string;
  master_incident_id: number;
  battalion: string;
  stacked: boolean;
  premise: string;
  entered_queue: string;
}