import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

import { JobStatus } from '../../common/enums/job-status.enum';

export type JobDocument = HydratedDocument<Job>;

@Schema({
  _id: false,
})
export class Customer {
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  phone: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  address: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

@Schema({
  _id: false,
})
export class JobLocation {
  @Prop({
    type: String,
    enum: ['Point'],
    required: true,
  })
  type: 'Point';

  @Prop({
    type: [Number],
    required: true,
  })
  coordinates: [number, number];
}

export const JobLocationSchema = SchemaFactory.createForClass(JobLocation);

@Schema({
  timestamps: true,
  collection: 'jobs',
})
export class Job {
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  title: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  description: string;

  @Prop({
    type: CustomerSchema,
    required: true,
  })
  customer: Customer;

  @Prop({
    type: JobLocationSchema,
    required: true,
  })
  location: JobLocation;

  @Prop({
    type: String,
    enum: Object.values(JobStatus),
    required: true,
    index: true,
  })
  status: JobStatus;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true,
  })
  technicianId: Types.ObjectId | null;

  @Prop({
    type: Date,
    required: true,
    index: true,
  })
  scheduledAt: Date;

  @Prop({
    type: Date,
    default: null,
  })
  startedAt: Date | null;

  @Prop({
    type: Date,
    default: null,
  })
  completedAt: Date | null;

  @Prop({
    type: String,
    default: null,
  })
  completionNotes: string | null;

  @Prop({
    type: [String],
    default: [],
  })
  completionPhotos: string[];
}

export const JobSchema = SchemaFactory.createForClass(Job);

/**
 * Geospatial index.
 *
 * Required for:
 * GET /jobs/nearby
 */
JobSchema.index({
  location: '2dsphere',
});

/**
 * Main jobs list query.
 *
 * Useful for:
 * GET /jobs?status=COMPLETED
 * GET /jobs?technicianId=...
 * GET /jobs?from=...&to=...
 */
JobSchema.index({
  status: 1,
  scheduledAt: -1,
});

/**
 * Technician job listing.
 *
 * Useful for:
 * GET /jobs/my
 */
JobSchema.index({
  technicianId: 1,
  status: 1,
  scheduledAt: -1,
});
