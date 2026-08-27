"use client";

import { useRouter } from "next/navigation";

import { format } from "date-fns";
import { MapPin, User, Phone, Mail, Calendar, Clock } from "lucide-react";
import { useJob, useJobs, useTechnicians } from "@/src/lib/hooks/useJobs";
import { LoadingSpinner } from "@/src/components/shared/LoadingSpinner";
import { Badge } from "@/src/components/ui/Badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/Select";
import { Button } from "@/src/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/Card";

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: job, isLoading, error } = useJob(params.id);
  const { data: technicians } = useTechnicians();
  const { assignJob, unassignJob, cancelJob, unassignLoading, cancelLoading } =
    useJobs({ page: 1, limit: 10 });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-red-700">
          Error loading job: {error?.message || "Job not found"}
        </p>
      </div>
    );
  }

  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800",
    ASSIGNED: "bg-blue-100 text-blue-800",
    IN_PROGRESS: "bg-purple-100 text-purple-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  const handleAssign = (technicianId: string) => {
    assignJob({ jobId: job._id, technicianId });
  };

  const handleUnassign = () => {
    unassignJob(job._id);
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel this job?")) {
      cancelJob(job._id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold text-gray-900">{job.title}</h1>
          <Badge className="">{job.status}</Badge>
        </div>
        <div className="flex space-x-2">
          {job.status === "PENDING" && (
            <Select onValueChange={handleAssign}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Assign technician" />
              </SelectTrigger>
              <SelectContent>
                {technicians?.map((tech: any) => (
                  <SelectItem key={tech._id} value={tech._id}>
                    {tech.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {job.status === "ASSIGNED" && (
            <Button
              variant="outline"
              onClick={handleUnassign}
              disabled={unassignLoading}
            >
              Unassign
            </Button>
          )}
          {job.status !== "COMPLETED" && job.status !== "CANCELLED" && (
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={cancelLoading}
            >
              Cancel Job
            </Button>
          )}
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="mt-1">{job.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Priority</p>
                  <p className="mt-1 capitalize">
                    {job.priority.toLowerCase()}
                  </p>
                </div>
                {job.scheduledDate && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Scheduled Date
                    </p>
                    <p className="mt-1">
                      {format(new Date(job.scheduledDate), "PPP")}
                    </p>
                  </div>
                )}
                {job.completedDate && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Completed Date
                    </p>
                    <p className="mt-1">
                      {format(new Date(job.completedDate), "PPP")}
                    </p>
                  </div>
                )}
              </div>

              {job.assignedTo && (
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Assigned To
                  </p>
                  <p className="mt-1">{job.assignedTo.name}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {job.photos && job.photos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Completion Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {job.photos.map((photo, index) => (
                    <div key={index} className="aspect-w-1 aspect-h-1">
                      <img
                        src={photo}
                        alt={`Completion photo ${index + 1}`}
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-2">
                <User className="h-4 w-4 mt-1 text-gray-500" />
                <div>
                  <p className="font-medium">{job.customer.name}</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Mail className="h-4 w-4 mt-1 text-gray-500" />
                <a
                  href={`mailto:${job.customer.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {job.customer.email}
                </a>
              </div>
              <div className="flex items-start space-x-2">
                <Phone className="h-4 w-4 mt-1 text-gray-500" />
                <a
                  href={`tel:${job.customer.phone}`}
                  className="text-blue-600 hover:underline"
                >
                  {job.customer.phone}
                </a>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-1 text-gray-500" />
                <div>
                  <p>{job.customer.address}</p>
                  <p className="text-sm text-gray-500">
                    {job.location.address}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                {/* Integrate Google Maps or other map service here */}
                <div className="text-center">
                  <MapPin className="h-8 w-8 mx-auto text-gray-400" />
                  <p className="text-sm text-gray-500 mt-2">
                    Map view coming soon
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {job.location.coordinates[0]}, {job.location.coordinates[1]}
                  </p>
                </div>
              </div>
              {job.location.address && (
                <p className="mt-2 text-sm text-gray-600">
                  {job.location.address}
                </p>
              )}
            </CardContent>
          </Card>

          {job.notes && job.notes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.notes.map((note, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      • {note}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
