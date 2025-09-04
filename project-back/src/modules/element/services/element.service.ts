import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Element } from '../entities/element.entity';
import { FiltersPaginatedDto } from '../dtos/filters-paginated.dto';
import { ElementPaginatedMapper } from '../mappers/element-paginated.mapper';

@Injectable()
export class ElementService {
  constructor(private dataSource: DataSource) {}

  async getElementsByFilters(
    country: number,
    name?: string,
    subType?: string,
    sapReference?: string,
  ): Promise<Element[]> {
    const queryBuilder = this.dataSource
      .getRepository(Element)
      .createQueryBuilder('element')
      .leftJoinAndSelect('element.norm', 'norm')
      .leftJoinAndSelect('element.subType', 'subType')
      .leftJoinAndSelect('norm.country', 'country')
      .where('country.id = :country', { country });

    if (name && name.trim() !== '') {
      queryBuilder.orWhere('norm.name LIKE :name', { name: `%${name}%` });
    }

    if (subType && subType.trim() !== '') {
      queryBuilder.orWhere('subType.name LIKE :subType', {
        subType: `%${subType}%`,
      });
    }

    if (sapReference && sapReference.trim() !== '') {
      queryBuilder.orWhere('element.sapReference LIKE :sapReference', {
        sapReference: `%${sapReference}%`,
      });
    }

    return await queryBuilder.getMany();
  }

  async getElementsByFiltersPaginated(
    filtersPaginatedDto: FiltersPaginatedDto,
  ) {
    const { page, limit, subType, sapReference, name } = filtersPaginatedDto;

    const queryBuilder = this.dataSource
      .getRepository(Element)
      .createQueryBuilder('element')
      .leftJoinAndSelect('element.norm', 'norm')
      .leftJoinAndSelect('element.subType', 'subType')
      .leftJoinAndSelect('norm.country', 'country')
      .where('country.id = :country', { country: filtersPaginatedDto.country });

    if (name && name.trim() !== '') {
      queryBuilder.andWhere('norm.name LIKE :name', { name: `%${name}%` });
    }

    if (subType && subType.trim() !== '') {
      queryBuilder.andWhere('subType.name = :subType', {
        subType: subType,
      });
    }

    if (sapReference && sapReference.trim() !== '') {
      queryBuilder.andWhere('element.sapReference LIKE :sapReference', {
        sapReference: `%${sapReference}%`,
      });
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data: data.map((element) => ElementPaginatedMapper.toDto(element)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getElementsByIds(ids: number[]): Promise<Element[]> {
    if (!ids || ids.length === 0) {
      return [];
    }

    const queryBuilder = this.dataSource
      .getRepository(Element)
      .createQueryBuilder('element')
      .leftJoinAndSelect('element.norm', 'norm')
      .leftJoinAndSelect('element.subType', 'subType')
      .leftJoinAndSelect('norm.country', 'country')
      .where('element.id IN (:...ids)', { ids });

    return await queryBuilder.getMany();
  }
}
