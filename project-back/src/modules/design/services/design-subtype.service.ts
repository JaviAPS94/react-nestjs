import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DesignSubType } from '../entities/design-subtype.entity';

@Injectable()
export class DesignSubTypeService {
  constructor(
    @InjectRepository(DesignSubType)
    private readonly designSubTypeRepository: Repository<DesignSubType>,
  ) {}

  async findAll(): Promise<DesignSubType[]> {
    return this.designSubTypeRepository.find({
      where: { deletedAt: null },
      relations: ['designType'],
    });
  }

  async findAllWithFunctions(): Promise<DesignSubType[]> {
    return this.designSubTypeRepository.find({
      where: { deletedAt: null },
      relations: [
        'designType',
        'designSubTypeFunctions',
        'designSubTypeFunctions.designFunction',
      ],
    });
  }

  async findById(id: number): Promise<DesignSubType> {
    const designSubType = await this.designSubTypeRepository.findOne({
      where: { id, deletedAt: null },
      relations: ['designType'],
    });

    if (!designSubType) {
      throw new NotFoundException(`Design subtype with ID ${id} not found`);
    }

    return designSubType;
  }

  async findByIdWithFunctions(id: number): Promise<DesignSubType> {
    const designSubType = await this.designSubTypeRepository.findOne({
      where: { id, deletedAt: null },
      relations: [
        'designType',
        'designSubTypeFunctions',
        'designSubTypeFunctions.designFunction',
      ],
    });

    if (!designSubType) {
      throw new NotFoundException(`Design subtype with ID ${id} not found`);
    }

    return designSubType;
  }

  async findByTypeId(typeId: number): Promise<DesignSubType[]> {
    return this.designSubTypeRepository.find({
      where: { designType: { id: typeId }, deletedAt: null },
      relations: ['designType'],
    });
  }

  async findByTypeIdWithFunctions(typeId: number): Promise<DesignSubType[]> {
    return this.designSubTypeRepository.find({
      where: { designType: { id: typeId }, deletedAt: null },
      relations: [
        'designType',
        'designSubTypeFunctions',
        'designSubTypeFunctions.designFunction',
      ],
    });
  }
}
