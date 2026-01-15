import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { SettingsService } from './settings.service';

@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('escrow-fee')
  getEscrowFee() {
    return this.settingsService.getEscrowFee();
  }

  @Patch('escrow-fee')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  updateEscrowFee(@Body() body: any) {
    return this.settingsService.updateEscrowFee(body, 'admin-id');
  }

  @Get('auto-complete')
  getAutoComplete() {
    return this.settingsService.getAutoCompleteSettings();
  }

  @Get('rules')
  getRules() {
    return this.settingsService.getRules();
  }
}
