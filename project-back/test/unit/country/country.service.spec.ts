import { Test, TestingModule } from '@nestjs/testing';
import { CountryService } from '../../../src/modules/country/country.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from '../../../src/modules/country/entities/country.entity';

describe('CountryService', () => {
  let service: CountryService;
  let repository: jest.Mocked<Repository<Country>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountryService,
        {
          provide: getRepositoryToken(Country),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            softRemove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CountryService>(CountryService);
    repository = module.get<jest.Mocked<Repository<Country>>>(
      getRepositoryToken(Country),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of countries', async () => {
      const expectedCountries = [
        {
          id: 1,
          name: 'Country 1',
          norms: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];
      repository.find.mockResolvedValue(expectedCountries);

      const countries = await service.findAll();
      expect(countries).toEqual(expectedCountries);
    });
  });

  describe('findOne', () => {
    it('should return a single country', async () => {
      const expectedCountry = {
        id: 1,
        name: 'Country 1',
        norms: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      repository.findOne.mockResolvedValue(expectedCountry);

      const country = await service.findOne(1);
      expect(country).toEqual(expectedCountry);
    });

    it('should throw an exception if country not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrowError(
        `Country with ID 1 not found`,
      );
    });
  });

  describe('create', () => {
    it('should successfully create and return a country', async () => {
      const newCountryData = { name: 'New Country' };
      const savedCountry = {
        id: 1,
        ...newCountryData,
        norms: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      repository.create.mockReturnValue(savedCountry);
      repository.save.mockResolvedValue(savedCountry);

      const result = await service.create(newCountryData);
      expect(result).toEqual(savedCountry);
      expect(repository.create).toHaveBeenCalledWith(newCountryData);
      expect(repository.save).toHaveBeenCalledWith(savedCountry);
    });
  });

  describe('update', () => {
    it('should successfully update and return the country', async () => {
      const countryId = 1;
      const updateData = { name: 'Updated Country' };
      const existingCountry = {
        id: countryId,
        name: 'Old Country',
        norms: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      const updatedCountry = {
        id: countryId,
        ...updateData,
        norms: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      repository.findOne.mockResolvedValue(existingCountry);
      repository.save.mockResolvedValue(updatedCountry);

      const result = await service.update(countryId, updateData);
      expect(result).toEqual(updatedCountry);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: countryId },
      });
      expect(repository.save).toHaveBeenCalledWith({
        ...existingCountry,
        ...updateData,
      });
    });

    it('should throw an exception if country not found', async () => {
      const countryId = 1;
      const updateData = { name: 'Updated Country' };

      repository.findOne.mockResolvedValue(null);

      await expect(service.update(countryId, updateData)).rejects.toThrowError(
        `Country with ID ${countryId} not found`,
      );
    });
  });

  describe('remove', () => {
    it('should successfully remove a country', async () => {
      const countryId = 1;
      const existingCountry = {
        id: countryId,
        name: 'Country to be deleted',
        norms: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      repository.findOne.mockResolvedValue(existingCountry);
      repository.softRemove.mockResolvedValue(existingCountry);

      await service.remove(countryId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: countryId },
      });
      expect(repository.softRemove).toHaveBeenCalledWith(existingCountry);
    });

    it('should throw an exception if country not found', async () => {
      const countryId = 1;

      repository.findOne.mockResolvedValue(null);

      await expect(service.remove(countryId)).rejects.toThrowError(
        `Country with ID ${countryId} not found`,
      );
    });
  });
});
