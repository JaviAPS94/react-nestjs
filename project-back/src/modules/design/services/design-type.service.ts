import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DesignType } from '../entities/design-type.entity';

@Injectable()
export class DesignTypeService {
  constructor(
    @InjectRepository(DesignType)
    private readonly designTypeRepository: Repository<DesignType>,
  ) {}

  async findAll(): Promise<DesignType[]> {
    return this.designTypeRepository.find({
      where: { deletedAt: null },
    });
  }

  async findById(id: number): Promise<DesignType> {
    const designType = await this.designTypeRepository.findOne({
      where: { id, deletedAt: null },
    });

    if (!designType) {
      throw new NotFoundException(`Design type with ID ${id} not found`);
    }

    return designType;
  }
}
