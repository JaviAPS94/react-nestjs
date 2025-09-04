import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Template } from '../entities/template.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template)
    private readonly templateRepository: Repository<Template>,
  ) {}

  async findBySubTypeId(designSubTypeId: number): Promise<Template[]> {
    return this.templateRepository.find({
      where: { designSubType: { id: designSubTypeId }, deletedAt: null },
      order: { createdAt: 'DESC' },
    });
  }
}
