import { Test, TestingModule } from '@nestjs/testing';
import { TypeService } from '../../../src/modules/type/type.service';
import { Type } from '../../../src/modules/type/entities/type.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TypeService', () => {
  let service: TypeService;
  let repository: jest.Mocked<Repository<Type>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypeService,
        {
          provide: getRepositoryToken(Type),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TypeService>(TypeService);
    repository = module.get<jest.Mocked<Repository<Type>>>(
      getRepositoryToken(Type),
    );
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAllWithFields', () => {
    it('debe retornar una lista de tipos con sus campos', async () => {
      const expectedResult: Type[] = [
        {
          id: 1,
          name: 'Type 1',
          field: {
            id: 1,
            base: 'Field 1',
            types: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          },
          elements: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          id: 2,
          name: 'Type 2',
          field: {
            id: 1,
            base: 'Field 1',
            types: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          },
          elements: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        ,
      ];

      // Simulamos el comportamiento del método find
      repository.find.mockResolvedValue(expectedResult);

      const result = await service.findAllWithFields();
      expect(result).toEqual(expectedResult);
      expect(repository.find).toHaveBeenCalledWith({
        relations: ['field'],
      });
    });
  });
});
