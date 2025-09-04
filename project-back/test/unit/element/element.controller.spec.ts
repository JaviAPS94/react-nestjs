import { Test, TestingModule } from '@nestjs/testing';
import { ElementController } from '../../../src/modules/element/element.controller';
import { ElementService } from '../../../src/modules/element/services/element.service';
import { Element } from '../../../src/modules/element/entities/element.entity';
import { ElementResponseDto } from '../../../src/modules/element/dtos/element.dto';
import { Field } from '../../../src/modules/field/entities/field.entity';

describe('ElementController', () => {
  let controller: ElementController;
  let elementService: ElementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ElementController],
      providers: [
        {
          provide: ElementService,
          useValue: {
            getElementsByFilters: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ElementController>(ElementController);
    elementService = module.get<ElementService>(ElementService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getElementsByFilters', () => {
    it('should return an array of ElementResponseDto', async () => {
      const mockField = new Field();
      const mockElements: Element[] = [
        {
          id: 1,
          values: JSON.stringify({ key: 'value' }),
          type: {
            id: 1,
            name: 'Type 1',
            elements: [],
            field: mockField,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: new Date(),
          },
          norm: {
            id: 1,
            name: 'Norm 1',
            version: '1.0',
            elements: [],
            country: {
              id: 1,
              name: 'Country 1',
              norms: [],
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: new Date(),
            },
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date(),
        },
      ];

      const expectedResponse: ElementResponseDto[] = mockElements.map(
        (element) => {
          const elementResponseDto = new ElementResponseDto();
          elementResponseDto.id = element.id;
          elementResponseDto.values = JSON.parse(element.values);
          elementResponseDto.type = {
            id: element.type.id,
            name: element.type.name,
          };
          elementResponseDto.norm = {
            id: element.norm.id,
            name: element.norm.name,
            version: element.norm.version,
            country: {
              id: element.norm.country.id,
              name: element.norm.country.name,
            },
          };
          return elementResponseDto;
        },
      );

      (elementService.getElementsByFilters as jest.Mock).mockResolvedValue(
        mockElements,
      );

      const result = await controller.getElementsByFilters(1, 'test');

      expect(elementService.getElementsByFilters).toHaveBeenCalledWith(
        1,
        'test',
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should return an empty array if no elements are found', async () => {
      (elementService.getElementsByFilters as jest.Mock).mockResolvedValue([]);

      const result = await controller.getElementsByFilters(1, 'non-existing');

      expect(elementService.getElementsByFilters).toHaveBeenCalledWith(
        1,
        'non-existing',
      );
      expect(result).toEqual([]);
    });
  });
});
