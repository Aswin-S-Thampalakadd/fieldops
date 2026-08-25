import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Job, JobSchema } from './schemas/job.schema';

import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';

import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Job.name,
        schema: JobSchema,
      },
    ]),
    UsersModule,
  ],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
