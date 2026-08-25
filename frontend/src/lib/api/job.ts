import { apiClient } from "./client";
import { Job, JobFilters, JobsResponse, CreateJobInput } from "@/lib/types/job";

export const jobsService = {
  getJobs: async (filters: JobFilters): Promise<JobsResponse> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "dateRange" && value) {
          params.append("startDate", value.start);
          params.append("endDate", value.end);
        } else {
          params.append(key, value.toString());
        }
      }
    });

    const response = await apiClient.get(`/jobs?${params.toString()}`);
    return response.data;
  },

  getJob: async (id: string): Promise<Job> => {
    const response = await apiClient.get(`/jobs/${id}`);
    return response.data;
  },

  createJob: async (data: CreateJobInput): Promise<Job> => {
    const response = await apiClient.post("/jobs", data);
    return response.data;
  },

  updateJob: async (id: string, data: Partial<Job>): Promise<Job> => {
    const response = await apiClient.patch(`/jobs/${id}`, data);
    return response.data;
  },

  assignJob: async (id: string, technicianId: string): Promise<Job> => {
    const response = await apiClient.patch(`/jobs/${id}/assign`, {
      technicianId,
    });
    return response.data;
  },

  unassignJob: async (id: string): Promise<Job> => {
    const response = await apiClient.patch(`/jobs/${id}/unassign`);
    return response.data;
  },

  cancelJob: async (id: string): Promise<Job> => {
    const response = await apiClient.patch(`/jobs/${id}/cancel`);
    return response.data;
  },

  getNearbyJobs: async (coordinates: [number, number], radius: number = 10) => {
    const response = await apiClient.get("/jobs/nearby", {
      params: {
        longitude: coordinates[0],
        latitude: coordinates[1],
        radius,
      },
    });
    return response.data;
  },

  getTechnicians: async () => {
    const response = await apiClient.get("/users/technicians");
    return response.data;
  },

  getJobStatusCounts: async () => {
    const response = await apiClient.get("/jobs/status");
    return response.data;
  },
};
