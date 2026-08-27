import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JobsService } from './jobs.service';

import { CreateJobDto } from './dto/create-job.dto';
import { AssignJobDto } from './dto/assign-job.dto';
import { ListJobsDto } from './dto/list-jobs.dto';

import { AccessTokenGuard } from '../auth/guards/access-token.guard';

import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

import { Role } from '../common/enums/role.enum';

@Controller('jobs')
@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(Role.ADMIN)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  create(@Body() dto: CreateJobDto) {
    return this.jobsService.create(dto);
  }

  @Get()
  findAll(@Query() query: ListJobsDto) {
    return this.jobsService.findAll(query);
  }

  @Get('status')
  getJobsCountByStatus() {
    return this.jobsService.jobsCountByStatus();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(':id/assign')
  assign(@Param('id') id: string, @Body() dto: AssignJobDto) {
    return this.jobsService.assign(id, dto.technicianId);
  }

  @Patch(':id/unassign')
  unassign(@Param('id') id: string) {
    return this.jobsService.unassign(id);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.jobsService.cancel(id);
  }
}
