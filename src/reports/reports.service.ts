import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private repo: Repository<Report>
  ){}
  
  create(reportDto: CreateReportDto, user: User){
    const report = this.repo.create(reportDto);
    report.user = user;
    return this.repo.save(report);
  }

  async changeApprovalStatus(id: string, approved: boolean) {
    const report = await this.repo.findOne(id);
        
    if (!report) {
      throw new NotFoundException(`${id}에 해당하는 리포트를 찾을 수 없습니다`);
    }

    report.approved = approved;
    return this.repo.save(report);
  }
}
