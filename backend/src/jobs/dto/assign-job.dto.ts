import { IsMongoId } from 'class-validator';

export class AssignJobDto {
  @IsMongoId()
  technicianId: string;
}
