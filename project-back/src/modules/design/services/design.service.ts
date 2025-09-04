import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { CreateDesignDto } from '../dtos/create-desing.dto';
import { Design } from '../entities/design.entity';
import { DesignElement } from '../entities/design-element.entity';
import { Element } from 'src/modules/element/entities/element.entity';
import { SubDesign } from '../entities/sub-design.entity';
import { DesignSubType } from '../entities/design-subtype.entity';

@Injectable()
export class DesignService {
  constructor(private dataSource: DataSource) {}

  async createDesign(designData: CreateDesignDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const designSubType = await queryRunner.manager.findOne(DesignSubType, {
        where: { id: designData.designSubtypeId },
      });

      if (!designSubType) {
        throw new NotFoundException('Design subtype not found');
      }

      const design = new Design();
      design.name = designData.name;
      design.code = designData.code;
      design.designSubType = designSubType;
      const designDb = await queryRunner.manager.save(design);

      //Save design elements with elements that already exists in db
      if (designData.elements && designData.elements.length > 0) {
        const elements = await queryRunner.manager.findBy(Element, {
          id: In(designData.elements),
        });
        if (elements.length !== designData.elements.length) {
          throw new NotFoundException('Some elements not found');
        }
        for (const element of elements) {
          const designElement = new DesignElement();
          designElement.design = designDb;
          designElement.element = element;
          await queryRunner.manager.save(designElement);
        }
      }

      // Save sub-designs if provided
      if (designData.subDesigns && designData.subDesigns.length > 0) {
        for (const subDesignData of designData.subDesigns) {
          const subDesign = new SubDesign();
          subDesign.name = subDesignData.name;
          subDesign.code = subDesignData.code;
          subDesign.design = designDb;
          subDesign.data = JSON.stringify(subDesignData.data);
          await queryRunner.manager.save(subDesign);
        }
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
