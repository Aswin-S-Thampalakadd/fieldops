"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";

import { JobFilters } from "@/src/lib/types/job";
import { useJobs, useTechnicians } from "@/src/lib/hooks/useJobs";
import { LoadingSpinner } from "@/src/components/shared/LoadingSpinner";
import { Button } from "@/src/components/ui/Button";
import { JobsTable } from "@/src/components/jobs/JobsTable";

import "./JobsPage.css";

export default function JobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<JobFilters>({
    page: parseInt(searchParams.get("page") || "1"),
    limit: 10,
    status: searchParams.get("status") || undefined,
    technician: searchParams.get("technician") || undefined,
    dateRange:
      searchParams.get("startDate") && searchParams.get("endDate")
        ? {
            start: searchParams.get("startDate")!,
            end: searchParams.get("endDate")!,
          }
        : undefined,
  });

  const { jobs, total, totalPages, isLoading, error } = useJobs(filters);

  const { data: technicians } = useTechnicians();

  const handleFilterChange = (newFilters: Partial<JobFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));

    const params = new URLSearchParams();

    Object.entries({
      ...filters,
      ...newFilters,
      page: 1,
    }).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "dateRange" && value) {
          params.set("startDate", value.start);
          params.set("endDate", value.end);
        } else {
          params.set(key, value.toString());
        }
      }
    });

    router.push(`?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="jobs-loading">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="jobs-error">
        <div className="jobs-error-icon">!</div>
        <div>
          <h3>Unable to load jobs</h3>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="jobs-page">
      <div className="jobs-page-header">
        <div className="jobs-header-content">
          <div className="jobs-header-icon">
            <span>J</span>
          </div>

          <div>
            <h1 className="jobs-page-title">Jobs</h1>
            <p className="jobs-page-subtitle">
              Manage and track all your field operations jobs
            </p>
          </div>
        </div>

        <Button
          className="jobs-new-button"
          onClick={() => router.push("/jobs/new")}
        >
          <Plus className="jobs-new-button-icon" />
          New Job
        </Button>
      </div>

      <div className="jobs-summary">
        <div className="jobs-summary-item">
          <span className="jobs-summary-label">Total Jobs</span>
          <span className="jobs-summary-value">{total}</span>
        </div>

        <div className="jobs-summary-divider" />

        <div className="jobs-summary-item">
          <span className="jobs-summary-label">Current Page</span>
          <span className="jobs-summary-value">
            {filters.page} / {totalPages || 1}
          </span>
        </div>

        <div className="jobs-summary-divider" />

        <div className="jobs-summary-item">
          <span className="jobs-summary-label">Technicians</span>
          <span className="jobs-summary-value">{technicians?.length || 0}</span>
        </div>
      </div>

      <div className="jobs-table-container">
        <div className="jobs-table-header">
          <div>
            <h2>All Jobs</h2>
            <p>View, manage, assign and track your jobs</p>
          </div>

          <div className="jobs-result-count">
            {jobs.length} result{jobs.length !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="jobs-table-wrapper">
          <JobsTable
            jobs={jobs}
            total={total}
            page={filters.page}
            limit={filters.limit}
            totalPages={totalPages}
            onPageChange={(page) => handleFilterChange({ page })}
          />
        </div>
      </div>
    </div>
  );
}
