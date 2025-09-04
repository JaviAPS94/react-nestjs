import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CountryOutputDto } from 'src/modules/country/dtos/country-output.dto';
import { SubTypeDto } from 'src/modules/element/dtos/element.dto';
import { NormSpecificationOutputDto } from './norm-specification-output.dto';

export class NormPaginatedDto {
  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  page: number;
  @ApiProperty({
    example: 10,
    required: true,
  })
  @IsNotEmpty()
  limit: number;
  @ApiProperty({
    example: 1,
    required: true,
  })
  @ApiProperty({
    example: 10,
    required: true,
  })
  @IsNotEmpty()
  total: number;
  @ApiProperty({
    example: 1,
    required: true,
  })
  @ApiProperty({
    example: 10,
    required: true,
  })
  @IsNotEmpty()
  totalPages: number;
  data: NormDataDto[];
}

export class NormDataDto {
  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  id: number;
  @ApiProperty({
    example: 'Norma 123CRT',
    required: true,
  })
  @IsNotEmpty()
  name: string;
  @ApiProperty({
    example: '1.0.0',
    required: true,
  })
  @IsNotEmpty()
  version: string;
  @IsNotEmpty()
  normFile: string;
  country: CountryOutputDto;
  elements: ElementOutputDto[];
  normSpecification: NormSpecificationOutputDto | null;
}

export class ElementOutputDto {
  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  id: number;
  @ApiProperty({
    example: { voltaje: '10v' },
    required: true,
  })
  @IsNotEmpty()
  values: Record<string, any>;
  sapReference: string;
  subType: SubTypeDto;
}
