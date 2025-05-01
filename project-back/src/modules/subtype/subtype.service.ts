import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubType } from './entities/subtype.entity';

@Injectable()
export class SubTypeService {
  constructor(
    @InjectRepository(SubType)
    private readonly subTypeRepository: Repository<SubType>,
  ) {}

  async findAllWithFieldsByType(typeId: number): Promise<SubType[]> {
    return await this.subTypeRepository.find({
      where: { type: { id: typeId } },
      relations: ['field'],
    });
  }

  async findById(id: number): Promise<SubType | null> {
    const subType = await this.subTypeRepository.findOne({
      where: { id },
      relations: ['field'],
    });

    return subType || null;
  }

  async findAllWithFields(): Promise<SubType[]> {
    return await this.subTypeRepository.find({
      relations: ['field'],
    });
  }
}
