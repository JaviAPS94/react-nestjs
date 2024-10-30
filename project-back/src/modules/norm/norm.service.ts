import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateNormDto } from './dtos/create-norm.dto';
import { Norm } from './entities/norm.entity';
import { Country } from '../country/entities/country.entity';
import { Element } from '../element/entities/element.entity';
import { Type } from '../type/entities/type.entity';
import { File as MulterFile } from 'multer';
import * as fs from 'fs';
import * as path from 'path';

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

        const type = await queryRunner.manager.findOne(Type, {
          where: { id: elementData.type },
        });

        if (!type) {
          throw new NotFoundException('Type not found');
        }

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

        element.norm = savedNorm;
        element.type = type;
        element.values = JSON.stringify(processedValues);

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
    values: Record<string, any>,
    files: MulterFile[],
    elementIndex: number,
  ): Promise<Record<string, any>> {
    const processedValues = { ...values };

    for (const [key, value] of Object.entries(values)) {
      // Check if value is a file (e.g., if it's one of the uploaded files)
      if (typeof value === 'object' && value && files[elementIndex]) {
        const file = files[elementIndex];

        // Save the file and replace the value with the file path
        const filePath = path.join('uploads', file.filename);
        fs.writeFileSync(filePath, file.buffer);

        // Replace the file entry in values with the file path or URL
        processedValues[key] = filePath; // You can change this to a public URL if needed
      }
    }

    return processedValues;
  }
}
