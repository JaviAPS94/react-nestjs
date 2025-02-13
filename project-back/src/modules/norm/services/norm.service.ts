import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateNormDto, ElementDto } from '../dtos/create-norm.dto';
import { Norm } from '../entities/norm.entity';
import { Country } from '../../country/entities/country.entity';
import { Element } from '../../element/entities/element.entity';
import { File as MulterFile } from 'multer';
import { SubType } from '../../subtype/entities/subtype.entity';
import { SpecialItem } from 'src/modules/element/entities/special-item.entity';

@Injectable()
export class NormService {
  constructor(private dataSource: DataSource) {}

  async createNorm(
    normData: CreateNormDto,
    files: MulterFile[],
  ): Promise<void> {
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

      for (const [elementIndex, elementData] of normData.elements.entries()) {
        const element = new Element();

        const subType = await queryRunner.manager.findOne(SubType, {
          where: { id: elementData.subType },
        });

        if (!subType) {
          throw new NotFoundException('SubType not found');
        }

        if (elementData.specialItem) {
          const specialItem = await queryRunner.manager.findOne(SpecialItem, {
            where: { id: elementData.specialItem },
          });

          if (!specialItem) {
            throw new NotFoundException('SpecialItem not found');
          }

          element.specialItem = specialItem;
        }

        const processedValues = await this.processValues(
          elementData,
          files,
          elementIndex,
        );

        element.norm = savedNorm;
        element.subType = subType;
        element.values = JSON.stringify(processedValues);
        element.sapReference = elementData.sapReference;

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

  private async processValues(
    elementData: ElementDto,
    files: MulterFile[],
    elementIndex: number,
  ): Promise<Record<string, any>> {
    const processedValues: Record<string, any>[] = [];

    for (const [valueIndex, value] of elementData.values.entries()) {
      if (value.type === 'file') {
        const findFile = files.find((file) =>
          file.fieldname.includes(
            `[${elementIndex}].values[${valueIndex}].value`,
          ),
        );
        const filePath = `uploads/${findFile.filename}`;
        processedValues.push({
          ...value,
          value: filePath,
        });
      } else {
        processedValues.push(value);
      }
    }

    return processedValues;
  }
}
