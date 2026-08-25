export interface Job {
  _id: string;
  title: string;
  description: string;
  status: "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
    address: string;
  };
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  createdBy: {
    _id: string;
    name: string;
  };
  scheduledDate?: string;
  completedDate?: string;
  photos: string[];
  notes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface JobFilters {
  status?: string;
  technician?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  page?: number;
  limit?: number;
  search?: string;
}

export interface JobsResponse {
  data: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateJobInput {
  title: string;
  description: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  location: {
    coordinates: [number, number];
    address: string;
  };
  scheduledDate?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
}

// types/job.types.ts

export interface Customer {
  name: string;
  phone: string;
  address: string;
  email: string;
}

export type JobLocation = {
  type: "Point";
  address: string;
  coordinates: [number, number]; // [longitude, latitude]
};

export interface TechnicianRef {
  id: string;
  name: string;
  email: string;
}

export type JobStatus =
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "PENDING"
  | "COMPLETED"
  | "CANCELLED";

export interface Job {
  id: string;
  title: string;
  description: string;
  customer: Customer;
  location: JobLocation;
  status: JobStatus;
  technician: TechnicianRef | null;
  scheduledAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  completionNotes: string | null;
  completionPhotos: string[];
  createdAt: string;
  updatedAt: string;
}

// For API responses with pagination
export interface JobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// For create/update job payloads
export interface CreateJobPayload {
  title: string;
  description?: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  technicianId?: string;
  scheduledAt?: string;
}

export interface UpdateJobPayload {
  title?: string;
  description?: string;
  customer?: {
    name?: string;
    phone?: string;
    address?: string;
  };
  location?: {
    latitude?: number;
    longitude?: number;
  };
  status?: JobStatus;
  technicianId?: string | null;
  scheduledAt?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  completionNotes?: string | null;
  completionPhotos?: string[];
}

// For job status counts
export interface JobStatusCounts {
  ASSIGNED: number;
  IN_PROGRESS: number;
  PENDING: number;
  COMPLETED: number;
  CANCELLED: number;
}

// For job filters/query params
export interface JobFilters {
  status?: JobStatus;
  technicianId?: string;
  customerName?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "scheduledAt" | "status" | "title";
  sortOrder?: "asc" | "desc";
}
