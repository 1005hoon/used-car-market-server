import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}
  @Get()

  @Post()
  @UseGuards(AuthGuard)
  createReport(@Body() dto: CreateReportDto) {
    return this.reportsService.create(dto);
  }
}
