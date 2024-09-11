import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { Repository } from 'typeorm';
import { CreateCountryDto } from './dtos/create-country.dto';
import { UpdateCountryDto } from './dtos/update-country.dto';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async create(createCountryDto: CreateCountryDto): Promise<Country> {
    const country = this.countryRepository.create(createCountryDto);
    return await this.countryRepository.save(country);
  }

  async findAll(): Promise<Country[]> {
    return await this.countryRepository.find({ relations: ['norms'] });
  }

  async findOne(id: number): Promise<Country> {
    const country = await this.countryRepository.findOne({
      where: { id },
    });
    if (!country) {
      throw new NotFoundException(`Country with ID ${id} not found`);
    }
    return country;
  }

  async update(
    id: number,
    updateCountryDto: UpdateCountryDto,
  ): Promise<Country> {
    const country = await this.findOne(id);
    Object.assign(country, updateCountryDto);
    return await this.countryRepository.save(country);
  }

  async remove(id: number): Promise<void> {
    const country = await this.findOne(id);
    await this.countryRepository.softRemove(country);
  }
}
