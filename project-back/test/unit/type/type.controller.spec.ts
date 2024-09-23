import { Test, TestingModule } from '@nestjs/testing';
import { TypeController } from '../../../src/modules/type/type.controller';
import { TypeService } from '../../../src/modules/type/type.service';
import {
  TypeWithFieldsDto,
  FieldDto,
} from '../../../src/modules/type/dtos/type-with-fields.dto';
import { Type } from '../../../src/modules/type/entities/type.entity';

describe('TypeController', () => {
  let controller: TypeController;
  let service: jest.Mocked<TypeService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeController],
      providers: [
        {
          provide: TypeService,
          useValue: {
            findAllWithFields: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TypeController>(TypeController);
    service = module.get<jest.Mocked<TypeService>>(TypeService);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('findAllWithFields', () => {
    it('debe retornar una lista de TypeWithFieldsDto', async () => {
      const typesWithFields: Type[] = [
        {
          id: 1,
          name: 'Type 1',
          field: {
            id: 1,
            base: JSON.stringify({ key: 'value' }),
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
      ];

      const fieldDto: FieldDto = {
        id: 1,
        base: JSON.parse(typesWithFields[0].field.base),
      };

      const expectedResult: TypeWithFieldsDto[] = [
        {
          id: 1,
          name: 'Type 1',
          field: fieldDto,
        },
      ];

      service.findAllWithFields.mockResolvedValue(typesWithFields);

      const result = await controller.findAllWithFields();
      expect(result).toEqual(expectedResult);
      expect(service.findAllWithFields).toHaveBeenCalled();
    });
  });
});
