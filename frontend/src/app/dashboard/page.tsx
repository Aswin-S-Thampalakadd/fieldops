"use client";

import {
  AlertCircle,
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  Clock3,
  MapPin,
  Plus,
  Users,
  Wrench,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "./DashboardPage.css";
import {
  useGetJobStatusCounts,
  useJobs,
  useTechnicians,
} from "@/src/lib/hooks/useJobs";
import { Job } from "@/src/lib/types/job";
import { TechnicianResponse } from "@/src/lib/types/user";

export default function DashboardPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const { data: technicians, isLoading } = useTechnicians();
  const {
    jobs,
    total,
    isLoading: isJobsLoading,
    error,
  } = useJobs({ page: currentPage, limit: pageSize });

  const { data } = useGetJobStatusCounts();

  const totalPages = Math.ceil((total || 0) / pageSize);

  const jobStatus = [
    {
      label: "Assigned",
      value: data?.ASSIGNED ?? 0,
      count: data?.ASSIGNED ?? 0,
      type: "purple",
      icon: Clock3,
    },
    {
      label: "In Progress",
      value: data?.IN_PROGRESS ?? 0,
      count: data?.IN_PROGRESS ?? 0,
      type: "blue",
      icon: Clock3,
    },
    {
      label: "Pending",
      value: data?.PENDING ?? 0,
      count: data?.PENDING ?? 0,
      type: "yellow",
      icon: AlertCircle,
    },
    {
      label: "Completed",
      value: data?.COMPLETED ?? 0,
      count: data?.COMPLETED ?? 0,
      type: "green",
      icon: CheckCircle2,
    },
    {
      label: "Cancelled",
      value: data?.CANCELLED ?? 0,
      count: data?.CANCELLED ?? 0,
      type: "red",
      icon: AlertCircle,
    },
  ];

  const totalJobs = Object.values(data ?? {}).reduce(
    (total: number, count) => total + (typeof count === "number" ? count : 0),
    0
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome back! Here's what's happening with your operations today.
          </p>
        </div>

        <button
          className="create-job-button"
          onClick={() => router.push("http://localhost:3001/jobs/new")}
        >
          <Plus size={18} />
          Create Job
        </button>
      </div>

      <div className="stats-grid">
        {jobStatus.map((stat) => {
          const Icon = stat.icon;
          return (
            <div className="stat-card" key={stat.label}>
              <div className="stat-card-top">
                <div>
                  <p className="stat-title">{stat.label}</p>
                  <p className="stat-value">{stat.value}</p>
                </div>
                <div className={`stat-icon stat-icon-${stat.type}`}>
                  <Icon size={22} />
                </div>
              </div>
              <div className="stat-footer">
                <span className="stat-description">Total {stat.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-main-grid">
        <div className="dashboard-card recent-jobs-card">
          <div className="dashboard-card-header">
            <div>
              <h2 className="dashboard-card-title">Recent Jobs</h2>
              <p className="dashboard-card-subtitle">
                Latest activity across your operations
              </p>
            </div>
            <button className="view-all-button">
              View all
              <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="jobs-table-wrapper">
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Location</th>
                  <th>Technician</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {isJobsLoading ? (
                  <tr>
                    <td colSpan={4} className="loading-state">
                      <div className="loading-spinner"></div>
                      <span>Loading jobs...</span>
                    </td>
                  </tr>
                ) : jobs?.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="empty-state">
                      <Briefcase size={32} />
                      <span>No jobs available</span>
                    </td>
                  </tr>
                ) : (
                  jobs.map((job: Job, index: number) => (
                    <tr key={job.id}>
                      <td>
                        <div className="job-info">
                          <span className="job-id">
                            #{String(index + 1).padStart(3, "0")}
                          </span>
                          <span className="job-customer">
                            {job?.title ?? "Untitled Job"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="location-info">
                          <MapPin size={15} />
                          {/* {job.location?.address ||
                            job.location?.latitude ||
                            "No location"} */}
                          test
                        </div>
                      </td>
                      <td>
                        <span className="technician-name">
                          {job?.technician?.name ?? "Unassigned"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status-badge status-${job.status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {job.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination-container">
              <button
                className="pagination-button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>
              <div className="pagination-pages">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      className={`pagination-page ${
                        page === currentPage ? "active" : ""
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
              <button
                className="pagination-button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="dashboard-card overview-card">
          <div className="dashboard-card-header">
            <div>
              <h2 className="dashboard-card-title">Job Overview</h2>
              <p className="dashboard-card-subtitle">
                Current job distribution
              </p>
            </div>
          </div>

          <div className="job-overview-list">
            {jobStatus.map((status) => (
              <div className="overview-item" key={status.label}>
                <div className="overview-item-header">
                  <div className="overview-label">
                    <span
                      className={`overview-dot overview-dot-${status.type}`}
                    />
                    {status.label}
                  </div>
                  <span className="overview-count">{status.count}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`progress-value progress-${status.type}`}
                    style={{
                      width:
                        totalJobs > 0
                          ? `${(status.count / totalJobs) * 100}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="total-jobs-box">
            <div className="total-jobs-icon">
              <Briefcase size={20} />
            </div>
            <div>
              <span className="total-jobs-label">Total Jobs</span>
              <strong className="total-jobs-value">{totalJobs}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-bottom-grid">
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <h2 className="dashboard-card-title">Technician Status</h2>
              <p className="dashboard-card-subtitle">
                Current field team availability
              </p>
            </div>
            <Wrench className="header-card-icon" size={20} />
          </div>

          <div className="technician-list">
            {isLoading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <span>Loading technicians...</span>
              </div>
            ) : technicians && technicians.length > 0 ? (
              technicians.map((technician: TechnicianResponse) => (
                <div className="technician-item" key={technician.name}>
                  <div className="technician-left">
                    <div className="technician-avatar">
                      {technician.initials || technician.name.charAt(0)}
                    </div>
                    <div>
                      <p className="technician-name">{technician.name}</p>
                      <p className="technician-role">{technician.role}</p>
                    </div>
                  </div>
                  <div className="technician-right">
                    <span
                      className={`technician-status technician-${
                        technician.status?.toLowerCase().replace(" ", "-") ||
                        "available"
                      }`}
                    >
                      <span className="status-dot" />
                      {technician.status || "Available"}
                    </span>
                    <span className="technician-jobs">
                      {technician.jobs || 0} active jobs
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <Users size={32} />
                <span>No technicians available</span>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <h2 className="dashboard-card-title">Quick Actions</h2>
              <p className="dashboard-card-subtitle">Common operations</p>
            </div>
          </div>

          <div className="quick-actions">
            <button
              className="quick-action quick-action-blue"
              onClick={() => router.push("http://localhost:3001/jobs/new")}
            >
              <div className="quick-action-icon">
                <Plus size={20} />
              </div>
              <div>
                <strong>Create Job</strong>
                <span>Add a new field job</span>
              </div>
            </button>

            <button className="quick-action quick-action-purple">
              <div className="quick-action-icon">
                <Users size={20} />
              </div>
              <div>
                <strong>Technicians</strong>
                <span>Manage field team</span>
              </div>
            </button>

            <button className="quick-action quick-action-green">
              <div className="quick-action-icon">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <strong>Completed</strong>
                <span>View completed jobs</span>
              </div>
            </button>

            <button className="quick-action quick-action-yellow">
              <div className="quick-action-icon">
                <AlertCircle size={20} />
              </div>
              <div>
                <strong>Pending</strong>
                <span>Review pending jobs</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
