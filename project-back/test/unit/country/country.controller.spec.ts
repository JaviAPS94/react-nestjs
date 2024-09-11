import { Test, TestingModule } from '@nestjs/testing';
import { CountryController } from '../../../src/modules/country/country.controller';
import { CountryService } from '../../../src/modules/country/country.service';
import { CountryOutputDto } from '../../../src/modules/country/dtos/country-output.dto';
import { Country } from '../../../src/modules/country/entities/country.entity';

describe('CountryController', () => {
  let controller: CountryController;
  let service: jest.Mocked<CountryService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountryController],
      providers: [
        {
          provide: CountryService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CountryController>(CountryController);
    service = module.get<jest.Mocked<CountryService>>(CountryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of CountryOutputDto', async () => {
      const expectedCountries: CountryOutputDto[] = [
        { id: 1, name: 'Country 1' },
      ];

      const mockCountries: Country[] = [
        {
          id: 1,
          name: 'Country 1',
          norms: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];

      service.findAll.mockResolvedValue(mockCountries);

      const countries = await controller.findAll();
      expect(countries).toEqual(expectedCountries);
    });
  });

  describe('findOne', () => {
    it('should return a single CountryOutputDto', async () => {
      const expectedCountry: CountryOutputDto = { id: 1, name: 'Country 1' };

      const mockCountry: Country = {
        id: 1,
        name: 'Country 1',
        norms: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      service.findOne.mockResolvedValue(mockCountry);

      const country = await controller.findOne('1');
      expect(country).toEqual(expectedCountry);
    });
  });

  describe('create', () => {
    it('should successfully create and return a country', async () => {
      const newCountryDto = { name: 'New Country' };
      const createdCountry: Country = {
        id: 1,
        ...newCountryDto,
        norms: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      service.create.mockResolvedValue(createdCountry);

      const result = await controller.create(newCountryDto);
      expect(result).toEqual(createdCountry);
      expect(service.create).toHaveBeenCalledWith(newCountryDto);
    });
  });

  describe('update', () => {
    it('should successfully update and return the country', async () => {
      const countryId = '1';
      const updateData = { name: 'Updated Country' };
      const updatedCountry: Country = {
        id: +countryId,
        ...updateData,
        norms: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      service.update.mockResolvedValue(updatedCountry);

      const result = await controller.update(countryId, updateData);
      expect(result).toEqual(updatedCountry);
      expect(service.update).toHaveBeenCalledWith(+countryId, updateData);
    });

    it('should throw an exception if country not found', async () => {
      const countryId = '1';
      const updateData = { name: 'Updated Country' };

      service.update.mockRejectedValue(
        new Error(`Country with ID ${countryId} not found`),
      );

      await expect(controller.update(countryId, updateData)).rejects.toThrow(
        `Country with ID ${countryId} not found`,
      );
    });
  });

  describe('remove', () => {
    it('should successfully remove a country', async () => {
      const countryId = '1';

      service.remove.mockResolvedValue(undefined);

      await controller.remove(countryId);
      expect(service.remove).toHaveBeenCalledWith(+countryId);
    });

    it('should throw an exception if country not found', async () => {
      const countryId = '1';

      service.remove.mockRejectedValue(
        new Error(`Country with ID ${countryId} not found`),
      );

      await expect(controller.remove(countryId)).rejects.toThrowError(
        `Country with ID ${countryId} not found`,
      );
    });
  });
});
