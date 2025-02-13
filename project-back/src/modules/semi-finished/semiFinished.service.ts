import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SemiFinished } from './entities/semiFinished.entity';

@Injectable()
export class SemiFinishedService {
  constructor(
    @InjectRepository(SemiFinished)
    private readonly semiFinishedRepository: Repository<SemiFinished>,
  ) {}

  async findAll(): Promise<SemiFinished[]> {
    return await this.semiFinishedRepository.find();
  }
}
