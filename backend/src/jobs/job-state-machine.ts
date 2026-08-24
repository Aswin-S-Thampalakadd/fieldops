import { ConflictException } from '@nestjs/common';

import { JobStatus } from '../common/enums/job-status.enum';

export class JobStateMachine {
  static assign(current: JobStatus): JobStatus {
    if (current !== JobStatus.PENDING) {
      throw new ConflictException(`Cannot assign job in ${current} state`);
    }

    return JobStatus.ASSIGNED;
  }

  static unassign(current: JobStatus): JobStatus {
    if (current !== JobStatus.ASSIGNED) {
      throw new ConflictException(`Cannot unassign job in ${current} state`);
    }

    return JobStatus.PENDING;
  }

  static cancel(current: JobStatus): JobStatus {
    if (current !== JobStatus.PENDING && current !== JobStatus.ASSIGNED) {
      throw new ConflictException(`Cannot cancel job in ${current} state`);
    }

    return JobStatus.CANCELLED;
  }
}
