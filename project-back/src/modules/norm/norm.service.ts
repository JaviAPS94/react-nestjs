import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateNormDto } from './dtos/create-norm.dto';
import { Norm } from './entities/norm.entity';
import { Country } from '../country/entities/country.entity';
import { Element } from '../element/entities/element.entity';
import { Type } from '../type/entities/type.entity';

@Injectable()
export class NormService {
  constructor(private dataSource: DataSource) {}

  async createNorm(normData: CreateNormDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const country = await queryRunner.manager.findOne(Country, {
        where: { id: normData.country },
      });

      if (!country) {
        throw new NotFoundException('Country not found');
      }

      const norm = new Norm();

      norm.name = normData.name;
      norm.version = normData.version;
      norm.country = country;

      const savedNorm = await queryRunner.manager.save(norm);

      for (const elementData of normData.elements) {
        const element = new Element();

        const type = await queryRunner.manager.findOne(Type, {
          where: { id: elementData.type },
        });

        if (!type) {
          throw new NotFoundException('Type not found');
        }

        element.norm = savedNorm;
        element.values = JSON.stringify(elementData.values);
        element.type = type;

        await queryRunner.manager.save(element);
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
