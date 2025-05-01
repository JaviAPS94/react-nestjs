import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateNormDto, ElementDto } from '../dtos/create-norm.dto';
import { Norm } from '../entities/norm.entity';
import { Country } from '../../country/entities/country.entity';
import { Element } from '../../element/entities/element.entity';
import { File as MulterFile } from 'multer';
import { SubType } from '../../subtype/entities/subtype.entity';
import { SpecialItem } from 'src/modules/element/entities/special-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { NormPaginatedMapper } from '../mappers/norm-paginated.mapper';

@Injectable()
export class NormService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Norm)
    private readonly normRepository: Repository<Norm>,
  ) {}

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

      let norm = await queryRunner.manager.findOne(Norm, {
        where: { id: normData.id },
        relations: ['elements'], // Ensure elements are loaded
      });

      if (norm) {
        norm.version = normData.version;
        norm.name = normData.name;
        norm.country = country;
        norm.normFile = await this.processNormFile(files);
        norm = await queryRunner.manager.save(norm);
      } else {
        norm = new Norm();
        norm.name = normData.name;
        norm.version = normData.version;
        norm.country = country;
        norm.normFile = await this.processNormFile(files);
        norm = await queryRunner.manager.save(norm);
      }

      // **Handle Element Deletion** (Remove elements that are no longer in the request)
      const existingElements = await queryRunner.manager.find(Element, {
        where: { norm: { id: norm.id } },
      });

      const requestElementIds = new Set(normData.elements.map((e) => e.id));

      for (const existingElement of existingElements) {
        if (!requestElementIds.has(existingElement.id)) {
          await queryRunner.manager.remove(existingElement);
        }
      }

      for (const [elementIndex, elementData] of normData.elements.entries()) {
        let element = new Element();

        if (elementData.id) {
          element = await queryRunner.manager.findOne(Element, {
            where: { id: elementData.id },
          });
        }

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

        element.norm = norm;
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

  private async processNormFile(files: MulterFile): Promise<string> {
    const file = files.find((file) => file.fieldname === 'normFile');
    return `uploads/${file.filename}`;
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

  async getAllNormsPaginated(paginationDto: PaginationDto) {
    const { page, limit, country, name } = paginationDto;

    const queryBuilder = this.normRepository
      .createQueryBuilder('norm')
      .leftJoinAndSelect('norm.normSpecification', 'normSpecification')
      .leftJoinAndSelect('norm.country', 'country')
      .leftJoinAndSelect('norm.elements', 'elements')
      .leftJoinAndSelect('elements.subType', 'subType')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('norm.createdAt', 'DESC');

    if (country) {
      queryBuilder.andWhere('country.id = :id', { id: country });
    }

    if (name) {
      queryBuilder.andWhere('norm.name LIKE :name', {
        name: `%${name}%`,
      });
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data: data.map((norm) => NormPaginatedMapper.toDto(norm)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getById(id: number) {
    const norm = await this.normRepository.findOne({
      where: { id },
      relations: [
        'country',
        'elements',
        'normSpecification',
        'elements.subType.type',
      ],
    });

    if (!norm) {
      throw new NotFoundException('Norm not found');
    }

    return NormPaginatedMapper.toDto(norm);
  }
}
