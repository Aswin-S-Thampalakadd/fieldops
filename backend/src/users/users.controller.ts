import { Controller, Get, UseGuards } from '@nestjs/common';

import { UsersService } from './users.service';

import { AccessTokenGuard } from '../auth/guards/access-token.guard';

import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

import { Role } from '../common/enums/role.enum';

@Controller('users')
@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(Role.ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('technicians')
  findTechnicians() {
    return this.usersService.findTechnicians();
  }
}
