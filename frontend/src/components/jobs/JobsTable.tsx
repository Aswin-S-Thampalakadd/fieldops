"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  UserPlus,
  X,
} from "lucide-react";

import { Job } from "@/src/lib/types/job";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/Table";

import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

import "./JobsTable.css";
import {
  useAssignJob,
  useCancelJob,
  useTechnicians,
} from "@/src/lib/hooks/useJobs";
import { TechnicianResponse } from "@/src/lib/types/user";

interface JobsTableProps {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ASSIGNED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-purple-100 text-purple-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const priorityColors = {
  LOW: "bg-gray-100 text-gray-800",
  MEDIUM: "bg-blue-100 text-blue-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-800",
};

export function JobsTable({
  jobs,
  total,
  page,
  limit,
  totalPages,
  onPageChange,
}: JobsTableProps) {
  const router = useRouter();
  const { data: technicians, isLoading } = useTechnicians();

  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // const { assignJob } = useAssignJob();
  const { mutate: assignJob, isPending, isSuccess, isError } = useAssignJob();

  const { mutate: cancelJob } = useCancelJob();

  const menuRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      let clickedInsideMenu = false;

      Object.keys(menuRefs.current).forEach((key) => {
        const menuElement = menuRefs.current[Number(key)];
        if (menuElement && menuElement.contains(target)) {
          clickedInsideMenu = true;
        }
      });

      if (!clickedInsideMenu) {
        setOpenMenuIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = (index: number) => {
    setOpenMenuIndex((prev) => (prev === index ? null : index));
  };

  const handleAssignClick = (job: Job) => {
    setSelectedJob(job);
    setSelectedTechnician(job.assignedTo?._id || "");
    setOpenMenuIndex(null);
    setIsAssignModalOpen(true);
  };

  const handleAssignSave = async () => {
    if (!selectedTechnician) {
      return;
    }

    const technician = technicians?.find(
      (item: TechnicianResponse) => item._id === selectedTechnician
    );
    console.log("selectedJob-----------", selectedJob);
    console.log("Assign technician:", {
      jobId: selectedJob?.id,
      technicianId: selectedTechnician,
      technicianName: technician?.name,
    });

    if (selectedJob) {
      await assignJob({
        jobId: selectedJob?.id,
        technicianId: selectedTechnician,
      });
    }

    setIsAssignModalOpen(false);
    setSelectedJob(null);
    setSelectedTechnician("");
  };

  const handleCancelClick = (job: Job) => {
    setSelectedJob(job);
    setOpenMenuIndex(null);
    setIsCancelModalOpen(true);
  };

  const handleCancelConfirm = async () => {
    console.log("Cancel job:", selectedJob?.id);

    if (!selectedJob || !selectedJob.id) {
      return;
    }

    await cancelJob(selectedJob.id);

    setIsCancelModalOpen(false);
    setSelectedJob(null);
  };

  const closeAssignModal = () => {
    setIsAssignModalOpen(false);
    setSelectedJob(null);
    setSelectedTechnician("");
  };

  const closeCancelModal = () => {
    setIsCancelModalOpen(false);
    setSelectedJob(null);
  };

  if (jobs.length === 0) {
    return (
      <div className="jobs-table-empty">
        <div className="jobs-table-empty-icon">
          <span>J</span>
        </div>
        <h3>No jobs found</h3>
        <p>There are no jobs matching your current filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className="jobs-table-section">
        <div className="jobs-table-scroll">
          <Table>
            <TableHeader>
              <TableRow className="jobs-table-header-row">
                <TableHead>Title</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="jobs-table-actions-head">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {jobs.map((job, index) => (
                <TableRow key={job._id ?? index} className="jobs-table-row">
                  <TableCell className="jobs-title-cell">
                    <div className="jobs-title-wrapper">
                      <div className="jobs-title-icon">
                        {job.title?.charAt(0)?.toUpperCase() || "J"}
                      </div>
                      <div className="jobs-title-content">
                        <span className="jobs-title">{job.title}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="jobs-customer">
                      <span className="jobs-customer-name">
                        {job.customer.name}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={`jobs-status-badge ${
                        statusColors[job.status]
                      }`}
                    >
                      <span className="jobs-badge-dot" />
                      {job.status.replace("_", " ")}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={`jobs-priority-badge ${
                        priorityColors[job.priority]
                      }`}
                    >
                      {job.priority}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {job.assignedTo ? (
                      <div className="jobs-technician">
                        <div className="jobs-technician-avatar">
                          {job.assignedTo.name?.charAt(0)?.toUpperCase() || "T"}
                        </div>
                        <span>{job.assignedTo.name}</span>
                      </div>
                    ) : (
                      <span className="jobs-unassigned">Unassigned</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <span className="jobs-created-date">
                      {format(new Date(job.createdAt), "MMM d, yyyy")}
                    </span>
                  </TableCell>

                  <TableCell className="jobs-actions-cell">
                    <div className="jobs-actions">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="jobs-view-button"
                        onClick={() => router.push(`/jobs/${job.id}`)}
                      >
                        <Eye className="jobs-view-icon" />
                        <span>View</span>
                      </Button>

                      <div
                        className="jobs-menu-wrapper"
                        ref={(el) => {
                          menuRefs.current[index] = el;
                        }}
                      >
                        <button
                          type="button"
                          className="jobs-menu-button"
                          onClick={() => toggleMenu(index)}
                          aria-label={`Actions for ${job.title}`}
                        >
                          <MoreHorizontal />
                        </button>

                        {openMenuIndex === index && (
                          <div className="jobs-actions-menu">
                            <button
                              type="button"
                              className="jobs-menu-item"
                              onClick={() => handleAssignClick(job)}
                            >
                              <UserPlus />
                              <span>Assign Technician</span>
                            </button>

                            {job.status !== "CANCELLED" &&
                              job.status !== "COMPLETED" && (
                                <button
                                  type="button"
                                  className="jobs-menu-item jobs-menu-item-danger"
                                  onClick={() => handleCancelClick(job)}
                                >
                                  <X />
                                  <span>Cancel Job</span>
                                </button>
                              )}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="jobs-pagination">
          <p className="jobs-pagination-info">
            Showing <strong>{(page - 1) * limit + 1}</strong> to{" "}
            <strong>{Math.min(page * limit, total)}</strong> of{" "}
            <strong>{total}</strong> jobs
          </p>

          <div className="jobs-pagination-controls">
            <Button
              variant="outline"
              size="sm"
              className="jobs-pagination-button"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft />
              <span>Previous</span>
            </Button>

            <div className="jobs-page-number">
              {page}
              <span>/</span>
              {totalPages || 1}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="jobs-pagination-button"
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
            >
              <span>Next</span>
              <ChevronRight />
            </Button>
          </div>
        </div>
      </div>

      {isAssignModalOpen && selectedJob && (
        <div className="jobs-modal-overlay" onMouseDown={closeAssignModal}>
          <div
            className="jobs-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="jobs-modal-header">
              <div className="jobs-modal-heading">
                <div>
                  <h3>Assign Technician</h3>
                </div>
              </div>
              <button
                type="button"
                className="jobs-modal-close"
                onClick={closeAssignModal}
              >
                <X />
              </button>
            </div>

            <div className="jobs-modal-body">
              <div className="jobs-selected-job">
                <span className="jobs-selected-job-label">Job</span>
                <span className="jobs-selected-job-title">
                  {selectedJob.title}
                </span>
              </div>

              <div className="jobs-form-group">
                <label htmlFor="technician">Technician</label>
                <select
                  id="technician"
                  value={selectedTechnician}
                  onChange={(event) =>
                    setSelectedTechnician(event.target.value)
                  }
                  className="jobs-technician-select"
                  disabled={isLoading}
                >
                  <option value="">Select a technician</option>
                  {technicians?.map((technician: TechnicianResponse) => (
                    <option key={technician._id} value={technician._id}>
                      {technician.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="jobs-modal-footer">
              <Button
                variant="outline"
                onClick={closeAssignModal}
                className="jobs-modal-cancel-button"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAssignSave}
                disabled={!selectedTechnician}
                className="jobs-modal-save-button"
              >
                <Check />
                Assign Technician
              </Button>
            </div>
          </div>
        </div>
      )}

      {isCancelModalOpen && selectedJob && (
        <div className="jobs-modal-overlay" onMouseDown={closeCancelModal}>
          <div
            className="jobs-confirm-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="jobs-confirm-icon">
              <AlertTriangle />
            </div>
            <h3>Cancel this job?</h3>
            <p>
              Are you sure you want to cancel{" "}
              <strong>{selectedJob.title}</strong>? This action will mark the
              job as cancelled.
            </p>
            <div className="jobs-confirm-footer">
              <Button
                variant="outline"
                onClick={closeCancelModal}
                className="jobs-modal-cancel-button"
              >
                Keep Job
              </Button>
              <button
                type="button"
                className="jobs-confirm-danger-button"
                onClick={handleCancelConfirm}
              >
                <X />
                Cancel Job
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
