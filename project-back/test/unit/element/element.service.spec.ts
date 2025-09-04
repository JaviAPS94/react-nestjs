import { Test, TestingModule } from '@nestjs/testing';
import { ElementService } from '../../../src/modules/element/services/element.service';
import { DataSource } from 'typeorm';
import { Element } from '../../../src/modules/element/entities/element.entity';

describe('ElementService', () => {
  let service: ElementService;
  let dataSource: DataSource;

  beforeEach(async () => {
    const mockDataSource = {
      getRepository: jest.fn().mockReturnValue({
        createQueryBuilder: jest.fn().mockReturnValue({
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          orWhere: jest.fn().mockReturnThis(),
          getMany: jest.fn(),
        }),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ElementService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<ElementService>(ElementService);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getElementsByFilters', () => {
    it('should return elements based on country and name filters', async () => {
      const mockElements = [new Element(), new Element()];

      // Mock the getMany method to return the mock elements
      const repository = dataSource.getRepository(Element);
      (repository.createQueryBuilder().getMany as jest.Mock).mockResolvedValue(
        mockElements,
      );

      const result = await service.getElementsByFilters(1, 'test');

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('element');
      expect(
        repository.createQueryBuilder().leftJoinAndSelect,
      ).toHaveBeenCalledTimes(3);
      expect(repository.createQueryBuilder().where).toHaveBeenCalledWith(
        'country.id = :country',
        { country: 1 },
      );
      expect(repository.createQueryBuilder().orWhere).toHaveBeenCalledWith(
        'norm.name LIKE :name',
        { name: '%test%' },
      );
      expect(result).toEqual(mockElements);
    });

    it('should return an empty array if no elements are found', async () => {
      const repository = dataSource.getRepository(Element);
      (repository.createQueryBuilder().getMany as jest.Mock).mockResolvedValue(
        [],
      );

      const result = await service.getElementsByFilters(1, 'non-existing');

      expect(repository.createQueryBuilder().getMany).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});
