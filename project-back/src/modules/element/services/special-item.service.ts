import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpecialItem } from '../entities/special-item.entity';

@Injectable()
export class SpecialItemService {
  constructor(
    @InjectRepository(SpecialItem)
    private readonly specialItemRepository: Repository<SpecialItem>,
  ) {}

  async findAll(): Promise<SpecialItem[]> {
    return await this.specialItemRepository.find();
  }
}
