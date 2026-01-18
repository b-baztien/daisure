import { Controller, Get, UseGuards } from '@nestjs/common';
import { BanksService } from './banks.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('banks')
export class BanksController {
  constructor(private readonly banksService: BanksService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.banksService.findEnabled();
  }
}
