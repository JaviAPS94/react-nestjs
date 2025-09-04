import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { NormController } from '../../../src/modules/norm/norm.controller';
import { NormService } from '../../../src/modules/norm/services/norm.service';
import { CreateNormDto } from '../../../src/modules/norm/dtos/create-norm.dto';

describe('NormController', () => {
  let controller: NormController;
  let normService: NormService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NormController],
      providers: [
        {
          provide: NormService,
          useValue: {
            createNorm: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<NormController>(NormController);
    normService = module.get<NormService>(NormService);
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

    it('should call NormService.createNorm and return void', async () => {
      await controller.createNorm(mockNormData);

      expect(normService.createNorm).toHaveBeenCalledWith(mockNormData);
    });

    it('should throw an HttpException when NormService.createNorm throws an error', async () => {
      const errorMessage = 'Country not found';
      const errorStatus = 404;

      (normService.createNorm as jest.Mock).mockRejectedValue(
        new HttpException(errorMessage, errorStatus),
      );

      await expect(controller.createNorm(mockNormData)).rejects.toThrow(
        HttpException,
      );
      await expect(controller.createNorm(mockNormData)).rejects.toThrow(
        errorMessage,
      );
    });
  });
});
