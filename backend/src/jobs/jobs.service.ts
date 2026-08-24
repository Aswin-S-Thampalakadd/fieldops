import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';

import { Job, JobDocument } from './schemas/job.schema';

import { CreateJobDto } from './dto/create-job.dto';
import { ListJobsDto } from './dto/list-jobs.dto';

import { JobStatus } from '../common/enums/job-status.enum';

import { UsersService } from '../users/users.service';
import { JobStateMachine } from './job-state-machine';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name)
    private readonly jobModel: Model<JobDocument>,

    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateJobDto) {
    const job = await this.jobModel.create({
      title: dto.title,
      description: dto.description,
      customer: dto.customer,
      location: {
        type: 'Point',
        coordinates: [dto.location.coordinates[0], dto.location.coordinates[1]],
      },
      status: JobStatus.PENDING,
      technicianId: null,
      scheduledAt: new Date(dto.scheduledAt),
    });

    return this.toResponse(job);
  }

  async findAll(dto: ListJobsDto) {
    const { page, limit, status, technicianId, from, to } = dto;

    const filter: Record<string, unknown> = {};

    if (status) {
      filter.status = status;
    }

    if (technicianId) {
      filter.technicianId = new Types.ObjectId(technicianId);
    }

    if (from || to) {
      const scheduledAt: Record<string, Date> = {};

      if (from) {
        scheduledAt.$gte = new Date(from);
      }

      if (to) {
        scheduledAt.$lte = new Date(to);
      }

      filter.scheduledAt = scheduledAt;
    }

    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      this.jobModel
        .find(filter)
        .populate('technicianId', '_id name email')
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),

      this.jobModel.countDocuments(filter).exec(),
    ]);

    return {
      data: jobs.map((job) => this.toResponse(job)),

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const job = await this.jobModel
      .findById(id)
      .populate('technicianId', '_id name email')
      .lean()
      .exec();

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return this.toResponse(job);
  }

  async assign(jobId: string, technicianId: string) {
    const technician = await this.usersService.findById(technicianId);

    if (!technician || technician.role !== Role.TECHNICIAN) {
      throw new NotFoundException('Technician not found');
    }

    const job = await this.jobModel.findById(jobId);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    job.status = JobStateMachine.assign(job.status);

    job.technicianId = technician._id;

    await job.save();

    return this.findOne(jobId);
  }
  async unassign(jobId: string) {
    const job = await this.jobModel.findById(jobId);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.status !== JobStatus.ASSIGNED) {
      throw new ConflictException(`Cannot unassign job in ${job.status} state`);
    }

    job.technicianId = null;
    job.status = JobStatus.PENDING;

    await job.save();

    return this.findOne(jobId);
  }

  async cancel(jobId: string) {
    const job = await this.jobModel.findById(jobId);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const cancellableStatuses = [JobStatus.PENDING, JobStatus.ASSIGNED];

    if (!cancellableStatuses.includes(job.status)) {
      throw new ConflictException(`Cannot cancel job in ${job.status} state`);
    }

    job.status = JobStatus.CANCELLED;

    await job.save();

    return this.findOne(jobId);
  }

  private toResponse(job: any) {
    return {
      id: job._id.toString(),

      title: job.title,
      description: job.description,

      customer: job.customer,

      location: {
        latitude: job.location.coordinates[1],
        longitude: job.location.coordinates[0],
      },

      status: job.status,

      technician: job.technicianId
        ? {
            id: job.technicianId._id?.toString() ?? job.technicianId.toString(),

            name: job.technicianId.name,

            email: job.technicianId.email,
          }
        : null,

      scheduledAt: job.scheduledAt,

      startedAt: job.startedAt,

      completedAt: job.completedAt,

      completionNotes: job.completionNotes,

      completionPhotos: job.completionPhotos,

      createdAt: job.createdAt,

      updatedAt: job.updatedAt,
    };
  }
}
