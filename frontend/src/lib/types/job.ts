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
