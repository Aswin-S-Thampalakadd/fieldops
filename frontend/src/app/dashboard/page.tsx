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
} from "lucide-react";

import "./DashboardPage.css";
import {
  useGetJobStatusCounts,
  useJobs,
  useTechnicians,
} from "@/src/lib/hooks/useJobs";

const stats = [
  {
    title: "Total Jobs",
    value: "156",
    change: "+12.5%",
    description: "from last month",
    icon: Briefcase,
    type: "blue",
  },
  {
    title: "Active Jobs",
    value: "23",
    change: "+8.2%",
    description: "from last week",
    icon: CheckCircle2,
    type: "green",
  },
  {
    title: "Pending Jobs",
    value: "12",
    change: "-4.3%",
    description: "from last week",
    icon: Clock3,
    type: "yellow",
  },
  {
    title: "Technicians",
    value: "8",
    change: "+2",
    description: "available today",
    icon: Users,
    type: "purple",
  },
];

const recentJobs = [
  {
    id: "JOB-1024",
    customer: "Acme Corporation",
    location: "Kochi, Kerala",
    technician: "Arun Kumar",
    status: "In Progress",
    priority: "High",
  },
  {
    id: "JOB-1023",
    customer: "Global Solutions",
    location: "Calicut, Kerala",
    technician: "Rahul Das",
    status: "Pending",
    priority: "Medium",
  },
  {
    id: "JOB-1022",
    customer: "Tech Industries",
    location: "Thrissur, Kerala",
    technician: "Vishnu Raj",
    status: "Completed",
    priority: "Low",
  },
  {
    id: "JOB-1021",
    customer: "Smart Systems",
    location: "Palakkad, Kerala",
    technician: "Nikhil S",
    status: "In Progress",
    priority: "High",
  },
];

export default function DashboardPage() {
  const { data: technicians, isLoading } = useTechnicians();
  const { jobs, total, isLoading: isJobsLoading, error } = useJobs({});
  console.log("JOBS------------", jobs ? jobs : "no jobs");
  const { data } = useGetJobStatusCounts();
  const jobStatus = [
    {
      label: "Assigned",
      value: data?.ASSIGNED ?? 0,
      count: data?.ASSIGNED ?? 0,
      type: "purple",
    },
    {
      label: "In Progress",
      value: data?.IN_PROGRESS ?? 0,
      count: data?.IN_PROGRESS ?? 0,
      type: "blue",
    },
    {
      label: "Pending",
      value: data?.PENDING ?? 0,
      count: data?.PENDING ?? 0,
      type: "yellow",
    },
    {
      label: "Completed",
      value: data?.COMPLETED ?? 0,
      count: data?.COMPLETED ?? 0,
      type: "green",
    },
    {
      label: "Cancelled",
      value: data?.CANCELLED ?? 0,
      count: data?.CANCELLED ?? 0,
      type: "red",
    },
  ];

  const totalJobs = Object.values(data ?? {}).reduce(
    (total, count) => total + count,
    0
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome back! Here&apos;s what&apos;s happening with your operations
            today.
          </p>
        </div>

        <button className="create-job-button">
          <Plus size={18} />
          Create Job
        </button>
      </div>

      <div className="stats-grid">
        {jobStatus.map((stat) => {
          const Icon = Briefcase;

          return (
            <div className="stat-card" key={"title"}>
              <div className="stat-card-top">
                <div>
                  <p className="stat-title">{stat.label}</p>
                  <p className="stat-value">{stat.value}</p>
                </div>

                <div className={`stat-icon stat-icon-${stat.type}`}>
                  <Icon size={22} />
                </div>
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
                  <>Jobs loading....</>
                ) : jobs?.length == 0 ? (
                  <>No jobs available</>
                ) : (
                  jobs.map((job, index) => (
                    <tr key={job.id}>
                      <td>
                        <div className="job-info">
                          <span className="job-id">{index + 1}</span>
                          <span className="job-customer">
                            {job?.title ?? ""}
                          </span>
                        </div>
                      </td>

                      <td>
                        <div className="location-info">
                          <MapPin size={15} />
                          {job.location?.latitude ?? ""}
                        </div>
                      </td>

                      <td>
                        <span className="technician-name">
                          {job?.technician?.name ?? ""}
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
                    style={{ width: `${status.value}%` }}
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
              <>Loading....</>
            ) : (
              technicians &&
              technicians?.length > 0 &&
              technicians.map((technician) => (
                <div className="technician-item" key={technician.name}>
                  <div className="technician-left">
                    <div className="technician-avatar">
                      {technician.initials}
                    </div>

                    <div>
                      <p className="technician-name">{technician.name}</p>

                      <p className="technician-role">{technician.role}</p>
                    </div>
                  </div>

                  {/* <div className="technician-right">
                    <span
                      className={`technician-status technician-${technician.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      <span className="status-dot" />
                      {technician.status}
                    </span>

                    <span className="technician-jobs">
                      {technician.jobs} active jobs
                    </span>
                  </div> */}
                </div>
              ))
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
            <button className="quick-action quick-action-blue">
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
