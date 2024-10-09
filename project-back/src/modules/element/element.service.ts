import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Element } from './entities/element.entity';

@Injectable()
export class ElementService {
  constructor(private dataSource: DataSource) {}

  async getElementsByFilters(
    country: number,
    name?: string, // Make name optional
  ): Promise<Element[]> {
    const queryBuilder = this.dataSource
      .getRepository(Element)
      .createQueryBuilder('element')
      .leftJoinAndSelect('element.norm', 'norm')
      .leftJoinAndSelect('element.type', 'type')
      .leftJoinAndSelect('norm.country', 'country')
      .where('country.id = :country', { country });

    if (name && name.trim() !== '') {
      queryBuilder.orWhere('norm.name LIKE :name', { name: `%${name}%` });
    }

    return await queryBuilder.getMany();
  }
}
