import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, QueryRunner } from 'typeorm';
import { NormService } from '../../../src/modules/norm/services/norm.service';
import { CreateNormDto } from '../../../src/modules/norm/dtos/create-norm.dto';
import { Country } from '../../../src/modules/country/entities/country.entity';
import { Type } from '../../../src/modules/type/entities/type.entity';
import { Norm } from '../../../src/modules/norm/entities/norm.entity';
import { Element } from '../../../src/modules/element/entities/element.entity';
import { NotFoundException } from '../../../src/common/exceptions/custom.exception';

describe('NormService', () => {
  let service: NormService;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;

  beforeEach(async () => {
    const mockQueryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        findOne: jest.fn(),
        save: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NormService,
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
          },
        },
      ],
    }).compile();

    service = module.get<NormService>(NormService);
    dataSource = module.get<DataSource>(DataSource);
    queryRunner = dataSource.createQueryRunner();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createNorm', () => {
    const mockNormData: CreateNormDto = {
      name: 'Test Norm',
      version: '1.0',
      countryId: 1,
      elements: [
        {
          typeId: 1,
          values: { key: 'value' },
        },
      ],
    };

    it('should create a norm and its elements successfully', async () => {
      const mockCountry = new Country();
      const mockType = new Type();
      const mockNorm = new Norm();
      mockNorm.country = mockCountry;
      mockNorm.name = mockNormData.name;
      mockNorm.version = mockNormData.version;
      const mockElement = new Element();
      mockElement.norm = mockNorm;
      mockElement.type = mockType;
      mockElement.values = JSON.stringify(mockNormData.elements[0].values);

      (queryRunner.manager.findOne as jest.Mock)
        .mockResolvedValueOnce(mockCountry)
        .mockResolvedValueOnce(mockType);

      (queryRunner.manager.save as jest.Mock)
        .mockResolvedValueOnce(mockNorm)
        .mockResolvedValueOnce(mockElement);

      await service.createNorm(mockNormData);

      expect(queryRunner.connect).toHaveBeenCalled();
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(queryRunner.manager.findOne).toHaveBeenCalledWith(Country, {
        where: { id: mockNormData.countryId },
      });
      expect(queryRunner.manager.save).toHaveBeenCalledWith(mockNorm);
      expect(queryRunner.manager.findOne).toHaveBeenCalledWith(Type, {
        where: { id: mockNormData.elements[0].typeId },
      });
      expect(queryRunner.manager.save).toHaveBeenCalledWith(mockElement);
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('should throw NotFoundException if country is not found', async () => {
      (queryRunner.manager.findOne as jest.Mock).mockResolvedValueOnce(null); // No Country

      await expect(service.createNorm(mockNormData)).rejects.toThrow(
        new NotFoundException('Country not found'),
      );

      expect(queryRunner.connect).toHaveBeenCalled();
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(queryRunner.manager.findOne).toHaveBeenCalledWith(Country, {
        where: { id: mockNormData.countryId },
      });
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('should throw NotFoundException if type is not found', async () => {
      const mockCountry = new Country();

      (queryRunner.manager.findOne as jest.Mock)
        .mockResolvedValueOnce(mockCountry)
        .mockResolvedValueOnce(null);

      await expect(service.createNorm(mockNormData)).rejects.toThrow(
        new NotFoundException('Type not found'),
      );

      expect(queryRunner.connect).toHaveBeenCalled();
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(queryRunner.manager.findOne).toHaveBeenCalledWith(Country, {
        where: { id: mockNormData.countryId },
      });
      expect(queryRunner.manager.findOne).toHaveBeenCalledWith(Type, {
        where: { id: mockNormData.elements[0].typeId },
      });
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('should rollback transaction if any error occurs', async () => {
      const mockCountry = new Country();
      (queryRunner.manager.findOne as jest.Mock).mockResolvedValueOnce(
        mockCountry,
      );
      (queryRunner.manager.save as jest.Mock).mockRejectedValueOnce(
        new Error('Save Error'),
      );

      await expect(service.createNorm(mockNormData)).rejects.toThrow(
        'Save Error',
      );

      expect(queryRunner.connect).toHaveBeenCalled();
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });
  });
});
