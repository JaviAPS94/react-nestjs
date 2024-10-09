import { ApiProperty } from '@nestjs/swagger';
import { CountryOutputDto } from 'src/modules/country/dtos/country-output.dto';

export class NormDto {
  @ApiProperty({
    example: 1,
  })
  id: number;
  @ApiProperty({
    example: 'norma',
  })
  name: string;
  @ApiProperty({
    example: '1.0',
  })
  version: string;
  @ApiProperty({
    type: () => CountryOutputDto,
  })
  country: CountryOutputDto;
}
