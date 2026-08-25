"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useJobs } from "@/src/lib/hooks/useJobs";
import { CreateJobInput } from "@/src/lib/types/job";
import { Button } from "@/src/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { LoadingSpinner } from "@/src/components/shared/LoadingSpinner";
import "./CreateJobPage.css";

const createJobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  customerName: z.string().min(2, "Customer name is required"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().min(10, "Phone number is required"),
  address: z.string().min(5, "Address is required"),
  latitude: z.string().transform((val) => parseFloat(val)),
  longitude: z.string().transform((val) => parseFloat(val)),
  scheduledAt: z.string().min(1, "Scheduled date is required"),
});

type CreateJobFormData = z.infer<typeof createJobSchema>;

export default function CreateJobPage() {
  const router = useRouter();
  const { createJob, createLoading } = useJobs({ page: 1, limit: 10 });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateJobFormData>({
    resolver: zodResolver(createJobSchema),
  });

  const onSubmit = async (data: CreateJobFormData) => {
    const jobData: CreateJobInput = {
      title: data.title,
      description: data.description,
      customer: {
        name: data.customerName,
        email: data.customerEmail,
        phone: data.customerPhone,
        address: data.address,
      },
      location: {
        coordinates: [data.longitude, data.latitude],
      },
      scheduledAt: data.scheduledAt,
      priority: "MEDIUM",
    };

    await createJob(jobData);
    router.push("/jobs");
  };

  return (
    <div className="create-job-container">
      <div className="create-job-header">
        <div>
          <h1 className="create-job-title">Create New Job</h1>
          <p className="create-job-subtitle">
            Fill in the details to schedule a new job
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="create-job-form">
        <Card className="form-card">
          <CardHeader>
            <CardTitle>Job Information</CardTitle>
          </CardHeader>
          <CardContent className="card-content">
            <div className="form-field">
              <label className="form-label">Title</label>
              <Input
                {...register("title")}
                placeholder="e.g., AC Repair - Downtown Office"
              />
              {errors.title && (
                <p className="form-error">{errors.title.message}</p>
              )}
            </div>

            <div className="form-field">
              <label className="form-label">Description</label>
              <textarea
                {...register("description")}
                rows={4}
                className="form-textarea"
                placeholder="Detailed description of the job..."
              />
              {errors.description && (
                <p className="form-error">{errors.description.message}</p>
              )}
            </div>

            <div className="form-field">
              <label className="form-label">Scheduled Date</label>
              <Input {...register("scheduledAt")} type="datetime-local" />
              {errors.scheduledAt && (
                <p className="form-error">{errors.scheduledAt.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="form-card">
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="card-content">
            <div className="form-field">
              <label className="form-label">Full Name</label>
              <Input {...register("customerName")} placeholder="John Doe" />
              {errors.customerName && (
                <p className="form-error">{errors.customerName.message}</p>
              )}
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">Email</label>
                <Input
                  {...register("customerEmail")}
                  type="email"
                  placeholder="john@example.com"
                />
                {errors.customerEmail && (
                  <p className="form-error">{errors.customerEmail.message}</p>
                )}
              </div>

              <div className="form-field">
                <label className="form-label">Phone</label>
                <Input
                  {...register("customerPhone")}
                  placeholder="(555) 123-4567"
                />
                {errors.customerPhone && (
                  <p className="form-error">{errors.customerPhone.message}</p>
                )}
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Address</label>
              <Input
                {...register("address")}
                placeholder="123 Main St, City, State"
              />
              {errors.address && (
                <p className="form-error">{errors.address.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="form-card">
          <CardHeader>
            <CardTitle>Location Coordinates</CardTitle>
          </CardHeader>
          <CardContent className="card-content">
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">Latitude</label>
                <Input
                  {...register("latitude")}
                  type="number"
                  step="any"
                  placeholder="40.7128"
                />
                {errors.latitude && (
                  <p className="form-error">{errors.latitude.message}</p>
                )}
              </div>

              <div className="form-field">
                <label className="form-label">Longitude</label>
                <Input
                  {...register("longitude")}
                  type="number"
                  step="any"
                  placeholder="-74.0060"
                />
                {errors.longitude && (
                  <p className="form-error">{errors.longitude.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="form-actions">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={createLoading}>
            {createLoading ? (
              <LoadingSpinner size="sm" className="form-spinner" />
            ) : null}
            Create Job
          </Button>
        </div>
      </form>
    </div>
  );
}
