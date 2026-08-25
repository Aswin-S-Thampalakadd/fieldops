"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { CreateJobInput, JobFilters } from "../types/job";
import { jobsService } from "../api/job";
import { useEffect, useState } from "react";

export function useJobs(filters: JobFilters = {}) {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["jobs", filters],
    queryFn: () => jobsService.getJobs(filters),
    staleTime: 30 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateJobInput) => jobsService.createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });

      toast.success("Job created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create job");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<any> }) =>
      jobsService.updateJob(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });

      queryClient.invalidateQueries({
        queryKey: ["job", id],
      });

      toast.success("Job updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update job");
    },
  });

  const assignMutation = useMutation({
    mutationFn: ({
      jobId,
      technicianId,
    }: {
      jobId: string;
      technicianId: string;
    }) => jobsService.assignJob(jobId, technicianId),
    onSuccess: (_, { jobId }) => {
      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });

      queryClient.invalidateQueries({
        queryKey: ["job", jobId],
      });

      toast.success("Job assigned successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to assign job");
    },
  });

  const unassignMutation = useMutation({
    mutationFn: (jobId: string) => jobsService.unassignJob(jobId),
    onSuccess: (_, jobId) => {
      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });

      queryClient.invalidateQueries({
        queryKey: ["job", jobId],
      });

      toast.success("Job unassigned successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to unassign job");
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (jobId: string) => jobsService.cancelJob(jobId),
    onSuccess: (_, jobId) => {
      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });

      queryClient.invalidateQueries({
        queryKey: ["job", jobId],
      });

      toast.success("Job cancelled successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to cancel job");
    },
  });

  return {
    jobs: data?.data || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,

    isLoading,
    error,
    refetch,

    createJob: createMutation.mutate,
    createLoading: createMutation.isPending,

    updateJob: updateMutation.mutate,
    updateLoading: updateMutation.isPending,

    assignJob: assignMutation.mutate,
    assignLoading: assignMutation.isPending,

    unassignJob: unassignMutation.mutate,
    unassignLoading: unassignMutation.isPending,

    cancelJob: cancelMutation.mutate,
    cancelLoading: cancelMutation.isPending,
  };
}

export function useJob(id: string) {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => jobsService.getJob(id),
    enabled: !!id,
  });
}

export function useTechnicians() {
  return useQuery({
    queryKey: ["technicians"],
    queryFn: () => jobsService.getTechnicians(),
  });
}

export function useGetJobStatusCounts() {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: () => jobsService.getJobStatusCounts(),
  });
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
