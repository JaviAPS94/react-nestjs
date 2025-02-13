import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NormSpecification } from '../entities/norm-specification.entity';

@Injectable()
export class NormSpecificationService {
  constructor(
    @InjectRepository(NormSpecification)
    private readonly normSpecificationRepository: Repository<NormSpecification>,
  ) {}

  async findAll(): Promise<NormSpecification[]> {
    return await this.normSpecificationRepository.find();
  }
}
