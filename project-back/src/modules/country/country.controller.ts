import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dtos/create-country.dto';
import { UpdateCountryDto } from './dtos/update-country.dto';
import { CountryOutputDto } from './dtos/country-output.dto';
import { Country } from './entities/country.entity';

@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post()
  create(@Body() createCountryDto: CreateCountryDto) {
    return this.countryService.create(createCountryDto);
  }

  @Get()
  async findAll(): Promise<CountryOutputDto[]> {
    const countries: Country[] = await this.countryService.findAll();
    return countries.map((country) => {
      const countryDto = new CountryOutputDto();
      countryDto.id = country.id;
      countryDto.name = country.name;
      return countryDto;
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CountryOutputDto> {
    const country: Country = await this.countryService.findOne(+id);
    const countryDto = new CountryOutputDto();
    countryDto.id = country.id;
    countryDto.name = country.name;
    return countryDto;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCountryDto: UpdateCountryDto) {
    return this.countryService.update(+id, updateCountryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.countryService.remove(+id);
  }
}
